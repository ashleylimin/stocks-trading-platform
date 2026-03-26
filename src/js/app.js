// 简化版app.js - 只测试核心功能

// 交易状态定义
const tradingStates = [
    {
        position: "0%",
        buttonText: "禁止交易（WAIT）",
        buttonClass: "action-red",
        pageTitle: "JUST WAIT"
    },
    {
        position: "≤30%",
        buttonText: "准备阶段（READY）",
        buttonClass: "action-yellow",
        pageTitle: "ACT"
    },
    {
        position: "≤100%",
        buttonText: "允许交易（CONFIRMED）",
        buttonClass: "action-green",
        pageTitle: "ACT"
    }
];

let currentStateIndex = 0;

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

// 获取市场数据
async function fetchMarketData() {
    try {
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
    fetchMarketData();
});