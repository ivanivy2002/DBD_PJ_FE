<script>
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from '../components/HelloWorld.vue'
// import Header from "./components/Header.vue";
// import Pageheader from "./components/Pageheader.vue";
import LoginForm from '../components/LoginForm.vue'
import Header from '../components/Header.vue'
import Aside from '../components/Aside.vue'
import Lorem from '../components/Lorem'
import TrueHeader from '@/components/TrueHeader'
import TestRouterHomeExtend from '@/components/TestRouterHomeExtend'

export default {
  name: 'NewHome',
  components: {
    TrueHeader,
    Lorem,
    Header,
    Aside,
    LoginForm,
    TestRouterHomeExtend
  }
}
</script>

<template>
  <!--  <Header id="AppHeader"/>-->
  <!--  <TrueHeader/>-->
  <!--  <Header />-->
  <!--  <div style="display: flex">-->
  <!--    <Aside />-->
  <!--    <router-view style="flex: 1" />-->

  <!--  </div>-->
  <div class="background"></div>
  <!--  <TestRouterHomeExtend />-->

  <div>
    <router-view/>
  </div>
  <!--  <Lorem />-->
  <!--  <RouterView/>-->
</template>

<style>
.background {
  /*background: url('../assets/images/background.jpg') no-repeat center center fixed;*/

  width: 100%; /* 大小设置成100% */
  height: 100%;
  opacity: 30%;
  position: fixed;
  background-size: 100% 100%;
  z-index: -1;
  /*background-size: cover;*/
}
</style>
