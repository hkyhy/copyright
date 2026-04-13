#!/usr/bin/env node

/**
 * 自定义模块配置示例
 * 演示如何添加自定义模块配置
 */

const { ModuleCopyrightGenerator } = require('../src/module-generator');
const path = require('path');

// 自定义模块配置
const customModule = {
  name: '自定义AI模块',
  version: 'V1.0',
  description: '这是一个自定义的AI模块示例',
  files: [
    'src/custom-module/',
    'server/custom-api.js'
  ],
  features: [
    '功能1：智能数据处理',
    '功能2：自动化分析',
    '功能3：实时监控'
  ],
  techStack: 'Node.js + React + AI'
};

async function generateCustomModule() {
  console.log('生成自定义模块材料\n');
  
  // 临时添加自定义模块到配置
  const { MODULES } = require('../src/module-config');
  MODULES['custom-module'] = customModule;
  
  const projectPath = process.cwd();
  const outputDir = path.join(projectPath, 'copyright-output', 'custom-module');
  
  try {
    const generator = new ModuleCopyrightGenerator('custom-module', projectPath, outputDir);
    await generator.generateAll();
    console.log('✅ 自定义模块材料生成成功！');
  } catch (error) {
    console.error('❌ 生成失败:', error.message);
  }
}

if (require.main === module) {
  generateCustomModule().catch(console.error);
}

module.exports = { customModule, generateCustomModule };
