<template>
  <!--  <p>This is Admin.</p>-->
  <div id="head" style="z-index: 10000">
    <HeaderAdmin />
  </div>
  <!-- TODO: 手动添加边距（？或许需要修正 -->
  <div>
    <br />
    <br />
    <br />
    <br />
    <br />
  </div>
  <!-- BUG: 滚轮上滑的时候有的元素会在顶栏上方，有的元素在下方 -->
  <!-- TODO: 可能的解决方案是让每个页面不要滚动 -->
  <div class="welcomeAdmin">
    <h1>欢迎来到管理员界面，请选择你接下来的操作😉</h1>
  </div>
  <div id="router" style="z-index: 1">
    <router-view />
  </div>
  <!-- <StoreTable /> -->
</template>

<script>
// import PCenterAdmin from "@/components/PCenterAdmin";
import HeaderAdmin from '@/components/AdminComponents/HeaderAdmin.vue'

export default {
  name: 'Admin',
  components: { HeaderAdmin }
}
</script>

<style scoped></style>
