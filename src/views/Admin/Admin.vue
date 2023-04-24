<template>
  <!--  <p>This is Admin.</p>-->
  <HeaderAdmin />
  <router-view />
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
