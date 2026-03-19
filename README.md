# 🚀 股票交易平台 - Livermore Trading System

一个基于纪律交易的股票筛选和分析平台，专注于强势股识别和Pivot点交易。

## ✨ 功能特性

- 📊 **市场概览**：实时大盘指数和交易信号
- 🏆 **强势股筛选**：RS≥80的股票自动识别
- 🎯 **Pivot点监控**：接近关键点的股票跟踪
- 🎨 **专业UI**：优化的大屏显示，支持1920px宽度
- ⚡ **实时数据**：中国A股市场实时行情

## 🏗️ 技术栈

### 前端 (React)
- React 18 + Vite
- Bootstrap 5 + 自定义CSS
- Axios API客户端
- 响应式设计

### 后端 (Python)
- FastAPI + Uvicorn
- akshare (中国股票数据)
- Pandas 数据分析
- 实时数据缓存

## 🚀 一键部署

### 后端部署 (Railway)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/7QjQlB?referralCode=stock)

### 前端部署 (Vercel)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fashleylimin%2Fstocks-trading-platform&env=VITE_API_BASE_URL&project-name=stocks-trading-platform&repository-name=stocks-trading-platform)

## 📁 项目结构

```
stocks-trading-platform/
├── frontend-react/          # React前端应用
│   ├── src/
│   │   ├── App.jsx         # 主应用组件
│   │   ├── LeadersPage.jsx # 强势股页面
│   │   ├── PivotPage.jsx   # Pivot点页面
│   │   └── App.css         # 样式文件
│   ├── package.json
│   └── vite.config.js
├── backend/                 # FastAPI后端
│   ├── main.py             # 主API文件
│   ├── requirements.txt    # Python依赖
│   └── railway.json        # Railway配置
├── requirements.txt        # 全局依赖
└── README.md              # 本文档
```

## 🔧 本地开发

### 1. 克隆仓库
```bash
git clone https://github.com/ashleylimin/stocks-trading-platform.git
cd stocks-trading-platform
```

### 2. 启动后端
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8082 --reload
```

### 3. 启动前端
```bash
cd frontend-react
npm install
npm run dev
```

### 4. 访问应用
- 前端: http://localhost:5173
- 后端API: http://localhost:8082
- API文档: http://localhost:8082/docs

## 🌐 生产部署

### 后端部署 (Railway)
1. 点击上方 "Deploy on Railway" 按钮
2. 授权GitHub访问
3. 自动部署完成
4. 获取后端URL: `https://[project].up.railway.app`

### 前端部署 (Vercel)
1. 点击上方 "Deploy with Vercel" 按钮
2. 导入GitHub仓库
3. 设置环境变量:
   - `VITE_API_BASE_URL`: https://[railway-url]/api
4. 部署完成
5. 获取前端URL: `https://[project].vercel.app`

## 📊 API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/health` | GET | 健康检查 |
| `/api/leaders` | GET | 获取强势股数据 |
| `/api/market/overview` | GET | 市场概览数据 |
| `/api/pivot` | GET | Pivot点股票数据 |
| `/api/tickers/filter` | GET | 条件筛选股票 |

## 🎨 设计理念

### 强势股页面 (Leaders)
- **只盯最强股票**：RS≥80才进入观察池
- **极简筛选**：IGNORE/WATCH/FOCUS三级状态
- **直接行动**：状态直接指示操作建议

### 屏幕优化
- 全宽度布局，支持1920px大屏
- 统一标题样式，去除冗余信息
- 优化颜色刻度，增强视觉层次

## 🔒 环境变量

### 后端
```bash
PORT=8082
PYTHON_VERSION=3.11
```

### 前端
```bash
VITE_API_BASE_URL=https://[backend-url]/api
```

## 📈 数据源

- 实时行情: akshare API
- 历史数据: 中国A股市场
- 指数数据: 上证、深证、创业板等

## 🛠️ 开发计划

- [ ] 用户认证系统
- [ ] 自选股功能
- [ ] 实时推送通知
- [ ] 移动端适配
- [ ] 数据导出功能

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📞 支持

如有问题，请提交GitHub Issue或联系维护者。

---

**投资有风险，入市需谨慎。本工具仅供学习参考，不构成投资建议。**