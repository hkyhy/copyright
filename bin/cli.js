#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const { generateCopyright } = require('../src/generator');
const { generateModule } = require('../src/module-generator');
const { interactiveMode } = require('../src/interactive');
const packageJson = require('../package.json');

const program = new Command();

program
  .name('copyright-gen')
  .description('中国软件著作权申请材料自动生成工具')
  .version(packageJson.version);

// 生成整体项目材料
program
  .command('generate')
  .description('为整个项目生成软著申请材料')
  .option('-p, --path <path>', '项目路径', process.cwd())
  .option('-o, --output <output>', '输出目录', './copyright-output')
  .action(async (options) => {
    try {
      console.log(chalk.blue('\n🚀 开始生成软件著作权申请材料...\n'));
      await generateCopyright(options.path, options.output);
      console.log(chalk.green('\n✅ 所有材料生成完成！\n'));
    } catch (error) {
      console.error(chalk.red('\n❌ 生成失败:'), error.message);
      process.exit(1);
    }
  });

// 生成模块材料
program
  .command('module <moduleName>')
  .description('为独立AI模块生成软著申请材料')
  .option('-p, --path <path>', '项目路径', process.cwd())
  .option('-o, --output <output>', '输出目录')
  .action(async (moduleName, options) => {
    try {
      console.log(chalk.blue(`\n🚀 开始为模块 ${moduleName} 生成申请材料...\n`));
      await generateModule(moduleName, options.path, options.output);
      console.log(chalk.green('\n✅ 模块材料生成完成！\n'));
    } catch (error) {
      console.error(chalk.red('\n❌ 生成失败:'), error.message);
      process.exit(1);
    }
  });

// 列出可用模块
program
  .command('list-modules')
  .description('列出所有可用的AI模块')
  .action(() => {
    const { MODULES } = require('../src/module-config');
    console.log(chalk.blue('\n📦 可用的AI模块:\n'));
    Object.entries(MODULES).forEach(([key, info]) => {
      console.log(chalk.yellow(`  ${key}`));
      console.log(chalk.gray(`    名称: ${info.name}`));
      console.log(chalk.gray(`    描述: ${info.description}\n`));
    });
  });

// 交互式模式
program
  .command('init')
  .description('交互式配置并生成申请材料')
  .action(async () => {
    try {
      await interactiveMode();
    } catch (error) {
      console.error(chalk.red('\n❌ 操作失败:'), error.message);
      process.exit(1);
    }
  });

program.parse();
