import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api';

// 状态配置 - 优化配色，体现刻度性
const STATUS_CONFIG = {
  IGNORE: { 
    label: 'IGNORE', 
    color: 'text-white', 
    bg: 'bg-secondary', 
    border: 'border-secondary',
    desc: '不看',
    priority: 1
  },
  WATCH: { 
    label: 'WATCH', 
    color: 'text-dark', 
    bg: 'bg-warning', 
    border: 'border-warning',
    desc: '观察池',
    priority: 2
  },
  FOCUS: { 
    label: 'FOCUS', 
    color: 'text-white', 
    bg: 'bg-success', 
    border: 'border-success',
    desc: '接近Pivot',
    priority: 3
  },
};

// 趋势配置
const TREND_CONFIG = {
  Strong: { label: 'Strong', color: 'text-success' },
  Weak: { label: 'Weak', color: 'text-danger' },
};

const LeadersPage = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 状态筛选器
  const statusFilters = ['ALL', 'FOCUS', 'WATCH', 'IGNORE'];
  const [activeFilter, setActiveFilter] = useState('ALL');

  // 获取强势股数据
  const fetchLeadersData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('正在获取强势股数据...');
      
      const response = await axios.get(`${API_BASE}/leaders`);
      console.log('强势股数据获取成功:', response.data);
      
      if (response.data.success) {
        // 转换后端数据格式为前端格式
        const formattedStocks = response.data.data.map((stock, index) => ({
          id: index + 1,
          ticker: stock.code,
          name: stock.name,
          sector: stock.sector,
          rs: stock.rs,
          status: stock.status,
          trend: stock.trend === '强' ? 'Strong' : 'Weak',
          nearHigh: stock.near_high === '是' ? 'Yes' : 'No',
          pivot: stock.pivot,
          price: stock.price,
          distance: `${stock.distance > 0 ? '+' : ''}${stock.distance.toFixed(2)}%`,
          change: stock.change,
          volume_ratio: stock.volume_ratio
        }));
        
        setStocks(formattedStocks);
        if (formattedStocks.length > 0) {
          setSelectedStock(formattedStocks[0]);
        }
      } else {
        setError(response.data.error || '获取数据失败');
      }
    } catch (error) {
      console.error('获取强势股数据失败:', error);
      setError('连接服务器失败，请检查后端服务是否运行');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载数据
  useEffect(() => {
    fetchLeadersData();
  }, []);

  // 筛选股票
  const filteredStocks = stocks.filter(stock => 
    activeFilter === 'ALL' || stock.status === activeFilter
  );

  // 获取状态配置
  const getStatusConfig = (status) => STATUS_CONFIG[status] || STATUS_CONFIG.IGNORE;

  // 获取趋势配置
  const getTrendConfig = (trend) => TREND_CONFIG[trend] || TREND_CONFIG.Weak;

  return (
    <div className="page-container">
      {/* 统一标题样式 */}
      <div className="page-title-container">
        <h1 className="page-main-title">只盯最强股票</h1>
      </div>

      {/* 状态筛选器 */}
      <div className="mb-3">
        <div className="d-flex gap-2">
          {statusFilters.map(filter => (
            <button
              key={filter}
              className={`btn btn-sm ${activeFilter === filter ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === 'ALL' ? '全部' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">加载中...</span>
          </div>
          <div className="mt-3 text-muted">正在获取强势股数据...</div>
        </div>
      )}

      {/* 错误状态 */}
      {error && !loading && (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">数据加载失败</h4>
          <p>{error}</p>
          <hr />
          <button className="btn btn-danger btn-sm" onClick={fetchLeadersData}>
            重试
          </button>
        </div>
      )}

      {/* 数据展示 */}
      {!loading && !error && (
        <>
          <div className="d-flex gap-4 w-100">
            {/* 左侧：股票列表 - 极简，整屏宽度 */}
            <div className="flex-grow-1 w-100">
              <div className="card border-0 shadow-sm w-100">
                <div className="card-body p-0 w-100">
                  <div className="table-responsive w-100">
                    <table className="table table-hover mb-0 w-100">
                      <thead className="table-light">
                        <tr>
                          <th className="py-3 px-3" style={{width: '25%'}}>股票</th>
                          <th className="py-3 px-3" style={{width: '20%'}}>板块</th>
                          <th className="py-3 px-3 text-end" style={{width: '15%'}}>RS</th>
                          <th className="py-3 px-3" style={{width: '20%'}}>状态</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStocks.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="text-center py-5 text-muted">
                              没有找到符合条件的股票
                            </td>
                          </tr>
                        ) : (
                          filteredStocks.map(stock => {
                            const statusConfig = getStatusConfig(stock.status);
                            return (
                              <tr 
                                key={stock.id}
                                className={`cursor-pointer ${selectedStock && selectedStock.id === stock.id ? 'table-active' : ''}`}
                                onClick={() => setSelectedStock(stock)}
                              >
                                <td className="py-3 px-3">
                                  <div className="fw-semibold">{stock.ticker}</div>
                                  <div className="text-xs text-muted">{stock.name}</div>
                                </td>
                                <td className="py-3 px-3">
                                  <div className="text-muted">{stock.sector}</div>
                                </td>
                                <td className="py-3 px-3 text-end">
                                  <div className="fw-bold">{stock.rs}</div>
                                </td>
                                <td className="py-3 px-3">
                                  <div className={`badge ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border} px-3 py-1 fw-semibold`}>
                                    {statusConfig.label}
                                  </div>
                                  <div className="text-xs text-muted mt-1">{statusConfig.desc}</div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 统计信息 */}
              <div className="mt-3 text-muted text-xs">
                显示 {filteredStocks.length} 只股票 · 
                FOCUS: {stocks.filter(s => s.status === 'FOCUS').length} · 
                WATCH: {stocks.filter(s => s.status === 'WATCH').length} · 
                IGNORE: {stocks.filter(s => s.status === 'IGNORE').length}
              </div>
            </div>

            {/* 右侧：详情 - 极简 */}
            <div className="flex-shrink-0" style={{minWidth: '350px'}}>
              {selectedStock ? (
                <>
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <h6 className="fw-bold mb-3">股票详情</h6>
                      
                      <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="fw-bold fs-5">{selectedStock.ticker}</div>
                          <div className={`badge ${getStatusConfig(selectedStock.status).bg} ${getStatusConfig(selectedStock.status).color} border-0`}>
                            {selectedStock.status}
                          </div>
                        </div>
                        <div className="text-muted">{selectedStock.sector}</div>
                      </div>

                      {/* 关键信息 - 极简 */}
                      <div className="mb-4">
                        <div className="d-flex gap-3">
                          <div className="flex-grow-1">
                            <div className="text-xs text-muted mb-1">Trend</div>
                            <div className={`fw-bold ${getTrendConfig(selectedStock.trend).color}`}>
                              {selectedStock.trend}
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <div className="text-xs text-muted mb-1">Near High</div>
                            <div className={`fw-bold ${selectedStock.nearHigh === 'Yes' ? 'text-success' : 'text-danger'}`}>
                              {selectedStock.nearHigh}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pivot信息 - 极简 */}
                      <div className="border-top pt-3">
                        <div className="text-xs text-muted mb-2">Pivot信息</div>
                        <div className="d-flex gap-3">
                          <div className="flex-grow-1">
                            <div className="text-xs text-muted mb-1">Pivot</div>
                            <div className="fw-bold">{selectedStock.pivot}</div>
                          </div>
                          <div className="flex-grow-1">
                            <div className="text-xs text-muted mb-1">Distance</div>
                            <div className={`fw-bold ${selectedStock.distance.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                              {selectedStock.distance}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 当前价格 */}
                      <div className="border-top pt-3 mt-3">
                        <div className="text-xs text-muted mb-1">当前价格</div>
                        <div className="fw-bold fs-4">{selectedStock.price}</div>
                      </div>

                      {/* 状态说明 */}
                      <div className="border-top pt-3 mt-3">
                        <div className="text-xs text-muted mb-2">状态说明</div>
                        <div className="text-xs">
                          {selectedStock.status === 'FOCUS' && '接近Pivot，准备交易'}
                          {selectedStock.status === 'WATCH' && '强势股，进入观察池'}
                          {selectedStock.status === 'IGNORE' && '不符合条件，不看'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 规则说明 */}
                  <div className="card border-0 shadow-sm mt-3">
                    <div className="card-body">
                      <h6 className="fw-bold mb-2">筛选规则</h6>
                      <ul className="text-xs text-muted mb-0 ps-3">
                        <li>RS ≥ 80 才进入 WATCH</li>
                        <li>接近Pivot (±3%) 进入 FOCUS</li>
                        <li>其他全部 IGNORE</li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center py-5">
                    <div className="text-muted">请从左侧选择一只股票查看详情</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LeadersPage;