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
import { useRouter } from 'vue-router'
import OpMenuAdmin from './OpMenuAdmin.vue'
import Btn76 from '../ui-buttons/Neon.vue'
import Btn87 from '../ui-buttons/CircularCharge.vue'

export default {
  name: 'HeaderOrdUser',
  components: { OpMenuAdmin, Btn76, Btn87 },

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
  width: 100%;
  position: fixed; /* 新增的代码 */
  top: 0; /* 新增的代码 */
  left: 0; /* 新增的代码 */
}

.header .el-menu {
  background-image: linear-gradient(to right, #32c8b2, #30d4c0);
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
  color: #2bbb9e;
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
  color: #2795d9;
  font-weight: 500;
}
</style>
