#!/bin/bash

echo "=== 股票交易平台部署测试 ==="
echo

# 获取Railway后端URL（部署后替换）
RAILWAY_URL="https://stocks-backend.up.railway.app"
# 获取Vercel前端URL（部署后替换）
VERCEL_URL="https://stocks-trading-platform.vercel.app"

echo "1. 测试后端健康检查..."
curl -s "$RAILWAY_URL/health" | python3 -m json.tool
echo

echo "2. 测试API端点..."
curl -s "$RAILWAY_URL/api/leaders" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(f'状态: {\"成功\" if data.get(\"success\") else \"失败\"}')
    print(f'股票数量: {data.get(\"count\", 0)}')
    print(f'数据源: {data.get(\"note\", \"N/A\")}')
except:
    print('API请求失败')
"
echo

echo "3. 测试前端部署..."
echo "前端URL: $VERCEL_URL"
echo "请手动访问: $VERCEL_URL"
echo

echo "4. 完整测试流程:"
echo "   a. 访问前端: $VERCEL_URL"
echo "   b. 点击 'Leaders' 页面"
echo "   c. 查看股票数据是否加载"
echo "   d. 测试筛选功能"
echo

echo "=== 部署完成 ==="
echo "后端: $RAILWAY_URL"
echo "前端: $VERCEL_URL"
echo "API文档: $RAILWAY_URL/docs"