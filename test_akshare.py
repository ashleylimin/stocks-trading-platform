#!/usr/bin/env python3
import akshare as ak
import pandas as pd
import sys

print("=== 测试AKShare实时数据 ===")

# 测试1: 指数实时数据
print("\n1. 测试指数实时数据:")
try:
    df = ak.stock_zh_index_spot_em()
    if df is not None:
        print(f"  数据形状: {df.shape}")
        print(f"  列名: {list(df.columns)}")
        if not df.empty:
            print(f"  前3行数据:")
            print(df.head(3))
            
            # 查找上证指数
            sz_df = df[df['代码'] == '000001']
            if not sz_df.empty:
                print(f"\n  上证指数数据:")
                print(sz_df.iloc[0])
    else:
        print("  返回None")
except Exception as e:
    print(f"  错误: {e}")

# 测试2: 指数日线数据
print("\n2. 测试指数日线数据:")
try:
    df_daily = ak.stock_zh_index_daily(symbol="sh000001")
    if df_daily is not None:
        print(f"  数据形状: {df_daily.shape}")
        if not df_daily.empty:
            print(f"  最新数据:")
            print(df_daily.tail(3))
    else:
        print("  返回None")
except Exception as e:
    print(f"  错误: {e}")

# 测试3: 市场宽度数据
print("\n3. 测试市场宽度数据:")
try:
    breadth_df = ak.stock_a_high_low_statistics(symbol='all')
    if breadth_df is not None:
        print(f"  数据形状: {breadth_df.shape}")
        print(f"  列名: {list(breadth_df.columns)}")
        if not breadth_df.empty:
            print(f"  最新数据:")
            print(breadth_df.tail(3))
    else:
        print("  返回None")
except Exception as e:
    print(f"  错误: {e}")

print("\n=== 测试完成 ===")