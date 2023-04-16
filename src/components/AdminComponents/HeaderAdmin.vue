<template>
  <div class="header">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
    >
      <el-menu-item index="0">
        <span class="header-logo">GansuiMall</span>
      </el-menu-item>
      <div class="flex-grow"></div>
      <OpMenuAdmin />
    </el-menu>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import OpMenuAdmin from './OpMenuAdmin.vue'

export default {
  name: 'HeaderAdmin',
  components: { OpMenuAdmin },

  setup() {
    const activeIndex = ref('1')
    const handleSelect = (key: string, keyPath: string[]) => {
      console.log(key, keyPath)
    }
    return {
      activeIndex,
      handleSelect
    }
  }
}
</script>

<style scoped>
.header {
  background-color: #1f2d3d;
  padding: 20px;
}

.el-menu-demo {
  background-color: #1f2d3d;
  border: none;
}

.el-menu-demo .el-menu-item,
.el-menu-demo .el-submenu__title {
  color: #fff;
  font-size: 16px;
}

.el-menu-demo .el-menu-item.is-active,
.el-menu-demo .el-submenu.is-active > .el-submenu__title {
  background-color: #4a5568;
}

.el-menu-demo .el-menu-item:hover,
.el-menu-demo .el-submenu__title:hover {
  background-color: #4a5568;
}

.header-logo {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}

.btn {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  cursor: pointer;
  color: #fff;
  border-color: #4a5568;
}

.btn:hover {
  background-color: #4a5568;
  border-color: #4a5568;
}

.btn:focus,
.btn.focus {
  box-shadow: 0 0 0 0.2rem rgba(74, 85, 104, 0.5);
}

.btn-outline-primary {
  background-color: transparent;
  color: #4a5568;
  border-color: #4a5568;
}

.btn-outline-primary:hover {
  background-color: #4a5568;
  color: #fff;
  border-color: #4a5568;
}
</style>
