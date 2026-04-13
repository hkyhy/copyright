const fs = require('fs').promises;
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');

class CopyrightGenerator {
  constructor(projectPath, outputDir) {
    this.projectPath = path.resolve(projectPath);
    this.outputDir = outputDir ? path.resolve(outputDir) : path.join(this.projectPath, 'copyright-output');
    this.projectInfo = {};
    this.codeFiles = [];
    this.totalLines = 0;
  }

  async analyzeProject() {
    const spinner = ora('正在分析项目...').start();
    
    try {
      // 读取 package.json
      const packagePath = path.join(this.projectPath, 'package.json');
      try {
        const packageData = JSON.parse(await fs.readFile(packagePath, 'utf-8'));
        this.projectInfo.name = packageData.name || '未命名项目';
        this.projectInfo.version = packageData.version || '1.0.0';
        this.projectInfo.description = packageData.description || '';
      } catch (e) {
        this.projectInfo.name = path.basename(this.projectPath);
        this.projectInfo.version = '1.0.0';
        this.projectInfo.description = '';
      }

      // 读取 README.md
      const readmePath = path.join(this.projectPath, 'README.md');
      try {
        this.projectInfo.readme = await fs.readFile(readmePath, 'utf-8');
      } catch (e) {
        this.projectInfo.readme = '';
      }

      // 扫描代码文件
      await this.scanCodeFiles();

      spinner.succeed(chalk.green('项目分析完成'));
      console.log(chalk.gray(`  项目名称: ${this.projectInfo.name}`));
      console.log(chalk.gray(`  版本号: ${this.projectInfo.version}`));
      console.log(chalk.gray(`  代码文件数: ${this.codeFiles.length}`));
      console.log(chalk.gray(`  总代码行数: ${this.totalLines}`));
    } catch (error) {
      spinner.fail(chalk.red('项目分析失败'));
      throw error;
    }
  }

