const fs = require('fs').promises;
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const { MODULES } = require('./module-config');

class ModuleCopyrightGenerator {
  constructor(moduleKey, projectRoot, outputDir) {
    if (!MODULES[moduleKey]) {
      throw new Error(`未知模块: ${moduleKey}. 可用模块: ${Object.keys(MODULES).join(', ')}`);
    }

    this.moduleKey = moduleKey;
    this.moduleInfo = MODULES[moduleKey];
    this.projectRoot = path.resolve(projectRoot);
    this.outputDir = outputDir 
      ? path.resolve(outputDir)
      : path.join(this.projectRoot, 'copyright-output', 'modules', moduleKey);
    this.codeLines = [];
    this.totalLines = 0;
  }

  async collectCode() {
    const spinner = ora(`正在收集 ${this.moduleInfo.name} 的代码...`).start();

    for (const filePattern of this.moduleInfo.files) {
      const filePath = path.join(this.projectRoot, filePattern);
      
      try {
        const stat = await fs.stat(filePath);
        if (stat.isFile()) {
          await this.readFile(filePath);
        } else if (stat.isDirectory()) {
          await this.readDirectory(filePath);
        }
      } catch (e) {
        spinner.warn(chalk.yellow(`路径不存在: ${filePattern}`));
      }
    }

    spinner.succeed(chalk.green(`代码收集完成，共 ${this.totalLines} 行`));
  }

