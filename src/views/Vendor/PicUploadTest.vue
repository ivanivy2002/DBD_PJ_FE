<template>
  <div>
    <input type="file" multiple @change="onFileChange" />
    <button @click="submitForm">提交</button>
  </div>
  <img v-for="imageUrl in getImageUrls(commodity.imagePath)" :key="imageUrl" :src="imageUrl" />
</template>
<script>
export default {
  data() {
    return {
      files: [], // 用于存放选中的文件
      commodity: {
        // 商品信息
        id: null,
        commodityName: 'Test',
        shopId: 20,
        intro: 'Test111',
        price: 0,
        imagePath:
          '0185fa30-0e27-4a25-97e8-a61d7b15e7a8-numpy.png,1f0fdb29-fdcd-4c07-afa1-f919540e12a0-TensorFlow.png',
        regStatus: null,
        changeStatus: null,
        createTime: null,
        updateTime: null,
        deleteTime: null
      }
    }
  },
  methods: {
    onFileChange(event) {
      // 选中文件时的回调
      this.files = event.target.files
    },
    async submitForm() {
      // 提交表单的回调
      // 创建FormData对象
      const formData = new FormData()
      // 将商品信息添加到表单数据中
      formData.append('commodity', JSON.stringify(this.commodity))
      // 将商品信息添加到表单数据中
      // for (const key in this.commodity) {
      //   formData.append(`commodity.${key}`, this.commodity[key])
      // }

      // 将所有选中的图片添加到表单数据中
      for (let i = 0; i < this.files.length; i++) {
        formData.append('files', this.files[i])
      }
      // 发送POST请求
      console.log(JSON.stringify(formData.get('commodity')))
      const res = await fetch('http://localhost:9000/commodity/reg', {
        method: 'POST',
        body: formData
      })
      //   .then(res => res.json()).then(res => {
      //   console.log(res)
      // })
      console.log(formData.get('commodity')) // 查看 commodity 字段的值
      // console.log(formData.entries())
      const result = await res.json()
      console.log(result)
    },
    getImageUrls(imagePaths) {
      const baseUrl = 'http://localhost:9000/display/commodity/'
      return imagePaths.split(',').map((imagePath) => `${baseUrl}${imagePath.trim()}`)
    }
    // getImageUrl(imagePath) {
    //   const baseUrl = 'http://localhost:9000/display/commodity/';
    //   return `${baseUrl}${imagePath}`;
    // },
    // splitByComma(str) {
    //   return str.split(',').map((imagePath) => imagePath.trim())
    // }
  }
}
</script>

<style scoped>
img {
  width: 20px;
  height: 20px;
}
</style>
