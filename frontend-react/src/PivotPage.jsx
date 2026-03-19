import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api';

// Mock数据 - 模拟股票数据（备用）
const mockStocks = [
  { id: 1, ticker: '000001.SZ', name: '平安银行', pivot: 12.50, price: 12.20, volume: 45000000 },
  { id: 2, ticker: '000858.SZ', name: '五粮液', pivot: 145.80, price: 146.20, volume: 32000000 },
  { id: 3, ticker: '300750.SZ', name: '宁德时代', pivot: 185.30, price: 184.50, volume: 68000000 },
  { id: 4, ticker: '600519.SH', name: '贵州茅台', pivot: 1680.00, price: 1695.00, volume: 2800000 },
  { id: 5, ticker: '000333.SZ', name: '美的集团', pivot: 58.40, price: 58.10, volume: 38000000 },
];

// 状态说明
const STATE_CONFIG = {
  WAIT: { label: 'WAIT', color: 'text-white', bg: 'bg-secondary', desc: '远离Pivot - 禁止' },
  READY: { label: 'READY', color: 'text-dark', bg: 'bg-warning', desc: '接近Pivot - 观察' },
  TRIGGER: { label: 'TRIGGER', color: 'text-dark', bg: 'bg-warning', desc: '盘中突破 - 禁止买' },
  CONFIRMED: { label: 'CONFIRMED', color: 'text-white', bg: 'bg-success', desc: '收盘确认 - 唯一允许' },
};

// 交易规则
const TRADING_RULES = [
  { id: 1, rule: '初始仓位：1/9资金', condition: '仅限CONFIRMED状态股票' },
  { id: 2, rule: '未盈利禁止加仓', condition: '必须已有浮盈才能追加' },
  { id: 3, rule: '盈利后加仓至2/9', condition: '有盈利保护，风险可控' },
  { id: 4, rule: '最大仓位限制：3/9', condition: '单票上限，分散风险' },
  { id: 5, rule: '时间限制：14:50前禁止买入', condition: '避免尾盘风险，实时监控' },
];

