#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
中国软件著作权申请材料自动生成工具
根据项目代码自动生成申请表、源代码文档、用户手册等材料
"""

import os
import sys
import json
import re
from datetime import datetime
from pathlib import Path

class CopyrightDocGenerator:
    def __init__(self, project_path, output_dir=None):
        self.project_path = Path(project_path).resolve()
        self.output_dir = Path(output_dir) if output_dir else self.project_path / 'copyright' / '整体项目材料'
        self.project_info = {}
        self.code_files = []
        self.total_lines = 0
        
    def analyze_project(self):
        """分析项目结构和信息"""
        print("正在分析项目...")
        
        # 读取 package.json
        package_json_path = self.project_path / 'package.json'
        if package_json_path.exists():
            with open(package_json_path, 'r', encoding='utf-8') as f:
                package_data = json.load(f)
                self.project_info['name'] = package_data.get('name', '未命名项目')
                self.project_info['version'] = package_data.get('version', '1.0.0')
                self.project_info['description'] = package_data.get('description', '')
        
        # 读取 README.md
        readme_path = self.project_path / 'README.md'
        if readme_path.exists():
            with open(readme_path, 'r', encoding='utf-8') as f:
                self.project_info['readme'] = f.read()
        
        # 扫描代码文件
        self._scan_code_files()
        
        print(f"项目名称: {self.project_info.get('name')}")
        print(f"版本号: {self.project_info.get('version')}")
        print(f"代码文件数: {len(self.code_files)}")
        print(f"总代码行数: {self.total_lines}")
        
    def _scan_code_files(self):
        """扫描项目中的代码文件"""
        exclude_dirs = {'node_modules', 'build', 'dist', '.git', 'coverage', '__pycache__', 'venv'}
        code_extensions = {'.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.h'}
        
        for root, dirs, files in os.walk(self.project_path):
            # 排除不需要的目录
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                if Path(file).suffix in code_extensions:
                    file_path = Path(root) / file
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            lines = f.readlines()
                            # 去除空行
                            non_empty_lines = [line for line in lines if line.strip()]
                            if non_empty_lines:
                                self.code_files.append({
                                    'path': file_path,
                                    'relative_path': file_path.relative_to(self.project_path),
                                    'lines': non_empty_lines,
                                    'line_count': len(non_empty_lines)
                                })
                                self.total_lines += len(non_empty_lines)
                    except Exception as e:
                        print(f"警告: 无法读取文件 {file_path}: {e}")
        
        # 按重要性排序：入口文件 > src目录 > 其他
        self.code_files.sort(key=lambda x: (
            0 if 'index' in str(x['relative_path']).lower() else
            1 if 'src' in str(x['relative_path']) else 2,
            str(x['relative_path'])
        ))

    
    def generate_source_code_doc(self):
        """生成源代码文档（前30页+后30页）"""
        print("正在生成源代码文档...")
        
        lines_per_page = 50
        total_pages = 60
        pages_per_section = 30
        
        output = []
        software_name = self.project_info.get('name', '软件名称')
        version = self.project_info.get('version', 'V1.0')
        
        # 收集所有代码行
        all_code_lines = []
        for file_info in self.code_files:
            all_code_lines.append(f"// 文件: {file_info['relative_path']}\n")
            all_code_lines.extend(file_info['lines'])
            all_code_lines.append("\n")
        
        # 生成前30页
        current_page = 1
        line_count = 0
        page_content = []
        
        for line in all_code_lines[:pages_per_section * lines_per_page]:
            page_content.append(line.rstrip())
            line_count += 1
            
            if line_count >= lines_per_page:
                output.append(self._format_page(software_name, version, current_page, page_content))
                current_page += 1
                line_count = 0
                page_content = []
                
                if current_page > pages_per_section:
                    break
        
        # 添加分隔标记
        output.append("\n" + "="*80 + "\n")
        output.append("以下是后30页内容\n")
        output.append("="*80 + "\n\n")
        
        # 生成后30页
        start_index = max(0, len(all_code_lines) - pages_per_section * lines_per_page)
        current_page = 31
        line_count = 0
        page_content = []

        
        for line in all_code_lines[start_index:]:
            page_content.append(line.rstrip())
            line_count += 1
            
            if line_count >= lines_per_page:
                output.append(self._format_page(software_name, version, current_page, page_content))
                current_page += 1
                line_count = 0
                page_content = []
        
        # 如果最后一页不足50行，也要输出
        if page_content:
            output.append(self._format_page(software_name, version, current_page, page_content))
        
        # 保存文档
        output_file = self.output_dir / '源代码文档.md'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(output))
        
        print(f"源代码文档已生成: {output_file}")
        return output_file
    
    def _format_page(self, software_name, version, page_num, lines):
        """格式化单页内容"""
        header = f"{software_name} {version}                                                    第 {page_num} 页"
        separator = "-" * 80
        content = '\n'.join(lines)
        return f"{header}\n{separator}\n{content}\n\n"
    
    def generate_user_manual(self):
        """生成用户手册"""
        print("正在生成用户手册...")
        
        software_name = self.project_info.get('name', '软件名称')
        version = self.project_info.get('version', 'V1.0')
        description = self.project_info.get('description', '')
        
        manual_content = f"""# {software_name} 用户手册

