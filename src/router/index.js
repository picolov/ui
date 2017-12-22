import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      meta: {label: 'menu.home'},
      name: 'Home',
      component: () => import('@/containers/Full'),
      children: [
        {
          path: 'dashboard',
          meta: {label: 'menu.dashboard'},
          name: 'Dashboard',
          component: () => import('@/views/Dashboard')
        },
        {
          path: 'contractAgreement',
          meta: {label: 'menu.contractagreement'},
          name: 'Contract Agreement',
          component: () => import('@/views/ContractAgreement')
        },
        {
          path: 'project',
          meta: {label: 'menu.project'},
          name: 'Project',
          component: () => import('@/views/Project')
        },
        {
          path: 'quotation',
          meta: {label: 'menu.quotation'},
          name: 'Quotation',
          component: () => import('@/views/Quotation')
        },
        {
          path: 'shipment',
          meta: {label: 'menu.shipment'},
          name: 'Shipment',
          component: () => import('@/views/Shipment')
        },
        {
          path: 'receivables',
          meta: {label: 'menu.receivables'},
          name: 'Receivables',
          component: () => import('@/views/Receivables')
        },
        {
          path: 'payables',
          meta: {label: 'menu.payables'},
          name: 'Payables',
          component: () => import('@/views/Payables')
        },
        {
          path: 'clients',
          meta: {label: 'menu.clients'},
          name: 'Clients',
          component: () => import('@/views/Clients')
        },
        {
          path: 'vendors',
          meta: {label: 'menu.vendors'},
          name: 'Vendors',
          component: () => import('@/views/Vendors')
        },
        {
          path: 'systemSetup',
          meta: {label: 'menu.systemsetup'},
          name: 'System Setup',
          component: () => import('@/views/SystemSetup')
        },
        {
          path: 'setting',
          meta: {label: 'menu.setting'},
          name: 'Setting',
          component: () => import('@/views/Setting')
        },
        {
          path: 'accountManagement',
          meta: {label: 'menu.accountManagement'},
          name: 'Account Management',
          component: () => import('@/views/AccountManagement'),
          props: (route) => ({ action: route.query.action })
        },
        {
          path: 'businessProfile',
          meta: {label: 'menu.businessProfile'},
          name: 'Business Profile',
          component: () => import('@/views/BusinessProfile')
        },
        {
          path: 'serviceOffering',
          meta: {label: 'menu.serviceOffering'},
          name: 'Service & Offering',
          component: () => import('@/views/ServiceOffering')
        },
        {
          path: 'notifChat',
          meta: {label: 'menu.notifChat'},
          name: 'Notification & Chats',
          component: () => import('@/views/NotifChat')
        }
      ]
    }
  ]
})
