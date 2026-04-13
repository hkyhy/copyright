const MODULES = {
  'ai-content-generator': {
    name: 'AI智能内容生成系统',
    version: 'V1.0',
    description: '基于大语言模型的智能内容生成系统，支持根据用户需求自动生成结构化内容和扩展内容',
    files: [
      'server/libs/services/content.js',
      'server/libs/controllers/admin-content.js',
      'server/libs/models/content.js',
      'src/components/Admin/Content/',
      'src/components/Common/Content/'
    ],
    features: [
      '基于需求描述的AI智能内容生成',
      '集成大语言模型API',
      '自动生成扩展内容',
      '多语言支持（中英文）',
      '内容分类和智能检索',
      '批量内容创建',
      '内容模板管理'
    ],
    techStack: 'Node.js + Fastify + AI API + React + Ant Design'
  },
  'digital-media-generator': {
    name: '数字媒体自动生成系统',
    version: 'V1.0',
    description: '基于AI的数字媒体自动生成系统，支持文本转媒体内容、异步任务处理和实时进度监控',
    files: [
      'server/libs/tasks/media/',
      'server/libs/services/media.js',
      'server/libs/controllers/admin-media.js',
      'server/libs/models/media.js',
      'server/libs/models/content-media.js',
      'src/components/Admin/Media/'
    ],
    features: [
      '文本转数字媒体内容',
      '集成第三方AI媒体API',
      '多种媒体形式支持',
      '异步任务处理',
      '实时进度监控',
      '自动回调处理',
      '智能错误重试',
      'AccessToken自动管理'
    ],
    techStack: 'Node.js + Fastify + AI Media API + React + Ant Design'
  },
  'video-communication-system': {
    name: '智能视频通信系统',
    version: 'V1.0',
    description: '基于WebRTC的智能视频通信系统，支持实时视频通话、设备检测、视频录制和流程自动化',
    files: [
      'src/components/Video/',
      'server/libs/services/video.js',
      'server/libs/controllers/video.js'
    ],
    features: [
      'WebRTC实时视频通信',
      '智能设备检测和配置',
      '通信流程自动化引导',
      '视频录制和存储',
      '多种通信模式支持',
      '问卷调查集成',
      '通信结果实时反馈'
    ],
    techStack: 'React + WebRTC + Agora/TRTC + Node.js + Fastify'
  },
  'data-report-system': {
    name: 'AI数据报告生成系统',
    version: 'V1.0',
    description: '智能数据分析和报告生成系统，支持多维度数据分析、可视化图表和数据洞察',
    files: [
      'src/components/Report/',
      'src/components/DataReport/',
      'src/components/Common/Analytics/Statistics/'
    ],
    features: [
      '数据智能分析',
      '自动生成分析报告',
      '数据洞察报告',
      '数据可视化图表',
      '多维度评估',
      '报告下载和分享',
      '统计数据展示'
    ],
    techStack: 'React + Chart.js + Ant Design + Node.js'
  },
  'task-scheduler-system': {
    name: '智能任务调度系统',
    version: 'V1.0',
    description: '分布式智能任务调度系统，支持异步任务处理、状态管理、进度监控和自动重试',
    files: [
      'server/libs/tasks/',
      'server/libs/services/task.js',
      'server/libs/models/task.js',
      'src/components/Common/Task/'
    ],
    features: [
      '分布式任务调度',
      '异步任务处理',
      '任务状态管理',
      '实时进度监控',
      '智能失败重试',
      '任务优先级管理',
      '高并发处理',
      '任务日志记录'
    ],
    techStack: 'Node.js + Fastify + Sequelize + SQLite/PostgreSQL'
  }
};

module.exports = { MODULES };
