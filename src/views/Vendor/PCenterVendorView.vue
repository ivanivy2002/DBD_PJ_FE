<template>
  <div class="aside">
    <el-menu :default-active="activeSelect" class="el-menu-vertical-demo" @select="handleSelect">
      <el-menu-item index="1">
        <el-icon><User /></el-icon>
        个人信息
      </el-menu-item>
      <el-menu-item index="2">
        <el-icon><Edit /></el-icon>修改信息</el-menu-item
      >
      <el-menu-item index="3"
        ><el-icon><WarningFilled /></el-icon>修改密码</el-menu-item
      >
      <el-menu-item index="4"
        ><el-icon><Money /></el-icon>查看资金</el-menu-item
      >
      <!-- <el-menu-item index="5"
        ><el-icon><Position /></el-icon>收货地址管理</el-menu-item
      > -->
    </el-menu>
  </div>
  <div class="personal-center">
    <!-- <div> -->
    <div v-if="activeSelect === '1'" class="personal-info-display">
      <h2>个人信息</h2>
      <div class="info-item">
        <span class="label">用户名: </span>
        <strong class="value">{{ userInfoForm.userName }}</strong>
      </div>
      <div class="info-item">
        <span class="label">邮箱: </span>
        <strong class="value">{{ userInfoForm.email }}</strong>
      </div>
      <div class="info-item">
        <span class="label">身份证号: </span>
        <strong class="value">{{ userInfoForm.idNumber }}</strong>
      </div>
      <div class="info-item">
        <span class="label">手机号: </span>
        <strong class="value">{{ userInfoForm.phoneNumber }}</strong>
      </div>
    </div>
    <div v-if="activeSelect === '2'" class="personal-info-display">
      <h2>修改个人信息</h2>
      <el-form
        :model="userInfoForm"
        :rules="rules"
        ref="userInfo"
        label-width="120px"
        class="user-form"
      >
        <!-- BUG: 输入值之后移开鼠标再点击不会变成原来的值 -->
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="userInfoForm.userName"
            :placeholder="userInfoForm.userName"
            onfocus="if (this.placeholder == this.value) this.value = ''"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="userInfoForm.email"
            :placeholder="userInfoForm.email"
            onfocus="if (this.placeholder == this.value) this.value = ''"
          ></el-input>
        </el-form-item>
        <!-- NOTE: 身份证号不可修改 -->
        <el-form-item label="身份证号" prop="idNumber">
          <el-input
            v-model="userInfoForm.idNumber"
            :placeholder="userInfoForm.idNumber"
            onfocus="if (this.placeholder == this.value) this.value = ''"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input
            v-model="userInfoForm.phoneNumber"
            :placeholder="userInfoForm.phoneNumber"
            onfocus="if (this.placeholder == this.value) this.value = ''"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeInfo">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="activeSelect === '4'" class="personal-balance">
      <h2>个人资金</h2>
      <p>当前余额: {{ balance }}</p>
      <el-form
        :model="balance"
        :rules="balanceRules"
        ref="balanceForm"
        label-width="120px"
        class="balance-form"
      >
        <el-form-item label="充值金额" prop="balance">
          <el-input v-model="rechargeAmount" type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="recharge(rechargeAmount)">充值</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="activeSelect === '3'" class="change-password">
      <h2>修改密码</h2>
      <el-form
        :model="changePasswordForm"
        :rules="rules"
        ref="passwordForm"
        label-width="120px"
        class="password-form"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="changePasswordForm.oldPassword"
            type="password"
            :show-password="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="changePasswordForm.newPassword"
            type="password"
            :show-password="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="changePasswordForm.confirmPassword"
            type="password"
            :show-password="true"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changePassword">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'
//? 下面这句话为什么用不到啊
// import { User, Edit, WarningFilled, Money } from '@element-plus/icons-vue'

