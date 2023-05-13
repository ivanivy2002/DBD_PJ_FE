<template>
  <el-sub-menu index="2" class="OpMenuButton">
    <template #title>
      <div class="submenu-title">
        <span class="submenu-title-text">操作中心</span>
      </div>
    </template>
    <el-menu-item index="2-4" @click="gotoStorePage">
      <button class="btn btn-outline-primary">查看首页</button>
    </el-menu-item>
    <el-menu-item index="2-1" @click="gotoStoreManagePage">
      <button class="btn btn-outline-primary">管理店铺</button>
    </el-menu-item>
    <el-menu-item index="2-2" @click="gotoCommodityRegManagePage">
      <button class="btn btn-outline-primary">管理商品上架</button>
    </el-menu-item>
    <el-menu-item index="2-3" @click="gotoCommodityChangeInfoManagePage">
      <button class="btn btn-outline-primary">管理商品信息修改</button>
    </el-menu-item>
    <el-menu-item index="2-6" @click="gotoManageMoneyPage">
      <button class="btn btn-outline-primary">管理账户</button>
    </el-menu-item>
    <el-menu-item index="2-4" @click="gotoCashFlowRecordPage">
      <button class="btn btn-outline-primary">查看流水</button>
    </el-menu-item>
    <el-menu-item index="2-5" @click="gotoActivityPage">
      <button class="btn btn-outline-primary">查看活动</button>
    </el-menu-item>
    <el-menu-item index="2-7" @click="gotoManageStoreActivityPage">
      <button class="btn btn-outline-primary">查看商店参加活动</button>
    </el-menu-item>
  </el-sub-menu>
</template>

<script lang="ts">
// import { ElMessage } from 'element-plus'
// import { ArrowDown } from '@element-plus/icons-vue'

export default {
  name: 'OpMenuAdmin',
  methods: {
    gotoStoreManagePage() {
      this.$router.push('/home/admin/manage')
    },
    gotoStorePage() {
      this.$router.push('/home/admin/store')
    },
    gotoCommodityTablePage() {
      this.$router.push('/home/admin/commodityTable')
    },
    gotoCommodityRegManagePage() {
      this.$router.push('/home/admin/commodityReg')
    },
    gotoCommodityChangeInfoManagePage() {
      this.$router.push('/home/admin/commodityChangeInfo')
    },
    gotoManageMoneyPage() {
      this.$router.push('/home/admin/manageMoney')
    },
    gotoCashFlowRecordPage() {
      this.$router.push('/home/admin/cashFlowRecord')
    },
    gotoActivityPage() {
      this.$router.push('/home/admin/activityManage')
    },
    gotoManageStoreActivityPage() {
      this.$router.push('/home/admin/manageStoreActivity')
    }
  },
  setup() {
    // const handleCommand = (command: string | number | object) => {
    //   ElMessage(`click on item ${command}`)
    // }
    return {
      // handleCommand
    }
  }
}
</script>

<style scoped>
.submenu-title {
  display: flex;
  align-items: center;
}

.submenu-title svg {
  margin-right: 6px;
}

.submenu-title-text {
  color: #ffffff;
  font-size: 18px;
  margin-left: 6px;
  /*font-family: Apple;*/
  font-weight: bold;
}

.submenu-title-text:hover {
  color: #4befc3;
}

.el-menu-demo .el-menu-item,
.el-menu-demo .el-submenu__title {
  color: #4befc3;
  font-size: 14px;
}

.el-menu-demo .el-menu-item.is-active,
.el-menu-demo .el-submenu.is-active > .el-submenu__title {
  background-color: #4a5568;
}

.el-menu-demo .el-menu-item:hover,
.el-submenu__title .btn:hover {
  background-color: #4a5568;
}

.el-menu-demo .el-menu-item.is-disabled {
  color: #ccc;
}

.btn {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  /* border-radius: 0.25rem; */
  cursor: pointer;
  color: #1ddbec;
  background-color: #2c3e50;
  border-color: #ffffff;
}

.btn:hover {
  background-color: #2de9ef;
  border-color: #ffffff;
}

.btn:focus,
.btn.focus {
  box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.5);
}

.btn-outline-primary {
  background-color: transparent;
  color: #2de9ef;
  border-color: #13cbd1;
  font-weight: bold;
}

.btn-outline-primary:hover {
  background-color: #2de9ef;
  color: #1dc8de;
  border-color: #ffffff;
}
.OpMenuButton:hover .submenu-title-text {
  color: #4befc3;
}
</style>
