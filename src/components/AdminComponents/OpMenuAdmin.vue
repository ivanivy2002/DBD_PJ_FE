<template>
  <el-sub-menu index="2" class="OpMenuButton">
    <template #title>
      <div class="OpMenuButton">
        <span class="OpMenuButton">操作中心</span>
      </div>
    </template>
    <el-menu-item index="2-4" @click="gotoStorePage">查看首页</el-menu-item>
    <el-menu-item index="2-1" @click="gotoStoreManagePage">管理店面</el-menu-item>
    <el-menu-item index="2-2" @click="gotoCommodityRegManagePage">管理商品上架</el-menu-item>
    <el-menu-item index="2-3" @click="gotoCommodityChangeInfoManagePage"
      >管理商品信息修改</el-menu-item
    >
    <el-menu-item index="2-3" @click="gotoManageMoneyPage">查看商城账户</el-menu-item>
    <el-menu-item index="2-3" @click="gotoCashFlowRecordPage">查看流水</el-menu-item>
  </el-sub-menu>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

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
    }
  },
  setup() {
    const handleCommand = (command: string | number | object) => {
      ElMessage(`click on item ${command}`)
    }
    return {
      handleCommand
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
  color: #fff;
  font-size: 16px;
  margin-left: 6px;
}

.el-menu-demo .el-menu-item,
.el-menu-demo .el-submenu__title {
  color: #fff;
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
  border-radius: 0.25rem;
  cursor: pointer;
  color: #fff;
  background-color: #2c3e50;
  border-color: #2c3e50;
}

.btn:hover {
  background-color: #3498db;
  border-color: #3498db;
}

.btn:focus,
.btn.focus {
  box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.5);
}

.btn-outline-primary {
  background-color: transparent;
  color: #3498db;
  border-color: #3498db;
}

.btn-outline-primary:hover {
  background-color: #3498db;
  color: #fff;
  border-color: #3498;
}

.OpMenuButton {
  color: rgba(255, 255, 255, 0.71);
  font-size: 16px;
  margin-left: 6px;
}

.OpMenuButton:hover {
  color: rgba(1, 0, 73, 0.75);
  font-size: 16px;
  margin-left: 6px;
}
</style>
