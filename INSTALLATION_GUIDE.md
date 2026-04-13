# 安装和使用指南

## 🎯 目标

将 copyright-generator 发布为 npm 包，让其他项目可以轻松安装和使用。

## 📋 发布前准备

### 1. 确保项目完整

检查以下文件是否存在：
- ✅ package.json
- ✅ README.md
- ✅ LICENSE
- ✅ bin/cli.js
- ✅ src/ 目录
- ✅ .npmignore

### 2. 安装依赖

```bash
npm install
```

### 3. 本地测试

```bash
# 运行测试脚本
npm run local-test

# 或手动测试
npm link
copyright-gen --version
copyright-gen list-modules
npm unlink -g copyright-generator
```

## 🚀 发布到 npm

### 方式1：首次发布

```bash
# 1. 登录 npm（如果还没登录）
npm login

# 2. 发布包
npm publish
```

### 方式2：使用发布脚本

```bash
npm run publish-npm
```

脚本会自动：
- 检查登录状态
- 运行测试
- 询问版本更新类型
- 确认后发布

### 包名冲突处理

如果 `copyright-generator` 已被占用：

**选项1：使用作用域包名**

修改 package.json：
```json
{
  "name": "@your-username/copyright-generator"
}
```

发布：
```bash
npm publish --access public
```

**选项2：更换包名**

修改 package.json：
```json
{
  "name": "cn-copyright-generator"
}
```

## 📦 在其他项目中使用

### 安装

```bash
# 全局安装（推荐）
npm install -g copyright-generator

# 或作用域包
npm install -g @your-username/copyright-generator

# 项目内安装
npm install copyright-generator --save-dev
```

### 使用

```bash
# 进入你的项目
cd /path/to/your/project

# 生成材料
copyright-gen generate

# 或交互式
copyright-gen init
```

## 🧪 测试场景

### 场景1：在新项目中测试

```bash
# 创建测试项目
mkdir test-project
cd test-project
npm init -y

# 创建一些代码文件
mkdir src
echo "console.log('Hello');" > src/index.js

# 安装并使用工具
npm install -g copyright-generator
copyright-gen generate

# 查看生成的文件
ls -la copyright-output/
```

### 场景2：在现有项目中测试

```bash
# 进入现有项目
cd /path/to/existing/project

# 使用工具
copyright-gen generate -o ./copyright-docs

# 查看结果
ls -la copyright-docs/
```

### 3. 生成AI模块材料

```bash
cd /path/to/project

# 查看可用模块
copyright-gen list-modules

# 生成指定模块
copyright-gen module ai-content-generator

# 查看结果
ls -la copyright-output/modules/ai-content-generator/
```

## 📊 验证清单

发布后验证：

- [ ] 包在 npmjs.com 上可见
- [ ] 可以通过 npm install 安装
- [ ] CLI 命令可以正常运行
- [ ] 生成的文件格式正确
- [ ] 文档链接正常
- [ ] 示例代码可以运行

## 🔄 更新流程

当需要发布新版本时：

```bash
# 1. 修改代码
# 2. 更新 CHANGELOG.md
# 3. 更新版本号并发布
npm version patch  # 或 minor, major
npm publish
```

## 📚 相关文档

- [README.md](./README.md) - 主要说明文档
- [QUICK_START.md](./QUICK_START.md) - 快速开始
- [PUBLISH.md](./PUBLISH.md) - 详细发布指南
- [docs/USAGE.md](./docs/USAGE.md) - 详细使用说明
- [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) - 项目结构

## 💡 使用技巧

### 1. 在 package.json 中添加脚本

```json
{
  "scripts": {
    "copyright": "copyright-gen generate",
    "copyright:module": "copyright-gen module ai-content-generator"
  }
}
```

### 2. 在 CI/CD 中使用

```yaml
# .github/workflows/copyright.yml
name: Generate Copyright Materials

on:
  push:
    tags:
      - 'v*'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g copyright-generator
      - run: copyright-gen generate -o ./copyright-materials
      - uses: actions/upload-artifact@v3
        with:
          name: copyright-materials
          path: ./copyright-materials
```

### 3. 自定义模块配置

参考 `examples/custom-module.js` 创建自定义模块。

## ❓ 常见问题

### Q: 如何修改包名？

A: 编辑 package.json 中的 `name` 字段，然后重新发布。

### Q: 如何撤销已发布的版本？

A: 使用 `npm unpublish copyright-generator@1.0.0`（24小时内）

### Q: 如何查看包的下载量？

A: 访问 `https://www.npmjs.com/package/copyright-generator`

### Q: 如何添加协作者？

A: 使用 `npm owner add <username> copyright-generator`

## 🎉 完成

你的工具现在是一个完整的 npm 包了！

**下一步：**
1. 发布到 npm
2. 在其他项目中测试
3. 收集用户反馈
4. 持续改进

---

祝你的软著申请顺利！🎊
