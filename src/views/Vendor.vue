<template>
  <!-- <p>This is Vendor.</p> -->
  <HeaderVendor />
  <router-view />
  <!-- <StoreTable /> -->
</template>

<script>
// import PCenterVendor from "@/components/PCenterVendor";
import HeaderVendor from '@/components/HeaderVendor'

export default {
  name: 'Vendor',
  components: { HeaderVendor }
}
</script>

<style scoped></style>
