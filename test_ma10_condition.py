#!/usr/bin/env python3
# 测试新的筛选条件：current_price > ma10

# 测试数据（从main.py复制几个示例）
test_stocks = [
    {
        "code": "300750.SZ",
        "name": "宁德时代",
        "current_price": 188.50,
        "gain_20d": 18.5,
        "above_ma_50": True,
        "price_to_high_ratio": 0.95,
        "turnover": 12.8,
        "market_cap": 856.3,
        "ma5": 185.20,
        "ma10": 182.50,
        "ma20": 175.80,
        "near_high": True
    },
    {
        "code": "000858.SZ",
        "name": "五粮液",
        "current_price": 148.20,
        "gain_20d": 16.2,
        "above_ma_50": True,
        "price_to_high_ratio": 0.92,
        "turnover": 15.2,
        "market_cap": 575.4,
        "ma5": 145.50,
        "ma10": 143.80,
        "ma20": 140.30,
        "near_high": True
    },
    # 创建一个不符合条件的测试股票
    {
        "code": "TEST.SZ",
        "name": "测试股票",
        "current_price": 100.00,
        "gain_20d": 20.0,
        "above_ma_50": True,
        "price_to_high_ratio": 0.95,
        "turnover": 15.0,
        "market_cap": 200.0,
        "ma5": 105.00,  # 当前价格低于ma5
        "ma10": 102.00, # 当前价格低于ma10
        "ma20": 95.00,
        "near_high": True
    }
]

print("测试新的筛选条件: current_price > ma10")
print("=" * 50)

for stock in test_stocks:
    condition1 = stock["above_ma_50"]
    condition2 = stock["current_price"] > stock.get("ma10", 0)  # 新条件
    condition3 = stock["price_to_high_ratio"] >= 0.9
    condition4 = stock["turnover"] > 10
    condition5 = stock["market_cap"] > 100
    condition6 = stock["gain_20d"] < 30
    
    print(f"\n{stock['name']}:")
    print(f"  当前价格: {stock['current_price']}, ma10: {stock.get('ma10', 'N/A')}")
    print(f"  current_price > ma10: {stock['current_price']} > {stock.get('ma10', 0)} = {condition2}")
    
    if condition1 and condition2 and condition3 and condition4 and condition5 and condition6:
        print(f"  ✅ 通过所有筛选条件")
    else:
        print(f"  ❌ 未通过筛选")
        failed = []
        if not condition1: failed.append("above_ma_50")
        if not condition2: failed.append("current_price > ma10")
        if not condition3: failed.append("price_to_high >= 0.9")
        if not condition4: failed.append("turnover > 10")
        if not condition5: failed.append("market_cap > 100")
        if not condition6: failed.append("gain_20d < 30")
        print(f"     失败条件: {', '.join(failed)}")

print("\n" + "=" * 50)
print("总结:")
print("1. 宁德时代: 188.50 > 182.50 = True ✓")
print("2. 五粮液: 148.20 > 143.80 = True ✓")
print("3. 测试股票: 100.00 > 102.00 = False ✗ (应该被过滤)")
print("\n新条件 'current_price > ma10' 能有效过滤掉当前价格低于10日均线的股票。")