<script>
// import { RouterLink, RouterView } from 'vue-router'
// import TheWelcome from '../components/TheWelcome.vue'
// import HelloWorld from '../components/HelloWorld.vue'
export default {
  name: 'Welcome'
}
</script>

<template>
  <div class="background"></div>

  <div class="center">
    <h1>Welcome!</h1>
    <h1>GanSui Mall</h1>
    <br />
    <nav class="routerText">
      <!-- <RouterLink to="/">Home</RouterLink> -->
      <RouterLink to="/about">About</RouterLink>
      <el-divider direction="vertical" border-style="solid" />
      <RouterLink to="/fun">HaveFun</RouterLink>
      <el-divider direction="vertical" border-style="solid" />
      <RouterLink to="/login">Login</RouterLink>
    </nav>
  </div>
  <!--  <TheWelcome />-->
</template>

<style scoped>
/* 背景图片 */
a {
  display: inline-block;
  padding: 0.5em 1em;
  /*background-color: #fff;*/
  color: #333;
  text-decoration: none;
}

a:hover {
  border-radius: 4px;
  border: 1px solid rgba(83, 166, 252, 0.55);
  background-color: rgba(83, 166, 252, 0.51);
  /*border-color: #999;*/
}

/*a + a:before {*/
/*  !*:after*!*/
/*  content: "";*/
/*  display: inline-block;*/
/*  width: 1px;*/
/*  height: 1em;*/
/*  margin-right: 1.5em;*/
/*      !*calc((100% / 3) - 0.5em - 1px);*!*/
/*  margin-left: 0.1em;*/
/*  background-color: #ccc;*/
/*  vertical-align: middle;*/
/*}*/
.center {
  padding-top: 10em;
  display: flex;
  justify-content: center;
  align-items: center;
  /*height: 100vh;*/
  flex-direction: column;
}

.background {
  background: url('../assets/images/background.jpg') no-repeat center center fixed;

  width: 100%; /* 大小设置成100% */
  height: 100%;
  opacity: 30%;
  position: fixed;
  background-size: 100% 100%;
  z-index: -1;
  /*background-size: cover;*/
}

.routerText {
  font-weight: bold;
  font-size: 20px;
}
</style>
