<template>
  <el-sub-menu index="2">
    <template #title>
      <div class="OpMenuButton">
        <span class="OpMenuButton">操作中心</span>
      </div>
    </template>
    <el-menu-item index="2-1" @click="gotoSignForm"> 申请开店</el-menu-item>
    <el-menu-item index="2-2" @click="gotoStoreInfo">查看商店</el-menu-item>
    <el-menu-item index="2-3" @click="gotoPCenter">个人中心</el-menu-item>
    <el-menu-item index="2-4" @click="gotoStorePage">查看首页</el-menu-item>
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
    gotoStorePage() {
      this.$router.push('/home/vendor/store')
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
