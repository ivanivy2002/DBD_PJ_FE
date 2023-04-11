<template>
  <div class="Header" id="headerLight">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#ffffff"
      text-color="#000000"
      active-text-color="#53A6FC"
      @select="handleSelect"
      style="flex: 1"
    >
      <el-menu-item index="1">Processing Center</el-menu-item>
      <el-sub-menu index="2">
        <template #title>Workspace</template>
        <el-menu-item index="2-1">item one</el-menu-item>
        <el-menu-item index="2-2">item two</el-menu-item>
        <el-menu-item index="2-3">item three</el-menu-item>
        <el-sub-menu index="2-4">
          <template #title>item four</template>
          <el-menu-item index="2-4-1">item one</el-menu-item>
          <el-menu-item index="2-4-2">item two</el-menu-item>
          <el-menu-item index="2-4-3">item three</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
      <el-button type="primary" id="loginButton" @click="login">Login/Sign up</el-button>
      <!--      <el-menu-item index="3" id="loginButton">Login/Sign up</el-menu-item>-->
      <el-menu-item index="4">Orders</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { ref } from 'vue'

const activeIndex = ref('1')
const activeIndex2 = ref('1')
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}
export default {
  name: 'Header'
}
</script>

<style scoped>
.Header {
  /*position: fixed;*/

  /*box-sizing: border-box;*/
  top: 0;
  /*float:right;*/
  right: 0;
  /*width: 100%;*/
  /*background-color: #fff;*/
  /*padding: 20px;*/
  /*z-index: 1;*/
}

#headerLight {
  /*display: grid;*/
  box-sizing: border-box;
}

#loginButton {
  color: aqua;
}
</style>