  async scanCodeFiles() {
    const excludeDirs = new Set(['node_modules', 'build', 'dist', '.git', 'coverage', '__pycache__', 'venv', '.next', 'out']);
    const codeExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.h', '.go', '.rs']);

    const scanDir = async (dir) => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            if (!excludeDirs.has(entry.name) && !entry.name.startsWith('.')) {
              await scanDir(fullPath);
            }
          } else if (entry.isFile()) {
            const ext = path.extname(entry.name);
            if (codeExtensions.has(ext)) {
              try {
                const content = await fs.readFile(fullPath, 'utf-8');
                const lines = content.split('\n').filter(line => line.trim());
                
                if (lines.length > 0) {
                  this.codeFiles.push({
                    path: fullPath,
                    relativePath: path.relative(this.projectPath, fullPath),
                    lines: lines,
                    lineCount: lines.length
                  });
                  this.totalLines += lines.length;
                }
              } catch (e) {
                // 忽略无法读取的文件
              }
            }
          }
        }
      } catch (e) {
        // 忽略无法访问的目录
      }
    };

    await scanDir(this.projectPath);

    // 排序：入口文件优先
    this.codeFiles.sort((a, b) => {
      const aIsIndex = a.relativePath.toLowerCase().includes('index');
      const bIsIndex = b.relativePath.toLowerCase().includes('index');
      const aIsSrc = a.relativePath.includes('src');
      const bIsSrc = b.relativePath.includes('src');
      
      if (aIsIndex && !bIsIndex) return -1;
      if (!aIsIndex && bIsIndex) return 1;
      if (aIsSrc && !bIsSrc) return -1;
      if (!aIsSrc && bIsSrc) return 1;
      return a.relativePath.localeCompare(b.relativePath);
    });
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
    const softwareName = this.projectInfo.name;
    const version = this.projectInfo.version;
    
    const output = [];
    const allCodeLines = [];
    
    // 收集所有代码行
    for (const file of this.codeFiles) {
      allCodeLines.push(`// 文件: ${file.relativePath}`);
      allCodeLines.push(...file.lines);
      allCodeLines.push('');
    }

    // 前30页
    let pageNum = 1;
    let lineCount = 0;
    let pageLines = [];
    
    for (let i = 0; i < Math.min(allCodeLines.length, pagesPerSection * linesPerPage); i++) {
      pageLines.push(allCodeLines[i]);
      lineCount++;
      
      if (lineCount >= linesPerPage) {
        output.push(this.formatPage(softwareName, version, pageNum, pageLines));
        pageNum++;
        lineCount = 0;
        pageLines = [];
        
        if (pageNum > pagesPerSection) break;
      }
    }

    // 分隔标记
    output.push('\n' + '='.repeat(80) + '\n');
    output.push('以下是后30页内容\n');
    output.push('='.repeat(80) + '\n\n');

    // 后30页
    const startIdx = Math.max(0, allCodeLines.length - pagesPerSection * linesPerPage);
    pageNum = 31;
    lineCount = 0;
    pageLines = [];
    
    for (let i = startIdx; i < allCodeLines.length; i++) {
      pageLines.push(allCodeLines[i]);
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
    return outputFile;
  }

  async generateUserManual() {
    const spinner = ora('正在生成用户手册...').start();
    
    const softwareName = this.projectInfo.name;
    const version = this.projectInfo.version;
    const description = this.projectInfo.description || '本软件提供完整的业务功能支持。';
    const currentDate = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const manual = `# ${softwareName} 用户手册

## 软件信息
- 软件名称：${softwareName}
- 版本号：${version}
- 开发日期：${currentDate}

## 一、软件概述

${description}

## 二、运行环境

### 硬件环境
- CPU：Intel Core i5 或更高
- 内存：8GB 或更高
- 硬盘：至少 10GB 可用空间
- 网络：宽带互联网连接

### 软件环境
- 操作系统：Windows 10/11, macOS 10.15+, Linux
- 浏览器：Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Node.js：14.0 或更高版本（如需要）

## 三、安装说明

### 3.1 环境准备
确保系统已安装必要的运行环境。

### 3.2 软件安装
按照安装向导完成软件安装。

### 3.3 配置说明
根据实际需求配置系统参数。

## 四、功能说明

### 4.1 主要功能
系统提供完整的业务功能支持，满足用户各类需求。

### 4.2 操作流程
1. 启动软件
2. 登录系统
3. 使用各项功能
4. 退出系统

## 五、注意事项

1. 首次使用需要进行系统配置
2. 建议定期备份数据
3. 保持网络连接稳定
4. 及时更新软件版本

## 六、技术支持

如有问题，请联系技术支持团队。

---
本文档由 copyright-generator 自动生成
生成日期：${currentDate}
`;

    const outputFile = path.join(this.outputDir, '用户手册.md');
    await fs.writeFile(outputFile, manual, 'utf-8');
    
    spinner.succeed(chalk.green('用户手册已生成'));
    return outputFile;
  }

  async generateApplicationForm() {
    const spinner = ora('正在生成申请表...').start();
    
    const softwareName = this.projectInfo.name;
    const version = this.projectInfo.version;
    const description = this.projectInfo.description || '本软件提供完整的业务功能支持。';
    const currentDate = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const form = `# 计算机软件著作权登记申请表

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

### 3. 源程序文件名
见源代码文档

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

### 5. 邮政编码
【请填写】

### 6. 联系人
【请填写】

### 7. 联系电话
【请填写】

### 8. 电子邮箱
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

主要应用于：
1. 业务流程自动化
2. 数据智能处理
3. 用户服务管理
4. 系统集成与协作
5. 数据分析与可视化

### 技术特点
1. 采用现代化的技术架构，确保系统稳定性和可扩展性
2. 集成AI技术，提供智能化功能
3. 模块化设计，便于维护和升级
4. 完善的错误处理和日志记录
5. 支持高并发访问
6. 良好的用户体验和界面设计

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
3. 软件名称和版本号必须与源代码文档、用户手册保持一致
4. 源程序量必须写明单位"行"
5. 著作权人信息必须填写完整准确
`;

    const outputFile = path.join(this.outputDir, '软件著作权登记申请表.md');
    await fs.writeFile(outputFile, form, 'utf-8');
    
    spinner.succeed(chalk.green('申请表已生成'));
    return outputFile;
  }

  async generateProjectInfo() {
    const info = {
      project_name: this.projectInfo.name,
      version: this.projectInfo.version,
      description: this.projectInfo.description,
      total_lines: this.totalLines,
      total_files: this.codeFiles.length,
      generated_date: new Date().toISOString(),
      output_directory: this.outputDir
    };

    const outputFile = path.join(this.outputDir, '项目信息.json');
    await fs.writeFile(outputFile, JSON.stringify(info, null, 2), 'utf-8');
    
    return outputFile;
  }

  async generateAll() {
    console.log(chalk.blue('\n' + '='.repeat(80)));
    console.log(chalk.blue('开始生成中国软件著作权申请材料'));
    console.log(chalk.blue('='.repeat(80) + '\n'));

    await this.analyzeProject();
    await fs.mkdir(this.outputDir, { recursive: true });
    
    await this.generateSourceCodeDoc();
    await this.generateUserManual();
    await this.generateApplicationForm();
    await this.generateProjectInfo();

    console.log(chalk.blue('\n' + '='.repeat(80)));
    console.log(chalk.green('所有材料生成完成！'));
    console.log(chalk.gray(`输出目录: ${this.outputDir}`));
    console.log(chalk.blue('='.repeat(80) + '\n'));

    console.log(chalk.yellow('下一步操作：'));
    console.log('1. 将Markdown文档转换为Word格式');
    console.log('2. 检查并完善申请表中的著作权人信息');
    console.log('3. 确保所有文档页眉、页码显示正确');
    console.log('4. 单面打印所有文档');
    console.log('5. 准备营业执照复印件和身份证复印件');
    console.log('6. 在申请表第三页盖章或签字');
    console.log('7. 提交至中国版权保护中心\n');
  }
}

async function generateCopyright(projectPath, outputDir) {
  const generator = new CopyrightGenerator(projectPath, outputDir);
  await generator.generateAll();
}

module.exports = { generateCopyright, CopyrightGenerator };
