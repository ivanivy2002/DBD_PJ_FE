<template>
  <div class="personal-center">
    <div class="personal-info">
      <h2>个人信息</h2>
      <el-form :model="userInfoForm" :rules="rules" ref="userInfo" label-width="120px" class="user-form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfoForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userInfoForm.email"></el-input>
        </el-form-item>
        <!-- NOTE: 身份证号不可修改 -->
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="userInfoForm.idCard" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userInfoForm.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="personal-fund">
      <h2>个人资金</h2>
      <p>当前余额: {{ balance }}</p>
      <el-form
        :model="fund"
        :rules="fundRules"
        ref="fundForm"
        label-width="120px"
        class="fund-form"
      >
        <el-form-item label="充值金额" prop="amount">
          <el-input v-model="fund.amount"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addFund">充值</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="change-password">
      <h2>修改密码</h2>
      <el-form
        :model="password"
        :rules="passwordRules"
        ref="passwordForm"
        label-width="120px"
        class="password-form"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="password.oldPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="password.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="password.confirmPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitPassword">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      userInfoForm: {
        username: '',
        email: '',
        idCard: '',
        phone: ''
      },
      fund: {
        amount: ''
      },
      password: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
    }
  },
  mounted() {
    // 获取用户信息和余额
    this.getUserInfo()
    this.getBalance()
  },
  methods: {
    async getUserInfo() {// 发送请求获取用户信息
      console.log(localStorage.getItem('id'))
      const response = await axios.get('http://localhost:9000/user/displayInfo', {
        params: {
          userId: localStorage.getItem('id')//获取cookie中的id
        }
      })
      console.log(response.data)

      // // 示例代码
      // this.userInfoForm = {
      //   username: 'Alice',
      //   email: 'alice@example.com',
      //   idCard: '123456789012345678',
      //   phone: '12345678901'
      // }
    },
    getBalance() {
      // 发送请求获取余额
      // 示例代码
      this.balance = 100.0
    },
    addFund() {
      this.$refs.fundForm.validate((valid) => {
        if (valid) {
          // 发送请求充值
          // 示例代码
          this.balance += Number(this.fund.amount)
          this.fund.amount = ''
          this.$message.success('充值成功')
        }
      })
    },
    confirmPasswordValidator(rule, value, callback) {
      if (value !== this.password.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    },
    submitForm() {
      this.$refs.userInfo.validate((valid) => {
        if (valid) {
          // 发送请求更新用户信息
          // 示例代码
          this.$message.success('个人信息更新成功')
        }
      })
    },
    resetForm() {
      this.$refs.userInfo.resetFields()
    },
    submitPassword() {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          // 发送请求更新密码
          // 示例代码
          this.$message.success('密码更新成功')
        }
      })
    }
  }
}
</script>

<style>
.personal-center {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.personal-info,
.personal-fund,
.change-password {
  margin-bottom: 30px;
}

.user-form,
.fund-form,
.password-form {
  max-width: 400px;
  margin: 20px auto;
}
</style>
