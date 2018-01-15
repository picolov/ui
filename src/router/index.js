import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  // linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/page/dashboard',
      meta: {label: 'menu_home'},
      name: 'Home',
      component: () => import('@/containers/Full'),
      children: [
        {
          path: 'page/:page/:arg?',
          component: () => import('@/views/GenericPage')
        }
      ]
    }
  ]
})
