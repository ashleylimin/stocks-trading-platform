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

// 交易状态定义
const tradingStates = [
    {
        position: "0%",
        buttonText: "状态：不属于我的行情",
        buttonClass: "action-red",
        pageTitle: "JUST WAIT",
        stonePosition: "0%",
        stoneProgress: 20,
        bayonetPosition: "0%",
        bayonetProgress: 95,
        executionReason: {
            title: "说明：",
            bulletPoints: [
                "市场条件不满足我的交易框架"
            ],
            command: "建议：<br>保持空仓，只看不动<br><br>底层逻辑：<br>不符合我的交易条件 ≠ 没有机会"
        }
    },
    {
        position: "0%",
        buttonText: "状态：行情可以，但不属于我，等待",
        buttonClass: "action-yellow",
        pageTitle: "WAIT",
        stonePosition: "0%",
        stoneProgress: 40,
        bayonetPosition: "0%",
        bayonetProgress: 90,
        executionReason: {
            title: "说明：",
            bulletPoints: [
                "市场整体条件满足，但波动率过高或趋势在恶化"
            ],
            command: "建议：<br>仓位全部归零，只看不动<br><br>底层逻辑：<br>知道什么行情不适合自己更重要"
        }
    },
    {
        position: "≤100%",
        buttonText: "状态：属于我的行情",
        buttonClass: "action-green",
        pageTitle: "ACT",
        stonePosition: "30%",
        stoneProgress: 60,
        bayonetPosition: "15%",
        bayonetProgress: 85,
        executionReason: {
            title: "说明：",
            bulletPoints: [
                "结构已被市场确认，具备试错条件"
            ],
            command: "建议：<br>1/9仓位试仓，严格执行止损<br><br>底层逻辑：<br>只有被验证的走势才值得参与"
        }
    }
];

let currentStateIndex = 0;

// 显示随机交易哲学格言


// 更新执行理由函数


// 更新UI函数
function updateUI(stateIndex) {
    const state = tradingStates[stateIndex];
    
    const pageTitle = document.querySelector('.page-title');
    const actionButton = document.querySelector('.action-button');
    const loadingIndicator = document.querySelector('.loading-indicator');
    
    if (pageTitle) pageTitle.textContent = state.pageTitle;
    if (loadingIndicator) loadingIndicator.style.display = 'none';
    if (actionButton) {
        actionButton.textContent = state.buttonText;
        actionButton.className = `action-button ${state.buttonClass}`;
    }
    
    // 更新仓位管理
    updatePositionManagement(state);
    
    // 隐藏所有状态说明，然后显示对应的状态
    for (let i = 0; i < 3; i++) {
        const stateElement = document.getElementById(`state-${i}`);
        if (stateElement) {
            stateElement.style.display = i === stateIndex ? 'block' : 'none';
        }
    }
    
    console.log('UI更新完成:', state.buttonText, '显示状态:', stateIndex);
}

// 更新仓位管理
function updatePositionManagement(state) {
    // 更新底仓
    const stoneValue = document.querySelector('.stone-section .position-value');
    const stoneProgress = document.querySelector('.stone-section .progress-fill');
    const stoneLabel = document.querySelector('.stone-section .progress-label');
    
    if (stoneValue) stoneValue.textContent = `建议：${state.stonePosition}`;
    if (stoneProgress) stoneProgress.style.width = `${state.stoneProgress}%`;
    if (stoneLabel) stoneLabel.textContent = `熬冬进度：${state.stoneProgress}%`;
    
    // 更新刺刀
    const bayonetValue = document.querySelector('.bayonet-section .position-value');
    const bayonetProgress = document.querySelector('.bayonet-section .progress-fill');
    const bayonetLabel = document.querySelector('.bayonet-section .progress-label');
    
    if (bayonetValue) bayonetValue.textContent = `建议：${state.bayonetPosition}`;
    if (bayonetProgress) bayonetProgress.style.width = `${state.bayonetProgress}%`;
    const distanceToDeath = 100 - state.bayonetProgress;
    if (bayonetLabel) bayonetLabel.textContent = `离死亡线：${distanceToDeath}%`;
}

