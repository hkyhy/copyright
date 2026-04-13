#!/bin/bash

# 本地安装测试脚本

echo "🧪 开始本地安装测试..."
echo ""

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

# 创建全局链接
echo ""
echo "🔗 创建全局链接..."
npm link

if [ $? -ne 0 ]; then
    echo "❌ 链接创建失败"
    exit 1
fi

# 测试命令是否可用
echo ""
echo "✅ 测试命令..."
copyright-gen --version

if [ $? -ne 0 ]; then
    echo "❌ 命令测试失败"
    npm unlink -g copyright-generator
    exit 1
fi

echo ""
echo "✅ 安装测试成功！"
echo ""
echo "现在你可以使用以下命令："
echo "  copyright-gen init          # 交互式模式"
echo "  copyright-gen generate      # 生成项目材料"
echo "  copyright-gen list-modules  # 查看可用模块"
echo ""
echo "测试完成后，运行以下命令取消链接："
echo "  npm unlink -g copyright-generator"
echo ""
