#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI模块软件著作权申请材料生成工具
为独立的AI功能模块生成软著申请材料
"""

import os
import sys
import json
from datetime import datetime
from pathlib import Path

# 模块配置
MODULES = {
    'ai-question-generator': {
        'name': 'AI智能面试题目生成系统',
        'version': 'V1.0',
        'description': '基于大语言模型的智能面试题目生成系统，支持根据职位描述自动生成结构化面试题目和追问题目',
        'files': [
            'server/libs/services/question.js',
            'server/libs/controllers/admin-question.js',
            'server/libs/models/question.js',
            'src/components/Admin/Question/',
            'src/components/Common/Question/'
        ],
        'features': [
            '基于职位描述的AI智能题目生成',
            '集成Coze大语言模型API',
            '自动生成追问题目',
            '多语言支持（中英文）',
            '题目分类和智能检索',
            '批量题目创建',
            '题目模板管理'
        ],
        'tech_stack': 'Node.js + Fastify + Coze AI API + React + Ant Design'
    },
    'digital-video-generator': {
        'name': '数字人视频自动生成系统',
        'version': 'V1.0',
        'description': '基于蝉镜API的数字人视频自动生成系统，支持文本转数字人视频、异步任务处理和实时进度监控',
        'files': [
            'server/libs/tasks/digital/',
            'server/libs/services/digital.js',
            'server/libs/controllers/admin-digital.js',
            'server/libs/models/digital.js',
            'server/libs/models/question-digital.js',
            'src/components/Admin/Digital/'
        ],
        'features': [
            '文本转数字人视频',
            '集成蝉镜数字人API',
            '多数字人形象支持',
            '异步任务处理',
            '实时进度监控',
            '自动回调处理',
            '智能错误重试',
            'AccessToken自动管理'
        ],
        'tech_stack': 'Node.js + Fastify + 蝉镜API + React + Ant Design'
    },
    'video-interview-system': {
        'name': '智能视频面试系统',
        'version': 'V1.0',
        'description': '基于WebRTC的智能视频面试系统，支持实时视频面试、设备检测、面试录制和流程自动化',
        'files': [
            'src/components/Interview/',
            'server/libs/services/interview.js',
            'server/libs/controllers/interview.js'
        ],
        'features': [
            'WebRTC实时视频通信',
            '智能设备检测和配置',
            '面试流程自动化引导',
            '视频录制和存储',
            '多种面试类型支持',
            '问卷调查集成',
            '面试结果实时反馈'
        ],
        'tech_stack': 'React + WebRTC + Agora/TRTC + Node.js + Fastify'
    },
    'interview-report-system': {
        'name': 'AI面试报告生成系统',
        'version': 'V1.0',
        'description': '智能面试数据分析和报告生成系统，支持多维度数据分析、可视化图表和人才盘点',
        'files': [
            'src/components/Report/',
            'src/components/InventoryReport/',
            'src/components/Common/Feedback/Statistics/'
        ],
        'features': [
            '面试数据智能分析',
            '自动生成面试报告',
            '人才盘点报告',
            '数据可视化图表',
            '多维度评估',
            '报告下载和分享',
            '统计数据展示'
        ],
        'tech_stack': 'React + Chart.js + Ant Design + Node.js'
    },
    'task-scheduler-system': {
        'name': '智能任务调度系统',
        'version': 'V1.0',
        'description': '分布式智能任务调度系统，支持异步任务处理、状态管理、进度监控和自动重试',
        'files': [
            'server/libs/tasks/',
            'server/libs/services/task.js',
            'server/libs/models/task.js',
            'src/components/Common/Task/'
        ],
        'features': [
            '分布式任务调度',
            '异步任务处理',
            '任务状态管理',
            '实时进度监控',
            '智能失败重试',
            '任务优先级管理',
            '高并发处理',
            '任务日志记录'
        ],
        'tech_stack': 'Node.js + Fastify + Sequelize + SQLite/PostgreSQL'
    }
}


class ModuleCopyrightGenerator:
    def __init__(self, module_key, project_root='.'):
        if module_key not in MODULES:
            raise ValueError(f"未知模块: {module_key}. 可用模块: {', '.join(MODULES.keys())}")
        
        self.module_key = module_key
        self.module_info = MODULES[module_key]
        self.project_root = Path(project_root).resolve()
        self.output_dir = self.project_root / 'copyright' / 'AI模块材料' / module_key
        self.code_lines = []
        self.total_lines = 0
        
    def collect_code(self):
        """收集模块相关的代码文件"""
        print(f"\n正在收集 {self.module_info['name']} 的代码...")
        
        for file_pattern in self.module_info['files']:
            file_path = self.project_root / file_pattern
            
            if file_path.is_file():
                self._read_file(file_path)
            elif file_path.is_dir():
                self._read_directory(file_path)
            else:
                print(f"警告: 路径不存在 {file_path}")
        
        print(f"收集完成，共 {self.total_lines} 行代码")
    
    def _read_file(self, file_path):
        """读取单个文件"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
                non_empty_lines = [line.rstrip() for line in lines if line.strip()]
                if non_empty_lines:
                    self.code_lines.append(f"// 文件: {file_path.relative_to(self.project_root)}\n")
                    self.code_lines.extend([line + '\n' for line in non_empty_lines])
                    self.code_lines.append("\n")
                    self.total_lines += len(non_empty_lines)
        except Exception as e:
            print(f"警告: 无法读取 {file_path}: {e}")
    
    def _read_directory(self, dir_path):
        """递归读取目录中的代码文件"""
        code_extensions = {'.js', '.jsx', '.ts', '.tsx', '.py', '.java'}
        
        for file_path in dir_path.rglob('*'):
            if file_path.is_file() and file_path.suffix in code_extensions:
                self._read_file(file_path)

    
    def generate_source_code_doc(self):
        """生成源代码文档"""
        print("正在生成源代码文档...")
        
        lines_per_page = 50
        pages_per_section = 30
        
        software_name = self.module_info['name']
        version = self.module_info['version']
        
        output = []
        
        # 前30页
        output.append(f"# {software_name} 源代码文档\n\n")
        output.append("## 前30页\n\n")
        
        page_num = 1
        line_count = 0
        page_lines = []
        
        for line in self.code_lines[:pages_per_section * lines_per_page]:
            page_lines.append(line.rstrip())
            line_count += 1
            
            if line_count >= lines_per_page:
                output.append(self._format_page(software_name, version, page_num, page_lines))
                page_num += 1
                line_count = 0
                page_lines = []
                
                if page_num > pages_per_section:
                    break
        
        # 后30页
        output.append("\n" + "="*80 + "\n")
        output.append("## 后30页\n\n")
        
        start_idx = max(0, len(self.code_lines) - pages_per_section * lines_per_page)
        page_num = 31
        line_count = 0
        page_lines = []
        
        for line in self.code_lines[start_idx:]:
            page_lines.append(line.rstrip())
            line_count += 1
            
            if line_count >= lines_per_page:
                output.append(self._format_page(software_name, version, page_num, page_lines))
                page_num += 1
                line_count = 0
                page_lines = []
        
        if page_lines:
            output.append(self._format_page(software_name, version, page_num, page_lines))
        
        output_file = self.output_dir / '源代码文档.md'
        self.output_dir.mkdir(parents=True, exist_ok=True)
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(output))
        
        print(f"源代码文档已生成: {output_file}")

    
    def _format_page(self, software_name, version, page_num, lines):
        """格式化页面"""
        header = f"{software_name} {version}                                                    第 {page_num} 页"
        separator = "-" * 80
        content = '\n'.join(lines)
        return f"{header}\n{separator}\n{content}\n\n"
    
    def generate_design_doc(self):
        """生成设计说明书"""
        print("正在生成设计说明书...")
        
        software_name = self.module_info['name']
        version = self.module_info['version']
        description = self.module_info['description']
        features = self.module_info['features']
        tech_stack = self.module_info['tech_stack']
        
        doc_content = f"""# {software_name} 设计说明书

## 软件信息
- 软件名称：{software_name}
- 版本号：{version}
- 开发日期：{datetime.now().strftime('%Y年%m月')}

## 一、引言

### 1.1 编写目的
本文档详细描述{software_name}的设计方案，包括系统架构、功能模块、技术实现等内容，为软件开发和维护提供技术依据。

### 1.2 项目背景
{description}

### 1.3 术语定义
- AI：人工智能（Artificial Intelligence）
- API：应用程序接口（Application Programming Interface）
- WebRTC：网页即时通信（Web Real-Time Communication）
- ORM：对象关系映射（Object-Relational Mapping）

## 二、系统概述

### 2.1 系统目标
{description}

### 2.2 技术架构
{tech_stack}

### 2.3 系统特点
"""
        
        for i, feature in enumerate(features, 1):
            doc_content += f"{i}. {feature}\n"
        
        doc_content += f"""

## 三、功能设计

### 3.1 功能模块划分
"""
        
        for i, feature in enumerate(features, 1):
            doc_content += f"\n#### 3.1.{i} {feature}\n"
            doc_content += f"实现{feature}的核心功能，提供完整的业务流程支持。\n"


        doc_content += """

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
文档生成日期：{datetime.now().strftime('%Y年%m月%d日')}
"""
        
        output_file = self.output_dir / '设计说明书.md'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(doc_content)
        
        print(f"设计说明书已生成: {output_file}")

    
    def generate_application_form(self):
        """生成申请表"""
        print("正在生成申请表...")
        
        software_name = self.module_info['name']
        version = self.module_info['version']
        description = self.module_info['description']
        
        form_content = f"""# 计算机软件著作权登记申请表

## 一、软件基本信息

### 1. 软件全称
{software_name}

### 2. 软件简称
{software_name}

### 3. 软件版本号
{version}

### 4. 软件分类
应用软件

### 5. 开发完成日期
{datetime.now().strftime('%Y年%m月%d日')}

### 6. 首次发表日期
{datetime.now().strftime('%Y年%m月%d日')}

### 7. 发表状态
- [ ] 已发表
- [x] 未发表

## 二、源程序信息

### 1. 源程序量
{self.total_lines}行

### 2. 主要编程语言
JavaScript/TypeScript

### 3. 技术架构
{self.module_info['tech_stack']}

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
{description}

### 主要功能
"""
        
        for i, feature in enumerate(self.module_info['features'], 1):
            form_content += f"{i}. {feature}\n"
        
        form_content += f"""

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

日期：{datetime.now().strftime('%Y年%m月%d日')}

---
注意事项：
1. 本表格需要单面打印
2. 第三页需要盖企业公章或个人签字
3. 软件名称和版本号必须与源代码文档、设计说明书保持一致
4. 源程序量必须写明单位"行"
"""
        
        output_file = self.output_dir / '软件著作权登记申请表.md'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(form_content)
        
        print(f"申请表已生成: {output_file}")
    
    def generate_readme(self):
        """生成README文件"""
        readme_content = f"""# {self.module_info['name']}

## 软件信息
- 名称：{self.module_info['name']}
- 版本：{self.module_info['version']}
- 描述：{self.module_info['description']}

## 主要功能
"""
        
        for feature in self.module_info['features']:
            readme_content += f"- {feature}\n"
        
        readme_content += f"""

## 技术栈
{self.module_info['tech_stack']}

## 代码统计
- 总代码行数：{self.total_lines}行
- 生成日期：{datetime.now().strftime('%Y年%m月%d日')}

## 软著申请材料
本目录包含完整的软件著作权申请材料：
1. 软件著作权登记申请表.md
2. 源代码文档.md
3. 设计说明书.md

## 使用说明
请参考设计说明书了解详细的使用方法。
"""
        
        output_file = self.output_dir / 'README.md'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(readme_content)
        
        print(f"README已生成: {output_file}")
    
    def generate_all(self):
        """生成所有材料"""
        print("\n" + "="*80)
        print(f"开始为 {self.module_info['name']} 生成软著申请材料")
        print("="*80)
        
        self.collect_code()
        self.generate_source_code_doc()
        self.generate_design_doc()
        self.generate_application_form()
        self.generate_readme()
        
        print("\n" + "="*80)
        print("所有材料生成完成！")
        print(f"输出目录: {self.output_dir}")
        print("="*80 + "\n")

def main():
    if len(sys.argv) < 2:
        print("使用方法: python3 generate_module_copyright.py <模块名称>")
        print("\n可用模块:")
        for key, info in MODULES.items():
            print(f"  - {key}: {info['name']}")
        sys.exit(1)
    
    module_key = sys.argv[1]
    project_root = sys.argv[2] if len(sys.argv) > 2 else '.'
    
    try:
        generator = ModuleCopyrightGenerator(module_key, project_root)
        generator.generate_all()
    except Exception as e:
        print(f"错误: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
