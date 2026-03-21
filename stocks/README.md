# 止观 (Just Wait) - 股票交易决策平台

一个简洁、决策导向的股票交易平台，帮助用户快速判断当天是否应该交易。

## 🎯 核心理念
**"页面只做一件事：判断今天能不能交易"**
- 默认状态：不交易
- 用户无需思考，只需执行
- 没有信号 = 不交易

## 🚀 在线访问
- 主域名: https://justwait.today
- Vercel部署: https://livermore-stocks-original.vercel.app

## 📊 交易状态

### 🔴 禁止交易 (No Trading)
- **条件**: 0个龙头股
- **仓位**: 0%
- **操作**: 不开新仓，保持空仓

### 🟡 可以交易 (Can Trade)
- **条件**: 1个龙头股
- **仓位**: ≤30%
- **操作**: 可以建仓，只做龙头，分批加仓

### 🟢 积极做多 (Aggressive Long)
- **条件**: ≥2个龙头股
- **仓位**: ≤100%
- **操作**: 全力做多，聚焦龙头，分批建仓

## 🏗️ 项目结构

```
stocks/
├── index.html          # 主页面 - 交易决策
├── vercel.json         # Vercel部署配置
├── logo.png            # 品牌Logo
├── *.svg               # 页面图标
├── backend/            # 后端API服务
│   ├── main.py         # FastAPI后端
│   └── requirements.txt # Python依赖
└── archive/            # 归档文件
    ├── old-versions/   # 旧版本备份
    └── test-files/     # 测试文件
```

## 🔧 技术栈

### 前端
- 纯HTML/CSS/JavaScript
- 响应式设计
- 无框架，极致轻量

### 后端
- Python + FastAPI
- akshare数据接口
- Railway部署

### 部署
- Vercel (前端静态部署)
- Railway (后端API服务)

## 📡 API接口

后端服务: `https://stocks-trading-platform-production.up.railway.app`

### 主要端点
- `GET /api/market/overview` - 市场概览数据
- 返回交易信号、市场情绪、龙头股信息

## 🚀 本地开发

### 前端
```bash
# 使用任何静态文件服务器
python3 -m http.server 8000
# 访问 http://localhost:8000
```

### 后端
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# API运行在 http://localhost:8000
```

## 📱 页面功能

### 1. Market (市场)
- 显示当前交易决策
- 实时市场数据
- 交易建议和原因

### 2. Pivot (关键点)
- 显示买入点（最多2个）
- 技术分析关键位置

### 3. Leaders (龙头股)
- 显示最强股票（最多5个）
- 强度指标和趋势

### 4. Account (账户)
- 仓位跟踪
- 交易记录
- 风险控制

## 🎨 设计原则

1. **极简信息**: 只显示必要决策信息
2. **明确状态**: 红/黄/绿三种清晰状态
3. **行动导向**: 具体操作指令，非模糊建议
4. **无干扰**: 移除所有图表、指数、百分比
5. **快速决策**: 3秒内完成判断

## 🔄 更新日志

### 2026-03-21
- ✅ 修复market页面API加载问题
- ✅ 添加加载状态指示器
- ✅ 整理项目结构，清理主目录
- ✅ 连接justwait.today域名
- ✅ 部署静态HTML版本

### 2026-03-20
- ✅ 创建决策导向的UI设计
- ✅ 实现三种交易状态
- ✅ 移除不必要的市场数据
- ✅ 部署到Vercel

## 📄 许可证

MIT License