import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Opus 代码动画导演课',
  description: '用 Claude Opus 5.5 写代码做科普与动态图形视频：技术 / 导演 / 编剧三线并进',
  cleanUrls: true,
  // 本机开发用 '/'；GitHub Pages 部署时由工作流设置 BASE=/opus-animation-course/
  base: process.env.BASE ?? '/',
  themeConfig: {
    nav: [
      { text: '课程地图', link: '/roadmap' },
      { text: '社区在讨论什么', link: '/community' },
      { text: '爆款拆片库', link: '/cases' },
      { text: '风格专题', link: '/style/' },
      { text: '速查表', link: '/cheatsheets/prompt' },
    ],
    sidebar: [
      {
        text: '开始',
        items: [
          { text: '课程地图', link: '/roadmap' },
          { text: '社区在讨论什么', link: '/community' },
          { text: '爆款拆片库', link: '/cases' },
        ],
      },
      {
        text: '第一阶段 · 基础',
        items: [
          { text: 'M0 心智模型与环境', link: '/m00/' },
          { text: 'M1 时间即函数', link: '/m01/' },
          { text: 'M2 拆片与复刻', link: '/m02/' },
          { text: 'M3 编剧 I：科普叙事', link: '/m03/' },
        ],
      },
      {
        text: '专题 · 视频风格',
        items: [
          { text: '导读：风格到底是什么', link: '/style/' },
          { text: '风格卡片库（16 种）', link: '/style/cards' },
          { text: '使用方法', link: '/style/workflow' },
          { text: '练习', link: '/style/practice' },
        ],
      },
      {
        text: '第二阶段 · 导演工作流',
        collapsed: false,
        items: [
          { text: 'M4 导演 I：视觉语言', link: '/m04/' },
          { text: 'M5 导演工作流', link: '/m05/' },
          { text: 'M6 声音', link: '/m06/' },
          { text: 'M7 项目一：90s 科普短片', link: '/m07/' },
        ],
      },
      {
        text: '第三阶段 · 动态图形与 3D 🚧',
        collapsed: false,
        items: [
          { text: 'M8 动态图形 & Remotion', link: '/m08/' },
          { text: 'M9 项目二：30s 宣传片', link: '/m09/' },
          { text: 'M10 Blender I：脚本化 3D', link: '/m10/' },
          { text: 'M11 Blender II：3D × 2D 合成', link: '/m11/' },
          { text: 'M12 毕业作品与工业化', link: '/m12/' },
        ],
      },
      {
        text: '速查表',
        items: [
          { text: '提示词骨架 & 改片口令', link: '/cheatsheets/prompt' },
          { text: '影视 / 动效术语', link: '/cheatsheets/terms' },
          { text: '审片清单', link: '/cheatsheets/checklist' },
          { text: '踩坑表', link: '/cheatsheets/pitfalls' },
        ],
      },
    ],
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一课', next: '下一课' },
    darkModeSwitchLabel: '外观',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: { noResultsText: '没有找到', resetButtonTitle: '清除', footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' } },
        },
      },
    },
  },
})
