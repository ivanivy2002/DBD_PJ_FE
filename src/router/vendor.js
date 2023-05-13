// import { createRouter, createWebHistory } from 'vue-router'
import Vendor from '@/views/Vendor/Vendor.vue'
import StoreInfoView from '@/views/Vendor/StoreInfoView'
import MCenterView from '@/views/Vendor/MCenterView'
import CommodityView from '@/views/Vendor/CommodityView'
import PCenterVendorView from '@/views/Vendor/PCenterVendorView'
import SignFormView from '@/views/Vendor/SignFormView'
import PicUploadTest from '@/views/Vendor/PicUploadTest'
// import CommodityTableView from '@/views/CommodityTableView.vue'
import VendorCommodityView from '@/views/Vendor/VendorCommodityView.vue'
import StoreTableView from '@/views/StoreTableView.vue'
import OrderManageView from '@/views/Vendor/Order/OrderManageView'
import VendorActivity from '@/views/Vendor/VendorActivity.vue'

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
        path: '/home/vendor/commodityTable',
        component: VendorCommodityView
      },
      {
        path: '/home/vendor/profile',
        name: 'PCenterVendorView',
        component: PCenterVendorView
      },
      {
        path: '/home/vendor/store',
        component: StoreTableView
      },
      {
        path: '/home/vendor/signform',
        name: 'SignFormView',
        component: SignFormView
      },
      {
        path: '/home/vendor/pic',
        name: 'PicUploadTest',
        component: PicUploadTest
      },
      {
        path: '/home/vendor/order/manage',
        name: 'OrderManageView',
        component: OrderManageView
      },
      {
        path: '/home/vendor/activity',
        name: 'VendorActivity',
        component: VendorActivity
      }
    ]
  }
]
