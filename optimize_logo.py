#!/usr/bin/env python3
"""
优化logo图片大小
"""
import os
from PIL import Image

def optimize_logo():
    input_path = "assets/icons/logo.png"
    output_path = "assets/icons/logo-optimized.png"
    
    try:
        # 打开原始图片
        img = Image.open(input_path)
        print(f"原始图片尺寸: {img.size}")
        print(f"原始图片模式: {img.mode}")
        
        # 调整大小 (120x120 保持比例)
        size = (120, 120)
        img.thumbnail(size, Image.Resampling.LANCZOS)
        
        # 转换为RGB模式如果必要
        if img.mode in ('RGBA', 'LA'):
            # 创建白色背景
            background = Image.new('RGB', img.size, (255, 255, 255))
            # 合并alpha通道
            background.paste(img, mask=img.split()[-1])
            img = background
        
        # 保存优化后的图片
        img.save(output_path, "PNG", optimize=True, quality=85)
        
        # 检查文件大小
        original_size = os.path.getsize(input_path)
        optimized_size = os.path.getsize(output_path)
        
        print(f"原始文件大小: {original_size / 1024:.1f} KB")
        print(f"优化后大小: {optimized_size / 1024:.1f} KB")
        print(f"压缩率: {(1 - optimized_size/original_size) * 100:.1f}%")
        print(f"优化后的图片已保存到: {output_path}")
        
        return output_path
        
    except Exception as e:
        print(f"优化失败: {e}")
        return None

if __name__ == "__main__":
    optimize_logo()