# 如何使用 Copyright Generator 包

## 📦 项目已转换为 npm 包

你的软著申请材料生成工具已经成功转换为一个可安装的 npm 包！

## 🚀 快速开始

### 1. 发布到 npm（首次）

```bash
# 登录 npm（如果还没登录）
npm login

# 发布包
npm publish
```

如果包名 `copyright-generator` 已被占用，可以：
- 使用作用域包名：修改 package.json 中的 name 为 `@your-username/copyright-generator`
- 或选择其他包名

### 2. 在其他项目中安装

发布后，其他项目可以这样安装：

```bash
# 全局安装
npm install -g copyright-generator

# 或项目内安装
npm install copyright-generator --save-dev
```

### 3. 使用命令生成材料

```bash
# 进入你的项目目录
cd /path/to/your/project

# 交互式生成
copyright-gen init

# 或直接生成
copyright-gen generate

# 生成AI模块材料
copyright-gen module ai-content-generator
```

## 📖 主要功能

### 命令行工具

```bash
# 查看帮助
copyright-gen --help

# 查看版本
copyright-gen --version

# 生成整体项目材料
copyright-gen generate -p ./my-project -o ./output

# 查看可用模块
copyright-gen list-modules

# 生成模块材料
copyright-gen module <module-name>

# 交互式模式
copyright-gen init
```

### 在代码中使用

```javascript
const { generateCopyright, generateModule } = require('copyright-generator');

// 生成整体项目材料
await generateCopyright('./my-project', './output');

// 生成模块材料
await generateModule('ai-content-generator', './my-project');
```

## 📁 项目结构

```
copyright-generator/
├── bin/cli.js              # CLI 入口
├── src/                    # 源代码
│   ├── index.js           # 主入口
│   ├── generator.js       # 整体项目生成器
│   ├── module-generator.js # 模块生成器
│   ├── module-config.js   # 模块配置
│   └── interactive.js     # 交互式界面
├── examples/              # 使用示例
├── scripts/               # 工具脚本
├── templates/             # 模板文件
├── docs/                  # 文档
└── package.json           # 包配置
```

## 🔧 本地开发测试

在发布前，可以本地测试：

```bash
# 1. 安装依赖
npm install

# 2. 创建全局链接
npm link

# 3. 测试命令
copyright-gen init

# 4. 或运行测试脚本
npm run local-test

# 5. 测试完成后取消链接
npm unlink -g copyright-generator
```

## 📝 使用示例

### 示例1：为整个项目生成材料

```bash
cd /path/to/your/project
copyright-gen generate
```

生成的文件在 `./copyright-output/` 目录：
- 软件著作权登记申请表.md
- 源代码文档.md
- 用户手册.md
- 项目信息.json

### 示例2：为AI模块生成材料

```bash
cd /path/to/your/project
copyright-gen list-modules  # 查看可用模块
copyright-gen module ai-question-generator
```

生成的文件在 `./copyright-output/modules/ai-question-generator/` 目录。

### 示例3：在 Node.js 脚本中使用

创建 `generate-copyright.js`：

```javascript
const { generateCopyright } = require('copyright-generator');

async function main() {
  try {
    await generateCopyright('.', './copyright-docs');
    console.log('✅ 生成成功！');
  } catch (error) {
    console.error('❌ 生成失败:', error.message);
  }
}

main();
```

运行：
```bash
node generate-copyright.js
```

## 🎯 内置AI模块

工具内置了5个AI模块配置：

1. `ai-question-generator` - AI智能面试题目生成系统
2. `digital-video-generator` - 数字人视频自动生成系统
3. `video-interview-system` - 智能视频面试系统
4. `interview-report-system` - AI面试报告生成系统
5. `task-scheduler-system` - 智能任务调度系统

## 📦 发布流程

### 方式1：手动发布

```bash
# 1. 更新版本号
npm version patch  # 或 minor, major

# 2. 发布
npm publish
```

### 方式2：使用脚本发布

```bash
npm run publish-npm
```

脚本会引导你完成版本更新和发布。

### 方式3：GitHub Actions 自动发布

1. 在 GitHub 仓库设置中添加 `NPM_TOKEN` secret
2. 创建 GitHub Release
3. 自动触发发布到 npm

## 🔄 更新包

发布新版本后，用户可以这样更新：

```bash
# 全局安装的更新
npm update -g copyright-generator

# 项目内安装的更新
npm update copyright-generator
```

## 📚 文档

- [README.md](./README.md) - 英文说明
- [README.zh-CN.md](./README.zh-CN.md) - 中文说明
- [QUICK_START.md](./QUICK_START.md) - 快速开始
- [docs/USAGE.md](./docs/USAGE.md) - 详细使用说明
- [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) - 项目结构
- [CHANGELOG.md](./CHANGELOG.md) - 更新日志
- [PUBLISH.md](./PUBLISH.md) - 发布指南

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 💡 提示

1. 首次发布前，确保包名未被占用
2. 建议先本地测试，确保功能正常
3. 发布后可以在 [npmjs.com](https://www.npmjs.com) 查看包信息
4. 记得更新 CHANGELOG.md 记录版本变更

## 🎉 完成！

现在你的工具已经是一个完整的 npm 包了！其他开发者可以通过简单的 `npm install` 命令安装使用。

---

如有问题，请查看文档或提交 Issue。
