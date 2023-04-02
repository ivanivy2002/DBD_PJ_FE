<template>
  <!-- Form -->
  <!--  TODO:[feat SignForm to make full function]-->
  <div class="DiaButton">
    <el-button text @click="dialogFormVisible = true"> 申请开店 </el-button>
  </div>

  <el-dialog v-model="dialogFormVisible" title="申请开店">
    <el-form ref="form" :model="signForm" label-width="80px" :rules="rules">
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="signForm.userName"
          placeholder="请输入您的用户名以供确认"
          onfocus="if (this.placeholder == this.value) this.value = ''"
        ></el-input>
      </el-form-item>
      <el-form-item label="店名" prop="shopName">
        <el-input v-model="signForm.shopName"></el-input>
      </el-form-item>
      <!-- <el-form-item label="商品类别">
        <el-input v-model="signForm.categories"></el-input>
      </el-form-item> -->
      <el-form-item label="商品类别" prop="categories">
        <el-checkbox-group v-model="signForm.categories">
          <el-checkbox label="food">食品</el-checkbox>
          <el-checkbox label="clothing">服装</el-checkbox>
          <el-checkbox label="electronics">电子产品</el-checkbox>
          <el-checkbox label="GPT">GPT</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="身份证号" prop="idNumber">
        <el-input v-model="signForm.idNumber"></el-input>
      </el-form-item>
      <el-form-item label="商店简介" prop="intro">
        <el-input v-model="signForm.intro"></el-input>
      </el-form-item>
      <el-form-item label="备案地址" prop="address">
        <el-input v-model="signForm.address"></el-input>
      </el-form-item>
      <el-form-item label="注册资金" prop="fund">
        <el-input v-model="signForm.fund"></el-input>
      </el-form-item>
      <el-form-item label="注册时间" prop="registrationTime">
        <el-input v-model="signForm.registrationTime" type="date"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="signin">申请</el-button>
        <el-button type="default" @click="resetForm">重置</el-button>
        <!-- <el-button type="default" @click="dialogFormVisible = false">取消</el-button> -->
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
// import { reactive, ref } from 'vue'

import {
  ElTabs,
  ElTabPane,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
  ElCheckbox,
  ElCheckboxGroup
} from 'element-plus'
import axios from 'axios'
export default {
  components: {
    ElTabs,
    ElTabPane,
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElCheckbox,
    ElCheckboxGroup
  },
  data() {
    return {
      dialogFormVisible: false,
      activeTab: 'signin',
      categories: [],
      signForm: {
        // FIXME: userName之后需要改掉, 用sessionStorage来存储
        userName: '',
        shopName: '',
        // categories: '',
        // NOTE: 用数组传成功！！
        categories: [],
        idNumber: '',
        intro: '',
        address: '',
        fund: '',
        registrationTime: ''
        // TODO: 日期格式以及多选框如何传递数据
        // TODO: 如何在这个时候传递用户名给后端
      },
      // BUG: 无法检查rules
      validateUserName: (rule, value, callback) => {
        if (!/^(?!_)(?!.*?_$)[a-zA-Z0-9_]{3,10}$/.test(value)) {
          callback(new Error('请输入正确格式的用户名！'))
        } else {
          callback()
        }
      },
      validateShopName: (rule, value, callback) => {
        if (value.length > 12) {
          callback(new Error('店名长度不能超过12个字符！'))
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
        shopName: [
          {
            required: true,
            message: '店名不能为空！',
            trigger: 'blur'
          },
          { validator: this.validateShopName, trigger: 'blur' }
        ],
        categories: [
          { type: 'array', required: true, message: '请选择至少一个商品类别', trigger: 'submit' } //* 点击提交时触发验证
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
              const cutoff = new Date('2023-03-19')
              if (date > cutoff) {
                callback(new Error('注册时间不得晚于2023年3月19日'))
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
    //TODO: 缺少异常处理；修改成PUT请求
    signin() {
      // this.HandleCategories() //* 将多个单词用+拼起来
      // NOTE: 前端检查是否符合规范
      this.$refs.form.validate((valid) => {
        console.log(valid)
        if (valid) {
          // this.AddArray() //* 将categories数组增加10个空元素
          this.signForm.categories.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
          // TODO:加入 loading 遮罩层，在请求数据时显示加载动画，避免用户误以为页面卡顿或未响应。?
          //NOTE: 把注册成功后的弹窗放在后端响应成功的回调函数中，确保在后端成功保存数据后再弹窗。
          // NOTE: 处理注册逻辑
          console.log('申请提交', this.signForm) // 控制台输出信息
          this.loading = true // 开启 loading 动画
          axios
            .post('http://localhost:9000/shop/reg', this.signForm)
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
                this.dialogFormVisible = false
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
          this.$refs.form.resetFields() // 重置表单
        } else {
          return false
        }
      })
    },
    // NOTE: 将数组中的单词变成一个字符串，中间用 + 连接
    HandleCategories() {
      this.signForm.categories = this.categories.join('+')
      console.log(this.signForm.categories)
    },
    AddArray() {
      this.categories.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    }
  }
}
</script>

<style scoped>
/*.el-button--text {*/
/*  margin-right: 15px;*/
/*}*/

/*.el-select {*/
/*  width: 300px;*/
/*}*/

/*.el-input {*/
/*  width: 300px;*/
/*}*/

.dialog-footer button:first-child {
  margin-right: 10px;
}

.DiaButton {
  margin: 12px;
  /*padding-top: 10px;*/
  /*background-color: #53A6FC;*/
  /*border-color: #1890ff;*/
  /*color: #fff;*/
}
</style>