## 软件信息
- 软件名称：{software_name}
- 版本号：{version}
- 开发日期：{datetime.now().strftime('%Y年%m月')}

## 一、软件概述

{description if description else '本软件是一款基于人工智能技术的面试系统，提供智能面试、数字人视频生成、面试报告等功能。'}


## 二、运行环境

### 硬件环境
- CPU：Intel Core i5 或更高
- 内存：8GB 或更高
- 硬盘：至少 10GB 可用空间
- 网络：宽带互联网连接

### 软件环境
- 操作系统：Windows 10/11, macOS 10.15+, Linux
- 浏览器：Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Node.js：14.0 或更高版本（开发环境）
- 数据库：SQLite 3.x 或 PostgreSQL 12+

## 三、主要功能

### 3.1 用户认证与管理
- 用户注册与登录
- 验证码发送与验证
- 权限管理（管理员、客户管理员、普通用户）
- 用户信息管理

### 3.2 面试项目管理
- 创建和配置面试项目
- 设置面试问题和流程
- 批量邀请候选人
- 项目状态管理（开启/关闭）

### 3.3 智能题库管理
- 题目创建与编辑
- 基于职位描述的AI智能生成题目
- 追问题目自动生成
- 题目分类和检索
- 多语言支持（中文/英文）

### 3.4 数字人视频生成
- 集成蝉镜API数字人技术
- 为面试题目自动生成数字人视频
- 支持多个数字人形象选择
- 异步任务处理和进度监控
- 视频生成状态实时反馈

### 3.5 视频面试功能
- 实时视频面试
- 设备检测（摄像头、麦克风）
- 面试录制与回放
- 面试引导流程
- 问卷调查集成

### 3.6 面试报告生成
- 自动生成面试报告
- 人才盘点报告
- 数据统计与分析
- 报告下载和分享

### 3.7 反馈管理
- 候选人反馈收集
- 反馈统计分析
- 反馈查看和管理

## 四、操作说明

### 4.1 管理员操作

#### 4.1.1 系统初始化
1. 访问系统初始化页面：http://localhost:3040/admin/initAdmin
2. 注册管理员账户
3. 配置系统基本信息

#### 4.1.2 题库管理
1. 登录管理后台
2. 进入"题库管理"模块
3. 点击"新增题目"或"AI生成题目"
4. 填写题目信息或输入职位描述
5. 保存题目

#### 4.1.3 数字人视频生成
1. 在题库列表中选择题目
2. 点击"生成数字人视频"按钮
3. 选择数字人形象
4. 确认生成，系统自动处理
5. 查看生成进度和结果


#### 4.1.4 面试项目创建
1. 进入"项目管理"模块
2. 点击"创建项目"
3. 填写项目信息（名称、描述、面试类型）
4. 选择面试题目
5. 配置面试流程
6. 保存并开启项目

#### 4.1.5 邀请候选人
1. 进入项目详情页
2. 点击"邀请候选人"
3. 输入候选人信息（姓名、手机号、邮箱）
4. 批量导入或单个添加
5. 发送邀请链接

### 4.2 候选人操作

#### 4.2.1 接受面试邀请
1. 收到邀请链接或邀请码
2. 点击链接或输入邀请码
3. 填写个人信息
4. 进入面试流程

#### 4.2.2 设备检测
1. 允许浏览器访问摄像头和麦克风
2. 测试设备是否正常
3. 调整设备设置
4. 确认进入面试

#### 4.2.3 视频面试
1. 阅读面试引导
2. 查看题目和准备时间
3. 开始录制回答
4. 提交答案
5. 完成所有题目

#### 4.2.4 查看结果
1. 完成面试后查看结果页
2. 填写反馈问卷（如有）
3. 等待面试结果通知

## 五、技术架构

### 5.1 前端技术栈
- React 18.2.0
- React Router 6.22.2
- Ant Design 5.14.2
- Styled Components
- Axios
- WebRTC (Agora/TRTC)

### 5.2 后端技术栈
- Node.js
- Fastify
- Sequelize ORM
- SQLite/PostgreSQL
- 蝉镜数字人API
- Coze AI API

