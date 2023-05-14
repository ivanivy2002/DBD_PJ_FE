<template>
  <div class="sign-form">
    <!--        <div class="form-header">活动新开</div>-->
    <div class="form-container">
      <el-form ref="form" :model="presetForm" label-width="125px" :rules="rules">
        <el-form-item label="持续时间" prop="lastTime">
          <el-input v-model="presetForm.lastTime"></el-input>
        </el-form-item>
        <el-form-item label="活动资金" prop="activityFund">
          <el-input v-model="presetForm.activityFund"></el-input>
        </el-form-item>
        <el-form-item label="商店注册资金阈值" prop="regFund">
          <el-input v-model="presetForm.regFund"></el-input>
        </el-form-item>
        <el-form-item label="月销额阈值" prop="monthlySales">
          <el-input v-model="presetForm.monthlySales"></el-input>
        </el-form-item>
        <el-form-item label="月销量阈值" prop="monthlyAmount">
          <el-input v-model="presetForm.monthlyAmount"></el-input>
        </el-form-item>
        <el-form-item label="初始活动资金" prop="originFund">
          <el-input v-model="presetForm.originFund"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="signIn" style="color: #fff">活动新开</el-button>
          <el-button type="primary" @click="resetForm" style="color: #fff">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { reactive, ref } from 'vue'

import {
  // ElTabs,
  // ElTabPane,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage
  // ElCheckbox,
  // ElCheckboxGroup,
} from 'element-plus'
import axios from 'axios'
// TODO: 这个options还没用上
// const options = [
//   { value: 'HTML', label: 'HTML' },
//   { value: 'CSS', label: 'CSS' },
//   { value: 'JavaScript', label: 'JavaScript' }
// ]

