<template>
  <el-sub-menu index="2">
    <template #title>
      <div class="submenu-title">
        <span class="submenu-title-text">操作中心</span>
      </div>
    </template>
    <el-menu-item index="2-1" @click="gotoSignForm">
      <button class="btn btn-outline-primary">申请开店</button>
    </el-menu-item>
    <el-menu-item index="2-2" @click="gotoStoreInfo">
      <button class="btn btn-outline-primary">店铺信息</button>
    </el-menu-item>
    <el-menu-item index="2-3" @click="gotoPCenter">
      <button class="btn btn-outline-primary">个人中心</button>
    </el-menu-item>
    <el-menu-item index="2-4" @click="gotoStorePage">
      <button class="btn btn-outline-primary">查看首页</button>
    </el-menu-item>
  </el-sub-menu>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import SignForm from './SignForm.vue'
import LoginForm from '../LoginForm.vue'
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
.submenu-title {
  display: flex;
  align-items: center;
}

.submenu-title svg {
  margin-right: 6px;
}

.submenu-title-text {
  color: #ffffff;
  font-size: 16px;
  margin-left: 6px;
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
</style>
