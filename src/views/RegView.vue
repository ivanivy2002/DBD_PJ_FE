<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="登录" name="login">
        <el-form :model="loginForm" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="loginForm.userName"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="loginForm.password" type="password"></el-input>
          </el-form-item>
          <!-- TODO: 是否为管理员 -->
          <el-form-item label="管理员">
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
      <el-tab-pane label="注册" name="reg">
        <el-form ref="form" :model="registerForm" label-width="80px" :rules="rules">
          <!-- 以下为单选框 -->
          <div>
            <el-radio-group v-model="registerForm.role">
              <el-radio label="1" size="large" border>普通用户</el-radio>
              <el-radio label="2" size="large" border>商户</el-radio>
            </el-radio-group>
          </div>
          <br />
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="registerForm.userName"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phoneNumber">
            <el-input v-model="registerForm.phoneNumber"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="idNumber">
            <el-input v-model="registerForm.idNumber" type="text"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerForm.email" type="email"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="registerForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="register">注册</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
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
  name: 'RegView',
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
      activeTab: 'reg',
      loginForm: {
        userName: '',
        password: '',
        role: ''
      },
      registerForm: {
        userName: '',
        password: '',
        phoneNumber: '',
        idNumber: '',
        email: '',
        confirmPassword: '',
        role: ''
      },
      validateUserName: (rule, value, callback) => {
        if (!/^(?!_)(?!.*?_$)[a-zA-Z0-9_]{3,10}$/.test(value)) {
          callback(new Error('请输入正确格式的用户名！'))
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
        if (
          !/^(?=\w{6,32}$)(?=(?:.*?[A-Za-z].*){1,})(?=(?:.*?\d.*){1,}|(?:.*?[-_].*){1,}).*$/.test(
            value
          )
        ) {
          callback(new Error('请输入正确格式的密码！'))
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
      },
      //HACK: 引入$message组件
      $message: this.message
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
            message: '用户名仅能出现英⽂字符、数字与下划线，⻓度为3-10个字符',
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
            message: '⻓度为6-32个字符；字⺟，数字或者特殊字符（-_）⾄少包含两种',
            trigger: 'blur'
          },
          { min: 6, max: 20, message: '请输入正确格式的密码！', trigger: 'blur' }
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
    // NOTE: 处理登录逻辑
    async login() {
      // 异步发送post请求
      try {
        // TODO: URL需要修改成统一的格式（不要写localhost）
        const response = await axios.post('http://localhost:9000/api/login', this.loginForm)
        // NOTE: 不需要在前端转换成JSON
        const { token, user } = response.data // 验证返回值
        // 处理登录逻辑，例如将token和用户信息保存到本地缓存
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        if (response.data.status === 600) {
          console.log('登录成功', response.data) //控制台输出
          ElMessage({
            //用于弹出消息提示
            showClose: true,
            type: 'success', //如果成功
            message: '登录成功'
          })
          // HACK: sleep 50ms 未进行测试
          await this.sleep(50) //*
          useRouter().push('/') //* 跳转到主页
          // TODO: 登录之后的页面跳转
        } else {
          console.error('登录失败', error)
          ElMessage({
            showClose: true,
            type: 'error', //如果失败输出状态码
            message: '登录失败:' + response.data.msg
          })
        }
      } catch (error) {
        console.error('登录失败', error)
        ElMessage({
          showClose: true,
          type: 'error', //如果失败,未连接上后端
          message: '登录失败:' + '500'
        })
      }
    },
    register() {
      // HACK: 检查填写的表单是否符合rules
      this.$refs.form.validate((valid) => {
        console.log(valid)
        if (valid) {
          // TODO:加入 loading 遮罩层，在请求数据时显示加载动画，避免用户误以为页面卡顿或未响应。?
          // 把注册成功后的弹窗放在后端响应成功的回调函数中，确保在后端成功保存数据后再弹窗。
          // NOTE: 处理注册逻辑
          console.log('注册', this.registerForm) // 控制台输出信息
          this.loading = true // 开启 loading 动画
          axios
            .post('http://localhost:9000/user', this.registerForm)
            .then((response) => {
              console.log(response.data)
              // NOTE: 只有当后端返回200时显示注册成功
              if (response.data.code === 200) {
                console.log('注册成功')
                ElMessage({
                  //用于弹出消息提示
                  showClose: true,
                  type: 'success', //如果成功
                  message: '注册成功'
                })
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
  }
}
</script>
