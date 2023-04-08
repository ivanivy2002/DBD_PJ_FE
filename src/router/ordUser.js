import { createRouter, createWebHistory } from 'vue-router'
import PCenterView from '../views/User/PCenterView.vue'
import OrdUser from '@/views/OrdUser'
import StoreTableView from '@/views/StoreTableView'

export default [
  {
    // path: '/orduser',
    path: '/home/orduser',
    component: OrdUser,
    children: [
      {
        path: '/home/orduser/store',
        component: StoreTableView
      },
      {
        path: '/home/orduser',
        redirect: '/home/orduser/store'
      },
      {
        path: '/home/orduser/profile',
        name: 'PCenterView',
        component: PCenterView
      }
    ]
  }
]
