<!--<template xmlns:v-on="http://www.w3.org/1999/xhtml">-->
<template>
  <div>
    <form @submit.prevent="uploadFiles">
      <input type="file" multiple v-on:change="handleFileUpload" />
      <button type="submit">Upload</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'PicUpLoad',
  data() {
    return {
      files: []
    }
  },
  methods: {
    handleFileUpload(event) {
      this.files = event.target.files
    },
    uploadFiles() {
      let formData = new FormData()
      for (let i = 0; i < this.files.length; i++) {
        formData.append('files[]', this.files[i])
      }
      axios.post('/api/upload', formData).then((response) => {
        console.log(response.data)
      })
    }
  }
}
</script>

<style scoped></style>
