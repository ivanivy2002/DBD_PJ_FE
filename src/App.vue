<script>
// import { RouterLink, RouterView } from 'vue-router'
import TrueHeader from '@/components/TrueHeader'

export default {
  name: 'LayOut',
  components: { TrueHeader }
}
</script>

<template>
  <!--  This is a test sentence.-->
  <!--  <TrueHeader />-->
  <router-view style="flex: 1" />

  <!--  <RouterView/>-->
</template>

<style>
/*#AppHeader {*/
/*  float: right;*/
/*}*/
</style>
