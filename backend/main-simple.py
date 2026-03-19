from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import random

app = FastAPI(title="Livermore Stock Platform - Simple")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:5174", 
        "http://localhost:3000", 
        "http://localhost:8080",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Stock Trading Platform API", "status": "online", "version": "simple"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/health")
async def api_health_check():
    return {"status": "healthy", "service": "stock-api", "timestamp": datetime.now().isoformat()}

@app.get("/api/leaders")
async def get_leaders():
    """获取强势股数据（模拟数据）"""
    try:
        print("=== 获取强势股数据（模拟）===")
        
        # 生成模拟数据
        mock_stocks = [
            {
                "code": "000001.SZ",
                "name": "平安银行",
                "sector": "金融",
                "rs": round(80 + random.uniform(0, 20), 1),
                "status": "FOCUS",
                "trend": "强",
                "near_high": "是",
                "pivot": round(12.85, 2),
                "distance": round(1.2, 2),
                "price": round(12.85, 2),
                "change": round(2.5, 2),
                "volume_ratio": round(1.8, 2)
            },
            {
                "code": "000858.SZ",
                "name": "五粮液",
                "sector": "消费",
                "rs": round(92.3, 1),
                "status": "FOCUS",
                "trend": "强",
                "near_high": "是",
                "pivot": round(148.20, 2),
                "distance": round(0.8, 2),
                "price": round(148.20, 2),
                "change": round(3.2, 2),
                "volume_ratio": round(2.1, 2)
            },
            {
                "code": "300750.SZ",
                "name": "宁德时代",
                "sector": "新能源",
                "rs": round(88.7, 1),
                "status": "WATCH",
                "trend": "强",
                "near_high": "否",
                "pivot": round(188.50, 2),
                "distance": round(3.5, 2),
                "price": round(188.50, 2),
                "change": round(4.1, 2),
                "volume_ratio": round(2.5, 2)
            },
            {
                "code": "600519.SH",
                "name": "贵州茅台",
                "sector": "消费",
                "rs": round(78.2, 1),
                "status": "IGNORE",
                "trend": "弱",
                "near_high": "否",
                "pivot": round(1650.00, 2),
                "distance": round(8.3, 2),
                "price": round(1650.00, 2),
                "change": round(-0.5, 2),
                "volume_ratio": round(0.8, 2)
            },
            {
                "code": "002415.SZ",
                "name": "海康威视",
                "sector": "科技",
                "rs": round(81.5, 1),
                "status": "WATCH",
                "trend": "强",
                "near_high": "是",
                "pivot": round(32.45, 2),
                "distance": round(2.1, 2),
                "price": round(32.45, 2),
                "change": round(2.8, 2),
                "volume_ratio": round(1.6, 2)
            }
        ]
        
        # 添加一些随机变化
        for stock in mock_stocks:
            stock['rs'] = round(stock['rs'] + random.uniform(-2, 2), 1)
            stock['price'] = round(stock['price'] * (1 + random.uniform(-0.01, 0.01)), 2)
            stock['change'] = round(stock['change'] + random.uniform(-0.5, 0.5), 2)
            
            # 根据RS调整状态
            if stock['rs'] < 80:
                stock['status'] = "IGNORE"
            elif stock['distance'] <= 3 and stock['rs'] >= 80:
                stock['status'] = "FOCUS"
            else:
                stock['status'] = "WATCH"
        
        return {
            "success": True,
            "count": len(mock_stocks),
            "data": mock_stocks,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "note": "模拟数据（简化版）"
        }
        
    except Exception as e:
        error_msg = f"获取强势股数据失败: {str(e)}"
        print(f"错误: {error_msg}")
        return {
            "success": False,
            "error": error_msg,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

@app.get("/api/market/overview")
async def get_market_overview():
    """获取市场概览数据（模拟）"""
    return {
        "success": True,
        "data": [
            {"code": "000001", "name": "上证指数", "price": 4095.45, "change": -0.82},
            {"code": "399006", "name": "创业板指", "price": 3310.28, "change": -0.22},
            {"code": "000688", "name": "科创50", "price": 856.42, "change": 0.35}
        ],
        "signal": {
            "allow_long": True,
            "trade_signal": "允许交易",
            "signal_level": "medium"
        }
    }

@app.get("/api/pivot")
async def get_pivot_stocks():
    """获取Pivot点股票（模拟）"""
    import random
    mock_stocks = [
        {
            "code": "000001.SZ",
            "name": "平安银行",
            "price": round(12.50 + random.uniform(-0.5, 0.5), 2),
            "change_pct": f"{random.uniform(-2, 3):.2f}%",
            "volume_ratio": f"{random.uniform(1.0, 3.0):.2f}",
            "turnover": f"{random.uniform(2, 8):.2f}%",
            "ma20": f"{12.30 + random.uniform(-0.3, 0.3):.2f}",
            "macd": "金叉"
        }
    ]
    
    return {
        "success": True,
        "count": len(mock_stocks),
        "data": mock_stocks
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8082)