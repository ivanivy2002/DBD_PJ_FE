<template>
  <div id="background"></div>
  <div class="center">
    <!-- TODO: 通过修改URL造成错误的消息提示 -->
    <!-- <div class="errorInfo">
          <h2>{{ error }}</h2>
        </div> -->
    <div class="title">
      <div class="title-text">
        <h1>Welcome to GanSui Mall!</h1>
      </div>
    </div>
    <div class="parent-element">
      <el-tabs type="card" v-model="activeTab">
        <el-tab-pane label="登录" id="login1" name="login">
          <el-form :model="loginForm" :label-width="label_width">
            <!--          wrapper-width="200"-->
            <el-form-item label="用户名" id="login2">
              <el-input
                v-model="loginForm.userName"
                placeholder="请输入您的用户名"
                onfocus="if (this.placeholder == this.value) this.value = ''"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" class="login">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入您的密码"
                onfocus="if (this.placeholder == this.value) this.value = ''"
              ></el-input>
            </el-form-item>
            <el-form-item label="管理员" id="login3">
              <el-radio-group v-model="loginForm.role">
                <el-radio label="1" size="large">是</el-radio>
                <el-radio label="0" size="large">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login">登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="注册" name="register">
          <el-form ref="form" :model="registerForm" :label-width="label_width" :rules="rules">
            <!--   size="large"-->
            <!-- 以下为单选框 -->
            <div>
              <el-radio-group v-model="registerForm.role">
                <el-radio label="1" size="large" border>普通用户</el-radio>
                <el-radio label="2" size="large" border>商户</el-radio>
              </el-radio-group>
            </div>
            <br />
            <!-- NOTE: 默认有文字，开始输入之后文字消失 使用 JavaScript 在 focus 事件中设置输入框的 value 属性为空 -->
            <div class="input-reader-name">
              <el-form-item label="用户名" prop="userName">
                <el-input
                  v-model="registerForm.userName"
                  placeholder="请输入您的用户名"
                  onfocus="if (this.placeholder == this.value) this.value = ''"
                ></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="phoneNumber">
                <el-input
                  v-model="registerForm.phoneNumber"
                  placeholder="请输入您的手机号"
                  onfocus="if (this.placeholder == this.value) this.value = ''"
                ></el-input>
              </el-form-item>
              <el-form-item label="身份证号" prop="idNumber">
                <el-input
                  v-model="registerForm.idNumber"
                  type="text"
                  placeholder="请输入您的身份证号"
                  onfocus="if (this.placeholder == this.value) this.value = ''"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input
                  v-model="registerForm.email"
                  type="email"
                  placeholder="请输入您的邮箱"
                  onfocus="if (this.placeholder == this.value) this.value = ''"
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="registerForm.password"
                  type="password"
                  placeholder="请输入您的密码"
                  onfocus="if (this.placeholder == this.value) this.value = ''"
                  :show-password="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  v-model="registerForm.confirmPassword"
                  type="password"
                  placeholder="请再次输入您的密码"
                  onfocus="if (this.placeholder == this.value) this.value = ''"
                  :show-password="true"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="register">注册</el-button>
                <el-button type="default" @click="resetForm">重置</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  ElTabs,
  ElTabPane,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
  ElRadio,
  ElRadioGroup
} from 'element-plus'
import axios from 'axios'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginView',
  components: {
    ElTabs,
    ElTabPane,
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElRadio,
    ElRadioGroup
  },
  data() {
    return {
      activeTab: 'login',
      label_width: 80,
      backUrl: '', //* 访问后端的URL（管理员与普通用户不同）
      frontUrl: '', //* 访问前端的URL（商户与普通用户不同）
      loginForm: {
        userName: '',
        password: '',
        role: '1'
      },
      registerForm: {
        userName: '',
        password: '',
        phoneNumber: '',
        idNumber: '',
        email: '',
        confirmPassword: '',
        role: '1'
      },
      error: null,
      // NOTE: 以下为前端输入格式检查
      validateUserName: (rule, value, callback) => {
        if (!/^(?!_)(?!.*?_$)[a-zA-Z0-9_]{3,10}$/.test(value)) {
          callback(new Error('用户名仅能出现英⽂字符、数字与下划线，⻓度为3-10个字符！'))
        } else {
          callback()
        }
      },
      //* 中国大陆手机号格式：以数字 1 开头、第二位是 3-9 中的任意一个数字，后面紧跟着 9 个数字的字符串
      validatePhoneNumber: (rule, value, callback) => {
        if (!/^1[3-9]\d{9}$/.test(value)) {
          callback(new Error('请输入正确的手机号！'))
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
      validatePassword: (rule, value, callback) => {
        if (!/(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,32}$/.test(value)) {
          callback(new Error('密码⻓度为6-32个字符；字⺟，数字或者特殊字符（-_）⾄少包含两种！'))
        } else {
          callback()
        }
      },
      validateConfirmPassword: (rule, value, callback) => {
        if (value !== this.registerForm.password) {
          callback(new Error('两次输入的密码不一致！'))
        } else {
          callback()
        }
      },
      validateRole: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择用户角色！'))
        } else {
          callback()
        }
      }
    }
  },
  computed: {
    //* 使用 required: true 规定该输入框是必填的，如果用户未输入用户名，则会弹出一个提示信息：“请输入用户名”。
    //* 使用 trigger: 'blur' 规定在用户离开输入框时进行验证
    rules: function () {
      return {
        userName: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          },
          { validator: this.validateUserName, trigger: 'blur' }
        ],

        phoneNumber: [{ required: true, validator: this.validatePhoneNumber, trigger: 'blur' }],
        idNumber: [{ required: true, validator: this.validateIdNumber, trigger: 'blur' }],
        email: [
          {
            required: true,
            type: 'email',
            message: '请输入正确的邮箱地址！',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            validator: this.validatePassword,
            min: 6,
            max: 32,
            // message: '请输入正确格式的密码！',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {
            required: true,
            message: '请再次输入密码',
            trigger: 'blur'
          },
          { validator: this.validateConfirmPassword, trigger: 'blur' }
        ],
        role: [
          {
            required: true,
            message: '请选择用户角色',
            trigger: 'blur'
          },
          { validator: this.validateRole, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields()
    },
    async login() {
      // 异步发送post请求
      try {
        // eslint-disable-next-line no-unused-vars
        const router = useRouter()
        // NOTE: 区分是管理员还是非管理员
        console.log(this.loginForm.role)
        if (this.loginForm.role == 0) {
          //* 非管理员
          this.backUrl = '/api/user/login'

          const response = await axios.get(this.backUrl, {
            params: {
              // 查询
              userName: this.loginForm.userName,
              password: this.loginForm.password,
              // TODO:可能有隐藏的bug
              role: this.loginForm.role
            },
            withCredentials: true // 携带session信息
          })
          // eslint-disable-next-line no-unused-vars
          const { token, user } = response.data // 验证返回值
          console.log(response.data)
          // 处理登录逻辑，例如将token和用户信息保存到浏览器本地缓存
          localStorage.setItem('token', token)
          console.log(response)
          if (response.data.code == 200) {
            console.log('登录成功', response.data) //控制台输出
            ElMessage({
              //用于弹出消息提示
              showClose: true,
              type: 'success', //如果成功
              message: '登录成功'
            })
            // NOTE: 将从Controller层获取的用户信息存储到localStorage中
            localStorage.setItem('role', response.data.role)
            localStorage.setItem('userId', response.data.userId)
            localStorage.setItem('shopId', response.data.shopId)
            localStorage.setItem('username', response.data.userName)
            const role = localStorage.getItem('role')
            // NOTE: 这个测试成功了
            console.log(role)
            console.log(localStorage)
            // HACK: sleep 50ms 未进行测试
            await this.sleep(50) //* 等待50ms
            if (role == 1) {
              this.backUrl = '/home/orduser' //* 跳转到普通用户主页
            } else {
              this.backUrl = '/home/vendor' //* 跳转到商户主页
            }
            this.$router.push(this.backUrl)
          } else {
            // console.error('登录失败', error)
            ElMessage({
              showClose: true,
              type: 'error', //如果失败输出状态码
              message: '登录失败:' + response.data.msg
            })
          }
        } else if (this.loginForm.role == 1) {
          //* 管理员
          // TODO: 后端接口有些修改，前端也需要相应修正，管理员和非管理员URL相同
          this.backUrl = '/api/user/login'
          const response = await axios.get(this.backUrl, {
            params: {
              // 查询
              userName: this.loginForm.userName,
              password: this.loginForm.password,
              // role: 3
              role: this.loginForm.role
              // session: this.loginForm.session
            }
          })
          // eslint-disable-next-line no-unused-vars
          const { token, user } = response.data // 验证返回值
          // NOTE:处理登录逻辑，例如将token和用户信息保存到本地缓存
          localStorage.setItem('token', token)
          // localStorage.setItem('role', user.role)
          // localStorage.setItem('id', user.id)
          // localStorage.setItem('userName', user.userName)
          // localStorage.setItem('user', JSON.stringify(user))
          // localStorage.getItem('token')
          console.log(response.data)
          // console.log(response.data.code)
          if (response.data.code == 200) {
            console.log('登录成功', response.data) //控制台输出
            ElMessage({
              //用于弹出消息提示
              showClose: true,
              type: 'success', //如果成功
              message: '登录成功'
            })
            // NOTE: 将从Controller层获取的用户信息存储到localStorage中
            localStorage.setItem('role', response.data.role)
            localStorage.setItem('id', response.data.id)
            localStorage.setItem('username', response.data.userName)
            // HACK: sleep 50ms 未进行测试
            await this.sleep(50) //* 等待50ms
            console.log(this.loginForm.role)
            this.$router.push('/home/admin') //* 跳转到管理员主页
          } else {
            // console.error('登录失败', error)
            ElMessage({
              showClose: true,
              type: 'error', //如果失败输出状态码
              message: '登录失败:' + response.data.msg
            })
          }
        } else {
          //* 出错
          // console.log(error)
          ElMessage({
            showClose: true,
            type: 'error', //如果失败,未连接上后端
            message: '登录失败：未成功连接后端'
          })
        }
        // NOTE: 不需要在前端转换成JSON
        this.$refs.form.resetFields() // 重置表单
      } catch (error) {
        console.error('登录失败', error)
        ElMessage({
          showClose: true,
          type: 'error', //如果失败,未连接上后端
          message: '登录失败'
        })
      }
    },
    register() {
      // NOTE: 检查填写的表单是否符合rules
      this.$refs.form.validate((valid) => {
        console.log(valid)
        if (valid) {
          // TODO:加入 loading 遮罩层，在请求数据时显示加载动画，避免用户误以为页面卡顿或未响应。?
          // 把注册成功后的弹窗放在后端响应成功的回调函数中，确保在后端成功保存数据后再弹窗。
          // NOTE: 处理注册逻辑
          console.log('注册', this.registerForm) // 控制台输出信息
          this.loading = true // 开启 loading 动画
          axios
            .post('/api/user/reg', this.registerForm)
            .then((response) => {
              console.log(response.data)
              // NOTE: 只有当后端返回200时显示注册成功
              // NOTE: response.data.code
              if (response.data.code === 200) {
                console.log('注册成功')
                ElMessage({
                  //用于弹出消息提示
                  showClose: true,
                  type: 'success', //如果成功
                  message: '注册成功'
                })
                this.resetForm() //* 如果注册成功则重置表单
              } else {
                console.error('注册失败')
                ElMessage({
                  showClose: true,
                  type: 'error', //如果失败输出状态码
                  message: '注册失败:' + response.data.msg
                })
              }
            })
            .catch((error) => {
              console.error(error)
              ElMessage({
                showClose: true,
                type: 'error', //如果失败，未连接上后端
                message: '注册失败:' + '500'
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
    sleep(ms) {
      // sleep 多少 ms
      return new Promise((resolve) => setTimeout(resolve, ms))
    }
  },
  // NOTE: 用于提示被重定向的用户错误信息
  mounted() {
    this.error = this.$route.query.error
  }
}
</script>

<style scoped>
#background {
  height: 100vh;
  background: linear-gradient(to bottom right, #c2e7ef, #abe5ef);
  /* background: url("https://images.unsplash.com/photo-1523875969136-392c28a97f81?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80") no-repeat center center fixed; */
  /* -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover; */
}

.title {
  overflow: hidden;
  font-size: 1em;
}

.title-text h1 {
  background: linear-gradient(to right, #6fcde5, #6cdbe8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  /* animation: scroll 10s linear infinite; */
  white-space: nowrap;

  position: relative;
  top: -60px;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
#login1,
#login2 {
  margin-top: 30px;
}
.parent-element {
  position: relative;
  top: -35px;
}
el-tabs {
  position: absolute;
  top: 0;
  left: 0;
}
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 650px;
  height: 600px;
  padding: 20px;
  background-color: #ffffff;
  /* background: linear-gradient(to bottom right, #177f7f, #32c8b2); */
  border-radius: 20px;
}

/*.el-tabs__header {*/
/*  padding: 0;*/
/*  margin-bottom: 0;*/
/*}*/

/*.el-tabs__nav {*/
/*  border-bottom: none;*/
/*  margin-top: 0;*/
/*}*/

/*.el-tabs__item {*/
/*  color: #606266;*/
/*  font-size: 16px;*/
/*  height: 50px;*/
/*  line-height: 50px;*/
/*}*/

/*.el-tabs__active-bar {*/
/*  background-color: #409eff;*/
/*  height: 2px;*/
/*}*/

/*.el-form-item__label {*/
/*  text-align: left;*/
/*  color: #606266;*/
/*  margin-bottom: 10px;*/
/*  font-weight: bold;*/
/*}*/

/*.el-input__inner {*/
/*  border-radius: 5px;*/
/*  padding: 0 15px;*/
/*  height: 40px;*/
/*  border: 1px solid #dcdfe6;*/
/*}*/

/*.el-button {*/
/*  padding: 9px 20px;*/
/*  border-radius: 5px;*/
/*}*/
</style>
