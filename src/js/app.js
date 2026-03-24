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
    const reasonTitle = document.querySelector('.decision-basis .basis-item div:nth-child(1)');
    const bulletPoints = document.querySelector('.decision-basis .basis-item div:nth-child(2)');
    const command = document.querySelector('.decision-basis .basis-item div:nth-child(3)');
    
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
        // 更新日期信息
        updateDateInfo();
        
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
            console.log('后端信号:', signal);
            if (signal === "禁止交易") {
                currentStateIndex = 0;
                console.log('设置为状态 0: 禁止交易');
            } else if (signal === "允许交易" || signal === "可以交易") {
                currentStateIndex = 1;
                console.log('设置为状态 1: 可以交易');
            } else if (signal === "积极交易" || signal === "积极做多") {
                currentStateIndex = 2;
                console.log('设置为状态 2: 积极交易');
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
                else if (signal === "允许交易" || signal === "可以交易") currentStateIndex = 1;
                else if (signal === "积极交易" || signal === "积极做多") currentStateIndex = 2;
                
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
        console.log(`日期信息已更新: ${statusText}`);
        console.log(`当前时间: ${currentHour}:${currentMinute}, 星期${['日', '一', '二', '三', '四', '五', '六'][dayOfWeek]}`);
    }
    
    // 更新回撤避免统计（在updateUI函数中处理）
}

// 页面加载时获取数据
fetchMarketData();

// 移动端菜单切换功能
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-visible');
            
            // 切换菜单图标
            const icon = menuToggle.querySelector('.menu-toggle-icon');
            if (sidebar.classList.contains('mobile-visible')) {
                // 显示关闭图标
                icon.innerHTML = '<path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
            } else {
                // 显示汉堡菜单图标
                icon.innerHTML = '<path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
            }
        });
        
        // 点击侧边栏外部关闭菜单
        document.addEventListener('click', function(event) {
            if (sidebar.classList.contains('mobile-visible') && 
                !sidebar.contains(event.target) && 
                !menuToggle.contains(event.target)) {
                sidebar.classList.remove('mobile-visible');
                const icon = menuToggle.querySelector('.menu-toggle-icon');
                icon.innerHTML = '<path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
            }
        });
        
        // 点击侧边栏菜单项后关闭菜单（移动端）
        const menuItems = sidebar.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('mobile-visible');
                    const icon = menuToggle.querySelector('.menu-toggle-icon');
                    icon.innerHTML = '<path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
                }
            });
        });
        
        console.log('移动端菜单切换功能已启用');
    }
    
    // 反馈功能
    function showFeedback() {
        const feedbackText = prompt('感谢使用止观系统！\n\n请告诉我们您的反馈或建议：\n\n1. 系统是否帮助您减少了不必要的交易？\n2. 您希望看到哪些改进？\n3. 其他建议？', '');
        
        if (feedbackText && feedbackText.trim()) {
            alert('感谢您的反馈！\n\n您的意见对我们非常重要。\n\n反馈已记录，我们会持续改进系统。');
            console.log('用户反馈:', feedbackText);
            
            // 这里可以添加将反馈发送到后端的代码
            // sendFeedbackToBackend(feedbackText);
        } else if (feedbackText !== null) {
            alert('反馈内容不能为空。');
        }
    }
    
    // 添加反馈按钮事件监听
    const feedbackButton = document.querySelector('.feedback-button');
    if (feedbackButton) {
        feedbackButton.addEventListener('click', showFeedback);
    }
});
// Debug Tue Mar 24 14:55:42 CST 2026
