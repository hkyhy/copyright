# 快速开始

## 5分钟快速生成软著申请材料

### 步骤1：安装工具

```bash
npm install -g copyright-generator
```

### 步骤2：进入你的项目目录

```bash
cd /path/to/your/project
```

### 步骤3：运行生成命令

```bash
copyright-gen generate
```

就这么简单！材料会自动生成到 `./copyright-output` 目录。

## 交互式模式

如果你喜欢交互式界面：

```bash
copyright-gen init
```

按照提示操作即可。

## 生成AI模块材料

如果你的项目包含独立的AI模块：

```bash
# 查看可用模块
copyright-gen list-modules

# 生成指定模块
copyright-gen module ai-content-generator
```

## 常见问题

### Q: 生成的文件在哪里？
A: 默认在 `./copyright-output` 目录，可以通过 `-o` 参数自定义。

### Q: 支持哪些编程语言？
A: 支持 JavaScript, TypeScript, Python, Java, C/C++, Go, Rust 等主流语言。

### Q: 生成后需要做什么？
A: 
1. 将 Markdown 转换为 Word 格式
2. 填写申请表中的著作权人信息
3. 打印并盖章
4. 提交到版权中心

### Q: 可以自定义模块吗？
A: 可以！参考 `examples/custom-module.js` 示例。

### Q: 如何在其他项目中使用？
A: 全局安装后，在任何项目目录运行 `copyright-gen generate` 即可。

## 下一步

- 查看 [README.md](./README.md) 了解详细功能
- 查看 [examples/](./examples/) 目录了解更多用法
- 查看 [PUBLISH.md](./PUBLISH.md) 了解如何发布到 npm

## 需要帮助？

提交 Issue 或查看文档获取更多帮助。
