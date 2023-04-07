<template>
  <el-sub-menu index="2">
    <template #title>操作中心</template>
    <!--    <el-menu-item index="2-1" @click="applyform">申请开店</el-menu-item>-->
    <!-- NOTE: 这个组件的按钮写在组件内部 -->
    <SignForm />
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
    gotoTargetPage() {
      this.$router.push('/home/vendor/storeinfo')
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
