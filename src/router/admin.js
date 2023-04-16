// import { createRouter, createWebHistory } from 'vue-router'
import Admin from '@/views/Admin'
import StoreTableView from '@/views/StoreTableView'
import ManageMoneyView from '@/views/Admin/ManageMoneyView'
import ManageStoreView from '@/views/Admin/ManageStoreView.vue'
import CommodityRegView from '@/views/Admin/CommodityRegView.vue'
import CommodityChangeInfoView from '@/views/Admin/CommodityChangeInfoView.vue'
// import CommodityTableView from '@/views/CommodityTableView.vue'
import AdminCommodityView from '@/views/Admin/adminCommodityView.vue'
import CashFlowRecordView from '@/views/Admin/CashFlowRecordView.vue'

export default [
  {
    // path: '/orduser',
    path: '/home/admin',
    component: Admin,
    children: [
      {
        path: '/home/admin/money',
        name: 'ManageMoneyView',
        component: ManageMoneyView
      },
      {
        path: '/home/admin/manage',
        component: ManageStoreView
      },
      {
        path: '/home/admin/store',
        component: StoreTableView
      },
      {
        path: '/home/admin/commodityTable',
        component: AdminCommodityView
      },
      {
        path: '/home/admin/commodityReg',
        component: CommodityRegView
      },
      {
        path: '/home/admin/commodityChangeInfo',
        component: CommodityChangeInfoView
      },
      {
        path: '/home/admin/manageMoney',
        component: ManageMoneyView
      },
      {
        path: '/home/admin/cashFlowRecord',
        component: CashFlowRecordView
      },
      {
        path: '/home/admin',
        redirect: '/home/admin/manage'
      }
    ]
  }
]
