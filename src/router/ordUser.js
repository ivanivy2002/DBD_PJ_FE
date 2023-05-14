// import { createRouter, createWebHistory } from 'vue-router'
import PCenterOrdUserView from '../views/OrdUser/PCenterOrdUserView.vue'
import OrdUser from '@/views/OrdUser/OrdUser.vue'
import StoreTableView from '@/views/StoreTableView'
import OrdUserCommodityView from '@/views/OrdUser/OrdUserCommodityView.vue'
import ShoppingCartView from '@/views/OrdUser/ShoppingCartView'
import OrderCreateView from '@/views/OrdUser/Order/OrderCreateView'
import OrderDisplayView from '@/views/Orduser/Order/OrderDisplayView'
import OrderPayView from '@/views/Orduser/Order/OrderPayView'
import OrderDetailView from '@/views/Orduser/Order/OrderDetailView'

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
        name: 'OrdUserCommodityView',
        component: OrdUserCommodityView
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
      },
      {
        path: '/home/orduser/order/create',
        name: 'OrderCreateView',
        component: OrderCreateView
      },
      {
        path: '/home/orduser/order/display',
        name: 'OrderDisplayView',
        component: OrderDisplayView
      },
      {
        path: '/home/orduser/order/pay',
        name: 'OrderPayView',
        component: OrderPayView
      },
      {
        path: '/home/orduser/order/detail',
        name: 'OrderDetailView',
        component: OrderDetailView
      }
    ]
  }
]
