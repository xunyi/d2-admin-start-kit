// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '页面',
    icon: 'folder-o',
    children: [
      { path: '/page1', title: '页面 1' },
      { path: '/page2', title: '页面 2' },
      { path: '/page3', title: '页面 3' }
    ]
  },
  {
    title: '系统管理',
    icon: 'folder-o',
    children: [
      { path: '/project-management', title: '项目管理' },
      { path: '/base-management', title: '基地管理' },
      { path: '/website-management', title: '网站管理' }
    ]
  },
  {
    title: '数据统计',
    icon: 'folder-o',
    children: [
      { path: 'practice-overview', title: '实践概况' }
    ]
  }
]
