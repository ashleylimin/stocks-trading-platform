#!/bin/bash

echo "=== Railway 后端部署测试 ==="
echo
echo "请将你的Railway后端URL粘贴在这里（例如: https://stocks-backend.up.railway.app）"
read -p "后端URL: " RAILWAY_URL
echo
echo "1. 测试健康检查..."
curl -s "$RAILWAY_URL/health" | python3 -m json.tool 2>/dev/null || echo "❌ 健康检查失败"
echo
echo "2. 测试API端点..."
curl -s "$RAILWAY_URL/api/leaders" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data.get('success'):
        print('✅ API测试成功')
        print(f'   股票数量: {data.get(\"count\", 0)}')
        print(f'   数据源: {data.get(\"note\", \"N/A\")}')
        if data.get('data'):
            stock = data['data'][0]
            print(f'   示例股票: {stock[\"code\"]} - {stock[\"name\"]} (RS: {stock[\"rs\"]})')
    else:
        print(f'❌ API返回失败: {data.get(\"error\")}')
except Exception as e:
    print(f'❌ API测试失败: {e}')
" 2>/dev/null || echo "❌ API请求失败"
echo
echo "3. 查看API文档..."
echo "   访问: $RAILWAY_URL/docs"
echo
echo "=== 后端部署完成 ==="
echo "✅ 后端URL: $RAILWAY_URL"
echo "📚 API文档: $RAILWAY_URL/docs"
echo
echo "下一步：部署前端到 Vercel"
echo "你需要这个后端URL来设置前端环境变量"