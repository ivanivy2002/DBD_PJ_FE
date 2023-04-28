<template>
  <el-sub-menu index="2">
    <template #title>
      <div class="submenu-title">
        <ArrowDown size="18" />
        <span class="submenu-title-text">操作中心</span>
      </div>
    </template>
    <el-menu-item index="2-1" disabled>申请开店</el-menu-item>
    <el-menu-item index="2-2" @click="gotoStorePage">
      <button class="btn btn-outline-primary">查看首页</button>
    </el-menu-item>
    <el-menu-item index="2-3" @click="gotoPCenter">
      <button class="btn btn-outline-primary">个人中心</button>
    </el-menu-item>
    <el-menu-item index="2-4" @click="gotoAddressCenter">
      <button class="btn btn-outline-primary">收货地址管理</button>
    </el-menu-item>
    <el-menu-item index="2-5" @click="gotoShoppingCart">
      <button class="btn btn-outline-primary">查看购物车</button>
    </el-menu-item>
  </el-sub-menu>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

export default {
  name: 'OpMenuOrdUser',
  methods: {
    gotoStorePage() {
      this.$router.push('/home/orduser/store')
    },
    gotoPCenter() {
      this.$router.push('/home/orduser/profile')
    },
    gotoAddressCenter() {
      this.$router.push('/home/orduser/address')
    },
    gotoShoppingCart() {
      this.$router.push('/home/orduser/cart')
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
</style>
