import { createRouter, createWebHistory } from 'vue-router'
import PCenterOrdUserView from '../views/ordUser/PCenterOrdUserView.vue'
import OrdUser from '@/views/OrdUser'
import StoreTableView from '@/views/StoreTableView'
import ordUserCommodityView from '@/views/ordUser/ordUserCommodityView'
import ShoppingCartView from '@/views/ordUser/ShoppingCartView'

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
        path: '/home/orduser/commodity',
        name: 'ordUserCommodityView',
        component: ordUserCommodityView
      },
      {
        path: '/home/orduser/profile',
        name: 'PCenterOrdUserView',
        component: PCenterOrdUserView
      },
      {
        path: '/home/orduser/cart',
        name: 'ShoppingCartView',
        component: ShoppingCartView
      }
    ]
  }
]
