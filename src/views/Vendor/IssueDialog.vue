<template>
  <el-dialog v-model="displayOrNot" title="商品详情" width="550px" top="9vh">
    <el-descriptions border="true" column="1">
      <el-descriptions-item label="上传图片" label-align="center">
        <input type="file" ref="fileInput" multiple />
        <button type="submit">上传</button>
      </el-descriptions-item>
      <el-descriptions-item label="商品名称" label-align="center">
        <el-input v-model="issuegoods.name"></el-input>
      </el-descriptions-item>
      <el-descriptions-item label="商品种类" label-align="center">
        <el-input v-model="issuegoods.category"></el-input>
      </el-descriptions-item>
      <el-descriptions-item label="价格" label-align="center">
        <el-input v-model="issuegoods.price"></el-input>
      </el-descriptions-item>
      <el-descriptions-item label="库存" label-align="center">
        <el-input v-model="issuegoods.stock"></el-input>
      </el-descriptions-item>
      <el-descriptions-item label="简介" label-align="center">
        <el-input v-model="issuegoods.introduction" type="textarea"></el-input>
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogcancel">取消</el-button>
        <el-button type="primary" @click="dialogconfirm">提交</el-button>
      </span>
    </template>
    <el-dialog v-model="imgdialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </el-dialog>
</template>

<script setup></script>

<script>
export default {
  props: ['display'],
  data() {
    return {
      picUrls: [],
      imgdialogVisible: false,
      displayOrNot: false,
      issuegoods: {
        name: '',
        category: '',
        price: '',
        introduction: '',
        stock: ''
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
    }
  },
  watch: {
    display() {
      if (this.display) {
        this.displayOrNot = true
      } else {
        this.displayOrNot = false
      }
    },
    displayOrNot() {
      if (!this.displayOrNot) {
        this.$emit('cancelDisplay')
      }
    }
  },
  methods: {
    dialogcancel() {
      this.$emit('cancelDisplay')
    },
    checkissuegoods() {
      if (
        this.issuegoods.name == '' ||
        this.issuegoods.category == '' ||
        this.issuegoods.price == '' ||
        this.issuegoods.introduction == ''
      ) {
        return false
      }
      return true
    },
    async dialogconfirm() {
      if (this.checkissuegoods()) {
        let formdatas = this.getPicFormDatas()
        console.log(formdatas)
        await this.getAllPicUrls(formdatas)
        console.log('newStock called')
        console.log(this.picUrls)
        this.newStock()
        this.$emit('cancelDisplay')
        this.issuegoods.name = ''
        this.issuegoods.category = ''
        this.issuegoods.price = ''
        this.issuegoods.introduction = ''
        this.issuegoods.stock = ''
      } else {
        this.$message.error('请确保表单准确完整')
      }
    },

    async getAllPicUrls(formDatas) {
      for (let i = 0; i < formDatas.length; i++) {
        await this.getPicUrl(formDatas[i])
      }
    },

    async getPicUrl(picFormData) {
      console.log('getPicUrl called')
      this.$axios({
        method: 'POST',
        url: '/api/commodity/upload-avatar',
        data: picFormData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((response) => {
          if (response.data.code == 200) {
            this.picUrls.push(response.data.object)
          }
        })
        .catch((error) => {
          console.error('There was a problem with the request:', error)
        })
    },

    getPicFormDatas() {
      const fileInput = this.$refs.fileInput
      const files = fileInput.files // 获取上传的多个文件
      const allFormDatas = []

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData()
        const file = files[i]
        formData.append('file', file) // 添加文件到 FormData 中
        allFormDatas.push(formData)
      }
      return allFormDatas
    },

    newStock() {
      this.$axios
        .post('/api/commodity/shop-shelve-application/apply', {
          application: {
            shop: {
              id: this.$store.state.storeInfo.id
            },
            commodityName: this.issuegoods.name,
            description: this.issuegoods.introduction,
            price: this.issuegoods.price,
            stock: this.issuegoods.stock
          },
          imgUrls: this.picUrls
        })
        .then((response) => {
          if (response.data.code == 200) {
            this.$message.success('提交成功，管理员正在审批~')
          } else if (response.data.code == 400) {
            this.$message.warning(response.data.msg)
          } else {
            this.$message.warning('服务器错误！')
          }
        })
        .catch((error) => {
          console.error('There was a problem with the request:', error)
        })
    }
  }
}
</script>
