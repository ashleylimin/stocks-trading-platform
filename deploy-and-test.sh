#!/bin/bash

echo "=== 股票交易平台部署助手 ==="
echo
echo "请按照以下步骤操作："
echo
echo "1. 部署后端到 Railway"
echo "   访问: https://railway.app"
echo "   选择仓库: stocks-trading-platform"
echo "   根目录: /backend"
echo "   启动命令: uvicorn main:app --host 0.0.0.0 --port \$PORT"
echo
echo "2. 部署完成后，输入你的Railway后端URL:"
read -p "后端URL (例如: https://stocks-backend.up.railway.app): " RAILWAY_URL
echo
echo "3. 部署前端到 Vercel"
echo "   访问: https://vercel.com"
echo "   选择同一仓库"
echo "   根目录: /frontend-react"
echo "   环境变量: VITE_API_BASE_URL=$RAILWAY_URL/api"
echo
echo "4. 部署完成后，输入你的Vercel前端URL:"
read -p "前端URL (例如: https://stocks-trading-platform.vercel.app): " VERCEL_URL
echo
echo "=== 测试部署 ==="
echo
echo "测试后端健康检查..."
curl -s "$RAILWAY_URL/health" | python3 -m json.tool 2>/dev/null || echo "后端未响应"
echo
echo "测试API端点..."
curl -s "$RAILWAY_URL/api/leaders" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(f'状态: {\"成功\" if data.get(\"success\") else \"失败\"}')
    print(f'股票数量: {data.get(\"count\", 0)}')
    if data.get('data'):
        print(f'示例股票: {data[\"data\"][0][\"code\"]} - {data[\"data\"][0][\"name\"]}')
except Exception as e:
    print(f'API测试失败: {e}')
" 2>/dev/null || echo "API测试失败"
echo
echo "=== 部署完成 ==="
echo "后端URL: $RAILWAY_URL"
echo "前端URL: $VERCEL_URL"
echo "API文档: $RAILWAY_URL/docs"
echo
echo "请访问前端URL使用应用: $VERCEL_URL"
echo "如有问题，查看日志:"
echo "  - Railway: https://railway.app/project/[你的项目]/deployments"
echo "  - Vercel: https://vercel.com/ashleylimin/stocks-trading-platform/deployments"