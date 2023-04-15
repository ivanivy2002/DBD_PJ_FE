import { createRouter, createWebHistory } from 'vue-router'
import vendorRoutes from './vendor.js'
import ordUserRoutes from './ordUser.js'
import adminRoutes from './admin.js'

// import HomeView from '../views/WelcomeView.vue'
// import UserView from '../views/UserView.vue'
import LoginView from '../views/LoginView.vue'
import FunView from '../views/FunView.vue'
import NewHome from '@/views/NewHome'
import WelcomeView from '@/views/WelcomeView'
import AboutView from '@/views/AboutView'
import Admin from '@/views/Admin'
import Vendor from '@/views/Vendor'
import ManageStoreView from '@/views/ManageStoreView'
import StoreMessage from '@/views/StoreMessage'
import StoreTableView from '@/views/StoreTableView'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/welcome',
      // '/welcome',
      name: 'welcome',
      // component: HomeView,
      component: WelcomeView
    },
    {
      path: '/',
      redirect: '/welcome'
    },
    {
      path: '/home',
      name: 'home',
      // component: HomeView,
      component: NewHome,
      children: [
        {
          // path: '/admin',
          path: '/home/admin',
          component: Admin,
          children: [
            {
              path: '/home/admin/manage',
              component: ManageStoreView
            },
            {
              path: '/home/admin/store',
              component: StoreTableView
            },
            {
              path: '/home/admin',
              redirect: '/home/admin/manage'
            }
          ]
        }

        // {
        //   path: '/home/vendor/storeinfo',
        //   component: StoreInfoView
        // },
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/AboutView.vue')
      component: AboutView
    },
    // {
    // path: '/user',
    // name: 'user',
    // component: UserView
    //  we do not use this!
    // },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/fun',
      name: 'fun',
      component: FunView
    },
    // 将 ordUser.js 中定义的路由添加到 routes 数组中
    ...ordUserRoutes,
    ...vendorRoutes,
    ...adminRoutes
  ]
})

// NOTE: 路由守卫，如果没有token，就跳转到登录页面
// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('token')
//   if (!token && to.path !== '/login') {
//     next('/login')
//   } else {
//     next()
//   }
// })

// NOTE: 根据不同的角色，跳转到不同的页面，并且有查看限制
// router.beforeEach((to, from, next) => {
//   //* 在每次路由切换前执行这个函数
//   const token = localStorage.getItem('token')
//   const role = sessionStorage.getItem('role')
//   if (!token && to.path !== '/login') {
//     //* 未登录用户重定向到登录页面
//     // next('/login')
//     next({
//       path: '/login',
//       query: { redirect: to.fullPath, error: '请先登录' }
//     })
//   } else if (to.path.startsWith('/home')) {
//     //* 已登录用户根据角色重定向到不同的页面：1: orduser, 2: vendor, 3: admin
//     if (role == 1 && !to.path.startsWith('/home/orduser')) {
//       //* 普通用户只能访问orduser页面
//       next('/home/orduser')
//     } else if (role == 2 && !to.path.startsWith('/home/vendor')) {
//       next('/home/vendor')
//     } else if (role == 3 && !to.path.startsWith('/home/admin')) {
//       next('/home/admin')
//     } else {
//       next()
//     }
//   } else {
//     next()
//   }
// })

export default router