export default {
  data() {
    return {
      dialogVisible: false,
      activeSelect: '1',
      userInfoForm: {
        userName: 'gan',
        email: '2251@vwv.com',
        idNumber: '30212566965845212X',
        phoneNumber: '18566965325'
      },
      balance: 100,
      // TODO: 下面这个参数似乎没有用到
      rechargeAmount: 0,
      changePasswordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      addresses: [],
      addressForm: {
        id: '',
        userId: '',
        name: '',
        phoneNumber: '',
        address: '',
        ifDefault: ''
      },
      defaultAddress: '',
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
      validatePassword: (rule, value, callback) => {
        if (!/(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,32}$/.test(value)) {
          callback(new Error('密码⻓度为6-32个字符；字⺟，数字或者特殊字符（-_）⾄少包含两种！'))
        } else {
          callback()
        }
      },
      validateConfirmPassword: (rule, value, callback) => {
        if (value !== this.changePasswordForm.newPassword) {
          callback(new Error('两次输入的密码不一致！'))
        } else {
          callback()
        }
      }
    }
  },
  mounted() {
    // 获取用户信息和余额
    this.getUserInfo()
    this.getBalance()
    this.getAddressInfo()
    this.addressForm.userId = localStorage.getItem('userId')
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
        email: [
          {
            required: true,
            type: 'email',
            message: '请输入正确的邮箱地址！',
            trigger: ['blur', 'change']
          }
        ],
        oldPassword: [
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
        newPassword: [
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
        ]
      }
    }
  },
  methods: {
    getUserInfo() {
      // 发送请求获取用户信息
      try {
        // TODO: 未做session测试
        console.log(localStorage.getItem('userId')) // 从session中拿数据向后端请求
        const response = axios
          .get('/api/user/displayInfo', {
            params: {
              userId: localStorage.getItem('userId') //获取cookie中的id
              // userId: 20
            }
          })
          .then((response) => {
            console.log(response)
            this.userInfoForm = {
              //* 拿数据
              userName: response.data.data.userName,
              email: response.data.data.email,
              idNumber: response.data.data.idNumber,
              phoneNumber: response.data.data.phoneNumber
            }
            // TODO: 如果修改的话需要更新session
            // sessionStorage.setItem('role', response.data.role)
            // sessionStorage.setItem('id', response.data.id)
            // sessionStorage.setItem('userName', response.data.userName)
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
    getBalance() {
      // 发送请求获取余额
      try {
        const response = axios
          .get('/api/user/displayAccount', {
            params: {
              userId: localStorage.getItem('userId') //获取cookie中的id
            }
          })
          .then((response) => {
            this.balance = response.data.data.balance
          })
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
    recharge(rechargeAmount) {
      try {
        // NOTE: 下面第二个参数是null很有意思
        if (rechargeAmount <= 0) {
          ElMessage({
            showClose: true,
            type: 'error',
            message: '充值金额有误'
          })
          return
        }
        const response = axios
          .post('/api/user/recharge', null, {
            params: {
              userId: localStorage.getItem('userId'), //获取cookie中的id
              // userId: 20,
              amount: rechargeAmount
              // TODO: 这里amount和balance的命名和关系
            }
          })
          .then((response) => {
            console.log(response)
            // this.balance = response.data.balance
            ElMessage({
              showClose: true,
              type: 'success', //如果失败,未连接上后端
              message: '充值成功'
            })
            this.getBalance() //刷新余额
          })
      } catch (error) {
        console.log(error)
        ElMessage({
          showClose: true,
          type: 'error', //如果失败,未连接上后端
          message: '充值失败, 开发问题'
        })
      }
    },
    changeInfo() {
      try {
        // NOTE: 验证表单是否符合规范
        this.$refs.userInfo.validate((valid) => {
          console.log(valid)
          if (valid) {
            const response = axios
              .put('/api/user/changeInfo', {
                userId: localStorage.getItem('userId'), //获取cookie中的id
                // userId: 20,
                userName: this.userInfoForm.userName,
                email: this.userInfoForm.email,
                idNumber: this.userInfoForm.idNumber,
                phoneNumber: this.userInfoForm.phoneNumber
                // NOTE: 这里应该不需要password，因为修改信息不需要密码
              })
              .then((response) => {
                console.log(response)
                if (response.data.code === 200) {
                  ElMessage({
                    showClose: true,
                    type: 'success', //如果失败,未连接上后端
                    message: '修改信息成功'
                  })
                  this.getUserInfo() //刷新信息
                } else {
                  console.error('修改个人信息失败')
                  ElMessage({
                    showClose: true,
                    type: 'error', //如果失败输出状态码
                    message: '注册失败:' + response.data.msg
                  })
                }
                // this.userInfoForm = response.data
              })
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
    changePassword() {
      this.$refs.passwordForm.validate((valid) => {
        console.log(valid)
        if (valid) {
          try {
            const response = axios
              .put('/api/user/changePassword', null, {
                params: {
                  password: this.changePasswordForm.oldPassword,
                  newPassword: this.changePasswordForm.newPassword,
                  // userId: 20
                  userId: localStorage.getItem('userId') //获取cookie中的id
                }
              })
              .then((response) => {
                console.log(response)
                if (response.data.code === 200) {
                  ElMessage({
                    showClose: true,
                    type: 'success', //如果失败,未连接上后端
                    message: '修改密码成功'
                  })
                  this.getUserInfo() //刷新信息
                } else {
                  // console.error('修改密码失败')
                  ElMessage({
                    showClose: true,
                    type: 'error', //如果失败输出状态码
                    message: '注册失败:' + response.data.msg
                  })
                }
              })
          } catch (error) {
            console.log(error)
            ElMessage({
              showClose: true,
              type: 'error', //如果失败,未连接上后端
              message: '修改密码失败, 开发问题'
            })
          }
        }
      })
    },
    async getAddressInfo() {
      // 拿地址的数据
      await axios
        .get('/api/address/display', {
          params: {
            userId: localStorage.getItem('userId') //获取cookie中的id
          }
        })
        .then((response) => {
          if (response.data.code === 200) {
            this.addresses = response.data.data
          } else {
            ElMessage({
              showClose: true,
              type: 'error', //如果失败输出状态码
              message: '获取地址失败:' + response.data.msg
            })
          }
        })
    },
    createAddress() {
      this.dialogVisible = true
    },
    deleteAddress(id) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios
            .put('/api/address/remove', null, {
              params: {
                addressId: id
              }
            })
            .then((response) => {
              if (response.data.code === 200) {
                ElMessage({
                  showClose: true,
                  type: 'success',
                  message: '删除成功'
                })
                this.getAddressInfo() //刷新信息
              } else {
                ElMessage({
                  showClose: true,
                  type: 'error',
                  message: '删除失败:' + response.data.msg
                })
              }
            })
        })
        .catch(() => {
          ElMessage({
            showClose: true,
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    editAddress(id, name, phoneNumber, address, ifDefault) {
      this.dialogVisible = true
      this.addressForm.id = id
      this.addressForm.name = name
      this.addressForm.phoneNumber = phoneNumber
      this.addressForm.address = address
      this.addressForm.ifDefault = ifDefault
      // this.form = { ...this.addresses[index] }
      // this.editIndex = index
    },
    saveAddress() {
      this.$refs.addressForm.validate((valid) => {
        if (valid) {
          axios.post('/api/address/createOrUpdate', this.addressForm).then((response) => {
            if (response.data.code === 200) {
              ElMessage({
                showClose: true,
                type: 'success',
                message: '操作成功'
              })
              this.getAddressInfo() //刷新信息
            } else {
              ElMessage({
                showClose: true,
                type: 'error', //如果失败输出状态码
                message: '操作失败:' + response.data.msg
              })
            }
          })
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    resetForm() {
      //* 重置表单
      this.$refs.userInfo.resetFields()
      this.getUserInfo() //刷新表单
    },
    handleSelect(index) {
      this.activeSelect = index // 根据点击的菜单项更新显示的栏目
    }
  }
}
</script>

<style>
/* body {
  background-color: #2d2d2d;
  font-family: Arial, sans-serif;
} */
.info-item {
  margin-top: 10px;
}

.personal-info,
.personal-modify {
  margin-top: 50px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  /* margin: 50px;
  color: #ffffff; */
}

.personal-info-display,
.personal-balance,
.change-password {
  /* background-color: linear-gradient(-45deg, #a0c7ca, #83e6e1); */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  padding: 30px;
  border-radius: 5px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #fcfcfc;
}

.user-form,
.balance-form,
.password-form {
  margin-top: 20px;
}

.el-form-item {
  margin-bottom: 15px;
}

.el-button {
  background-color: #66ccff;
  border: none;
  cursor: pointer;
  padding: 10px 20px;
  font-size: 16px;
  color: #ffffff;
  margin-right: 10px;
}

.el-button:hover {
  background-color: #4db8ff;
}

.el-button[type='primary'] {
  background-color: #4db8ff;
}

.el-button[type='primary']:hover {
  background-color: #3da6ff;
}

.el-input {
  /* background-color: #666; */
  color: #ffffff;
  border-radius: 4px;
  border: none;
  padding: 0 10px;
  box-shadow: none;
  transition: all 0.3s ease;
}

.el-input::placeholder {
  color: #aaa;
}

.el-input:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(102, 204, 255, 0.5);
  border-color: #66ccff;
}

.aside {
  margin: 20px;
  float: left;
  margin-right: 20px;
}

/* 设置菜单栏的宽度和高度 */
.el-menu-vertical-demo {
  width: 200px;
  height: 100%;
}

/* 设置菜单项的字体大小和颜色 */
.el-menu-item {
  font-size: 16px;
  color: #606266;
}

/* 鼠标悬停在菜单项上时的背景色 */
.el-menu-item:hover {
  background-color: #f5f7fa;
}

/* 设置菜单的边框和背景色 */
.aside {
  border: 1px solid #ebeef5;
  background-color: #fff;
}

.box-card {
  background-color: linear-gradient(-45deg, #a0c7ca, #83e6e1);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
  width: 600px;
  max-width: 600px;
}

.address-name {
  /* font-family: 'songti'; */
  font-size: 25px;
  font-weight: 500;
  font-style: normal;
  color: #000000;
}
.defaultAddress {
  display: inline-block;
  padding: 4px 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}
.defaultAddress span {
  margin-right: 4px;
}
</style>

<!-- <style scoped>
.personal-center {
  display: flex;
  flex-wrap: wrap;
  background-color: #222831;
  padding: 2rem;
  color: #eeeeee;
  font-family: 'Roboto', sans-serif;
}

.personal-info,
.personal-balance,
.change-password {
  background-color: #393e46;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.personal-info h2,
.personal-balance h2,
.change-password h2 {
  margin-bottom: 1rem;
  color: #00adb5;
}

.el-form-item {
  margin-bottom: 1.5rem;
}

.el-button {
  background-color: #00adb5;
  border-color: #00adb5;
  margin-right: 1rem;
  color: #eeeeee;
}

.el-button:hover {
  background-color: #00868b;
  border-color: #00868b;
}

.el-input {
  background-color: #eeeeee;
  color: #222831;
}

.el-input__inner {
  background-color: #eeeeee;
  color: #222831;
  border-color: #00adb5;
}

.el-input__inner:focus {
  border-color: #00adb5;
}

.el-input__inner:hover {
  border-color: #00adb5;
}

.el-input.is-disabled .el-input__inner {
  background-color: #b3b3b3;
  color: #666666;
}
</style> -->

<!-- <style>
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
</style> -->