const PivotPage = () => {
  // 状态管理
  const [marketAllowed, setMarketAllowed] = useState(false); // 市场是否允许交易
  const [currentTime, setCurrentTime] = useState(new Date());
  const [_stocks, _setStocks] = useState(mockStocks);
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState(null);
  
  // 获取市场数据
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        console.log('正在获取市场数据...');
        const response = await axios.get(`${API_BASE}/market/overview`, {
          timeout: 5000 // 5秒超时
        });
        const data = response.data;
        console.log('市场数据获取成功:', data);
        if (data.success) {
          setMarketData(data);
          // 根据市场信号判断是否允许交易
          const allowLong = data.signal?.allow_long || false;
          setMarketAllowed(allowLong);
          console.log('实时数据获取成功，交易状态:', allowLong ? '允许' : '禁止');
        } else {
          console.warn('市场数据返回失败:', data.error || data);
          // 不设置模拟数据，保持marketData为null
          // 让页面显示错误状态
          setMarketAllowed(false);
        }
      } catch (error) {
        console.error('获取市场数据失败:', error.message);
        // 获取真实数据失败时，不设置模拟数据
        // 保持marketData为null，让页面显示加载状态或错误
        // 测试按钮可以手动切换状态
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    
    // 更新时间
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // 每30秒刷新市场数据
    const dataInterval = setInterval(() => {
      if (!loading) {
        fetchMarketData();
      }
    }, 30000);
    
    return () => {
      clearInterval(timeInterval);
      clearInterval(dataInterval);
    };
  }, [loading]);
  
  // 判断是否为交易时间（14:50之后）
  const isAfterTradeTime = () => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    return hour > 14 || (hour === 14 && minute >= 50);
  };
  
  // 格式化当前时间
  const _formatCurrentTime = () => {
    const hour = currentTime.getHours().toString().padStart(2, '0');
    const minute = currentTime.getMinutes().toString().padStart(2, '0');
    return `${hour}:${minute}`;
  };
  
  // 获取时间状态文本
  const getTimeStatusText = () => {
    if (isAfterTradeTime()) {
      return `允许买入时段 (14:50后)`;
    } else {
      return `当前时间禁止买入(14:50前)`;
    }
  };
  
  // 计算股票状态
  const calculateStockState = (stock) => {
    const { pivot, price, volume } = stock;
    const distance = ((price - pivot) / pivot * 100).toFixed(2);
    const distanceValue = parseFloat(distance);
    
    // 状态判断逻辑
    if (price < pivot * 0.98) {
      return 'WAIT'; // 远离Pivot
    } else if (distanceValue >= -2 && distanceValue <= 1) {
      return 'READY'; // 接近Pivot
    } else if (price > pivot && !isAfterTradeTime()) {
      return 'TRIGGER'; // 盘中突破，但时间未到
    } else if (price > pivot && isAfterTradeTime() && volume > 30000000) {
      return 'CONFIRMED'; // 突破 + 时间满足 + 成交量高
    } else if (price > pivot) {
      return 'TRIGGER'; // 突破但其他条件不满足
    }
    
    return 'WAIT';
  };
  
  // 获取状态配置
  const getStateConfig = (state) => STATE_CONFIG[state] || STATE_CONFIG.WAIT;
  
  // 处理交易操作
  const handleTrade = (stockId) => {
    if (!marketAllowed) {
      alert('市场禁止交易');
      return;
    }
    
    const stock = _stocks.find(s => s.id === stockId);
    const state = calculateStockState(stock);
    
    if (state !== 'CONFIRMED') {
      alert(`禁止交易: ${getStateConfig(state).desc}`);
      return;
    }
    
    // 执行试探仓 1/9
    alert(`执行试探仓 1/9: ${stock.ticker} ${stock.name}`);
    console.log('交易执行:', { stock, position: '1/9' });
  };
  
  // 渲染市场状态
  const renderMarketStatus = () => {
    if (loading) {
      return (
        <div className="mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">加载中...</span>
              </div>
              <div className="text-muted">正在连接实时市场数据...</div>
              <div className="text-xs text-muted mt-2">正在从数据源获取最新行情</div>
            </div>
          </div>
        </div>
      );
    }
    
    // 检查数据获取是否成功
    if (!marketData || !marketData.success) {
      return (
        <div className="mb-4">
          <div className="card border-warning border-2">
            <div className="card-body text-center py-4">
              <div className="text-warning mb-2">
                <i className="bi bi-exclamation-triangle fs-1"></i>
              </div>
              <div className="h4 fw-bold text-warning mb-2">实时数据获取失败</div>
              <div className="text-muted">无法连接到实时行情数据源</div>
              <div className="text-xs text-muted mt-2">
                错误: {marketData?.error || '网络连接异常'}
              </div>
              <div className="text-xs text-muted mt-1">
                请检查网络连接或稍后重试
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (!marketAllowed) {
      return (
        <div className="mb-4">
          <div className="card border-danger border-2">
            <div className="card-body text-center py-4">
              <div className="text-danger mb-2">
                <i className="bi bi-shield-lock fs-1"></i>
              </div>
              <div className="h4 fw-bold text-danger mb-2">交易已锁定</div>
              <div className="text-muted">等待市场重新出现结构信号（Pivot）</div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="mb-4">
        <div className="card border-success">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                <div className="fw-bold text-dark">市场允许交易</div>
              </div>
              <div className={`fw-bold ${isAfterTradeTime() ? 'text-success' : 'text-danger'}`}>
                {getTimeStatusText()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
   // 渲染状态说明
  const renderStateLegend = () => (
    <div className="mb-4">
      <div className="text-sm fw-semibold text-muted mb-2">交易状态说明</div>
      <div className="row g-2">
        {Object.entries(STATE_CONFIG).map(([key, config]) => (
          <div key={key} className="col-6 col-md-3 d-flex">
            <div className={`p-3 rounded shadow-sm ${config.bg} w-100 d-flex flex-column`} style={{ minHeight: '100px' }}>
              <div className={`font-monospace fw-bold ${config.color} mb-1`}>{config.label}</div>
              <div className={`text-xs ${config.color === 'text-white' ? 'text-white text-opacity-90' : 'text-dark'} flex-grow-1`}>
                {config.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
    // 渲染规则提示
     const renderRules = () => (
    <div className="mt-3">
      <div className="card border-primary border-2 shadow-sm w-100">
        <div className="card-header bg-primary bg-opacity-10 border-bottom py-3">
          <div className="d-flex align-items-center">
            <i className="bi bi-journal-check text-primary me-2 fs-5"></i>
            <div className="fw-bold text-primary fs-5">交易纪律</div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="list-group list-group-flush">
            {TRADING_RULES.map(rule => (
              <div key={rule.id} className="list-group-item border-0 py-3 px-4" 
                   style={{borderBottom: rule.id < 5 ? '1px solid rgba(0,0,0,0.05)' : 'none'}}>
                <div className="d-flex align-items-start">
                  <div className="me-3 mt-1">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" 
                         style={{width: '32px', height: '32px', fontSize: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                      {rule.id}
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold text-dark fs-6 mb-1 d-flex align-items-center">
                      {rule.rule}
                      {rule.id === 5 && (
                        <span className="ms-2 badge bg-danger fs-7">实时执行</span>
                      )}
                    </div>
                    <div className="text-muted small d-flex align-items-center">
                      <i className="bi bi-info-circle me-1"></i>
                      {rule.condition}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="card-footer bg-white border-0 py-3 px-4 text-center">
            <div className="text-xs text-muted d-flex align-items-center justify-content-center">
              <i className="bi bi-shield-check me-1"></i>
              严格遵守交易纪律是长期盈利的基础
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="page-container">
      {/* 统一标题样式 */}
      <div className="page-title-container">
        <h1 className="page-main-title">只有突破成立，才允许开仓</h1>
      </div>
      
       {/* 市场状态 */}
      {renderMarketStatus()}
      
        {/* 如果没有实时数据，显示错误提示 */}
        {(!marketData || !marketData.success) ? (
          <div className="text-center py-5">
            <div className="text-warning text-lg mb-4 fw-bold">无法获取实时行情数据</div>
            <div className="text-muted mb-4">请检查网络连接或数据源配置</div>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-primary text-white fw-semibold rounded border-0"
            >
              重新加载
            </button>
          </div>
        ) : !marketAllowed ? (
          <div className="text-center py-5">
            <div className="text-danger text-lg mb-4 fw-bold">所有交易功能已锁定</div>
            <div className="text-muted mb-3">基于实时数据判断，当前市场条件不符合交易要求</div>
            <button
              onClick={() => setMarketAllowed(true)}
              className="px-5 py-2 bg-primary text-white fw-semibold rounded border-0"
            >
              模拟允许交易（测试用）
            </button>
            <div className="text-xs text-muted mt-3">注意：此按钮仅用于测试，会覆盖实时数据判断</div>
          </div>
       ) : (
        <>
           {/* 状态说明 */}
           {renderStateLegend()}
           
           {/* Pivot表格 */}
           <div className="mb-3 card border-0 shadow-sm w-100">
            <div className="card-body p-0">
               <div className="table-responsive">
                 <table className="table table-hover mb-0">
                   <thead className="table-light">
                     <tr>
                       <th className="text-start py-3 px-3 text-uppercase text-xs fw-bold text-muted" style={{width: '20%'}}>代码</th>
                       <th className="text-start py-3 px-3 text-uppercase text-xs fw-bold text-muted" style={{width: '15%'}}>Pivot点</th>
                       <th className="text-start py-3 px-3 text-uppercase text-xs fw-bold text-muted" style={{width: '15%'}}>现价</th>
                       <th className="text-start py-3 px-3 text-uppercase text-xs fw-bold text-muted" style={{width: '15%'}}>距离</th>
                       <th className="text-start py-3 px-3 text-uppercase text-xs fw-bold text-muted" style={{width: '20%'}}>状态</th>
                       <th className="text-start py-3 px-3 text-uppercase text-xs fw-bold text-muted" style={{width: '15%'}}>操作</th>
                     </tr>
                   </thead>
                  <tbody>
                     {_stocks.map(stock => {
                      const state = calculateStockState(stock);
                      const stateConfig = getStateConfig(state);
                      const distance = ((stock.price - stock.pivot) / stock.pivot * 100).toFixed(2);
                       const isActionAllowed = marketAllowed && state === 'CONFIRMED';
                      
                       return (
                         <tr key={stock.id} className="align-middle">
                           <td className="py-2 px-2">
                             <div className="font-monospace text-sm fw-semibold text-dark">{stock.ticker}</div>
                             <div className="text-xs text-muted">{stock.name}</div>
                           </td>
                           <td className="py-2 px-2 font-monospace fw-semibold text-dark">{stock.pivot.toFixed(2)}</td>
                           <td className="py-2 px-2 font-monospace fw-semibold text-dark">{stock.price.toFixed(2)}</td>
                           <td className="py-2 px-2">
                             <div className={`font-monospace fw-bold ${parseFloat(distance) >= 0 ? 'text-success' : 'text-danger'}`}>
                               {distance}%
                             </div>
                           </td>
                           <td className="py-2 px-2">
                             <div className={`d-inline-flex align-items-center px-2 py-1 rounded-pill text-xs fw-bold ${stateConfig.bg} ${stateConfig.color}`}>
                               {stateConfig.label}
                             </div>
                           </td>
                           <td className="py-2 px-2">
                            {isActionAllowed ? (
                              <button
                                onClick={() => handleTrade(stock.id)}
                                className="px-3 py-1 bg-success text-white text-sm fw-bold rounded border-0 shadow-sm"
                              >
                                试探仓 1/9
                              </button>
                            ) : (
                              <div className="px-3 py-1 bg-secondary text-white text-sm fw-bold rounded">
                                禁止操作
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          
          
          {/* 控制面板 */}
          <div className="mt-3">
            <div className="card border border-dark border-opacity-10 w-100">
              <div className="card-header bg-white border-bottom py-2">
                <div className="text-xs fw-semibold text-muted">测试控制面板</div>
              </div>
              <div className="card-body py-3">
                 <div className="d-flex flex-wrap justify-content-center gap-3">
                   <div className="text-center">
                     <button
                       onClick={() => setMarketAllowed(false)}
                       className="btn btn-outline-danger btn-sm mb-1"
                       title="模拟市场禁止交易状态"
                     >
                       <i className="bi bi-lock me-1"></i>锁定交易
                     </button>
                     <div className="text-xs text-muted">测试禁止状态</div>
                   </div>
                   <div className="text-center">
                     <button
                       onClick={() => setMarketAllowed(true)}
                       className="btn btn-outline-success btn-sm mb-1"
                       title="模拟市场允许交易状态"
                     >
                       <i className="bi bi-unlock me-1"></i>允许交易
                     </button>
                     <div className="text-xs text-muted">测试允许状态</div>
                   </div>
                   <div className="text-center">
                     <button
                       onClick={() => window.location.reload()}
                       className="btn btn-outline-primary btn-sm mb-1"
                       title="重新加载页面数据"
                     >
                       <i className="bi bi-arrow-clockwise me-1"></i>刷新数据
                     </button>
                     <div className="text-xs text-muted">重新获取数据</div>
                   </div>
                   <div className="text-center">
                     <button
                       onClick={() => {
                         // 重置所有测试状态
                         setMarketAllowed(false);
                         // 重新获取真实数据
                         const fetchData = async () => {
                           try {
                             const response = await axios.get(`${API_BASE}/market/overview`, {
                               timeout: 5000
                             });
                             const data = response.data;
                             if (data.success) {
                               setMarketData(data);
                               setMarketAllowed(data.signal?.allow_long || false);
                             }
                           } catch (error) {
                             console.error('重新获取数据失败:', error.message);
                           }
                         };
                         fetchData();
                       }}
                       className="btn btn-outline-secondary btn-sm mb-1"
                       title="返回Pivot主页，重置所有测试状态"
                     >
                       <i className="bi bi-house me-1"></i>返回主页
                     </button>
                     <div className="text-xs text-muted">重置测试状态</div>
                   </div>
                 </div>
                <div className="text-xs text-center text-muted mt-3">
                  <i className="bi bi-info-circle me-1"></i>
                  这些按钮仅用于测试，实际交易状态由市场数据决定
                </div>
              </div>
            </div>
          </div>
          
          {/* 规则提示 */}
          {renderRules()}
        </>
      )}
    </div>
  );
};

export default PivotPage;