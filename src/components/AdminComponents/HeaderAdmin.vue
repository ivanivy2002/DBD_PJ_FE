<template>
  <div class="container">
    <div class="header">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
      >
        <Btn87 />

        <div class="flex-grow"></div>
        <div class="welcomeWord">
          <!--                    欢迎 {{ this.userName }}-->
          欢迎, 管理员!
        </div>
        <!-- TODO: logout函数逻辑还没写，这个要配合session -->
        <div class="logout" style="display: flex">
          <Btn76 />
        </div>
        <OpMenuAdmin />
      </el-menu>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import OpMenuAdmin from './OpMenuAdmin.vue'
import Btn76 from '../ui-buttons/Neon.vue'
import Btn87 from '../ui-buttons/CircularCharge.vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'HeaderOrdUser',
  components: { OpMenuAdmin, Btn76, Btn87 },
  data() {
    return {
      userName: '',
      userId: ''
    }
  },
  setup() {
    const activeIndex = ref('1')
    const router = useRouter()

    const handleSelect = (key: string, keyPath: string[]) => {
      console.log(key, keyPath)
    }
    const gotoWelcome = () => {
      router.push('/welcome')
    }
    return {
      activeIndex,
      handleSelect,
      gotoWelcome
    }
  },
  methods: {
    getUserInfo() {
      // 发送请求获取用户信息
      try {
        // TODO: 未做session测试
        console.log(localStorage.getItem('userId')) // 从session中拿数据向后端请求
        // console.log(localStorage.getItem('id')) // 从session中拿数据向后端请求
        const response = axios
          .get('/api/user/displayInfo', {
            params: {
              userId: localStorage.getItem('userId') //获取cookie中的id
            }
          })
          .then((response) => {
            console.log(response)
            //* 拿数据
            this.userName = response.data.data.userName
            // TODO: 如果修改的话需要更新session
            // sessionStorage.setItem('role', response.data.role)
            // sessionStorage.setItem('id', response.data.id)
            // sessionStorage.setItem('userName', response.data.userName)
          })
      } catch (error) {
        console.log(error)
        ElMessage({
          showClose: true,
          type: 'error', //如果失败,未连接上后端
          message: '修改信息失败, 开发问题'
        })
      }
    }
  },
  mounted() {
    // 获取用户信息和余额
    // this.getUserInfo();
  }
}
</script>

<style scoped>
/* General styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  justify-content: center;
}

.flex-grow {
  flex-grow: 1;
}

/* Header styles */
.header {
  /*display: flex;*/

  width: 100%;
  position: fixed; /* 新增的代码 */
  top: 0; /* 新增的代码 */
  left: 0; /* 新增的代码 */
}

.header .el-menu {
  background-color: #91cbcc;
  border: none;
  min-height: 100%;
}

.el-menu-item {
  display: flex;
  align-items: center;
}

.header-logo {
  font-size: 40px;
  font-weight: bold;
  color: #43b9c2;
  margin-right: 15px;
}

/* Menu styles */
.header .el-menu-item.is-active {
  background-color: rgba(128, 255, 242, 0.1);
}

.header .el-menu-item:hover {
  background-color: rgba(128, 255, 242, 0.2);
}

.header .el-menu-item span {
  color: rgba(60, 190, 216, 0.95);
  font-weight: 500;
}
.welcomeWord {
  color: #fcfcfc;
  font-size: 20px;
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-right: 20px;
}
</style>
