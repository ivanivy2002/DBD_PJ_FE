<template>
  <el-sub-menu index="2">
    <template #title>操作中心</template>
    <!--    <el-menu-item index="2-1" @click="applyform">申请开店</el-menu-item>-->
    <el-menu-item index="2-1" @click="gotoSignForm"> 申请开店</el-menu-item>
    <el-menu-item index="2-2" @click="gotoStoreInfo">查看商店</el-menu-item>
    <el-menu-item index="2-3" @click="gotoPCenter">个人中心</el-menu-item>
    <!-- NOTE: 这个组件的按钮写在组件内部 -->
    <!-- NOTE: 但是现在注释掉了 -->
    <!-- <SignForm /> -->
    <!--         <el-menu-item index="2-2" @click="gotoTargetPage">查看商店</el-menu-item>-->
  </el-sub-menu>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import SignForm from './SignForm.vue'
import LoginForm from './LoginForm.vue'
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'OpMenuVendor',
  components: {
    SignForm,
    LoginForm
  },
  methods: {
    gotoStoreInfo() {
      this.$router.push('/home/vendor/storeinfo')
    },
    gotoPCenter() {
      this.$router.push('/home/vendor/profile')
    },
    gotoSignForm() {
      this.$router.push('/home/vendor/signform')
    }
  },
  data() {
    return {
      session: {
        role: '1',
        id: '',
        userName: ''
      }
    }
  },
  setup() {
    const state = reactive({
      tableData: []
    })
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
