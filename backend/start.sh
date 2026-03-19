#!/bin/bash

echo "Starting Stock Trading Platform Backend..."
echo "Python version: $(python --version)"
echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la

# 安装依赖
pip install --upgrade pip
pip install -r requirements.txt

# 启动应用
exec uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1