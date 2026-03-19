# 股票交易平台部署指南

## 项目结构
- `frontend-react/` - React前端应用
- `backend/` - FastAPI后端服务
- `requirements.txt` - Python依赖

## 部署方案

### 方案一：Vercel + Railway (推荐)

#### 后端部署 (Railway)
1. 访问 https://railway.app 注册账号
2. 创建新项目 → "Deploy from GitHub repo"
3. 选择仓库 `stocks-trading-platform`
4. 配置设置：
   - **根目录:** `/backend`
   - **启动命令:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. 获取后端URL: `https://your-project.up.railway.app`

#### 前端部署 (Vercel)
1. 访问 https://vercel.com 注册账号
2. 导入GitHub仓库
3. 配置设置：
   - **框架预设:** Vite
   - **根目录:** `/frontend-react`
   - **构建命令:** `npm run build`
   - **输出目录:** `dist`
4. 设置环境变量：
   ```
   VITE_API_BASE_URL=https://your-project.up.railway.app/api
   ```
5. 部署完成后获取前端URL

### 方案二：Docker部署

#### 构建Docker镜像
```bash
# 构建后端镜像
cd backend
docker build -t stocks-backend .

# 构建前端镜像  
cd ../frontend-react
docker build -t stocks-frontend .
```

#### 使用docker-compose运行
```bash
docker-compose up -d
```

### 方案三：手动部署到云服务器

#### 服务器要求
- Ubuntu 20.04+
- Python 3.11+
- Node.js 18+
- Nginx

#### 部署步骤
1. 安装依赖
2. 配置Nginx反向代理
3. 使用PM2管理进程
4. 设置SSL证书

## 环境变量配置

### 后端环境变量
```bash
PORT=8082
PYTHON_VERSION=3.11
```

### 前端环境变量
```bash
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

## 测试部署

1. 检查后端健康状态：
   ```
   GET https://your-backend-domain.com/health
   ```

2. 检查API端点：
   ```
   GET https://your-backend-domain.com/api/leaders
   ```

3. 访问前端应用：
   ```
   https://your-frontend-domain.com
   ```

## 故障排除

### 常见问题
1. **CORS错误**: 确保后端CORS配置包含前端域名
2. **API连接失败**: 检查环境变量 `VITE_API_BASE_URL`
3. **构建失败**: 检查Node.js和Python版本
4. **内存不足**: Railway免费版有内存限制，考虑升级或优化

### 日志查看
- Railway: 项目面板 → "Logs"
- Vercel: 项目面板 → "Deployments" → 选择部署 → "View Logs"

## 维护指南

### 更新部署
1. 推送代码到GitHub
2. Railway和Vercel会自动重新部署

### 监控
- Railway: 提供基本的监控和日志
- Vercel: 提供访问统计和性能监控
- 建议添加更详细的监控工具如Sentry

## 安全建议
1. 使用环境变量存储敏感信息
2. 启用HTTPS
3. 定期更新依赖
4. 设置API速率限制
5. 添加身份验证（如需）