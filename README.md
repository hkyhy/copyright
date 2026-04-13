# Copyright Generator

中国软件著作权申请材料自动生成工具 - 自动生成申请表、源代码文档、用户手册等材料

## 特性

- 🚀 自动扫描项目代码，生成源代码文档（前30页+后30页）
- 📝 自动生成软件著作权登记申请表
- 📖 自动生成用户手册/设计说明书
- 🎯 支持整体项目和独立AI模块两种模式
- 💡 交互式命令行界面，操作简单
- ⚡ 快速生成，节省时间

## 安装

### 全局安装（推荐）

```bash
npm install -g copyright-generator
```

### 项目内安装

```bash
npm install copyright-generator --save-dev
```

## 使用方法

### 1. 交互式模式（推荐新手）

```bash
copyright-gen init
```

按照提示选择生成模式和配置参数。

### 2. 生成整体项目材料

```bash
# 在当前目录生成
copyright-gen generate

# 指定项目路径和输出目录
copyright-gen generate -p /path/to/project -o ./output
```

### 3. 生成AI模块材料

```bash
# 查看可用模块
copyright-gen list-modules

# 生成指定模块的材料
copyright-gen module ai-question-generator

# 指定项目路径
copyright-gen module digital-video-generator -p /path/to/project
```

### 4. 在代码中使用

```javascript
const { generateCopyright, generateModule } = require('copyright-generator');

// 生成整体项目材料
await generateCopyright('./my-project', './output');

// 生成模块材料
await generateModule('ai-question-generator', './my-project');
```

## 可用的AI模块

- `ai-question-generator` - AI智能面试题目生成系统
- `digital-video-generator` - 数字人视频自动生成系统
- `video-interview-system` - 智能视频面试系统
- `interview-report-system` - AI面试报告生成系统
- `task-scheduler-system` - 智能任务调度系统

## 生成的文件

生成完成后，输出目录将包含以下文件：

```
copyright-output/
├── 软件著作权登记申请表.md
├── 源代码文档.md
├── 用户手册.md
└── 项目信息.json
```

## 命令行选项

### generate 命令

```bash
copyright-gen generate [options]

选项:
  -p, --path <path>      项目路径 (默认: 当前目录)
  -o, --output <output>  输出目录 (默认: ./copyright-output)
```

### module 命令

```bash
copyright-gen module <moduleName> [options]

参数:
  moduleName             模块名称

选项:
  -p, --path <path>      项目路径 (默认: 当前目录)
  -o, --output <output>  输出目录 (默认: ./copyright-output/modules/<moduleName>)
```

## 注意事项

1. 生成的Markdown文档需要转换为Word格式后提交
2. 请在申请表中填写完整的著作权人信息
3. 确保所有文档页眉、页码显示正确
4. 所有文档需要单面打印
5. 申请表第三页需要盖企业公章或个人签字

## 下一步操作

生成材料后，请按以下步骤操作：

1. 将Markdown文档转换为Word格式
2. 检查并完善申请表中的著作权人信息
3. 确保所有文档页眉、页码显示正确
4. 单面打印所有文档
5. 准备营业执照复印件和身份证复印件
6. 在申请表第三页盖章或签字
7. 提交至中国版权保护中心

## 参考资源

- [中国版权保护中心](http://www.copyright.com)
- [软著申请教程](https://github.com/AlexanderZhou01/China-software-copyright)

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 支持

如有问题，请提交 Issue 或联系维护者。