  async readFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());
      
      if (lines.length > 0) {
        const relativePath = path.relative(this.projectRoot, filePath);
        this.codeLines.push(`// 文件: ${relativePath}`);
        this.codeLines.push(...lines);
        this.codeLines.push('');
        this.totalLines += lines.length;
      }
    } catch (e) {
      // 忽略无法读取的文件
    }
  }

  async readDirectory(dirPath) {
    const codeExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.py', '.java']);
    
    const scanDir = async (dir) => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            await scanDir(fullPath);
          } else if (entry.isFile() && codeExtensions.has(path.extname(entry.name))) {
            await this.readFile(fullPath);
          }
        }
      } catch (e) {
        // 忽略无法访问的目录
      }
    };

    await scanDir(dirPath);
  }

  formatPage(softwareName, version, pageNum, lines) {
    const header = `${softwareName} ${version}${' '.repeat(Math.max(0, 80 - softwareName.length - version.length - 10))}第 ${pageNum} 页`;
    const separator = '-'.repeat(80);
    const content = lines.join('\n');
    return `${header}\n${separator}\n${content}\n\n`;
  }

  async generateSourceCodeDoc() {
    const spinner = ora('正在生成源代码文档...').start();

    const linesPerPage = 50;
    const pagesPerSection = 30;
    const softwareName = this.moduleInfo.name;
    const version = this.moduleInfo.version;

    const output = [];
    output.push(`# ${softwareName} 源代码文档\n\n`);
    output.push('## 前30页\n\n');

    // 前30页
    let pageNum = 1;
    let lineCount = 0;
    let pageLines = [];

    for (let i = 0; i < Math.min(this.codeLines.length, pagesPerSection * linesPerPage); i++) {
      pageLines.push(this.codeLines[i]);
      lineCount++;

      if (lineCount >= linesPerPage) {
        output.push(this.formatPage(softwareName, version, pageNum, pageLines));
        pageNum++;
        lineCount = 0;
        pageLines = [];

        if (pageNum > pagesPerSection) break;
      }
    }

    // 后30页
    output.push('\n' + '='.repeat(80) + '\n');
    output.push('## 后30页\n\n');

    const startIdx = Math.max(0, this.codeLines.length - pagesPerSection * linesPerPage);
    pageNum = 31;
    lineCount = 0;
    pageLines = [];

    for (let i = startIdx; i < this.codeLines.length; i++) {
      pageLines.push(this.codeLines[i]);
      lineCount++;

      if (lineCount >= linesPerPage) {
        output.push(this.formatPage(softwareName, version, pageNum, pageLines));
        pageNum++;
        lineCount = 0;
        pageLines = [];
      }
    }

    if (pageLines.length > 0) {
      output.push(this.formatPage(softwareName, version, pageNum, pageLines));
    }

    const outputFile = path.join(this.outputDir, '源代码文档.md');
    await fs.mkdir(this.outputDir, { recursive: true });
    await fs.writeFile(outputFile, output.join('\n'), 'utf-8');

    spinner.succeed(chalk.green('源代码文档已生成'));
  }

  async generateDesignDoc() {
    const spinner = ora('正在生成设计说明书...').start();

    const softwareName = this.moduleInfo.name;
    const version = this.moduleInfo.version;
    const description = this.moduleInfo.description;
    const features = this.moduleInfo.features;
    const techStack = this.moduleInfo.techStack;
    const currentDate = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });

    let doc = `# ${softwareName} 设计说明书

## 软件信息
- 软件名称：${softwareName}
- 版本号：${version}
- 开发日期：${currentDate}

## 一、引言

### 1.1 编写目的
本文档详细描述${softwareName}的设计方案，包括系统架构、功能模块、技术实现等内容，为软件开发和维护提供技术依据。

### 1.2 项目背景
${description}

### 1.3 术语定义
- AI：人工智能（Artificial Intelligence）
- API：应用程序接口（Application Programming Interface）
- WebRTC：网页即时通信（Web Real-Time Communication）
- ORM：对象关系映射（Object-Relational Mapping）

## 二、系统概述

### 2.1 系统目标
${description}

### 2.2 技术架构
${techStack}

### 2.3 系统特点
`;

    features.forEach((feature, i) => {
      doc += `${i + 1}. ${feature}\n`;
    });

    doc += `\n## 三、功能设计

### 3.1 功能模块划分
`;

    features.forEach((feature, i) => {
      doc += `\n#### 3.1.${i + 1} ${feature}\n`;
      doc += `实现${feature}的核心功能，提供完整的业务流程支持。\n`;
    });

    doc += `
## 四、数据库设计

### 4.1 数据表结构
系统采用关系型数据库，主要数据表包括：
- 核心业务表
- 配置信息表
- 任务状态表
- 日志记录表

### 4.2 数据关系
采用外键关联，确保数据一致性和完整性。

## 五、接口设计

### 5.1 RESTful API
系统提供标准的RESTful API接口，支持：
- GET：查询数据
- POST：创建数据
- PUT：更新数据
- DELETE：删除数据

### 5.2 第三方API集成
集成外部AI服务API，实现智能化功能。

## 六、安全设计

### 6.1 身份认证
- 基于Token的身份认证机制
- 密码加密存储
- 会话管理

### 6.2 权限控制
- 基于角色的访问控制（RBAC）
- 接口权限验证
- 数据权限隔离

### 6.3 数据安全
- 敏感数据加密
- SQL注入防护
- XSS攻击防护

## 七、性能设计

### 7.1 异步处理
采用异步任务处理机制，提高系统响应速度。

### 7.2 缓存策略
合理使用缓存，减少数据库访问压力。

### 7.3 并发控制
支持高并发访问，确保系统稳定性。

## 八、部署方案

### 8.1 开发环境
- Node.js 14+
- 数据库（SQLite/PostgreSQL）
- 开发工具

### 8.2 生产环境
- 云服务器部署
- 负载均衡
- 数据备份

## 九、维护说明

### 9.1 日志管理
系统记录详细的操作日志，便于问题排查。

### 9.2 监控告警
实时监控系统运行状态，异常情况及时告警。

### 9.3 版本升级
支持平滑升级，不影响现有业务。

---
文档生成日期：${new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
`;

    const outputFile = path.join(this.outputDir, '设计说明书.md');
    await fs.writeFile(outputFile, doc, 'utf-8');

    spinner.succeed(chalk.green('设计说明书已生成'));
  }

  async generateApplicationForm() {
    const spinner = ora('正在生成申请表...').start();

    const softwareName = this.moduleInfo.name;
    const version = this.moduleInfo.version;
    const description = this.moduleInfo.description;
    const features = this.moduleInfo.features;
    const currentDate = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });

    let form = `# 计算机软件著作权登记申请表

## 一、软件基本信息

### 1. 软件全称
${softwareName}

### 2. 软件简称
${softwareName}

### 3. 软件版本号
${version}

### 4. 软件分类
应用软件

### 5. 开发完成日期
${currentDate}

### 6. 首次发表日期
${currentDate}

### 7. 发表状态
- [ ] 已发表
- [x] 未发表

## 二、源程序信息

### 1. 源程序量
${this.totalLines}行

### 2. 主要编程语言
JavaScript/TypeScript

### 3. 技术架构
${this.moduleInfo.techStack}

## 三、著作权人信息

### 1. 著作权人类型
- [ ] 个人
- [x] 企业
- [ ] 其他组织

### 2. 著作权人名称
【请填写企业全称】

### 3. 统一社会信用代码
【请填写】

### 4. 地址
【请填写】

### 5. 联系人
【请填写】

### 6. 联系电话
【请填写】

### 7. 电子邮箱
【请填写】

## 四、开发方式

- [x] 独立开发
- [ ] 合作开发
- [ ] 委托开发

## 五、权利范围

- [x] 全部权利
- [ ] 部分权利

## 六、软件用途和技术特点

### 软件用途
${description}

### 主要功能
`;

    features.forEach((feature, i) => {
      form += `${i + 1}. ${feature}\n`;
    });

    form += `
### 技术特点
1. 采用现代化的技术架构，确保系统稳定性和可扩展性
2. 集成先进的AI技术，提供智能化功能
3. 采用异步处理机制，提高系统性能
4. 完善的错误处理和日志记录
5. 支持高并发访问
6. 模块化设计，便于维护和升级

## 七、申请人声明

本人（单位）郑重声明：
1. 本申请表中所填写的内容真实、准确、完整
2. 本软件系原创开发，不存在抄袭、剽窃他人作品的情况
3. 本软件不侵犯任何第三方的知识产权
4. 本人（单位）对申请材料的真实性负责

申请人（盖章/签字）：_______________

日期：${currentDate}

---
注意事项：
1. 本表格需要单面打印
2. 第三页需要盖企业公章或个人签字
3. 软件名称和版本号必须与源代码文档、设计说明书保持一致
4. 源程序量必须写明单位"行"
`;

    const outputFile = path.join(this.outputDir, '软件著作权登记申请表.md');
    await fs.writeFile(outputFile, form, 'utf-8');

    spinner.succeed(chalk.green('申请表已生成'));
  }

  async generateReadme() {
    let readme = `# ${this.moduleInfo.name}

## 软件信息
- 名称：${this.moduleInfo.name}
- 版本：${this.moduleInfo.version}
- 描述：${this.moduleInfo.description}

## 主要功能
`;

    this.moduleInfo.features.forEach(feature => {
      readme += `- ${feature}\n`;
    });

    readme += `
## 技术栈
${this.moduleInfo.techStack}

## 代码统计
- 总代码行数：${this.totalLines}行
- 生成日期：${new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}

## 软著申请材料
本目录包含完整的软件著作权申请材料：
1. 软件著作权登记申请表.md
2. 源代码文档.md
3. 设计说明书.md

## 使用说明
请参考设计说明书了解详细的使用方法。
`;

    const outputFile = path.join(this.outputDir, 'README.md');
    await fs.writeFile(outputFile, readme, 'utf-8');
  }

  async generateAll() {
    console.log(chalk.blue('\n' + '='.repeat(80)));
    console.log(chalk.blue(`开始为 ${this.moduleInfo.name} 生成软著申请材料`));
    console.log(chalk.blue('='.repeat(80) + '\n'));

    await this.collectCode();
    await this.generateSourceCodeDoc();
    await this.generateDesignDoc();
    await this.generateApplicationForm();
    await this.generateReadme();

    console.log(chalk.blue('\n' + '='.repeat(80)));
    console.log(chalk.green('所有材料生成完成！'));
    console.log(chalk.gray(`输出目录: ${this.outputDir}`));
    console.log(chalk.blue('='.repeat(80) + '\n'));
  }
}

async function generateModule(moduleKey, projectRoot, outputDir) {
  const generator = new ModuleCopyrightGenerator(moduleKey, projectRoot, outputDir);
  await generator.generateAll();
}

module.exports = { generateModule, ModuleCopyrightGenerator };