export default {
  name: 'PresetFormView',
  components: {
    // ElTabs,
    // ElTabPane,
    ElForm,
    ElFormItem,
    ElInput,
    ElButton
    // ElCheckbox,
    // ElCheckboxGroup,
  },
  data() {
    return {
      // dialogFormVisible: false,
      activeTab: 'signin',
      categories: [],
      presetForm: {
        activityFund: 10,
        lastTime: 0,
        x: 0,
        y: 0,
        regFund: 10,
        monthlySales: 0,
        monthlyAmount: 0,
        status: null,
        creatTime: null,
        originFund: 0
      },
      loading: false,
      disabled: false,
      options: [],
      validateUserName: (rule, value, callback) => {
        if (!/^(?!_)(?!.*?_$)[a-zA-Z0-9_]{3,10}$/.test(value)) {
          callback(new Error('请输入正确格式的用户名！'))
        } else {
          callback()
        }
      },
      //* 中国大陆身份证号：包括前两位的区间、出生年份、出生月份、出生日期、顺序码和校验码
      validateIdNumber: (rule, value, callback) => {
        if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
          callback(new Error('请输入正确的身份证号！'))
        } else {
          callback()
        }
      },
      validateIntro: (rule, value, callback) => {
        if (value.length > 128) {
          callback(new Error('商店简介不能超过128个字符！'))
        } else {
          callback()
        }
      },
      validateAddress: (rule, value, callback) => {
        if (value.length > 32) {
          callback(new Error('备案地址不能超过32个字符！'))
        } else {
          callback()
        }
      },
      // NOTE: 先将value转换为浮点数 检查是否为之后检查大小
      validateFund: (rule, value, callback) => {
        const fund = parseFloat(value)
        if (isNaN(fund) || fund <= 1000) {
          callback(new Error('资金需大于1000元！'))
        } else {
          callback()
        }
      },
      validateActivityFund: (rule, value, callback) => {
        const fund = parseFloat(value)
        if (isNaN(fund) || fund <= 0) {
          callback(new Error('资金需大于' + 0 + '元！'))
        } else {
          callback()
        }
      },
      $message: this.message //引入$message组件
    }
  },
  computed: {
    rules: function () {
      return {
        userName: [
          {
            required: true,
            message: '用户名不能为空！',
            trigger: 'blur'
          },
          { validator: this.validateUserName, trigger: 'blur' }
        ],
        activityFund: [
          {
            required: true,
            message: '资金不能为空！',
            trigger: 'blur'
          },
          { validator: this.validateActivityFund, trigger: 'blur' }
        ],
        shopName: [
          {
            required: true,
            message: '店名不能为空！',
            trigger: 'blur'
          },
          { validator: this.validateShopName, trigger: 'blur' }
        ],

        idNumber: [{ required: true, validator: this.validateIdNumber, trigger: 'blur' }],
        intro: [
          {
            required: true,
            message: '商店简介不能为空！',
            trigger: 'blur'
          },
          { validator: this.validateIntro, min: 1, max: 128, trigger: 'blur' }
        ],
        address: [
          {
            required: true,
            message: '备案地址不能为空！',
            trigger: 'blur'
          },
          { validator: this.validateAddress, min: 1, max: 32, trigger: 'blur' }
        ],
        fund: [
          {
            required: true,
            message: '资金不能为空！',
            trigger: 'blur'
          },
          { validator: this.validateFund, message: '请输入足够的资金！', trigger: 'blur' }
        ],
        registrationTime: [
          {
            type: 'date',
            required: true,
            message: '注册时间不能为空',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              const date = new Date(value)
              const cutoff = new Date('2023-04-16')
              if (date > cutoff) {
                callback(new Error('注册时间不得晚于2023年4月16日'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    //NOTE: 重置表单
    resetForm() {
      this.$refs.form.resetFields()
    },
    gotoPCenter() {
      this.$router.push('/home/vendor/profile')
    },
    //TODO: 缺少异常处理；修改成PUT请求
    signIn() {
      // NOTE: 前端检查是否符合规范
      this.presetForm.vendorId = localStorage.getItem('userId')
      this.$refs.form.validate((valid) => {
        console.log(valid)
        if (valid) {
          // this.AddArray() //* 将categories数组增加10个空元素
          // this.presetForm.categories.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
          // if (this.categories.length === 0) {
          //     this.$message({
          //         message: '请选择至少一个商品类别',
          //         type: 'warning'
          //     })
          //     return
          // }
          // TODO:加入 loading 遮罩层，在请求数据时显示加载动画，避免用户误以为页面卡顿或未响应。?
          //NOTE: 把注册成功后的弹窗放在后端响应成功的回调函数中，确保在后端成功保存数据后再弹窗。
          // NOTE: 处理注册逻辑
          console.log('申请提交', this.presetForm) // 控制台输出信息
          this.loading = true // 开启 loading 动画
          // this.presetForm.categories = this.joinWithComma(this.categories) //* 将多个单词用+拼起来
          axios
            .post('/api/activity/preset', this.presetForm)
            .then((response) => {
              console.log(response.data)
              // NOTE: 只有当后端返回200时显示注册成功
              if (response.data.code == 200) {
                console.log('申请提交成功')
                ElMessage({
                  //用于弹出消息提示
                  showClose: true,
                  type: 'success', //如果成功
                  message: '申请提交成功'
                })
                this.$refs.form.resetFields() // 重置表单
                // this.dialogFormVisible = false
              } else {
                console.error('申请提交失败，请重试！')
                ElMessage({
                  showClose: true,
                  type: 'error', //如果失败输出状态码
                  message: '申请提交失败:' + response.data.msg
                })
              }
            })
            .catch((error) => {
              console.error(error)
              ElMessage({
                showClose: true,
                type: 'error', //如果失败，未连接上后端
                message: '申请提交失败:vue好像有什么地方错了呢'
              })
              // this.$message.error('数据保存失败，' + error.toString())
            })
            .finally(() => {
              this.loading = false // 关闭 loading 动画
            })
        } else {
          return false
        }
      })
    },

    // AddArray() {
    //   this.categories.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    // },
    gotoStoreInfo() {
      this.$router.push('/home/vendor/storeinfo')
    },
    // NOTE: 将数组中的单词变成一个字符串，中间用 + 连接
    joinWithComma(categories) {
      if (!Array.isArray(categories)) {
        throw new Error('Argument must be an array')
      }
      return categories.join(',')
    }
  }
}
</script>

<style scoped>
.form-header {
  font-family: '黑体';
  font-size: 30px;
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
}

.form-container {
  font-weight: bold;
  color: #ffffff;
}

.sign-form {
  max-width: 600px;
  margin: 0 auto;
  background-image: linear-gradient(
    to bottom right,
    rgba(177, 234, 221, 0.91),
    rgba(49, 231, 206, 0.71)
  );
  padding: 30px;
  border-radius: 10px;
}

.sign-form__title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.el-form-item__label {
  color: #333;
}

.el-input__inner {
  background-color: rgb(46, 24, 109);
  border-color: rgb(53, 4, 4);
  color: #333;
}

.el-checkbox__inner {
  border-color: rgb(32, 7, 7);
  background-color: rgb(32, 5, 5);
}

.el-checkbox__label {
  color: #333;
}

.el-button {
  background-color: #4ca9df;
  border-color: #4ca9df;
  border-radius: 5px;
  color: rgb(178, 218, 217);
}

.el-button:hover,
.el-button:focus {
  background-color: #105494;
  border-color: #105494;
}

.el-button:active {
  background-color: #1f2937;
  border-color: #1f2937;
}

.el-message__content {
  color: #fff;
}
</style>
