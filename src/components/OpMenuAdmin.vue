<template>
  <el-sub-menu index="2">
    <template #title>操作中心</template>
    <el-menu-item index="2-1" @click="gotoManagePage">管理店面</el-menu-item>
    <el-menu-item index="2-2" @click="gotoStorePage">查看首页</el-menu-item>
  </el-sub-menu>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

export default {
  name: 'OpMenuAdmin',
  methods: {
    gotoManagePage() {
      this.$router.push('/home/admin/manage')
    },
    gotoStorePage() {
      this.$router.push('/home/admin/store')
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
