import { createRouter, createWebHistory } from 'vue-router'
import PCenterView from '../views/User/PCenterView.vue'
import Vendor from '@/views/Vendor'
import StoreInfoView from '@/views/Vendor/StoreInfoView'
import MCenterView from '@/views/Vendor/MCenterView'
import CommodityView from '@/views/Vendor/CommodityView'
import PCenterVendorView from '@/views/Vendor/PCenterVendorView'

export default [
  {
    path: '/home/vendor',
    component: Vendor,
    children: [
      {
        path: '/home/vendor/storeinfo',
        component: StoreInfoView
      },
      {
        path: '/home/vendor/mcenter',
        component: MCenterView
      },
      {
        path: '/home/vendor/commodity',
        component: CommodityView
      },
      {
        path: '/home/vendor/profile',
        name: 'PCenterVendorView',
        component: PCenterVendorView
      }
    ]
  }
]
