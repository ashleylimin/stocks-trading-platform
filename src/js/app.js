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

// 获取市场数据
async function fetchMarketData() {
    try {
        console.log('fetchMarketData: 开始');
        // 先更新日期信息
        updateDateInfo();
        
        const apiUrl = '/api/market/overview?t=' + Date.now();
        console.log('fetchMarketData: 请求URL:', apiUrl);
        const response = await fetch(apiUrl);
        console.log('fetchMarketData: 响应状态:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('fetchMarketData: 收到数据，signal:', result.signal);
        processMarketData(result);
        
    } catch (error) {
        console.error('fetchMarketData: 获取数据失败:', error);
        // 使用默认状态（空仓）
        updateStatusUI('empty', '网络错误，请检查连接');
        updateRiskIndicators({});
    }
}

// 处理市场数据
function processMarketData(result) {
    console.log('processMarketData: 开始处理，result:', result);
    
    if (result.success && result.signal) {
        const signal = result.signal.trade_signal;
        console.log('processMarketData: 信号值:', signal);
        
        // 根据信号更新状态
        if (signal === "属于我的行情") {
            updateStatusUI('full', '');
            showWaveTracking(true);
        } else {
            // 行情可以但不属于我，或不属于我的行情
            updateStatusUI('empty', getConditionExplanation(result.signal));
            showWaveTracking(false);
        }
        
        // 更新风险指标
        updateRiskIndicators(result);
        
        // 更新页面标题
        updatePageTitle(signal);
    } else {
        console.log('processMarketData: 数据无效，result.success:', result.success, 'result.signal:', result.signal);
        updateStatusUI('empty', '数据无效，请稍后重试');
        updateRiskIndicators({});
    }
}

// 获取条件说明
function getConditionExplanation(signal) {
    const conditions = [];
    
    if (!signal.condition1_trend) {
        conditions.push("趋势条件不满足");
    }
    if (!signal.condition2_breadth) {
        conditions.push("市场宽度不足");
    }
    if (!signal.condition3_sectors) {
        conditions.push("板块强度不够");
    }
    if (!signal.condition4_volatility) {
        conditions.push("波动率过高");
    }
    if (!signal.condition5_hl_trend) {
        conditions.push("趋势在恶化");
    }
    
    if (conditions.length === 0) {
        return "所有条件满足，但综合判断不适合交易";
    }
    
    return conditions.join("，");
}

// 更新状态UI
function updateStatusUI(status, explanation) {
    console.log('updateStatusUI: 状态:', status, '说明:', explanation);
    
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

// 显示/隐藏波段追踪
function showWaveTracking(show) {
    const waveTrackingSection = document.getElementById('waveTrackingSection');
    if (waveTrackingSection) {
        waveTrackingSection.style.display = show ? 'block' : 'none';
    }
}

// 更新风险指标
function updateRiskIndicators(result) {
    console.log('updateRiskIndicators: 开始更新风险指标');
    
    const signal = result.signal || {};
    const breadth = result.breadth || {};
    
    // 更新波动率
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
    
    // 更新趋势稳定性
    const trendValue = document.getElementById('trendValue');
    const trendRating = document.getElementById('trendRating');
    if (trendValue && trendRating) {
        const trend = signal.trend_rating || '中性';
        const condition = signal.trend_condition || false;
        trendValue.textContent = trend;
        trendRating.textContent = trend + (condition ? ' ✓' : ' ✗');
        trendRating.setAttribute('data-rating', trend);
    }
    
    // 更新市场宽度(H/L Ratio)
    const hlRatioValue = document.getElementById('hlRatioValue');
    if (hlRatioValue) {
        const hlRatio = signal.hl_ratio || 1.0;
        const yesterdayHlRatio = signal.yesterday_hl_ratio || 1.0;
        const trendCondition = signal.condition5_hl_trend || false;
        const trendSymbol = trendCondition ? '↗' : '↘';
        hlRatioValue.textContent = `${hlRatio.toFixed(2)} ${trendSymbol} (昨:${yesterdayHlRatio.toFixed(2)})`;
    }
    
    console.log('updateRiskIndicators: 风险指标更新完成');
}

// 更新页面标题
function updatePageTitle(signal) {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        if (signal === "属于我的行情") {
            pageTitle.textContent = "ACT";
        } else {
            pageTitle.textContent = "JUST WAIT";
        }
    }
}

// 更新日期信息 - 显示最后一个交易日
function updateDateInfo() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const dayOfWeek = now.getDay();
    
    // 获取今天的日期
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    // 判断是否交易日（周一至周五）
    const isTradingDay = dayOfWeek >= 1 && dayOfWeek <= 5;
    
    let statusText = '';
    
    if (!isTradingDay) {
        // 非交易日（周末）
        let lastTradingDay = new Date(now);
        if (dayOfWeek === 0) { // 周日
            lastTradingDay.setDate(now.getDate() - 2);
        } else if (dayOfWeek === 6) { // 周六
            lastTradingDay.setDate(now.getDate() - 1);
        }
        const lastYear = lastTradingDay.getFullYear();
        const lastMonth = String(lastTradingDay.getMonth() + 1).padStart(2, '0');
        const lastDay = String(lastTradingDay.getDate()).padStart(2, '0');
        statusText = `非交易日，基于 ${lastYear}-${lastMonth}-${lastDay} 收盘`;
    } else {
        // 交易日
        if (currentHour < 9 || (currentHour === 9 && currentMinute < 30)) {
            // 开盘前
            statusText = `今日 ${dateString}，等待开盘`;
        } else if ((currentHour === 9 && currentMinute >= 30) || 
                   (currentHour > 9 && currentHour < 11) || 
                   (currentHour === 11 && currentMinute < 30) ||
                   (currentHour === 13 && currentMinute >= 0) ||
                   (currentHour > 13 && currentHour < 15)) {
            // 交易中
            statusText = `今日 ${dateString}，交易中`;
        } else if ((currentHour === 11 && currentMinute >= 30) || 
                   (currentHour > 11 && currentHour < 13) ||
                   (currentHour === 15 && currentMinute >= 0)) {
            // 收盘后
            statusText = `今日 ${dateString}，已收盘`;
        } else {
            // 收盘后
            statusText = `今日 ${dateString}，已收盘`;
        }
    }
    
    // 更新页面上的日期信息
    const dateInfoElement = document.querySelector('.date-info');
    if (dateInfoElement) {
        dateInfoElement.textContent = statusText;
    }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面初始化开始');
    
    // 显示随机交易格言
    const randomQuote = tradingPhilosophyQuotes[Math.floor(Math.random() * tradingPhilosophyQuotes.length)];
    console.log('今日格言:', randomQuote);
    
    // 获取市场数据
    console.log('开始获取市场数据...');
    fetchMarketData();
    
    // 设置定时刷新（每5分钟）
    setInterval(fetchMarketData, 5 * 60 * 1000);
    
    console.log('页面初始化完成');
});