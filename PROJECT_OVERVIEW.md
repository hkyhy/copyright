# Copyright Generator - 项目总览

## 🎯 项目简介

Copyright Generator 是一个自动化工具，用于生成中国软件著作权申请所需的全部材料。

**核心价值：**
- ⏱️ 节省时间：从手动几天到自动几秒
- 📝 规范格式：符合版权中心要求
- 🎯 双模式：支持整体项目和AI模块
- 🚀 易于使用：命令行工具，一键生成

## 📦 包信息

- **包名**: copyright-generator
- **版本**: 1.0.0
- **许可证**: MIT
- **Node.js**: >=14.0.0

## 🏗️ 项目架构

```
用户项目
    ↓
安装 copyright-generator
    ↓
运行 copyright-gen 命令
    ↓
扫描项目代码
    ↓
生成申请材料
    ↓
输出到指定目录
```

## 📂 核心文件

| 文件 | 说明 |
|------|------|
| `bin/cli.js` | CLI 命令行入口 |
| `src/generator.js` | 整体项目生成器 |
| `src/module-generator.js` | AI模块生成器 |
| `src/module-config.js` | 内置模块配置 |
| `src/interactive.js` | 交互式界面 |
| `src/index.js` | API 导出 |

## 🎨 功能特性

### 1. 整体项目生成

```bash
copyright-gen generate
```

**生成内容：**
- 软件著作权登记申请表
- 源代码文档（前30页+后30页）
- 用户手册
- 项目信息统计

### 3. AI模块生成

```bash
copyright-gen module <module-name>
```

**生成内容：**
- 模块申请表
- 模块源代码文档
- 设计说明书
- 模块 README

### 3. 交互式模式

```bash
copyright-gen init
```

**特点：**
- 友好的用户界面
- 引导式操作
- 参数验证

## 🔧 技术栈

- **Node.js** - 运行环境
- **Commander.js** - CLI 框架
- **Chalk** - 终端着色
- **Ora** - 加载动画
- **Inquirer** - 交互式提示

## 📊 使用流程

### 开发者视角

```
1. 开发完成项目
2. 需要申请软著
3. npm install -g copyright-generator
4. copyright-gen generate
5. 获得所有申请材料
6. 转换格式并提交
```

### 工具内部流程

```
1. 读取 package.json 获取项目信息
2. 递归扫描代码文件
3. 统计代码行数
4. 生成源代码文档（前30页+后30页）
5. 生成用户手册/设计说明书
6. 生成申请表
7. 输出到指定目录
```

## 🎯 内置模块

| 模块 | 名称 | 代码行数估计 |
|------|------|-------------|
| ai-content-generator | AI智能内容生成系统 | 3000-6000 |
| digital-media-generator | 数字媒体自动生成系统 | 3000-5000 |
| video-communication-system | 智能视频通信系统 | 4000-8000 |
| data-report-system | AI数据报告生成系统 | 2000-4000 |
| task-scheduler-system | 智能任务调度系统 | 2000-4000 |

## 📈 发布计划

### v1.0.0 (当前版本)
- ✅ 基本功能实现
- ✅ CLI 命令行工具
- ✅ 整体项目生成
- ✅ AI模块生成
- ✅ 交互式模式
- ✅ 完整文档

### v1.1.0 (计划中)
- [ ] 直接导出 Word 格式
- [ ] 配置文件支持
- [ ] 自定义模板
- [ ] 单元测试

### v1.2.0 (计划中)
- [ ] Web UI 界面
- [ ] 批量生成
- [ ] 进度保存

### v2.0.0 (未来)
- [ ] 支持其他国家版权格式
- [ ] AI 辅助填写
- [ ] 在线提交

## 🚀 快速命令参考

```bash
# 安装
npm install -g copyright-generator

# 查看版本
copyright-gen --version

# 查看帮助
copyright-gen --help

# 交互式模式
copyright-gen init

# 生成整体项目
copyright-gen generate

# 查看模块
copyright-gen list-modules

# 生成模块
copyright-gen module ai-question-generator

# 指定路径
copyright-gen generate -p ./project -o ./output
```

## 📖 文档导航

- **快速开始**: [QUICK_START.md](./QUICK_START.md)
- **详细使用**: [docs/USAGE.md](./docs/USAGE.md)
- **项目结构**: [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)
- **发布指南**: [PUBLISH.md](./PUBLISH.md)
- **安装指南**: [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)
- **更新日志**: [CHANGELOG.md](./CHANGELOG.md)
- **中文文档**: [README.zh-CN.md](./README.zh-CN.md)

## 🤝 贡献

欢迎贡献代码、报告问题、提出建议！

## 📄 许可证

MIT License - 自由使用、修改、分发

---

**现在就开始使用吧！** 🎉

```bash
npm install -g copyright-generator
copyright-gen init
```
