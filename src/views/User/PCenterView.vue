<template>
  <div class="personal-center">
    <div class="personal-info">
      <h2>个人信息</h2>
      <el-form
        :model="userInfoForm"
        :rules="rules"
        ref="userInfo"
        label-width="120px"
        class="user-form"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userInfoForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userInfoForm.email"></el-input>
        </el-form-item>
        <!-- NOTE: 身份证号不可修改 -->
        <el-form-item label="身份证号" prop="idNumber">
          <el-input v-model="userInfoForm.idNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="userInfoForm.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeInfo">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="personal-balance">
      <h2>个人资金</h2>
      <p>当前余额: {{ balance }}</p>
      <el-form
        :model="balance"
        :rules="balanceRules"
        ref="balanceForm"
        label-width="120px"
        class="balance-form"
      >
        <el-form-item label="充值金额" prop="amount">
          <el-input v-model="balance.amount"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="recharge(amount)">充值</el-button>
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
        userName: '',
        email: '',
        idNumber: '',
        phoneNumber: ''
      },
      balance: {
        amount: 100
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
      try {
        // TODO: 未做session测试
        console.log(localStorage.getItem('id'))// 从session中拿数据像后端请求
        const response = await axios.get('http://localhost:9000/user/displayInfo', {
          params: {
            userId: localStorage.getItem('id')//获取cookie中的id
          }
        })
        // NOTE: 如果修改的话需要更新session
        sessionStorage.setItem('role', response.data.role)
        sessionStorage.setItem('id', response.data.id)
        sessionStorage.setItem('userName', response.data.userName)
        console.log(response.data)
        this.userInfoForm = {//* 拿数据
          userName: response.data.userName,
          email: response.data.email,
          idNumber: response.data.idNumber,
          phoneNumber: response.data.phoneNumber
        }
        // // 前端写死的假数据
        // this.userInfoForm = {
        //   userName: 'Alice',
        //   email: 'alice@example.com',
        //   idNumber: '123456789012345678',
        //   phoneNumber: '12345678901'
        // }
      } catch (error) {
        console.log(error)
        ElMessage({
          showClose: true,
          type: 'error', //如果失败,未连接上后端
          message: '修改信息失败, 开发问题'
        })
      }

    },
    async getBalance() {// 发送请求获取余额
      try {
        const response = await axios.get('http://localhost:9000/user/displayAccount', {
          params: {
            userId: localStorage.getItem('id')//获取cookie中的id
          }
        })
        this.balance = response.data.balance

      } catch (error) {
        console.log(error)
        ElMessage({
          showClose: true,
          type: 'error', //如果失败,未连接上后端
          message: '修改信息失败, 开发问题'
        })
      }
      // // 前端写死的假数据
      // this.balance = 100.0
    },
    async recharge() {
      try {
        const response = await axios.post('http://localhost:9000/user/recharge', {
          userId: localStorage.getItem('id'),//获取cookie中的id
          amount: this.balance.amount
        })
        this.balance = response.data.balance
        ElMessage({
          showClose: true,
          type: 'success', //如果失败,未连接上后端
          message: '充值成功'
        })
        this.getBalance() //刷新余额
      } catch (error) {
        console.log(error)
        ElMessage({
          showClose: true,
          type: 'error', //如果失败,未连接上后端
          message: '充值失败, 开发问题'
        })
      }
    },
    async changeInfo() {
      try {
        // NOTE: 验证表单是否符合规范
        this.$refs.userInfo.validate((valid) => {
          console.log(valid)
          if (valid) {
            const response = await axios.post('http://localhost:9000/user/changeInfo', {
              userId: localStorage.getItem('id'),//获取cookie中的id
              userName: this.userInfoForm.userName,
              email: this.userInfoForm.email,
              idNumber: this.userInfoForm.idNumber,
              phoneNumber: this.userInfoForm.phoneNumber
              // NOTE: 这里应该不需要password，因为修改信息不需要密码
            })
            this.userInfoForm = response.data
            ElMessage({
              showClose: true,
              type: 'success', //如果失败,未连接上后端
              message: '修改信息成功'
            })
            this.getUserInfo() //刷新信息
          }
        })

      } catch (error) {
        console.log(error)
        ElMessage({
          showClose: true,
          type: 'error', //如果失败,未连接上后端
          message: '修改信息失败, 开发问题'
        })
      }
    },
    async changePassword() {
      this.$refs.passwordForm.validate((valid) => {
        console.log(valid)
        if (valid) {
          try {
            const response = await axios.post('http://localhost:9000/user/changePassword', {
              userId: localStorage.getItem('id'),//获取cookie中的id
              oldPassword: this.password.oldPassword,
              newPassword: this.password.newPassword
            })
            this.password = response.data
            ElMessage({
              showClose: true,
              type: 'success', //如果失败,未连接上后端
              message: '修改密码成功'
            })
            this.getUserInfo() //刷新信息
          } catch (error) {
            console.log(error)
            ElMessage({
              showClose: true,
              type: 'error', //如果失败,未连接上后端
              message: '修改密码失败, 开发问题'
            })
          }
          this.$message.success('密码更新成功')
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
    resetForm() {//* 重置表单
      this.$refs.userInfo.resetFields()
    },

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
.personal-balance,
.change-password {
  margin-bottom: 30px;
}

.user-form,
.balance-form,
.password-form {
  max-width: 400px;
  margin: 20px auto;
}
</style>
