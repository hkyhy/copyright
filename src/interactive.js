const inquirer = require('inquirer');
const chalk = require('chalk');
const { generateCopyright } = require('./generator');
const { generateModule } = require('./module-generator');
const { MODULES } = require('./module-config');

async function interactiveMode() {
  console.log(chalk.blue('\n🎯 欢迎使用软件著作权申请材料生成工具\n'));

  const { mode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: '请选择生成模式：',
      choices: [
        { name: '整体项目申请材料', value: 'project' },
        { name: 'AI模块申请材料', value: 'module' },
        { name: '退出', value: 'exit' }
      ]
    }
  ]);

  if (mode === 'exit') {
    console.log(chalk.gray('\n再见！\n'));
    return;
  }

  if (mode === 'project') {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectPath',
        message: '项目路径：',
        default: process.cwd()
      },
      {
        type: 'input',
        name: 'outputDir',
        message: '输出目录：',
        default: './copyright-output'
      }
    ]);

    await generateCopyright(answers.projectPath, answers.outputDir);
  } else if (mode === 'module') {
    const moduleChoices = Object.entries(MODULES).map(([key, info]) => ({
      name: `${info.name} (${key})`,
      value: key
    }));

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'moduleKey',
        message: '选择要生成的模块：',
        choices: moduleChoices
      },
      {
        type: 'input',
        name: 'projectPath',
        message: '项目路径：',
        default: process.cwd()
      },
      {
        type: 'input',
        name: 'outputDir',
        message: '输出目录（留空使用默认）：',
        default: ''
      }
    ]);

    await generateModule(
      answers.moduleKey,
      answers.projectPath,
      answers.outputDir || undefined
    );
  }
}

module.exports = { interactiveMode };
