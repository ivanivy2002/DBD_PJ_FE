<template>
  <!--  <p>This is OrdUser.</p>-->
  <HeaderOrdUser />
  <router-view />
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

<style scoped></style>
