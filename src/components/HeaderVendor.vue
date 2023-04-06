<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="0">
      <el-image style="width: 100px; height: 100px" :src="imageUrl" />
    </el-menu-item>
    <div class="flex-grow" />
    <!--    <el-menu-item index="1">Processing Center</el-menu-item>-->
    <!--    <el-sub-menu index="2">-->
    <OpMenuVendor />
    <!--    </el-sub-menu>-->
  </el-menu>
</template>

<script lang="ts">
import { ref } from 'vue'
import OpMenuVendor from './OpMenuVendor.vue'

export default {
  name: 'HeaderVendor',
  components: { OpMenuVendor },

  setup() {
    const activeIndex = ref('1')
    const handleSelect = (key: string, keyPath: string[]) => {
      console.log(key, keyPath)
    }
    const imageFitsText = ['fill', 'contain', 'cover', 'none', 'scale-down']
    const imageUrl = '../../src/assets/images/GanSui.jpg'
    return {
      activeIndex,
      handleSelect,
      imageFitsText,
      imageUrl
    }
  }
}
</script>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
