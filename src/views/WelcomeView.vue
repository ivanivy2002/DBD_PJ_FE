<template>
  <div class="center" @mouseenter="isHover = true" @mouseleave="isHover = false">
    <h1>Welcome!</h1>
    <h1 id="title" @click="showConfetti">GanSui Mall</h1>
    <br />
    <nav class="routerText">
      <RouterLink to="/about">About</RouterLink>
      <el-divider direction="vertical" border-style="solid" />
      <RouterLink to="/fun">HaveFun</RouterLink>
      <el-divider direction="vertical" border-style="solid" />
      <RouterLink to="/login">Login</RouterLink>
    </nav>
  </div>
</template>

<script>
import JSConfetti from 'js-confetti'
const confetti = new JSConfetti()
export default {
  name: 'Welcome',
  mounted() {
    this.showConfetti()
  },
  methods: {
    showConfetti() {
      confetti.addConfetti()
    }
  }
}
</script>

<style scoped>
/* 导入外部CSS样式 */
@import url(../assets/css/welcome.css);

body {
  margin: 0;
}

.center {
  /* 视口高度的100%*/
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: linear-gradient(to bottom right, #177f7f, #32c8b2);
  color: white;
  /* text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); */
  transition: background 0.5s ease-in-out;
}

/* .center:hover {
  background: linear-gradient(to bottom right, #177f7f, #21c0c0);
} */

h1 {
  font-size: 3em;
  font-weight: bold;
  margin: 0.5em;
}

#title {
  font-size: 5em;
  font-weight: bold;
  margin: 0.5em;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.978);
}

#title:hover {
  transform: scale(1.1) rotate(5deg);
  transition: transform 0.5s ease-in-out;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

nav {
  /* margin-top: 2em; */
  display: flex;
  justify-content: center;
  align-items: center;
}

.routerText a {
  display: inline-block;
  margin: 0 1em;
  padding: 0.75em 1.5em;
  border-radius: 2em;
  background: #21c0c0;
  color: white;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: bold;
  transition: transform 0.2s ease-in-out;
}

.routerText a:hover {
  transform: scale(1.1);
}
</style>
