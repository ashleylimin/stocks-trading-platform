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
        buttonText: "禁止交易（WAIT）",
        buttonClass: "action-red",
        pageTitle: "JUST WAIT",
        executionReason: {
            title: "为什么今天不交易？",
            bulletPoints: [
                "市场没有形成一致方向",
                "没有确认的强势突破",
                "条件尚未满足"
            ],
            command: "今天的任务：<br>不交易，保持耐心"
        }
    },
    {
        position: "≤30%",
        buttonText: "准备阶段（READY）",
        buttonClass: "action-yellow",
        pageTitle: "ACT",
        executionReason: {
            title: "为什么暂时不交易？",
            bulletPoints: [
                "市场开始分化",
                "有潜在强势股票出现",
                "但尚未确认突破"
            ],
            command: "今天的任务：<br>只观察，不出手"
        }
    },
    {
        position: "≤100%",
        buttonText: "允许交易（CONFIRMED）",
        buttonClass: "action-green",
        pageTitle: "ACT",
        executionReason: {
            title: "为什么今天允许交易？",
            bulletPoints: [
                "市场方向开始明确",
                "出现确认突破的强势股票",
                "系统条件已满足"
            ],
            command: "今天的任务：<br>只做确认后的最强股票"
        }
    }
];

let currentStateIndex = 0;

// 显示随机交易哲学格言
function showRandomPhilosophyQuote() {
    const decisionBasis = document.querySelector('.decision-basis');
    if (!decisionBasis) return;
    
    // 随机选择一条格言
    const randomIndex = Math.floor(Math.random() * tradingPhilosophyQuotes.length);
    const quote = tradingPhilosophyQuotes[randomIndex];
    
    // 更新显示
    const basisItem = decisionBasis.querySelector('.basis-item');
    if (basisItem) {
        const divs = basisItem.querySelectorAll('div');
        if (divs.length > 0) {
            // 第一个div显示交易哲学格言
            divs[0].innerHTML = quote;
            divs[0].style.fontSize = '16px';
            divs[0].style.color = '#666';
            divs[0].style.lineHeight = '1.6';
            divs[0].style.marginBottom = '16px';
            divs[0].style.fontStyle = 'italic';
            divs[0].style.textAlign = 'center';
            divs[0].style.width = '100%';
        }
    }
}

// 更新执行理由函数
function updateExecutionReason(state) {
    const decisionBasis = document.querySelector('.decision-basis');
    if (!decisionBasis) return;
    
    const basisTitle = decisionBasis.querySelector('.basis-title');
    const basisItem = decisionBasis.querySelector('.basis-item');
    
    if (basisTitle) basisTitle.textContent = '执行理由';
    
    if (basisItem) {
        // 清空现有内容
        basisItem.innerHTML = '';
        
        // 添加标题
        const titleDiv = document.createElement('div');
        titleDiv.textContent = state.executionReason.title;
        titleDiv.style.fontSize = '18px';
        titleDiv.style.fontWeight = '600';
        titleDiv.style.color = '#333';
        titleDiv.style.marginBottom = '12px';
        basisItem.appendChild(titleDiv);
        
        // 添加要点
        const pointsDiv = document.createElement('div');
        pointsDiv.innerHTML = state.executionReason.bulletPoints.map(point => `• ${point}`).join('<br>');
        pointsDiv.style.fontSize = '16px';
        pointsDiv.style.color = '#666';
        pointsDiv.style.lineHeight = '1.6';
        pointsDiv.style.marginBottom = '16px';
        basisItem.appendChild(pointsDiv);
        
        // 添加命令
        const commandDiv = document.createElement('div');
        commandDiv.innerHTML = state.executionReason.command;
        commandDiv.style.fontWeight = '700';
        commandDiv.style.color = '#8e8e93';
        commandDiv.style.fontSize = '16px';
        commandDiv.style.borderTop = '2px solid #f0f0f0';
        commandDiv.style.paddingTop = '12px';
        commandDiv.style.width = '100%';
        commandDiv.style.textAlign = 'center';
        
        // 根据状态设置颜色
        if (state.buttonClass === 'action-red') {
            commandDiv.style.color = '#dc2626';
            commandDiv.style.borderTopColor = '#dc2626';
        } else if (state.buttonClass === 'action-yellow') {
            commandDiv.style.color = '#d97706';
            commandDiv.style.borderTopColor = '#d97706';
        } else if (state.buttonClass === 'action-green') {
            commandDiv.style.color = '#059669';
            commandDiv.style.borderTopColor = '#059669';
        }
        
        basisItem.appendChild(commandDiv);
    }
}

// 更新UI函数
function updateUI(stateIndex) {
    const state = tradingStates[stateIndex];
    
    const pageTitle = document.querySelector('.page-title');
    const positionInfo = document.querySelector('.position-info');
    const actionButton = document.querySelector('.action-button');
    const loadingIndicator = document.querySelector('.loading-indicator');
    
    if (pageTitle) pageTitle.textContent = state.pageTitle;
    if (positionInfo) positionInfo.textContent = `建议仓位：${state.position}`;
    if (loadingIndicator) loadingIndicator.style.display = 'none';
    if (actionButton) {
        actionButton.textContent = state.buttonText;
        actionButton.className = `action-button ${state.buttonClass}`;
    }
    
    // 更新执行理由
    updateExecutionReason(state);
    
    console.log('UI更新完成:', state.buttonText);
}

// 处理市场数据
function processMarketData(result) {
    if (result.success && result.signal) {
        const signal = result.signal.trade_signal;
        
        if (signal === "禁止交易") {
            currentStateIndex = 0;
        } else if (signal === "允许交易" || signal === "可以交易") {
            currentStateIndex = 1;
        } else if (signal === "积极交易" || signal === "积极做多") {
            currentStateIndex = 2;
        } else {
            currentStateIndex = 0;
        }
        
        updateUI(currentStateIndex);
    } else {
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
        // 先更新日期信息
        updateDateInfo();
        
        const apiUrl = '/api/market/overview?t=' + Date.now();
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
        }
        
        const result = await response.json();
        processMarketData(result);
        
    } catch (error) {
        console.log('API请求失败，使用默认状态');
        currentStateIndex = 0;
        updateUI(currentStateIndex);
    }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面初始化开始');
    
    // 先显示随机交易哲学格言
    showRandomPhilosophyQuote();
    
    // 然后获取市场数据
    fetchMarketData();
});