# 部署检查清单

## ✅ 已完成
- [x] 代码推送到GitHub: `ashleylimin/stocks-trading-platform`
- [x] 清理日志文件
- [x] 更新.gitignore
- [x] 配置环境变量支持

## 🚀 需要手动操作

### 1. Railway 后端部署
- [ ] 访问 https://railway.app
- [ ] 登录（使用GitHub）
- [ ] 创建新项目 → "Deploy from GitHub repo"
- [ ] 选择仓库: `ashleylimin/stocks-trading-platform`
- [ ] 配置:
  - Root Directory: `/backend`
  - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] 等待部署完成
- [ ] 获取后端URL: `https://__________.up.railway.app`

### 2. Vercel 前端部署
- [ ] 访问 https://vercel.com
- [ ] 登录（使用GitHub）
- [ ] 点击 "Add New" → "Project"
- [ ] 导入仓库: `ashleylimin/stocks-trading-platform`
- [ ] 配置:
  - Framework Preset: Vite
  - Root Directory: `/frontend-react`
  - Build Command: `npm run build`
  - Output Directory: `dist`
- [ ] 环境变量:
  - `VITE_API_BASE_URL`: https://__________.up.railway.app/api
- [ ] 点击 "Deploy"
- [ ] 获取前端URL: `https://__________.vercel.app`

### 3. 测试部署
- [ ] 后端健康检查: `GET /health`
- [ ] API测试: `GET /api/leaders`
- [ ] 前端访问测试
- [ ] CORS配置验证

## 🔧 故障排除

### 常见问题
1. **构建失败**
   - 检查Node.js版本 (需要18+)
   - 检查Python版本 (需要3.11+)
   - 查看构建日志

2. **API连接失败**
   - 检查 `VITE_API_BASE_URL` 环境变量
   - 验证后端URL是否正确
   - 检查CORS配置

3. **数据不显示**
   - 检查浏览器控制台错误
   - 验证API响应格式
   - 检查网络连接

4. **性能问题**
   - Railway免费版有资源限制
   - 考虑优化代码或升级计划

## 📞 支持

### Railway 支持
- 文档: https://docs.railway.app
- Discord: https://discord.gg/railway

### Vercel 支持
- 文档: https://vercel.com/docs
- Discord: https://vercel.com/discord

### 项目问题
- GitHub Issues: https://github.com/ashleylimin/stocks-trading-platform/issues

## 🔄 更新流程
1. 本地开发测试
2. 推送到GitHub: `git push`
3. Railway自动重新部署后端
4. Vercel自动重新部署前端
5. 验证生产环境

## 💰 成本估算
- **Railway**: $5/月免费额度 (足够)
- **Vercel**: 完全免费 (个人项目)
- **总成本**: $0 (免费方案)