#!/bin/bash

# npm 发布脚本

echo "📦 准备发布到 npm..."
echo ""

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 检查是否已登录 npm
echo "🔐 检查 npm 登录状态..."
npm whoami > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ 未登录 npm，请先运行: npm login"
    exit 1
fi

# 运行测试（如果有）
if grep -q '"test"' package.json; then
    echo ""
    echo "🧪 运行测试..."
    npm test
    
    if [ $? -ne 0 ]; then
        echo "❌ 测试失败，取消发布"
        exit 1
    fi
fi

# 显示当前版本
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo ""
echo "当前版本: $CURRENT_VERSION"
echo ""

# 询问版本类型
echo "选择版本更新类型:"
echo "  1) patch (补丁版本，如 1.0.0 -> 1.0.1)"
echo "  2) minor (次版本，如 1.0.0 -> 1.1.0)"
echo "  3) major (主版本，如 1.0.0 -> 2.0.0)"
echo "  4) 跳过版本更新"
echo ""
read -p "请选择 [1-4]: " version_choice

case $version_choice in
    1)
        npm version patch
        ;;
    2)
        npm version minor
        ;;
    3)
        npm version major
        ;;
    4)
        echo "跳过版本更新"
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

NEW_VERSION=$(node -p "require('./package.json').version")
echo ""
echo "新版本: $NEW_VERSION"
echo ""

# 确认发布
read -p "确认发布到 npm? [y/N]: " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "❌ 取消发布"
    exit 1
fi

# 发布
echo ""
echo "🚀 发布中..."
npm publish

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 发布成功！"
    echo ""
    echo "版本 $NEW_VERSION 已发布到 npm"
    echo "用户可以通过以下命令安装："
    echo "  npm install -g copyright-generator"
    echo ""
else
    echo ""
    echo "❌ 发布失败"
    exit 1
fi
