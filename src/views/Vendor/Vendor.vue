<template>
  <!-- <p>This is Vendor.</p> -->
  <div id="head" style="z-index: 10000; position: relative">
    <HeaderVendor />
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
  <!-- <div class="welcomeVendor">
    <h1>欢迎来到商家界面，请开始你的表演🥳</h1>
  </div> -->
  <div id="router" style="z-index: 1">
    <router-view />
  </div>
  <!-- <StoreTable /> -->
</template>

<script>
// import OpMenuVendor from "@/components/OpMenuVendor";
import HeaderVendor from '@/components/VendorComponents/HeaderVendor.vue'

export default {
  name: 'Vendor',
  components: { HeaderVendor }
}
</script>

<style scoped></style>
