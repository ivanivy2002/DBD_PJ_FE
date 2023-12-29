// import { createRouter, createWebHistory } from 'vue-router'
import Admin from '@/views/Admin/Admin.vue'
import StoreTableView from '@/views/StoreTableView'
import ManageMoneyView from '@/views/Admin/ManageMoneyView'
import ManageStoreView from '@/views/Admin/ManageStoreView.vue'
import CommodityRegView from '@/views/Admin/CommodityRegView.vue'
import CommodityChangeInfoView from '@/views/Admin/CommodityChangeInfoView.vue'
// import CommodityTableView from '@/views/CommodityTableView.vue'
import AdminCommodityView from '@/views/Admin/AdminCommodityView.vue'
import ManageUserView from '@/views/Admin/ManageUserView.vue'
// import CashFlowRecordView from '@/views/Admin/CashFlowRecordView.vue'
import ActivityManage from '@/views/Admin/Activity/ActivityManage.vue'
import PresetFormView from '@/views/Admin/Activity/PresetFormView.vue'
import ManageStoreActivityView from '@/views/Admin/Activity/ManageStoreActivityView.vue'
import AdminActivity from '@/views/Admin/Activity/AdminActivity.vue'
import AdminCashFlowView from '@/views/Admin/cashFlow/AdminCashFlowView.vue'

export default [
  {
    // path: '/orduser',
    path: '/home/admin',
    component: Admin,
    children: [
      {
        path: '/home/admin/manageUser',
        name: 'ManageUserView',
        component: ManageUserView
      },
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
      // {
      //   path: '/home/admin/cashFlowRecord',
      //   component: CashFlowRecordView
      // },
      {
        // [Table] Manage All activity
        path: '/home/admin/activityManage',
        component: ActivityManage
      },
      {
        // [Form-post] Preset activity
        path: '/home/admin/presetForm',
        component: PresetFormView
      },
      {
        // [Form-get] show specific activity
        path: '/home/admin/activity',
        component: AdminActivity
      },
      {
        path: '/home/admin/manageStoreActivity',
        component: ManageStoreActivityView
      },
      {
        path: '/home/admin/cashflow',
        component: AdminCashFlowView
      }

      // TODO: 这里和vendor保持一致
      // {
      //   path: '/home/admin',
      //   redirect: '/home/admin/manage'
      // }
    ]
  }
]
