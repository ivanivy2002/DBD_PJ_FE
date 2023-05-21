<template>
  <!--  <p>This is Admin.</p>-->
  <div id="head" style="z-index: 1000; position: relative">
    <HeaderAdmin />
  </div>
  <div style="z-index: 1">
    <!--    <AdminAside />-->
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
  <!-- <div class="welcomeAdmin">
    <h1>欢迎来到管理员界面，请选择你接下来的操作😉</h1>
  </div> -->
  <div id="router" style="z-index: 1">
    <router-view />
  </div>
  <!-- <StoreTable /> -->
</template>

<script>
// import PCenterAdmin from "@/components/PCenterAdmin";
import HeaderAdmin from '@/components/AdminComponents/HeaderAdmin.vue'
import AdminAside from '@/components/AdminComponents/AdminAside.vue'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Admin',
  components: { HeaderAdmin, AdminAside }
}
</script>

<style scoped></style>
