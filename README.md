# 止观 (Just Wait) - 股票交易决策平台

一个简洁、决策导向的股票交易平台，帮助用户快速判断当天是否应该交易。

## 🎯 核心理念
**"页面只做一件事：判断今天能不能交易"**
- 默认状态：不交易
- 用户无需思考，只需执行
- 没有信号 = 不交易

## 🚀 在线访问
- 主域名: [https://justwait.today](https://justwait.today)
- GitHub: [https://github.com/ashleylimin/stocks-trading-platform](https://github.com/ashleylimin/stocks-trading-platform)

## 📊 交易状态

### 🔴 禁止交易 (WAIT)
- **条件**: 市场没有形成一致方向
- **仓位**: 0%
- **操作**: 不交易，保持耐心

### 🟡 准备阶段 (READY)
- **条件**: 市场开始分化，有潜在强势股票
- **仓位**: ≤30%
- **操作**: 只观察，不出手

### 🟢 允许交易 (CONFIRMED)
- **条件**: 市场方向明确，出现确认突破的强势股票
- **仓位**: ≤100%
- **操作**: 只做确认后的最强股票

## 🏗️ 项目结构

```
stocks/
├── index.html              # 主入口页面（重定向到/market）
├── vercel.json             # Vercel部署配置
├── README.md               # 项目说明文档
├── src/                    # 前端源代码
│   ├── css/               # 样式文件
│   │   └── styles.css     # 主样式文件
│   ├── js/                # JavaScript文件
│   │   └── app.js         # 主JavaScript逻辑
│   └── pages/             # 页面文件
│       ├── market/        # 市场决策页面
│       ├── pivot/         # Pivot分析页面
│       ├── leaders/       # 龙头股页面
│       └── account/       # 账户管理页面
├── assets/                # 静态资源
│   └── icons/             # 图标文件
├── backend/               # 后端API服务
│   ├── main.py           # FastAPI后端主文件
│   └── requirements.txt   # Python依赖
├── archive/               # 归档文件
│   ├── old-versions/     # 旧版本备份
│   └── test-files/       # 测试文件
└── .vercel/              # Vercel配置
```

## 🔧 技术栈

### 前端
- 纯HTML/CSS/JavaScript
- 响应式设计，移动端友好
- 无框架，极致轻量
- 苹果极简设计风格

### 后端
- Python + FastAPI
- akshare数据接口（获取实时市场数据）
- Railway部署

### 部署
- Vercel（前端静态部署）
- Railway（后端API服务）

## 📡 API接口

后端服务: `https://stocks-trading-platform-production.up.railway.app`

### 主要端点
- `GET /api/market/overview` - 市场概览数据
- `GET /api/leaders/filtered` - 筛选后的龙头股数据

## 📱 页面功能

### 1. Market (市场决策)
- 显示当前交易决策（WAIT/READY/CONFIRMED）
- 实时市场数据
- 交易建议和详细原因
- 加载时显示随机交易哲学格言

### 2. Pivot (关键点分析)
- 显示买入点分析
- Pivot判断逻辑（MA5和near_high判断）
- 技术分析关键位置

### 3. Leaders (龙头股筛选)
- 显示最强股票（最多5个）
- 乖离防御塔逻辑（bias20 ≥ 15%时禁止追高）
- 强度指标和趋势分析

### 4. Account (账户管理)
- 仓位跟踪和纪律检查
- 建议仓位vs实际仓位对比
- 风险控制提醒

## 🎨 设计原则

1. **极简信息**: 只显示必要决策信息，移除所有图表、指数、百分比
2. **明确状态**: 红/黄/绿三种清晰状态，用户3秒内完成判断
3. **行动导向**: 具体操作指令，非模糊建议
4. **无干扰设计**: 专注于交易决策，避免信息过载
5. **命令式语言**: 使用"必须"、"禁止"、"只能"等明确指令

## 🔄 核心功能

### 交易哲学格言系统
- 加载时随机显示10条交易哲学格言
- 强化"止观"系统理念：在等待中思考，在思考中等待
- 格言示例：
  - "价格包含一切"
  - "市场不解释，只给结果"
  - "等待，是交易的一部分"
  - "先活下来，再谈盈利"

### 乖离防御塔 (Bias Defense Tower)
- 实时计算bias20 = ((当前价格 - MA20) / MA20) × 100
- 当bias20 ≥ 15%时，标记为"乖离过大"
- 自动禁用交互，防止追高操作
- 守护1/9试错机会

### Pivot判断逻辑
- 价格 ≥ MA5 且 near_high: "Near Pivot"
- 价格 < MA5: "Pivot Failure"
- 基于MA5均线的状态判断

## 🚀 本地开发

### 前端开发
```bash
# 使用Python简单HTTP服务器
python3 -m http.server 8000
# 访问 http://localhost:8000
```

### 后端开发
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
# API运行在 http://localhost:8001
```

## 📄 许可证

MIT License

## 📞 反馈与支持

如有问题或建议，请通过GitHub Issues提交反馈。