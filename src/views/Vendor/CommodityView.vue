<template>
  <div>
    <el-tabs>
      <el-tab-pane label="已上架商品" name="displayQualified">
        <div>
          <el-table :data="stateQualified.tableData" style="width: 100%">
            <el-table-column prop="commodityName" label="商品名称"></el-table-column>
            <el-table-column prop="intro" label="商品简介"></el-table-column>
            <el-table-column prop="price" label="商品价格"></el-table-column>
            <!--      <el-table-column prop="registrationTime" label="注册时间"></el-table-column>-->
            <!--      <el-table-column prop="imagePath" label="图片"></el-table-column>-->
            <!-- NOTE:使用了解构赋值语法，将 row 对象从插槽数据中解构出来，然后使用它的 regStatus 属性来决定 el-tag 标签的样式 -->
            <el-table-column prop="regStatus" label="状态">
              <template #default="{ row }">
                <!-- NOTE: 0是待审核，1是已通过，2是已拒绝 -->
                <el-tag
                  :type="
                    row.regStatus === '待审核'
                      ? 'warning'
                      : row.regStatus === '已上架'
                      ? 'success'
                      : 'danger'
                  "
                  >{{ row.regStatus }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button
                  class="changeButton"
                  size="normal"
                  @click="openChangeForm(row)"
                  :disabled="isButtonDisabled(row)"
                  >修改
                  <!--  @click="changeCommodity(row)"-->
                </el-button>
                <el-button
                  type="danger"
                  size="normal"
                  @click="deleteCommodity(row)"
                  :disabled="isButtonDisabled(row)"
                  >下架
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <el-button type="success" text @click="dialogFormVisible = true">+上架新商品</el-button>
        </div>
        <div class="el-form">
          <el-dialog v-model="dialogFormVisible" title="申请上架商品">
            <el-form ref="form" :model="signForm" label-width="80px" :rules="rules">
              <el-form-item label="商品名称" prop="commodityName">
                <el-input v-model="signForm.commodityName"></el-input>
              </el-form-item>
              <el-form-item label="商品简介" prop="intro">
                <el-input v-model="signForm.intro"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="price">
                <el-input v-model="signForm.price"></el-input>
              </el-form-item>
              <el-form-item label="上传图片" label-align="center">
                <!-- ref="fileInput"  -->
                <input type="file" multiple @change="onFileChange" />
                <!-- <button type="submit">上传</button> -->
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="signIn">申请</el-button>
                <el-button type="default" @click="resetForm">重置</el-button>
                <!-- <el-button type="default" @click="dialogFormVisible = false">取消</el-button> -->
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
        <div class="el-form-change">
          <el-dialog v-model="changeFormVisible" title="修改商品信息" id="changeForm">
            <el-form
              ref="form"
              :model="changeForm"
              label-width="80px"
              :rules="rules"
              id="changeForm"
            >
              <input type="hidden" v-model="changeForm.id" />
              <!--                            //TODO: -->
              <el-form-item label="商品名称" prop="commodityName">
                <el-input v-model="changeForm.commodityName"></el-input>
              </el-form-item>
              <el-form-item label="商品简介" prop="intro">
                <el-input v-model="changeForm.intro"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="price">
                <el-input v-model="changeForm.price"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="changeIn">提交修改</el-button>
                <el-button type="default" @click="resetForm">重置</el-button>
                <!-- <el-button type="default" @click="dialogFormVisible = false">取消</el-button> -->
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
      </el-tab-pane>
      <el-tab-pane label="上架申请记录" name="displayRegRecord">
        <div>
          <el-table :data="stateRegRecord.tableData" style="width: 100%">
            <el-table-column prop="commodityName" label="商品名称"></el-table-column>
            <el-table-column prop="intro" label="商品简介"></el-table-column>
            <el-table-column prop="price" label="商品价格"></el-table-column>
            <!--        <el-table-column prop="categories" label="商品类别"></el-table-column>-->
            <!--      <el-table-column prop="registrationTime" label="注册时间"></el-table-column>-->
            <!--      <el-table-column prop="imagePath" label="图片"></el-table-column>-->
            <!-- NOTE:使用了解构赋值语法，将 row 对象从插槽数据中解构出来，然后使用它的 regStatus 属性来决定 el-tag 标签的样式 -->
            <el-table-column prop="regStatus" label="上架状态">
              <template #default="{ row }">
                <!-- NOTE: 0是待审核，1是已通过，2是已拒绝 -->
                <el-tag
                  :type="
                    row.regStatus === '待审核'
                      ? 'warning'
                      : row.regStatus === '已上架'
                      ? 'success'
                      : 'danger'
                  "
                  >{{ row.regStatus }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="修改申请记录" name="displayChangeInfoRecord">
        <div>
          <el-table :data="stateRegRecord.tableData" style="width: 100%">
            <el-table-column prop="commodityName" label="商品名称"></el-table-column>
            <el-table-column prop="intro" label="商品简介"></el-table-column>
            <el-table-column prop="price" label="商品价格"></el-table-column>
            <!--        <el-table-column prop="categories" label="商品类别"></el-table-column>-->
            <!--      <el-table-column prop="imagePath" label="图片"></el-table-column>-->
            <!-- NOTE:使用了解构赋值语法，将 row 对象从插槽数据中解构出来，然后使用它的 regStatus 属性来决定 el-tag 标签的样式 -->
            <el-table-column prop="changeStatus" label="修改状态">
              <template #default="{ row }">
                <!-- NOTE: 0是待审核，1是已通过，2是已拒绝 -->
                <el-tag
                  :type="
                    row.changeStatus === '待审核'
                      ? 'warning'
                      : row.changeStatus === '已上架'
                      ? 'success'
                      : 'danger'
                  "
                  >{{ row.changeStatus }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  // ElTabs,
  ElTabPane,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage
  // ElCheckbox,
  // ElCheckboxGroup
} from 'element-plus'
import axios from 'axios'

export default {
  name: 'CommodityView',
  components: {
    // ElTabs,
    ElTabPane,
    ElForm,
    ElFormItem,
    ElInput,
    ElButton
    // ElCheckbox,
    // ElCheckboxGroup,
  },
  data() {
    return {
      files: [],
      picUrls: [],
      stateQualified: {
        tableData: []
      },
      stateRegRecord: {
        tableData: []
      },
      stateChangeInfoRecord: {
        tableData: []
      },
      commoditiesData: [],
      ifApprove: 0,
      userName: '',
      dialogFormVisible: false,
      changeFormVisible: false,
      activeTab: 'signIn',
      signForm: {
        // TODO: userName之后需要改掉, 用sessionStorage来存储
        id: null,
        commodityName: null,
        shopId: 0,
        intro: null,
        price: 0,
        imagePath: null,
        regStatus: null,
        changeStatus: null,
        createTime: null,
        updateTime: null,
        deleteTime: null
        // TODO: 如何在这个时候传递用户名给后端
      },
      changeForm: {
        id: null,
        commodityName: null,
        shopId: 0,
        intro: null,
        price: 0,
        imagePath: null,
        regStatus: null,
        changeStatus: null,
        createTime: null,
        updateTime: null,
        deleteTime: null
      },
      picUrls: [], // 存储上传成功后返回的图片 URL
      imgdialogVisible: false, // 控制图片预览对话框是否显示
      dialogImageUrl: '', // 图片预览对话框中显示的图片 URL
      validateUserName: (rule, value, callback) => {
        if (!/^(?!_)(?!.*?_$)[a-zA-Z0-9_]{3,10}$/.test(value)) {
          callback(new Error('请输入正确格式的用户名！'))
        } else {
          callback()
        }
      },
      validateCommodityName: (rule, value, callback) => {
        if (value.length > 12) {
          callback(new Error('商品名称长度不能超过12个字符！'))
        } else {
          callback()
        }
      },
      //* 中国大陆身份证号：包括前两位的区间、出生年份、出生月份、出生日期、顺序码和校验码
      validateIntro: (rule, value, callback) => {
        if (value.length > 128) {
          callback(new Error('商品简介不能超过128个字符！'))
        } else {
          callback()
        }
      },
      // NOTE: 先将value转换为浮点数 检查是否为之后检查大小
      validatePrice: (rule, value, callback) => {
        const fund = parseFloat(value)
        if (isNaN(fund) || fund <= 0) {
          callback(new Error('价格需大于0元！'))
        } else {
          callback()
        }
      },
      $message: this.message //引入$message组件
    }
  },
  computed: {
    isButtonDisabled() {
      return (row) => {
        if (row.regStatus !== '已上架') {
          return true
        } else {
          return false
        }
      }
    },
    rules: function () {
      return {
        commodityName: [
          {
            required: true,
            message: '商品名称不能为空！',
            trigger: 'blur'
          },
          { validator: this.validateCommodityName, trigger: 'blur' }
        ],
        intro: [
          {
            required: true,
            message: '商品简介不能为空！',
            trigger: 'blur'
          },
          { validator: this.validateIntro, min: 1, max: 128, trigger: 'blur' }
        ],
        price: [
          {
            required: true,
            message: '商品价格不能为空或小于0！',
            trigger: 'blur'
          },
          { validator: this.validatePrice, min: 1, max: 128, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onFileChange(event) {
      // 选中文件时的回调
      this.files = event.target.files
    },
    //NOTE: 重置表单
    resetForm() {
      this.$refs.form.resetFields()
      // 重置上传文件的input元素
      this.$refs.fileInput.value = ''
    },
    //TODO: 缺少异常处理；修改成PUT请求
    // NOTE: 申请上架商品
    async signIn() {
      //* 申请上架商品
      // NOTE: 前端检查是否符合规范
      this.signForm.shopId = localStorage.getItem('shopId')
      this.$refs.form.validate((valid) => {
        console.log(valid)
        if (valid) {
          // TODO:加入 loading 遮罩层，在请求数据时显示加载动画，避免用户误以为页面卡顿或未响应。?
          //NOTE: 把注册成功后的弹窗放在后端响应成功的回调函数中，确保在后端成功保存数据后再弹窗。
          // NOTE: 处理注册逻辑
          console.log('申请提交', this.signForm) // 控制台输出信息
          this.loading = true // 开启 loading 动画
          const res = fetch('http://localhost:9000/commodity/reg', {
            method: 'POST',
            body: this.organizeFormData()
          })
            .then((res) => res.json())
            .then((res) => {
              console.log(res)
              if (res.data.code == 200) {
                ElMessage({
                  showClose: true,
                  type: 'success',
                  message: '申请提交成功'
                })
                this.dialogFormVisible = false
              } else {
                console.error('申请提交失败，请重试！')
                ElMessage({
                  showClose: true,
                  type: 'error', //如果失败输出状态码
                  message: '申请提交失败:' + res.msg
                })
              }
            })
          // axios
          //   .post('http://localhost:9000/commodity/reg', this.signForm)
          //   .then((response) => {
          //     if (response.data.code == 200) {
          //       ElMessage({
          //         showClose: true,
          //         type: 'success',
          //         message: '申请提交成功'
          //       })
          //       this.dialogFormVisible = false
          //     } else {
          //       console.error('申请提交失败，请重试！')
          //       ElMessage({
          //         showClose: true,
          //         type: 'error', //如果失败输出状态码
          //         message: '申请提交失败:' + response.data.msg
          //       })
          //     }
          //   })
          //   .catch((error) => {
          //     console.error(error)
          //     ElMessage({
          //       showClose: true,
          //       type: 'error', //如果失败，未连接上后端
          //       message: '申请提交失败:vue好像有什么地方错了呢'
          //     })
          //     // this.$message.error('数据保存失败，' + error.toString())
          //   })
          //   .finally(() => {
          //     this.loading = false // 关闭 loading 动画
          //   })
          this.$refs.form.resetFields() // 重置表单
        } else {
          return false
        }
      })
    },
    // NOTE: 将表单和图片数据组合成一个 FormData 对象
    organizeFormData() {
      const formData = new FormData()
      formData.append('commodity', JSON.stringify(this.signForm))
      for (let i = 0; i < this.files.length; i++) {
        formData.append('files', this.files[i])
      }
      return formData
    },
    openChangeForm(row) {
      this.changeForm = row
      this.changeForm.id = row.id
      this.changeFormVisible = true
    },
    changeIn: async function (row) {
      console.log(row)
      // this.changeForm.id = localStorage.getItem("id")
      this.changeForm.shopId = localStorage.getItem('shopId')
      // NOTE: 前端检查是否符合规范
      this.$refs.form.validate((valid) => {
        console.log(valid)
        if (valid) {
          // TODO:加入 loading 遮罩层，在请求数据时显示加载动画，避免用户误以为页面卡顿或未响应。?
          //NOTE: 把注册成功后的弹窗放在后端响应成功的回调函数中，确保在后端成功保存数据后再弹窗。
          // NOTE: 处理注册逻辑
          console.log('申请提交', this.changeForm) // 控制台输出信息
          this.loading = true // 开启 loading 动画
          axios
            // .post('http://localhost:9000/commodity/changeInfo', this.changeForm)
            .put('http://localhost:9000/commodity/changeInfo', this.changeForm)
            .then((response) => {
              console.log(response.data)
              // NOTE: 只有当后端返回200时显示注册成功
              if (response.data.code == 200) {
                console.log('修改提交成功')
                ElMessage({
                  //用于弹出消息提示
                  showClose: true,
                  type: 'success', //如果成功
                  message: '修改提交成功'
                })
                this.dialogFormVisible = false
              } else {
                console.error('修改提交失败，请重试！')
                ElMessage({
                  showClose: true,
                  type: 'error', //如果失败输出状态码
                  message: '修改提交失败:' + response.data.msg
                })
              }
            })
            .catch((error) => {
              console.error(error)
              ElMessage({
                showClose: true,
                type: 'error', //如果失败，未连接上后端
                message: '修改提交失败: vue好像有什么地方出错了呢'
              })
              // this.$message.error('数据保存失败，' + error.toString())
            })
            .finally(() => {
              this.loading = false // 关闭 loading 动画
            })
          this.$refs.form.resetFields() // 重置表单
        } else {
          return false
        }
      })
    },
    // NOTE: 将数组中的单词变成一个字符串，中间用 + 连接
    getPicFormDatas() {
      const fileInput = this.$refs.fileInput
      const files = fileInput.files // 获取上传的多个文件
      const allFormData = []

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData()
        const file = files[i]
        formData.append('file', file) // 添加文件到 FormData 中
        allFormData.push(formData)
      }
      return allFormData
    },
    gotoStoreInfo() {
      this.$router.push('/home/vendor/storeinfo')
    },
    deleteCommodity: async function (row) {
      console.log(row)
      try {
        // eslint-disable-next-line no-unused-vars
        const response = axios
          .put('http://localhost:9000/commodity/remove', null, {
            params: {
              commodityId: row.id
            }
          })
          // eslint-disable-next-line no-unused-vars
          .then((response) => {
            console.log('delReq' + row.id)
            // this.balance = response.data.balance
            ElMessage({
              showClose: true,
              type: 'success', //如果失败,未连接上后端
              message: '商品已下架'
            })
          })
      } catch (error) {
        console.log(error)
        ElMessage({
          showClose: true,
          type: 'error', //如果失败,未连接上后端
          message: '下架失败'
        })
      }
      await this.fetchDataQualified()
    },
    async fetchDataQualified() {
      try {
        console.log(localStorage.getItem('shopId'))
        const response = await axios.get('http://localhost:9000/commodity/displayQualified', {
          params: {
            shopId: localStorage.getItem('shopId') //获取cookie中的id
          }
        })
        this.commoditiesData = response.data.data
        this.stateQualified.tableData = response.data.data.map((row) => {
          // row.goodsInfo = row.goodsInfo.replace(/\+/g, ' ')
          console.log(row)
          // row = this.removeZerosInObjectArray(row)
          return row
        })
        console.log(this.stateQualified.tableData)
      } catch (error) {
        console.log(error)
      }
    },
    async fetchDataRegRecord() {
      try {
        console.log(localStorage.getItem('shopId'))
        const response = await axios.get('http://localhost:9000/commodity/displayRegRecord', {
          params: {
            shopId: localStorage.getItem('shopId') //获取cookie中的id
          }
        })
        this.commoditiesData = response.data.data
        this.stateRegRecord.tableData = response.data.data.map((row) => {
          console.log(row)
          return row
        })
        // this.state.tableData = this.removeZerosInObjectArray(this.state.tableData)
        console.log(this.stateRegRecord.tableData)
      } catch (error) {
        console.log(error)
      }
    },
    async fetchDataChangeInfoRecord() {
      try {
        console.log(localStorage.getItem('shopId'))
        const response = await axios.get(
          'http://localhost:9000/commodity/displayChangeInfoRecord',
          {
            params: {
              shopId: localStorage.getItem('shopId') //获取cookie中的id
            }
          }
        )
        this.commoditiesData = response.data.data
        this.stateRegRecord.tableData = response.data.data.map((row) => {
          // row.goodsInfo = row.goodsInfo.replace(/\+/g, ' ')
          console.log(row)
          // row = this.removeZerosInObjectArray(row)
          return row
        })
        // console.log(this.state.tableData)
        // this.state.tableData = this.removeZerosInObjectArray(this.state.tableData)
        console.log(this.stateRegRecord.tableData)
      } catch (error) {
        console.log(error)
      }
    }
    // NOTE: 去掉数组末尾多余的零
  },
  // NOTE: 用computed来实现按钮的disabled属性，如果不是待审核状态，就禁用按钮
  // NOTE: 需要注意的是，这里的row是一个参数，要在调用的时候传入
  mounted: function () {
    this.fetchDataRegRecord()
    this.fetchDataChangeInfoRecord()
    this.fetchDataQualified()
  }
}
</script>

<style scoped>
.el-tabs__header,
.el-tabs__content {
  color: white;
}

.changeButton:hover {
  background-color: #4db8ff;
  color: white;
}

#changeForm {
  background-color: #2d2d2d;
}
</style>
