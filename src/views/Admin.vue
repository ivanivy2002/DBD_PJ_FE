<template>
  <!--  <p>This is Admin.</p>-->
  <HeaderAdmin />
  <router-view />
  <!-- TODO: view和组件覆盖怎么办？ 写一个类似于弹窗的东西？ -->
  <!-- <StoreTable /> -->
</template>

<script>
// import PCenterAdmin from "@/components/PCenterAdmin";
import HeaderAdmin from '@/components/HeaderAdmin'

export default {
  name: 'Admin',
  components: { HeaderAdmin }
}
</script>

<style scoped></style>
