// 交易哲学格言（加载时随机显示）
const tradingPhilosophyQuotes = [
    "价格包含一切",
    "市场不解释，只给结果",
    "没有信号，就是信号",
    "等待，是交易的一部分",
    "不是所有上涨，都属于你",
    "机会出现之前，什么都不做",
    "行动必须基于确认，而不是预期",
    "强者恒强，弱者更弱",
    "错误不可避免，失控可以避免",
    "先活下来，再谈盈利"
];

async function fetchMarketData() {
    try {
        updateDateInfo();

        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const apiUrl = isLocal
            ? 'http://localhost:8001/api/market/overview?t=' + Date.now()
            : null;

        let result;
        if (isLocal && apiUrl) {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP错误: ${response.status}`);
                }
                result = await response.json();
            } catch (apiError) {
                console.log('本地API失败，使用mock数据:', apiError.message);
                result = getMockMarketData();
            }
        } else {
            result = getMockMarketData();
        }

        processMarketData(result);

    } catch (error) {
        console.error('获取数据失败:', error);
        const mockData = getMockMarketData();
        processMarketData(mockData);
    }
}

function getMockMarketData() {
    return {
        success: true,
        signal: { allow_long: true, trade_signal: "属于我的行情", signal_level: "high" },
        data: [
            { 代码: "000001", 名称: "上证指数", 最新价: 4026.63, 涨跌幅: 0.95 },
            { 代码: "000688", 名称: "科创50", 最新价: 1405.07, 涨跌幅: 2.17 },
            { 代码: "399006", 名称: "创业板指", 最新价: 3558.53, 涨跌幅: 2.36 },
            { 代码: "000300", 名称: "沪深300", 最新价: 4701.28, 涨跌幅: 1.19 }
        ],
        breadth: {
            advance_count: 3955, decline_count: 1044, up_percentage: 79.1, down_percentage: 20.9,
            highs_52wk: 988, lows_52wk: 365, hl_ratio: 2.71, market_sentiment: "积极"
        }
    };
}

function processMarketData(result) {
    if (!result.success || !result.signal) {
        updateStatusUI('empty', '数据无效，请稍后重试');
        updateRiskIndicators({});
        return;
    }

    const signal = result.signal;
    const breadth = result.breadth || {};

    const market = {
        indexChange: result.data && result.data.length > 0 ? result.data[0].涨跌幅 || 0 : 0,
        highLowRatio: breadth.hl_ratio || 0,
        strongSectorsCount: breadth.up_percentage > 60 ? 1 : 0
    };

    const status = getMarketStatus(market);

    if (status.status === "可尝试") {
        updateStatusUI('full', status.reason);
        showWaveTracking(true);
    } else {
        updateStatusUI('empty', status.reason);
        showWaveTracking(false);
    }

    updateRiskIndicators(result);
    updatePageTitle(status);
}

function getConditionExplanation(signal) {
    const conditions = [];
    if (!signal.condition1_trend) conditions.push("趋势条件不满足");
    if (!signal.condition2_breadth) conditions.push("市场宽度不足");
    if (!signal.condition3_sectors) conditions.push("板块强度不够");
    if (conditions.length === 0) return "所有条件满足，但综合判断不适合交易";
    return conditions.join("，");
}

function updateStatusUI(status, explanation) {
    const statusButton = document.getElementById('statusButton');
    const statusExplanation = document.getElementById('statusExplanation');

    if (statusButton) {
        if (status === 'full') {
            statusButton.className = 'status-button status-green';
            statusButton.querySelector('.status-text').textContent = '满仓满融';
        } else {
            statusButton.className = 'status-button status-red';
            statusButton.querySelector('.status-text').textContent = '空仓';
        }
    }

    if (statusExplanation) {
        statusExplanation.textContent = explanation;
    }
}

function showWaveTracking(show) {
    const waveTrackingSection = document.getElementById('waveTrackingSection');
    if (waveTrackingSection) {
        waveTrackingSection.style.display = show ? 'block' : 'none';
    }
}

function updateRiskIndicators(result) {
    const signal = result.signal || {};
    const breadth = result.breadth || {};

    const volatilityValue = document.getElementById('volatilityValue');
    const volatilityRating = document.getElementById('volatilityRating');
    if (volatilityValue && volatilityRating) {
        const volatility = signal.volatility || 2.0;
        const rating = signal.volatility_rating || '中等';
        const condition = signal.volatility_condition || false;
        volatilityValue.textContent = `${volatility}%`;
        volatilityRating.textContent = rating + (condition ? ' ✓' : ' ✗');
        volatilityRating.setAttribute('data-rating', rating);
    }

    const trendValue = document.getElementById('trendValue');
    const trendRating = document.getElementById('trendRating');
    if (trendValue && trendRating) {
        const trend = signal.trend_rating || '中性';
        const condition = signal.trend_condition || false;
        trendValue.textContent = trend;
        trendRating.textContent = trend + (condition ? ' ✓' : ' ✗');
        trendRating.setAttribute('data-rating', trend);
    }

    const hlRatioValue = document.getElementById('hlRatioValue');
    if (hlRatioValue) {
        const hlRatio = signal.hl_ratio || 1.0;
        const yesterdayHlRatio = signal.yesterday_hl_ratio || 1.0;
        const trendCondition = signal.condition5_hl_trend || false;
        const trendSymbol = trendCondition ? '↗' : '↘';
        hlRatioValue.textContent = `${hlRatio.toFixed(2)} ${trendSymbol} (昨:${yesterdayHlRatio.toFixed(2)})`;
    }
}

function updatePageTitle(status) {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        if (status.status === "可尝试") {
            pageTitle.textContent = "ACT";
        } else if (status.status === "观察中") {
            pageTitle.textContent = "OBSERVE";
        } else {
            pageTitle.textContent = "JUST WAIT";
        }
    }
}

function updateDateInfo() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const dayOfWeek = now.getDay();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const isTradingDay = dayOfWeek >= 1 && dayOfWeek <= 5;

    let statusText = '';

    if (!isTradingDay) {
        let lastTradingDay = new Date(now);
        if (dayOfWeek === 0) {
            lastTradingDay.setDate(now.getDate() - 2);
        } else if (dayOfWeek === 6) {
            lastTradingDay.setDate(now.getDate() - 1);
        }
        const lastYear = lastTradingDay.getFullYear();
        const lastMonth = String(lastTradingDay.getMonth() + 1).padStart(2, '0');
        const lastDay = String(lastTradingDay.getDate()).padStart(2, '0');
        statusText = `非交易日，基于 ${lastYear}-${lastMonth}-${lastDay} 收盘`;
    } else {
        if (currentHour < 9 || (currentHour === 9 && currentMinute < 30)) {
            statusText = `今日 ${dateString}，等待开盘`;
        } else if ((currentHour === 9 && currentMinute >= 30) ||
                   (currentHour > 9 && currentHour < 11) ||
                   (currentHour === 11 && currentMinute < 30) ||
                   (currentHour === 13 && currentMinute >= 0) ||
                   (currentHour > 13 && currentHour < 15)) {
            statusText = `今日 ${dateString}，交易中`;
        } else {
            statusText = `今日 ${dateString}，已收盘`;
        }
    }

    const dateInfoElement = document.querySelector('.date-info');
    if (dateInfoElement) {
        dateInfoElement.textContent = statusText;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const randomQuote = tradingPhilosophyQuotes[Math.floor(Math.random() * tradingPhilosophyQuotes.length)];
    console.log('今日格言:', randomQuote);
    fetchMarketData();
    setInterval(fetchMarketData, 5 * 60 * 1000);
});
