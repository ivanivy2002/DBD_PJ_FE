<template>
  <el-sub-menu index="2">
    <template #title>操作中心</template>
    <el-menu-item index="2-1" disabled>申请开店</el-menu-item>
    <el-menu-item index="2-2" @click="gotoStorePage">查看首页</el-menu-item>
    <el-menu-item index="2-3" @click="gotoPCenter">个人中心</el-menu-item>
    <el-menu-item index="2-4" @click="gotoShoppingCart">查看购物车</el-menu-item>
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
    gotoShoppingCart() {
      this.$router.push('/home/orduser/shoppingcart')
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
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
