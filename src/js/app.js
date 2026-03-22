// 三种交易状态
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
                "没有足够的强势股票", 
                "没有确认的突破信号"
            ],
            command: "今天的任务只有一个：不交易"
        }
    },
    {
        position: "≤30%",
        buttonText: "可以交易（READY）",
        buttonClass: "action-yellow",
        pageTitle: "ACT",
        executionReason: {
            title: "为什么今天可以交易？",
            bulletPoints: [
                "市场开始出现明确方向",
                "有1-2只强势股票走强",
                "部分突破信号得到确认"
            ],
            command: "今天的任务：只做最强的1-2只股票"
        }
    },
    {
        position: "≤100%",
        buttonText: "允许交易（CONFIRMED）",
        buttonClass: "action-green",
        pageTitle: "ACT",
        executionReason: {
            title: "为什么今天必须交易？",
            bulletPoints: [
                "市场方向非常明确",
                "有≥2只强势股票确认突破",
                "所有条件都已满足"
            ],
            command: "今天的任务：全力做多最强的股票"
        }
    }
];

// 获取DOM元素
const pageTitle = document.querySelector('.page-title');
const positionInfo = document.querySelector('.position-info');
const actionButton = document.querySelector('.action-button');

// 初始化状态
let currentStateIndex = 0;

// 更新UI函数
function updateUI(stateIndex) {
    const state = tradingStates[stateIndex];
    
    // 更新页面标题
    pageTitle.textContent = state.pageTitle;
    
    // 更新仓位信息
    positionInfo.textContent = `建议仓位：${state.position}`;
    
    // 隐藏加载指示器
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
    
    // 更新按钮
    actionButton.textContent = state.buttonText;
    actionButton.className = `action-button ${state.buttonClass}`;
    
    // 更新执行理由
    updateExecutionReason(state);
    
    console.log('UI更新完成');
}

// 更新执行理由函数
function updateExecutionReason(state) {
    const reasonTitle = document.querySelector('.decision-basis .basis-item:nth-child(1) div:nth-child(1)');
    const bulletPoints = document.querySelector('.decision-basis .basis-item:nth-child(1) div:nth-child(2)');
    const command = document.querySelector('.decision-basis .basis-item:nth-child(1) div:nth-child(3)');
    
    if (reasonTitle) {
        reasonTitle.textContent = state.executionReason.title;
    }
    
    if (bulletPoints) {
        bulletPoints.innerHTML = state.executionReason.bulletPoints.map(point => `• ${point}`).join('<br>');
    }
    
    if (command) {
        command.innerHTML = state.executionReason.command.replace('<br>', '<br>');
    }
}

// 按钮点击显示详细信息（不再切换状态）
actionButton.addEventListener('click', function() {
    // 不再切换状态，只显示当前状态的详细信息
    const state = tradingStates[currentStateIndex];
    const reasonText = `${state.executionReason.title}\n\n${state.executionReason.bulletPoints.map(point => `• ${point}`).join('\n')}\n\n${state.executionReason.command}`;
    alert(`交易决策：${state.buttonText}\n建议仓位：${state.position}\n\n${reasonText}\n\n决策基于实时市场数据，不可手动更改。`);
});

// 显示加载状态
console.log('页面初始化，显示加载状态');