// 处理市场数据
function processMarketData(result) {
    console.log('processMarketData: 开始处理，result:', result);
    
    if (result.success && result.signal) {
        const signal = result.signal.trade_signal;
        console.log('processMarketData: 信号值:', signal);
        
        if (signal === "不属于我的行情") {
            currentStateIndex = 0;
            console.log('processMarketData: 设置为状态 0 (不属于我的行情)');
        } else if (signal === "行情可以，但不属于我，等待") {
            currentStateIndex = 1;
            console.log('processMarketData: 设置为状态 1 (行情可以，但不属于我)');
        } else if (signal === "属于我的行情") {
            currentStateIndex = 2;
            console.log('processMarketData: 设置为状态 2 (属于我的行情)');
        } else {
            currentStateIndex = 0;
            console.log('processMarketData: 未知信号，设置为状态 0');
        }
        
        // 更新风险指标
        updateRiskIndicators(result);
        
        updateUI(currentStateIndex);
    } else {
        console.log('processMarketData: 数据无效，result.success:', result.success, 'result.signal:', result.signal);
        currentStateIndex = 0;
        updateUI(currentStateIndex);
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
            lastTradingDay.setDate(now.getDate() - 2); // 回退到周五
        } else if (dayOfWeek === 6) { // 周六
            lastTradingDay.setDate(now.getDate() - 1); // 回退到周五
        }
        const lastYear = lastTradingDay.getFullYear();
        const lastMonth = String(lastTradingDay.getMonth() + 1).padStart(2, '0');
        const lastDay = String(lastTradingDay.getDate()).padStart(2, '0');
        statusText = `今日判断（${lastYear}-${lastMonth}-${lastDay} 已收盘）`;
    } else {
        // 交易日（周一至周五）
        const currentTime = currentHour * 100 + currentMinute;
        
        if (currentTime < 900) {
            // 9:00前
            statusText = `今日判断（${dateString} 等待开盘）`;
        } else if (currentTime >= 900 && currentTime < 930) {
            // 9:00-9:30 开盘前
            statusText = `今日判断（${dateString} 等待开盘）`;
        } else if ((currentTime >= 930 && currentTime < 1130) || 
                   (currentTime >= 1300 && currentTime < 1500)) {
            // 交易时间 9:30-11:30, 13:00-15:00
            statusText = `今日判断（${dateString}）`;
        } else if (currentTime >= 1130 && currentTime < 1300) {
            // 午休时间 11:30-13:00
            statusText = `今日判断（${dateString} 午间休市）`;
        } else {
            // 15:00后 已收盘
            statusText = `今日判断（${dateString} 已收盘）`;
        }
    }
    
    const dateElement = document.querySelector('.date-info');
    if (dateElement) {
        dateElement.textContent = statusText;
    }
}

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
        console.log('API请求失败，使用默认状态，错误:', error.message);
        // 紧急修复：如果API失败，默认显示"可尝试"状态（全力做多）
        currentStateIndex = 2; // 改为状态2（可尝试）
        updateUI(currentStateIndex);
    }
}

// 复制状态文本函数
function copyStateText(stateIndex) {
    const stateSection = document.getElementById(`state-${stateIndex}`);
    if (!stateSection) return;
    
    const title = stateSection.querySelector('.state-title').textContent;
    const content = stateSection.querySelector('.state-content').textContent;
    const textToCopy = `${title}\n\n${content}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        const copyBtn = stateSection.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '已复制';
        copyBtn.style.background = '#34c759';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
        
        console.log(`状态 ${stateIndex} 已复制到剪贴板`);
    }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动选择文本复制');
    });
}

// 更新风险指标
function updateRiskIndicators(result) {
    console.log('updateRiskIndicators: 开始更新风险指标');
    
    const signal = result.signal;
    const breadth = result.breadth;
    
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

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面初始化开始');
    
    // 获取市场数据
    console.log('开始获取市场数据...');
    fetchMarketData();
    
    // 初始化复制按钮
    console.log('初始化状态说明复制功能');
});