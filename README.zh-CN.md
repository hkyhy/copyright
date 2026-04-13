# 软件著作权申请材料生成器

[English](./README.md) | 简体中文

一键生成中国软件著作权申请所需的全部材料，包括申请表、源代码文档、用户手册等。

## ✨ 特性

- 🚀 **自动化生成** - 扫描项目代码，自动生成所有申请材料
- 📝 **完整材料** - 申请表、源代码文档（前30页+后30页）、用户手册
- 🎯 **双模式支持** - 支持整体项目和独立AI模块两种申请模式
- 💡 **交互式界面** - 友好的命令行交互，操作简单直观
- ⚡ **快速高效** - 几秒钟完成材料生成，节省大量时间
- 🔧 **灵活配置** - 支持自定义输出目录和模块配置

## 📦 安装

### 全局安装（推荐）

```bash
npm install -g copyright-generator
```

安装后可在任何项目中使用 `copyright-gen` 命令。

### 项目内安装

```bash
npm install copyright-generator --save-dev
```

在 package.json 中添加脚本：

```json
{
  "scripts": {
    "copyright": "copyright-gen generate"
  }
}
```

## 🚀 快速开始

### 方式1：交互式模式（推荐）

```bash
copyright-gen init
```

按照提示选择生成模式和配置参数，适合首次使用。

### 方式2：命令行模式

```bash
# 在当前目录生成整体项目材料
copyright-gen generate

# 指定项目路径和输出目录
copyright-gen generate -p ./my-project -o ./output

# 生成AI模块材料
copyright-gen module ai-question-generator
```

## 📖 使用指南

### 生成整体项目材料

为整个项目生成软著申请材料：

```bash
copyright-gen generate [选项]

选项:
  -p, --path <path>      项目路径 (默认: 当前目录)
  -o, --output <output>  输出目录 (默认: ./copyright-output)
```

示例：
```bash
# 当前目录
copyright-gen generate

# 指定路径
copyright-gen generate -p /Users/dev/my-project -o ./copyright-docs
```

### 生成AI模块材料

为独立的AI功能模块生成申请材料：

```bash
# 查看所有可用模块
copyright-gen list-modules

# 生成指定模块
copyright-gen module <模块名称> [选项]

选项:
  -p, --path <path>      项目路径 (默认: 当前目录)
  -o, --output <output>  输出目录 (默认: ./copyright-output/modules/<模块名称>)
```

示例：
```bash
copyright-gen module ai-question-generator
copyright-gen module digital-video-generator -p ./my-project
```

### 在代码中使用

```javascript
const { generateCopyright, generateModule } = require('copyright-generator');

// 生成整体项目材料
await generateCopyright('./my-project', './output');

// 生成模块材料
await generateModule('ai-content-generator', './my-project');
```

## 📋 内置AI模块

工具内置了5个常见AI模块的配置：

| 模块ID | 模块名称 | 说明 |
|--------|---------|------|
| `ai-content-generator` | AI智能内容生成系统 | 基于大语言模型的智能内容生成 |
| `digital-media-generator` | 数字媒体自动生成系统 | 文本转数字媒体内容 |
| `video-communication-system` | 智能视频通信系统 | WebRTC实时视频通信 |
| `data-report-system` | AI数据报告生成系统 | 智能数据分析和报告生成 |
| `task-scheduler-system` | 智能任务调度系统 | 分布式异步任务处理 |

## 📁 生成的文件

运行后会在输出目录生成以下文件：

```
copyright-output/
├── 软件著作权登记申请表.md    # 申请表（需填写著作权人信息）
├── 源代码文档.md              # 前30页+后30页源代码
├── 用户手册.md                # 用户手册/使用说明
└── 项目信息.json              # 项目统计信息
```

## ⚙️ 配置说明

### 支持的代码文件类型

- JavaScript/TypeScript: `.js`, `.jsx`, `.ts`, `.tsx`
- Python: `.py`
- Java: `.java`
- C/C++: `.c`, `.cpp`, `.h`
- Go: `.go`
- Rust: `.rs`

### 自动排除的目录

- `node_modules`
- `build`, `dist`, `.next`, `out`
- `.git`
- `coverage`, `__pycache__`, `venv`

## 📝 申请流程

生成材料后，按以下步骤完成申请：

1. **转换格式** - 将 Markdown 文档转换为 Word 格式
2. **填写信息** - 在申请表中填写完整的著作权人信息
3. **检查格式** - 确保页眉、页码显示正确
4. **打印文档** - 单面打印所有文档
5. **准备附件** - 营业执照复印件、身份证复印件
6. **盖章签字** - 在申请表第三页盖企业公章或个人签字
7. **提交申请** - 提交至中国版权保护中心

## 🔗 相关资源

- [中国版权保护中心](http://www.copyright.com)
- [软著申请教程](https://github.com/AlexanderZhou01/China-software-copyright)
- [在线申请系统](https://register.ccopyright.com.cn)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发

```bash
# 克隆仓库
git clone <repository-url>
cd copyright-generator

# 安装依赖
npm install

# 本地测试
npm link
copyright-gen init

# 取消链接
npm unlink -g copyright-generator
```

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

## 💬 支持

如有问题或建议，请：
- 提交 [Issue](../../issues)
- 查看 [文档](./README.md)
- 参考 [示例代码](./examples/)

---

Made with ❤️ for Chinese developers