// 从后端获取实时数据（页面加载后立即执行）
async function fetchMarketData() {
    try {
        console.log('正在获取市场数据...');
        const apiUrl = 'https://stocks-trading-platform-production.up.railway.app/api/market/overview';
        console.log('API URL:', apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        console.log('响应状态:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('API响应:', result);
        
        if (result.success && result.signal) {
            const signal = result.signal.trade_signal;
            console.log('交易信号:', signal);
            
            // 根据后端信号决定状态
            if (signal === "禁止交易") {
                currentStateIndex = 0;
            } else if (signal === "可以交易") {
                currentStateIndex = 1;
            } else if (signal === "积极做多") {
                currentStateIndex = 2;
            } else {
                console.log('未知信号，使用默认状态');
                currentStateIndex = 0; // 默认禁止交易
            }
            
            // 更新决策依据
            updateDecisionBasis(result);
            
            updateUI(currentStateIndex);
            console.log('UI已更新，状态索引:', currentStateIndex);
        } else {
            console.log('API响应格式错误，使用演示数据');
        }
    } catch (error) {
        console.error('获取数据失败:', error);
        console.log('错误详情:', error.message);
        
        // 尝试使用XMLHttpRequest作为fallback
        try {
            console.log('尝试使用XMLHttpRequest...');
            const xhrResult = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://stocks-trading-platform-production.up.railway.app/api/market/overview');
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error(`XHR错误: ${xhr.status}`));
                    }
                };
                xhr.onerror = () => reject(new Error('XHR网络错误'));
                xhr.send();
            });
            
            console.log('XHR成功:', xhrResult);
            if (xhrResult.success && xhrResult.signal) {
                const signal = xhrResult.signal.trade_signal;
                if (signal === "禁止交易") currentStateIndex = 0;
                else if (signal === "可以交易") currentStateIndex = 1;
                else if (signal === "积极做多") currentStateIndex = 2;
                
                // 更新决策依据
                updateDecisionBasis(xhrResult);
                
                updateUI(currentStateIndex);
                return;
            }
        } catch (xhrError) {
            console.error('XHR也失败:', xhrError);
        }
        
        console.log('使用演示数据');
    }
}

// 更新决策依据函数
function updateDecisionBasis(data) {
    const decisionBasis = document.querySelector('.decision-basis');
    if (!decisionBasis) return;
    
    // 获取数据
    const breadth = data.breadth || {};
    const signal = data.signal || {};
    
    // 更新市场广度
    const marketBreadthElement = document.querySelector('.basis-item:nth-child(2) .basis-value');
    if (marketBreadthElement && breadth.up_percentage !== undefined && breadth.down_percentage !== undefined) {
        marketBreadthElement.textContent = `上涨${breadth.up_percentage}% / 下跌${breadth.down_percentage}%`;
    }
    
    // 更新52周高低比
    const hlRatioElement = document.querySelector('.basis-item:nth-child(3) .basis-value');
    if (hlRatioElement && breadth.hl_ratio !== undefined && breadth.highs_52wk !== undefined && breadth.lows_52wk !== undefined) {
        const hlRatioPercent = (breadth.hl_ratio * 100).toFixed(1);
        hlRatioElement.textContent = `${hlRatioPercent}% (${breadth.highs_52wk}/${breadth.lows_52wk})`;
    }
    
    // 更新趋势条件
    const trendElement = document.querySelector('.basis-item:nth-child(4) .basis-value');
    if (trendElement && signal.condition1_trend !== undefined) {
        trendElement.textContent = signal.condition1_trend ? "已满足" : "未满足";
        trendElement.className = signal.condition1_trend ? "basis-value basis-true" : "basis-value basis-false";
    }
    
    // 更新广度条件
    const breadthElement = document.querySelector('.basis-item:nth-child(5) .basis-value');
    if (breadthElement && signal.condition2_breadth !== undefined) {
        breadthElement.textContent = signal.condition2_breadth ? "已满足" : "未满足";
        breadthElement.className = signal.condition2_breadth ? "basis-value basis-true" : "basis-value basis-false";
    }
    
    // 更新板块条件
    const sectorsElement = document.querySelector('.basis-item:nth-child(6) .basis-value');
    if (sectorsElement && signal.condition3_sectors !== undefined) {
        sectorsElement.textContent = signal.condition3_sectors ? "已满足" : "未满足";
        sectorsElement.className = signal.condition3_sectors ? "basis-value basis-true" : "basis-value basis-false";
    }
    
    console.log('决策依据已更新');
}

// 页面加载时获取数据
fetchMarketData();