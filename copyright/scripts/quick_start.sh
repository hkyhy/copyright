#!/bin/bash
# 软著申请材料快速生成脚本

echo "=================================="
echo "中国软件著作权申请材料生成工具"
echo "=================================="
echo ""

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "错误: 未找到 python3，请先安装 Python 3"
    exit 1
fi

echo "请选择生成类型："
echo "1. 生成整个项目的软著材料"
echo "2. 生成AI模块的软著材料"
echo ""
read -p "请输入选项 (1 或 2): " choice

case $choice in
    1)
        echo ""
        echo "正在为整个项目生成软著材料..."
        python3 copyright/scripts/generate_copyright_docs.py . ./copyright/整体项目材料
        ;;
    2)
        echo ""
        echo "可用的AI模块："
        echo "  1. ai-question-generator - AI智能面试题目生成系统"
        echo "  2. digital-video-generator - 数字人视频自动生成系统"
        echo "  3. video-interview-system - 智能视频面试系统"
        echo "  4. interview-report-system - AI面试报告生成系统"
        echo "  5. task-scheduler-system - 智能任务调度系统"
        echo "  6. all - 生成所有模块"
        echo ""
        read -p "请输入模块编号或名称: " module_choice
        
        case $module_choice in
            1|ai-question-generator)
                python3 copyright/scripts/generate_module_copyright.py ai-question-generator .
                ;;
            2|digital-video-generator)
                python3 copyright/scripts/generate_module_copyright.py digital-video-generator .
                ;;
            3|video-interview-system)
                python3 copyright/scripts/generate_module_copyright.py video-interview-system .
                ;;
            4|interview-report-system)
                python3 copyright/scripts/generate_module_copyright.py interview-report-system .
                ;;
            5|task-scheduler-system)
                python3 copyright/scripts/generate_module_copyright.py task-scheduler-system .
                ;;
            6|all)
                echo "正在生成所有模块的软著材料..."
                python3 copyright/scripts/generate_module_copyright.py ai-question-generator .
                python3 copyright/scripts/generate_module_copyright.py digital-video-generator .
                python3 copyright/scripts/generate_module_copyright.py video-interview-system .
                python3 copyright/scripts/generate_module_copyright.py interview-report-system .
                python3 copyright/scripts/generate_module_copyright.py task-scheduler-system .
                ;;
            *)
                echo "无效的选项"
                exit 1
                ;;
        esac
        ;;
    *)
        echo "无效的选项"
        exit 1
        ;;
esac

echo ""
echo "=================================="
echo "生成完成！"
echo "=================================="
echo ""
echo "下一步："
echo "1. 查看生成的文件"
echo "2. 将Markdown转换为Word格式"
echo "3. 填写著作权人信息"
echo "4. 准备附件材料"
echo "5. 提交申请"
echo ""
