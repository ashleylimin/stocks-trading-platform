// JUST WAIT 核心状态判断
// 输入：marketData + stocks
// 输出：Market 状态 + Leaders + Pivot 状态

function getMarketStatus(market) {
  const trendOK = market.indexChange > 0;
  const breadthOK = market.highLowRatio >= 1.0;
  const hasStrongSector = market.strongSectorsCount >= 1;

  if (trendOK && breadthOK && hasStrongSector) {
    return {
      status: "可尝试",
      suggestedPosition: 1 / 9,
      reason: "市场具备交易优势，允许小仓位试错",
    };
  }

  if (hasStrongSector || breadthOK) {
    return {
      status: "观察中",
      suggestedPosition: 0,
      reason: "部分信号出现，但尚未形成确认",
    };
  }

  return {
    status: "无交易优势",
    suggestedPosition: 0,
    reason: "当前未出现可执行结构，保持空仓",
  };
}

function classifyLeader(stock) {
  const aboveMA50 = stock.close > stock.ma50;
  const nearHigh = stock.close / stock.high52w >= 0.85;
  const strongTrend = stock.change20d >= 10;
  const volumeOK = stock.volume > stock.avgVolume20;

  if (aboveMA50 && nearHigh && strongTrend && volumeOK) {
    return "强势";
  }

  if (aboveMA50 && stock.change20d >= 5) {
    return "观察";
  }

  return "忽略";
}

function classifyStage(stock) {
  const priceToHigh2Y = stock.close / stock.high2y;
  const priceToLow120 = stock.close / stock.low120;

  if (priceToHigh2Y < 0.6 && priceToLow120 < 1.6) {
    return "First Pivot";
  }

  if (priceToHigh2Y >= 0.6 && priceToHigh2Y <= 0.85) {
    return "Second Leg";
  }

  return "Late Stage";
}

function getPivotStatus(stock) {
  const baseOK =
    stock.range20d < 30 &&
    stock.close > stock.ma50;

  const breakout =
    stock.close > stock.high20d &&
    stock.changeToday >= 4 &&
    stock.volume >= stock.avgVolume20 * 1.2;

  const confirmed =
    breakout ||
    (stock.close > stock.pivotPrice && stock.pullbackHeld === true);

  if (confirmed) {
    return {
      status: "CONFIRMED",
      action: "可尝试",
      position: 1 / 9,
      reason: "结构确认，允许小仓位试错",
    };
  }

  if (baseOK && stock.close / stock.high20d >= 0.95) {
    return {
      status: "READY",
      action: "观察中",
      position: 0,
      reason: "接近结构，但尚未确认",
    };
  }

  return {
    status: "WAIT",
    action: "忽略",
    position: 0,
    reason: "无结构，不具备交易意义",
  };
}

function buildLeaders(stocks) {
  return stocks
    .map(stock => ({
      ...stock,
      leaderStatus: classifyLeader(stock),
      stage: classifyStage(stock),
      pivot: getPivotStatus(stock),
    }))
    .filter(stock => stock.leaderStatus !== "忽略")
    .filter(stock => stock.stage !== "Late Stage")
    .sort((a, b) => {
      const scoreA =
        a.change20d * 0.4 +
        a.volumeRatio * 0.3 +
        a.relativeStrength * 0.3;

      const scoreB =
        b.change20d * 0.4 +
        b.volumeRatio * 0.3 +
        b.relativeStrength * 0.3;

      return scoreB - scoreA;
    })
    .slice(0, 5);
}

function checkAccount(currentPosition, suggestedPosition) {
  if (currentPosition <= suggestedPosition) {
    return {
      status: "合规",
      message: "仓位与系统一致，当前风险处于可控范围",
    };
  }

  const diff = currentPosition - suggestedPosition;

  if (diff <= 0.3) {
    return {
      status: "偏离",
      message: "当前仓位高于系统建议，停止加仓",
    };
  }

  return {
    status: "违规",
    message: "你正在承担未被验证的风险",
  };
}