### 5.3 核心模块
- 用户认证模块
- 题库管理模块
- 数字人视频生成模块
- 视频面试模块
- 报告生成模块
- 任务调度模块

## 六、注意事项

1. 首次使用需要配置环境变量（.env文件）
2. 数字人视频生成需要配置蝉镜API密钥
3. AI题目生成需要配置Coze API密钥
4. 视频面试需要稳定的网络连接
5. 建议使用Chrome浏览器以获得最佳体验

## 七、常见问题

### 7.1 视频无法录制
- 检查浏览器权限设置
- 确认摄像头和麦克风正常工作
- 尝试刷新页面重新授权

### 7.2 数字人视频生成失败
- 检查蝉镜API配置是否正确
- 确认API额度是否充足
- 查看任务日志获取详细错误信息

### 7.3 题目生成失败
- 检查Coze API配置
- 确认职位描述是否清晰
- 检查网络连接

## 八、技术支持

如有问题，请联系技术支持团队。

---
本文档由软件著作权申请材料自动生成工具生成
生成日期：{datetime.now().strftime('%Y年%m月%d日')}
"""
        
        output_file = self.output_dir / '用户手册.md'
        self.output_dir.mkdir(parents=True, exist_ok=True)
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(manual_content)
        
        print(f"用户手册已生成: {output_file}")
        return output_file

    
    def generate_application_form(self):
        """生成软件著作权登记申请表"""
        print("正在生成申请表...")
        
        software_name = self.project_info.get('name', '软件名称')
        version = self.project_info.get('version', 'V1.0')
        description = self.project_info.get('description', '')
        
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

### 8. 首次发表国家/地区
中国

## 二、源程序信息

### 1. 源程序量
{self.total_lines}行

### 2. 主要编程语言
JavaScript/TypeScript

### 3. 源程序文件名
见源代码文档

### 4. 软件开发平台
Node.js + React

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
{description if description else '本软件是一款基于人工智能技术的智能面试系统，用于企业招聘面试场景。'}

主要应用于：
1. 企业招聘面试
2. 人才评估与筛选
3. 面试流程自动化
4. 数字人视频面试
5. 面试数据分析

### 技术特点
1. 采用React前端框架，提供流畅的用户体验
2. 集成WebRTC技术，实现实时视频面试
3. 接入AI大模型，智能生成面试题目和追问
4. 集成数字人技术，自动生成数字人面试视频
5. 采用前后端分离架构，支持高并发访问
6. 使用Sequelize ORM，支持多种数据库
7. 异步任务处理机制，提高系统性能

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
3. 软件名称和版本号必须与源代码文档、用户手册保持一致
4. 源程序量必须写明单位"行"
5. 著作权人信息必须填写完整准确
"""
        
        output_file = self.output_dir / '软件著作权登记申请表.md'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(form_content)
        
        print(f"申请表已生成: {output_file}")
        return output_file

    
    def generate_project_info(self):
        """生成项目信息JSON文件"""
        info = {
            'project_name': self.project_info.get('name'),
            'version': self.project_info.get('version'),
            'description': self.project_info.get('description'),
            'total_lines': self.total_lines,
            'total_files': len(self.code_files),
            'generated_date': datetime.now().isoformat(),
            'output_directory': str(self.output_dir)
        }
        
        output_file = self.output_dir / '项目信息.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(info, f, ensure_ascii=False, indent=2)
        
        print(f"项目信息已生成: {output_file}")
        return output_file
    
    def generate_all(self):
        """生成所有申请材料"""
        print("\n" + "="*80)
        print("开始生成中国软件著作权申请材料")
        print("="*80 + "\n")
        
        # 分析项目
        self.analyze_project()
        
        # 创建输出目录
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # 生成各类文档
        self.generate_source_code_doc()
        self.generate_user_manual()
        self.generate_application_form()
        self.generate_project_info()
        
        print("\n" + "="*80)
        print("所有材料生成完成！")
        print(f"输出目录: {self.output_dir}")
        print("="*80 + "\n")
        
        print("下一步操作：")
        print("1. 将Markdown文档转换为Word格式")
        print("2. 检查并完善申请表中的著作权人信息")
        print("3. 确保所有文档页眉、页码显示正确")
        print("4. 单面打印所有文档")
        print("5. 准备营业执照复印件和身份证复印件")
        print("6. 在申请表第三页盖章或签字")
        print("7. 提交至中国版权保护中心\n")

def main():
    if len(sys.argv) < 2:
        print("使用方法: python3 generate_copyright_docs.py <项目路径> [输出目录]")
        print("示例: python3 generate_copyright_docs.py . ./copyright-output")
        sys.exit(1)
    
    project_path = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else None
    
    generator = CopyrightDocGenerator(project_path, output_dir)
    generator.generate_all()

if __name__ == '__main__':
    main()
