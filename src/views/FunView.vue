<script>
import JSConfetti from 'js-confetti'

const confetti = new JSConfetti()

export default {
  name: 'FunView',
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

<template>
  <div id="my-showConfetti">
    <h1 @click="showConfetti">🎉 Congratulations!</h1>
  </div>
</template>

<style>
h1 {
  text-align: center;
  cursor: pointer;
  margin-top: 3em;
}

#my-showConfetti {
  /* 视口高度的100%*/
  min-height: 100vh;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background: linear-gradient(to bottom right, #177f7f, #32c8b2);
  color: white;
  /* text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); */
  transition: background 0.5s ease-in-out;
}
</style>
