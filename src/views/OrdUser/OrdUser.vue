<template>
  <!--  <p>This is OrdUser.</p>-->
  <div id="head" style="z-index: 1000; position: relative">
    <HeaderOrdUser />
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
  <div id="router" style="z-index: 1">
    <router-view />
  </div>

  <!-- <StoreTable /> -->
</template>

<script>
// import PCenterOrdUser from "@/components/PCenterOrdUser";
import HeaderOrdUser from '@/components/OrdUserComponents/HeaderOrdUser.vue'

export default {
  name: 'OrdUser',
  components: { HeaderOrdUser }
}
</script>

<style scoped>
#head {
  width: 100%;
}
</style>
