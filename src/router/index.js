import Vue from 'vue'
import Router from 'vue-router'
import config from '@/api/config'

Vue.use(Router)
// 配置路由
const router = new Router({
  mode: 'history',
  //  base: '/system/',
  scrollBehavior(to, from, savedPosition) { // 这个功能只在支持 history.pushState 的浏览器中可用。
    // return 期望滚动到哪个的位置
  },
  routes: [
    {
      path: '/',
      redirect: 'board'
    }, {
      path: '/board',
      component: () => import('@/views/Board'), meta: {
        title: config.title
      }
    }, {
      path: '/chartDetail',
      component: () => import('@/views/ChartDetail'), meta: {
        title: '图表详情'
      }
    }, {
      path: '/equipmentStatus',
      component: () => import('@/views/EquipmentStatus'),
      meta: {
        title: config.Statustitle
      }
    }, {
      path: '/equipmentProductionStatus',
      component: () => import('@/views/EquipmentProductionStatus'),
      meta: {
        title: config.productionStatusTitle
      }
    }]
});
// import {app} from "./js/app";
// 全局路由守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next();
});
export default router
