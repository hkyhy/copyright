# 项目结构说明

## 目录结构

```
copyright-generator/
├── bin/                          # 可执行文件
│   └── cli.js                    # CLI 入口文件
├── src/                          # 源代码
│   ├── index.js                  # 主入口，导出 API
│   ├── generator.js              # 整体项目生成器
│   ├── module-generator.js       # 模块生成器
│   ├── module-config.js          # 内置模块配置
│   └── interactive.js            # 交互式界面
├── examples/                     # 示例代码
│   ├── basic-usage.js            # 基本使用示例
│   └── custom-module.js          # 自定义模块示例
├── scripts/                      # 脚本工具
│   ├── publish.sh                # npm 发布脚本
│   └── install-test.sh           # 本地安装测试脚本
├── templates/                    # 模板文件
│   └── module-template.json      # 模块配置模板
├── docs/                         # 文档
│   ├── USAGE.md                  # 详细使用说明
│   └── PROJECT_STRUCTURE.md      # 项目结构说明（本文件）
├── .github/                      # GitHub 配置
│   └── workflows/
│       └── publish.yml           # 自动发布工作流
├── copyright/                    # 原始软著材料（可选）
├── package.json                  # 项目配置
├── README.md                     # 英文说明文档
├── README.zh-CN.md               # 中文说明文档
├── QUICK_START.md                # 快速开始指南
├── CHANGELOG.md                  # 更新日志
├── PUBLISH.md                    # 发布指南
├── LICENSE                       # MIT 许可证
├── .gitignore                    # Git 忽略配置
└── .npmignore                    # npm 忽略配置
```

## 核心模块说明

### bin/cli.js

CLI 命令行入口文件，使用 Commander.js 实现命令行解析。

**主要命令:**
- `generate` - 生成整体项目材料
- `module <name>` - 生成模块材料
- `list-modules` - 列出可用模块
- `init` - 交互式模式

### src/generator.js

整体项目生成器，核心类 `CopyrightGenerator`。

**主要功能:**
- 分析项目结构（package.json, README.md）
- 扫描代码文件
- 生成源代码文档（前30页+后30页）
- 生成用户手册
- 生成申请表
- 生成项目信息 JSON

**关键方法:**
- `analyzeProject()` - 分析项目
- `scanCodeFiles()` - 扫描代码
- `generateSourceCodeDoc()` - 生成源代码文档
- `generateUserManual()` - 生成用户手册
- `generateApplicationForm()` - 生成申请表
- `generateAll()` - 生成所有材料

### src/module-generator.js

AI模块生成器，核心类 `ModuleCopyrightGenerator`。

**主要功能:**
- 根据模块配置收集代码
- 生成模块源代码文档
- 生成设计说明书
- 生成模块申请表
- 生成模块 README

**关键方法:**
- `collectCode()` - 收集模块代码
- `readFile()` - 读取单个文件
- `readDirectory()` - 递归读取目录
- `generateSourceCodeDoc()` - 生成源代码文档
- `generateDesignDoc()` - 生成设计说明书
- `generateApplicationForm()` - 生成申请表
- `generateAll()` - 生成所有材料

### src/module-config.js

内置AI模块配置，导出 `MODULES` 对象。

**模块配置结构:**
```javascript
{
  'module-key': {
    name: '模块名称',
    version: 'V1.0',
    description: '模块描述',
    files: ['文件路径数组'],
    features: ['功能列表'],
    techStack: '技术栈'
  }
}
```

**内置模块:**
- ai-content-generator
- digital-media-generator
- video-communication-system
- data-report-system
- task-scheduler-system

### src/interactive.js

交互式命令行界面，使用 Inquirer.js 实现。

**功能:**
- 选择生成模式
- 输入配置参数
- 调用相应的生成器

### src/index.js

主入口文件，导出公共 API。

**导出内容:**
- `generateCopyright` - 生成整体项目材料
- `generateModule` - 生成模块材料
- `MODULES` - 模块配置对象

## 依赖说明

### 生产依赖

- **commander** (^11.0.0) - 命令行参数解析
- **chalk** (^4.1.2) - 终端文本着色
- **ora** (^5.4.1) - 终端加载动画
- **inquirer** (^8.2.5) - 交互式命令行界面

### 为什么选择这些依赖？

- **commander**: 最流行的 Node.js CLI 框架，API 简洁
- **chalk**: 让终端输出更美观，提升用户体验
- **ora**: 提供加载动画，让用户知道程序在运行
- **inquirer**: 强大的交互式提示库，易于使用

## 工作流程

### 整体项目生成流程

```
用户运行命令
    ↓
CLI 解析参数
    ↓
创建 CopyrightGenerator 实例
    ↓
分析项目（package.json, README.md）
    ↓
扫描代码文件（递归遍历目录）
    ↓
生成源代码文档（前30页+后30页）
    ↓
生成用户手册
    ↓
生成申请表
    ↓
生成项目信息 JSON
    ↓
输出到指定目录
```

### 模块生成流程

```
用户运行命令
    ↓
CLI 解析参数
    ↓
创建 ModuleCopyrightGenerator 实例
    ↓
根据模块配置收集代码
    ↓
生成源代码文档（前30页+后30页）
    ↓
生成设计说明书
    ↓
生成申请表
    ↓
生成 README
    ↓
输出到指定目录
```

## 扩展开发

### 添加新的内置模块

编辑 `src/module-config.js`，添加新的模块配置：

```javascript
MODULES['new-module'] = {
  name: '新模块名称',
  version: 'V1.0',
  description: '模块描述',
  files: ['src/new-module/'],
  features: ['功能1', '功能2'],
  techStack: 'Node.js + React'
};
```

### 添加新的生成器

1. 在 `src/` 目录创建新的生成器文件
2. 实现生成逻辑
3. 在 `src/index.js` 中导出
4. 在 `bin/cli.js` 中添加命令

### 自定义模板

1. 在 `templates/` 目录添加模板文件
2. 在生成器中读取模板
3. 替换模板变量
4. 输出生成的文件

## 测试

### 本地测试

```bash
# 安装依赖
npm install

# 创建全局链接
npm link

# 测试命令
copyright-gen --version
copyright-gen init

# 取消链接
npm unlink -g copyright-generator
```

### 使用测试脚本

```bash
# 运行安装测试脚本
npm run local-test

# 运行示例
npm run example
npm run example:custom
```

## 发布流程

1. 更新版本号（package.json）
2. 更新 CHANGELOG.md
3. 提交代码
4. 运行发布脚本：`npm run publish-npm`
5. 或使用 GitHub Release 触发自动发布

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 代码规范

- 使用 ES6+ 语法
- 使用 async/await 处理异步
- 添加适当的注释
- 保持代码简洁清晰
- 遵循现有代码风格

## 许可证

MIT License - 详见 LICENSE 文件

---

更新日期：2026-04-02
