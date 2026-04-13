#!/usr/bin/env node

/**
 * 基本使用示例
 * 演示如何在代码中使用 copyright-generator
 */

const { generateCopyright, generateModule, MODULES } = require('../src/index');
const path = require('path');

async function example1() {
  console.log('示例1: 生成整体项目材料\n');
  
  const projectPath = process.cwd();
  const outputDir = path.join(projectPath, 'copyright-output');
  
  try {
    await generateCopyright(projectPath, outputDir);
    console.log('✅ 生成成功！');
  } catch (error) {
    console.error('❌ 生成失败:', error.message);
  }
}

async function example2() {
  console.log('\n示例2: 生成AI模块材料\n');
  
  const projectPath = process.cwd();
  const moduleKey = 'ai-content-generator';
  
  try {
    await generateModule(moduleKey, projectPath);
    console.log('✅ 生成成功！');
  } catch (error) {
    console.error('❌ 生成失败:', error.message);
  }
}

async function example3() {
  console.log('\n示例3: 列出所有可用模块\n');
  
  Object.entries(MODULES).forEach(([key, info]) => {
    console.log(`模块: ${key}`);
    console.log(`  名称: ${info.name}`);
    console.log(`  描述: ${info.description}`);
    console.log('');
  });
}

// 运行示例
async function main() {
  const args = process.argv.slice(2);
  const exampleNum = args[0] || '3';
  
  switch (exampleNum) {
    case '1':
      await example1();
      break;
    case '2':
      await example2();
      break;
    case '3':
      await example3();
      break;
    default:
      console.log('使用方法: node basic-usage.js [1|2|3]');
      console.log('  1 - 生成整体项目材料');
      console.log('  2 - 生成AI模块材料');
      console.log('  3 - 列出所有可用模块');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { example1, example2, example3 };
