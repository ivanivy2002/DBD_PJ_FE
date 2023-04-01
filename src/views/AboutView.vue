<template>
  <div class="about">
    <h1>This is an about page, 但是还没有写好www, 时间太紧张了哇QWQ</h1>
    <br />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

<script>
import axios from 'axios'
export default {
  name: 'About',
  created() {
    this.load()
  },
  methods: {
    load() {
      axios.get('localhost:9000/user')
    }
  }
}
</script>
