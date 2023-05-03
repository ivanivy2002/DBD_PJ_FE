<script>
// import { RouterLink, RouterView } from 'vue-router'
// import TrueHeader from '@/components/TrueHeader'
import 'element-plus/theme-chalk/index.css'
export default {
  name: 'LayOut'
  // components: { TrueHeader }
}
</script>

<template>
  <!-- <el-defaults :style="{ color: '#409EFF', theme: 'light' }"></el-defaults> -->
  <!--  This is a test sentence.-->
  <!--  <TrueHeader />-->
  <router-view style="flex: 1" />

  <!--  <RouterView/>-->
</template>

<style>
/*#AppHeader {*/
/*  float: right;*/
/*}*/
body {
  /* 去掉浏览器四周的白边 */
  margin: auto;
}
</style>
