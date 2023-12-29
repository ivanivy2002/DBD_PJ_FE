<template>
  <div class="center" @mouseenter="isHover = true" @mouseleave="isHover = false">
    <div class="content">
      <h1>Welcome!</h1>
      <h1 id="title" @click="showConfetti">YW2 Mall</h1>
      <br />
      <nav class="routerText">
        <RouterLink to="/about">About</RouterLink>
        <el-divider direction="vertical" border-style="solid" />
        <RouterLink to="/fun">HaveFun</RouterLink>
        <el-divider direction="vertical" border-style="solid" />
        <RouterLink to="/login">Login</RouterLink>
      </nav>
      <!-- <img src="../assets/images/test.jpg" class="image" /> -->
    </div>
  </div>
</template>

<script>
import JSConfetti from 'js-confetti'
const confetti = new JSConfetti()
export default {
  // eslint-disable-next-line vue/multi-word-component-names
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
  margin: 4;
}

.center {
  /* 视口高度的100%*/
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: linear-gradient(to bottom right, #9ae8b9, #58a973);
  color: white;
  /* text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); */
  transition: background 0.5s ease-in-out;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #44a862;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  width: 750px;
  height: 500px;
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
  background: rgba(110, 216, 159, 0.99);
  color: white;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: bold;
  transition: transform 0.2s ease-in-out;
}
/* .image {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 200px;
  height: auto;
  margin: 20px;
} */
.routerText a:hover {
  transform: scale(1.1);
}
</style>
