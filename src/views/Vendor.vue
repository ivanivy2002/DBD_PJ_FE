<template>
  <!-- <p>This is Vendor.</p> -->
  <HeaderVendor />
  <router-view />
  <!-- <StoreTable /> -->
</template>

<script>
// import OpMenuVendor from "@/components/OpMenuVendor";
import HeaderVendor from '@/components/Vendor/HeaderVendor.vue'

export default {
  name: 'Vendor',
  components: { HeaderVendor }
}
</script>

<style scoped></style>
