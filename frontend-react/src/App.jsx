import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import PivotPage from './PivotPage';
import LeadersPage from './LeadersPage';

// API base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api';

function App() {
  const [activePage, setActivePage] = useState('market');
  const [marketData, setMarketData] = useState(null);
  const [_leadersData, setLeadersData] = useState(null);
  const [_pivotData, setPivotData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  
  // 判断是否为交易时间
  const isTradingTime = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const day = now.getDay(); // 0=周日, 1=周一, ..., 6=周六
    
    // 判断是否为交易日（周一至周五）
    if (day === 0 || day === 6) {
      return false; // 周末非交易时间
    }
    
    // A股交易时间：上午9:30-11:30，下午13:00-15:00
    const isMorningSession = (hour === 9 && minute >= 30) || 
                            (hour === 10) || 
                            (hour === 11 && minute < 30);
    
    const isAfternoonSession = (hour === 13) || 
                              (hour === 14) || 
                              (hour === 15 && minute === 0);
    
    return isMorningSession || isAfternoonSession;
  };

  // 获取市场数据
  const fetchMarketData = async () => {
    try {
      console.log('正在获取市场数据...');
      const response = await axios.get(`${API_BASE}/market/overview`);
      console.log('市场数据获取成功:', response.data);
      setMarketData(response.data);
      setLastUpdateTime(new Date());
      return response.data;
    } catch (error) {
      console.error('获取市场数据失败:', error);
      console.error('错误详情:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  // 获取涨幅榜数据
  const _fetchLeadersData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/leaders`);
      setLeadersData(response.data);
    } catch (error) {
      console.error('获取涨幅榜数据失败:', error);
    }
  };

  // 获取选股数据
  const _fetchPivotData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/pivot`);
      setPivotData(response.data);
    } catch (error) {
      console.error('获取选股数据失败:', error);
    }
  };

  // 运行选股
  const _runStockSelection = async () => {
    try {
      const response = await axios.get(`${API_BASE}/stocks/select`);
      setPivotData(response.data);
    } catch (error) {
      console.error('选股失败:', error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 先只加载市场数据
        await fetchMarketData();
      } catch (error) {
        console.error('初始数据加载失败:', error);
      } finally {
        // 无论如何都设置loading为false，让页面显示
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  // 交易时间自动刷新市场数据
  useEffect(() => {
    if (activePage !== 'market') return;
    
    const checkAndRefresh = async () => {
      if (isTradingTime()) {
        console.log('交易时间，自动刷新市场数据...');
        try {
          await fetchMarketData();
        } catch (error) {
          console.error('自动刷新失败:', error);
        }
      }
    };
    
    // 初始检查
    checkAndRefresh();
    
    // 每60秒检查一次是否为交易时间并刷新（从30秒延长到60秒）
    const intervalId = setInterval(checkAndRefresh, 60000);
    
    return () => clearInterval(intervalId);
  }, [activePage]);

  // 侧边栏菜单项
  const menuItems = [
    { id: 'market', label: 'Market', icon: 'market.svg' },
    { id: 'pivot', label: 'Pivot', icon: 'povit.svg' },
    { id: 'leaders', label: 'Leaders', icon: 'leaders.svg' },
    { id: 'account', label: 'Account', icon: 'account.svg' },
  ];

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <img src="/logo.png" alt="Livermore Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
          </div>
          <div>
            <div className="brand-name">Livermore</div>
          </div>
        </div>
        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <img src={item.icon} className="menu-icon" alt={item.label} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activePage === 'market' && (
          <MarketPage 
            data={marketData} 
            loading={loading} 
            lastUpdateTime={lastUpdateTime}
          />
        )}
        {activePage === 'leaders' && (
          <LeadersPage />
        )}
        {activePage === 'pivot' && (
          <PivotPage />
        )}
        {activePage === 'account' && (
          <AccountPage />
        )}
      </div>
    </div>
  );
}

// Market Page Component
function MarketPage({ 
  data, 
  loading, 
  lastUpdateTime
}) {
  const formatTime = (date) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('zh-CN', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="market-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">不是所有上涨，都属于我</h1>
        </div>
        <div className="header-controls">
          <div className="refresh-controls">
            <div className="trading-time-refresh">
              <span className="refresh-status">
                <i className="bi bi-clock"></i>
                交易时间自动刷新
              </span>
              {lastUpdateTime && (
                <div className="update-time-right">
                  <span className="time-label">数据更新:</span>
                  <span className="time-value">{formatTime(lastUpdateTime)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {loading || !data ? (
        <div className="loading">
          <div className="spinner-border text-primary" role="status"></div>
          <span className="ms-2">加载中...</span>
        </div>
      ) : renderMarketContent(data, lastUpdateTime)}
    </div>
  );
}

function renderMarketContent(data) {
  const { data: indices, breadth, signal } = data;
  const tradeSignal = signal?.trade_signal || '禁止交易';
  const signalLevel = signal?.signal_level || 'low';
  const hlRatio = signal?.hl_ratio || 0;
  
  // 根据H/L Ratio判断市场宽度条件
  let widthConditionMet = false;
  let widthConditionDesc = '';
  
  if (hlRatio > 1.5) {
    widthConditionMet = true;
    widthConditionDesc = `H/L Ratio > 1.5 (当前: ${hlRatio}) - 积极交易`;
  } else if (hlRatio > 1) {
    widthConditionMet = true;
    widthConditionDesc = `H/L Ratio > 1 (当前: ${hlRatio}) - 允许交易`;
  } else {
    widthConditionMet = false;
    widthConditionDesc = `H/L Ratio < 1 (当前: ${hlRatio}) - 禁止交易`;
  }
  
  // 计算条件状态
  const conditions = [
    { label: '主要趋势', met: signal?.condition1_trend, desc: '上证/科创 ≥ 0%' },
    { label: '市场宽度', met: widthConditionMet, desc: widthConditionDesc },
    { label: '强势板块', met: signal?.condition3_sectors, desc: '有强势板块' }
  ];
  
  // 根据信号级别设置样式
  let signalClass = 'signal-red';
  let signalIcon = '⛔';
  
  if (signalLevel === 'high') {
    signalClass = 'signal-green';
    signalIcon = '🚀';
  } else if (signalLevel === 'medium') {
    signalClass = 'signal-yellow';
    signalIcon = '✅';
  }
  
  return (
    <div className="page-container">
      {/* 统一标题样式 */}
      <div className="page-title-container">
        <h1 className="page-main-title">市场概览</h1>
      </div>

      {/* 交易信号状态 */}
      <div className="signal-status-card mb-4">
        <div className="signal-header">
          <h3 className="signal-title">交易信号</h3>
          <div className={`signal-indicator ${signalClass}`}>
            {signalIcon} {tradeSignal}
          </div>
        </div>
        
        <div className="conditions-grid">
          {conditions.map((condition, index) => (
            <div key={index} className={`condition-item ${condition.met ? 'condition-met' : 'condition-not-met'}`}>
              <div className="condition-icon">
                {condition.met ? '✓' : '✗'}
              </div>
              <div className="condition-content">
                <div className="condition-label">{condition.label}</div>
                <div className="condition-desc">{condition.desc}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="signal-summary">
          <div className="summary-item">
            <span className="summary-label">120日H/L:</span>
            <span className={`summary-value ${
              hlRatio > 1.5 ? 'text-success' : 
              hlRatio > 1 ? 'text-warning' : 
              'text-danger'
            }`}>
              {hlRatio}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">新高/新低:</span>
            <span className="summary-value">
              {breadth?.highs_52wk || 0}/{breadth?.lows_52wk || 0}
            </span>
            <span className="summary-note">(120日估算)</span>
          </div>
        </div>
      </div>

      {/* Index Trend */}
      <div className="section-card mb-4">
        <div className="section-title">主要指数</div>
        <div className="index-list">
          {indices.map((index) => {
            const change = parseFloat(index['涨跌幅']);
            const _arrow = change > 0 ? '↗' : (change < 0 ? '↘' : '→');
            const changeClass = change > 0 ? 'up' : (change < 0 ? 'down' : 'flat');
            const indexNameMap = {
              '000001': '上证指数',
              '000688': '科创50',
              '399006': '创业板指',
              '000300': '沪深300'
            };
            const name = indexNameMap[index['代码']] || index['名称'];
            const price = parseFloat(index['最新价']);
            
            return (
              <div className="index-item" key={index['代码']}>
                <div className="index-header">
                  <span className="index-name">{name}</span>
                </div>
                <div className="index-price-container">
                  <span className="index-price">{price.toFixed(0)}</span>
                  <span className={`index-change ${changeClass}`}>
                    {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market Metrics */}
      <div className="section-card">
        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-header">
              <span className="metric-title">市场宽度</span>
              <span className={`metric-status ${
                hlRatio > 1.5 ? 'status-good' : 
                hlRatio > 1 ? 'status-neutral' : 
                'status-bad'
              }`}>
                {hlRatio > 1.5 ? '强势' : 
                 hlRatio > 1 ? '中性' : 
                 '疲弱'}
              </span>
            </div>
            <div className="metric-values">
              <div className="metric-value-group">
                <span className="metric-value">{breadth?.highs_52wk || 0}</span>
                <span className="metric-label">52周新高</span>
              </div>
              <div className="metric-divider">/</div>
              <div className="metric-value-group">
                <span className="metric-value">{breadth?.lows_52wk || 0}</span>
                <span className="metric-label">52周新低</span>
              </div>
              <div className="metric-value-group highlight">
                <span className={`metric-value ${
                  hlRatio > 1.5 ? 'text-success' : 
                  hlRatio > 1 ? 'text-warning' : 
                  'text-danger'
                }`}>
                  {(breadth?.hl_ratio || 0).toFixed(2)}
                </span>
                <span className="metric-label">H/L比率</span>
              </div>
            </div>
          </div>
          
          <div className="metric-item">
            <div className="metric-header">
              <span className="metric-title">板块强度</span>
              <span className="metric-status status-good">强势</span>
            </div>
            <div className="sector-tags">
              <span className="sector-tag strong">半导体</span>
              <span className="sector-tag strong">AI</span>
              <span className="sector-tag neutral">新能源</span>
              <span className="sector-tag weak">生物医药</span>
            </div>
            <div className="sector-summary">
              强势板块: 2 | 中性: 1 | 弱势: 1
            </div>
          </div>
         </div>
       </div>
     </div>
   );
 }





// Account Page Component
function AccountPage() {
  return (
    <div className="page-container">
      {/* 统一标题样式 */}
      <div className="page-title-container">
        <h1 className="page-main-title">小亏·大赚·实时监控</h1>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="account-info">
            <div className="avatar">
              <i className="bi bi-person"></i>
            </div>
            <h3>Guest User</h3>
            <p className="text-secondary">登录以获取更多功能</p>
            <button className="btn btn-primary mt-3">
              <i className="bi bi-box-arrow-in-right me-2"></i>
              登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
