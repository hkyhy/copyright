# 发布指南

## 发布到 npm

### 1. 准备工作

确保已安装依赖：

```bash
npm install
```

### 2. 更新版本号

```bash
# 补丁版本（bug修复）
npm version patch

# 次版本（新功能）
npm version minor

# 主版本（破坏性更新）
npm version major
```

### 3. 登录 npm

```bash
npm login
```

### 4. 发布

```bash
npm publish
```

如果包名已被占用，可以使用作用域包名：

```bash
# 修改 package.json 中的 name 为 @your-username/copyright-generator
npm publish --access public
```

## 本地测试

在发布前，建议先本地测试：

```bash
# 在项目根目录创建全局链接
npm link

# 在其他项目中测试
cd /path/to/test-project
copyright-gen init

# 测试完成后取消链接
npm unlink -g copyright-generator
```

## 发布检查清单

- [ ] 所有功能正常工作
- [ ] README.md 文档完整
- [ ] package.json 信息正确
- [ ] .npmignore 配置正确
- [ ] 版本号已更新
- [ ] 已测试 CLI 命令
- [ ] 已测试 API 调用

## 使用 GitHub Actions 自动发布

创建 `.github/workflows/publish.yml`：

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 更新日志

记得在每次发布时更新 CHANGELOG.md。
