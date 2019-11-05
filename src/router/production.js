/**
 *  生产环境路由
 */

let proRouter = [
  {
    path: '/buildingDict',
    name: '楼盘字典',
    component: () => import('@/views/buildingDict/index.vue')
  },
]
export default proRouter
