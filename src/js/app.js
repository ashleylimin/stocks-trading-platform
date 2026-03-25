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

// 显示随机交易哲学格言
function showRandomPhilosophyQuote() {
    const decisionBasis = document.querySelector('.decision-basis');
    if (!decisionBasis) {
        console.log('未找到.decision-basis元素');
        return;
    }
    
    // 随机选择一条格言
    const randomIndex = Math.floor(Math.random() * tradingPhilosophyQuotes.length);
    const quote = tradingPhilosophyQuotes[randomIndex];
    
    // 使用更可靠的选择器
    const basisItem = decisionBasis.querySelector('.basis-item');
    if (!basisItem) {
        console.log('未找到.basis-item元素');
        return;
    }
    
    // 获取basis-item内的所有div元素
    const divs = basisItem.querySelectorAll('div');
    console.log('找到的div数量:', divs.length);
    
    // 更新显示
    const basisTitle = decisionBasis.querySelector('.basis-title');
    if (basisTitle) {
        basisTitle.textContent = '交易哲学';
        console.log('更新标题: 交易哲学');
    }
    

    // 第二个div应该是交易哲学格言
    if (divs.length > 1) {
        divs[1].innerHTML = quote;
        divs[1].style.fontSize = '16px';
        divs[1].style.color = '#666';
        divs[1].style.lineHeight = '1.6';
        divs[1].style.marginBottom = '16px';
        divs[1].style.fontStyle = 'italic';
        divs[1].style.textAlign = 'center';
        divs[1].style.width = '100%';
        console.log('更新第二个div:', quote);
    }
    
    // 第三个div应该是"止观 · 交易系统"
    if (divs.length > 2) {
        divs[2].innerHTML = '止观 · 交易系统';
        divs[2].style.fontWeight = '700';
        divs[2].style.color = '#8e8e93';
        divs[2].style.fontSize = '16px';
        divs[2].style.borderTop = '2px solid #f0f0f0';
        divs[2].style.paddingTop = '12px';
        divs[2].style.width = '100%';
        divs[2].style.textAlign = 'center';
        console.log('更新第三个div: justwait.today');
    }
    
    console.log('显示交易哲学格言:', quote);
}

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
    const decisionBasis = document.querySelector('.decision-basis');
    if (!decisionBasis) return;
    
    const basisTitle = decisionBasis.querySelector('.basis-title');
    const reasonTitle = decisionBasis.querySelector('.basis-item div:nth-child(1)');
    const bulletPoints = decisionBasis.querySelector('.basis-item div:nth-child(2)');
    const command = decisionBasis.querySelector('.basis-item div:nth-child(3)');
    
    if (basisTitle) basisTitle.textContent = '执行理由';
    if (reasonTitle) reasonTitle.textContent = state.executionReason.title;
    
    if (bulletPoints) {
        bulletPoints.innerHTML = state.executionReason.bulletPoints.map(point => `• ${point}`).join('<br>');
    }
    
    if (command) {
        command.innerHTML = state.executionReason.command.replace('<br>', '<br>');
        // 根据状态设置颜色
        if (state.buttonClass === 'action-red') {
            command.style.color = '#dc2626';
            command.style.borderTopColor = '#dc2626';
        } else if (state.buttonClass === 'action-yellow') {
            command.style.color = '#d97706';
            command.style.borderTopColor = '#d97706';
        } else if (state.buttonClass === 'action-green') {
            command.style.color = '#059669';
            command.style.borderTopColor = '#059669';
        }
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

// 等待DOM完全加载后显示随机交易哲学格言
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM已完全加载，显示交易哲学格言');
        showRandomPhilosophyQuote();
        fetchMarketData();
    });
} else {
    // DOM已经加载完成
    console.log('DOM已加载完成，显示交易哲学格言');
    showRandomPhilosophyQuote();
    fetchMarketData();
}
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
            console.log('完整signal对象:', result.signal);
            
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
                console.log('未知信号值:', signal);
                currentStateIndex = 0; // 默认禁止交易
            }
            
            console.log('最终状态索引:', currentStateIndex);
            
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

// 页面初始化 - 在DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM已完全加载，开始页面初始化');
    
    // 显示随机交易哲学格言
    showRandomPhilosophyQuote();
    
    // 获取市场数据
    fetchMarketData();
    
    // 移动端菜单切换功能
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
// More debug Tue Mar 24 15:01:18 CST 2026
