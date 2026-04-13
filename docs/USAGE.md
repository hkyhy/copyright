# 详细使用说明

## 目录

1. [安装](#安装)
2. [基本使用](#基本使用)
3. [高级功能](#高级功能)
4. [API文档](#api文档)
5. [常见问题](#常见问题)

## 安装

### 全局安装

```bash
npm install -g copyright-generator
```

全局安装后，可以在任何目录使用 `copyright-gen` 命令。

### 项目内安装

```bash
npm install copyright-generator --save-dev
```

在 package.json 中添加脚本：

```json
{
  "scripts": {
    "copyright": "copyright-gen generate",
    "copyright:module": "copyright-gen module ai-content-generator"
  }
}
```

然后使用：

```bash
npm run copyright
npm run copyright:module
```

## 基本使用

### 1. 交互式模式

最简单的使用方式，适合首次使用：

```bash
copyright-gen init
```

程序会引导你：
1. 选择生成模式（整体项目 or AI模块）
2. 输入项目路径
3. 输入输出目录
4. 自动生成材料

### 2. 生成整体项目材料

```bash
# 在当前目录生成
copyright-gen generate

# 指定项目路径
copyright-gen generate -p /path/to/project

# 指定输出目录
copyright-gen generate -o ./my-copyright-docs

# 同时指定项目路径和输出目录
copyright-gen generate -p /path/to/project -o ./output
```

### 3. 生成AI模块材料

```bash
# 查看所有可用模块
copyright-gen list-modules

# 生成指定模块
copyright-gen module ai-content-generator

# 指定项目路径
copyright-gen module digital-media-generator -p /path/to/project

# 指定输出目录
copyright-gen module video-communication-system -o ./module-output
```

## 高级功能

### 在 Node.js 代码中使用

```javascript
const { generateCopyright, generateModule, MODULES } = require('copyright-generator');

async function main() {
  // 生成整体项目材料
  await generateCopyright('./my-project', './output');
  
  // 生成模块材料
  await generateModule('ai-content-generator', './my-project');
  
  // 查看所有模块配置
  console.log(MODULES);
}

main().catch(console.error);
```

### 自定义模块配置

创建自定义模块配置：

```javascript
const { ModuleCopyrightGenerator } = require('copyright-generator/src/module-generator');
const { MODULES } = require('copyright-generator/src/module-config');

// 添加自定义模块
MODULES['my-custom-module'] = {
  name: '我的自定义模块',
  version: 'V1.0',
  description: '模块描述',
  files: [
    'src/my-module/',
    'server/my-api.js'
  ],
  features: [
    '功能1',
    '功能2',
    '功能3'
  ],
  techStack: 'Node.js + React'
};

// 生成材料
const generator = new ModuleCopyrightGenerator('my-custom-module', './project', './output');
await generator.generateAll();
```

### 批量生成多个模块

```javascript
const { generateModule, MODULES } = require('copyright-generator');

async function generateAllModules() {
  const projectPath = './my-project';
  
  for (const moduleKey of Object.keys(MODULES)) {
    console.log(`生成模块: ${moduleKey}`);
    await generateModule(moduleKey, projectPath);
  }
  
  console.log('所有模块生成完成！');
}

generateAllModules().catch(console.error);
```

## API文档

### generateCopyright(projectPath, outputDir)

生成整体项目的软著申请材料。

**参数:**
- `projectPath` (string): 项目路径，默认为当前目录
- `outputDir` (string): 输出目录，默认为 `./copyright-output`

**返回:**
- Promise<void>

**示例:**
```javascript
await generateCopyright('./my-project', './output');
```

### generateModule(moduleKey, projectPath, outputDir)

生成AI模块的软著申请材料。

**参数:**
- `moduleKey` (string): 模块标识符（必需）
- `projectPath` (string): 项目路径，默认为当前目录
- `outputDir` (string): 输出目录，默认为 `./copyright-output/modules/<moduleKey>`

**返回:**
- Promise<void>

**示例:**
```javascript
await generateModule('ai-content-generator', './my-project');
```

### MODULES

内置的AI模块配置对象。

**类型:**
```typescript
{
  [key: string]: {
    name: string;
    version: string;
    description: string;
    files: string[];
    features: string[];
    techStack: string;
  }
}
```

**示例:**
```javascript
const { MODULES } = require('copyright-generator');

console.log(MODULES['ai-content-generator'].name);
// 输出: AI智能内容生成系统
```

## 常见问题

### Q1: 生成的文件在哪里？

A: 默认在 `./copyright-output` 目录。可以通过 `-o` 参数自定义输出目录。

### Q2: 支持哪些编程语言？

A: 支持 JavaScript, TypeScript, Python, Java, C/C++, Go, Rust 等主流语言。

### Q3: 如何排除某些文件或目录？

A: 工具会自动排除 `node_modules`, `build`, `dist`, `.git` 等常见目录。如需自定义，可以修改源代码中的 `excludeDirs` 配置。

### Q4: 生成的代码行数不够怎么办？

A: 软著要求至少3000行代码。如果项目代码不足，建议：
- 包含更多相关文件
- 不要过度压缩代码
- 保留必要的注释

### Q5: 可以生成 Word 格式吗？

A: 当前版本生成 Markdown 格式，需要手动转换为 Word。未来版本会支持直接导出 Word。

### Q6: 如何添加自定义模块？

A: 参考 `examples/custom-module.js` 示例，或修改 `src/module-config.js` 文件。

### Q7: 生成失败怎么办？

A: 检查：
- 项目路径是否正确
- 是否有 package.json 文件
- 是否有足够的代码文件
- 查看错误信息获取详细原因

### Q8: 可以在 CI/CD 中使用吗？

A: 可以！在 CI 配置中安装并运行：

```yaml
- name: Generate copyright materials
  run: |
    npm install -g copyright-generator
    copyright-gen generate -p . -o ./copyright-docs
```

### Q9: 生成的材料符合版权中心要求吗？

A: 工具按照中国版权保护中心的要求生成材料，但仍需：
- 填写完整的著作权人信息
- 转换为 Word 格式
- 确保页眉页码正确
- 单面打印

### Q10: 如何更新工具？

```bash
# 全局安装的更新
npm update -g copyright-generator

# 项目内安装的更新
npm update copyright-generator
```

## 技术支持

如有其他问题：
- 查看 [README.md](../README.md)
- 提交 [Issue](../../issues)
- 查看 [示例代码](../examples/)

---

更新日期：2026-04-02
