#!/bin/bash

echo "=== 启动股票交易平台后端 ==="
echo "工作目录: $(pwd)"
echo "Python版本: $(python --version 2>&1)"

# 安装最小依赖
pip install --no-cache-dir fastapi==0.104.1 uvicorn[standard]==0.24.0 akshare==1.12.50 pandas==2.1.3

# 启动应用
echo "启动FastAPI应用..."
exec python -m uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1