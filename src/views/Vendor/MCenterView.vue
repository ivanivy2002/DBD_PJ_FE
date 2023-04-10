<template>
  <div class="shop-center">
    <div class="shop-info">
      <h2>修改商店信息(目前不需要！)</h2>
      <!--      <el-form-->
      <!--        :model="shopInfoForm"-->
      <!--        :rules="rules"-->
      <!--        ref="shopInfo"-->
      <!--        label-width="120px"-->
      <!--        class="shop-form"-->
      <!--      >-->
      <!--        &lt;!&ndash; BUG: 输入值之后移开鼠标再点击不会变成原来的值 &ndash;&gt;-->
      <!--        <el-form-item label="商店名称" prop="shopName">-->
      <!--          <el-input-->
      <!--            v-model="shopInfoForm.shopName"-->
      <!--            :placeholder="shopInfoForm.shopName"-->
      <!--            onfocus="if (this.placeholder == this.value) this.value = ''"-->
      <!--          ></el-input>-->
      <!--        </el-form-item>-->
      <!--        <el-form-item label="商店简介" prop="intro">-->
      <!--          <el-input-->
      <!--            v-model="shopInfoForm.intro"-->
      <!--            :placeholder="shopInfoForm.intro"-->
      <!--            onfocus="if (this.placeholder == this.value) this.value = ''"-->
      <!--          ></el-input>-->
      <!--        </el-form-item>-->
      <!--        &lt;!&ndash; NOTE: 身份证号不可修改 &ndash;&gt;-->
      <!--        <el-form-item label="备案地址" prop="vendorId">-->
      <!--          <el-input-->
      <!--            v-model="shopInfoForm.vendorId"-->
      <!--            :placeholder="shopInfoForm.vendorId"-->
      <!--            onfocus="if (this.placeholder == this.value) this.value = ''"-->
      <!--            disabled-->
      <!--          ></el-input>-->
      <!--        </el-form-item>-->
      <!--        <el-form-item>-->
      <!--          <el-button type="primary" @click="changeInfo">提交</el-button>-->
      <!--          <el-button @click="resetForm">重置</el-button>-->
      <!--        </el-form-item>-->
      <!--      </el-form>-->
    </div>
    <div class="shop-balance">
      <h2>商店资金</h2>
      <p>当前余额: {{ balance }}</p>
      <!-- :model="balance"-->
      <el-form ref="balanceForm" label-width="120px" class="balance-form">
        <el-form-item label="充值金额" prop="balance">
          <el-input v-model="rechargeAmount" type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="recharge(rechargeAmount)">充值</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'
export default {
  name: 'MCenterView',
  data() {
    return {
      // shopInfoForm: {
      //   shopName: 'GanSuiShop',
      //   email: '2251@vwv.com',
      //   address: '超级天空城3区55街道干碎小区',
      //   intro: 'what is life for?',
      //   vendorId: '30212566965845212X'
      // },
      balance: 100,
      rechargeAmount: 0,
      password: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      // NOTE: 以下为前端输入格式检查
      validateShopName: (rule, value, callback) => {
        if (!/^(?!_)(?!.*?_$)[a-zA-Z0-9_]{3,10}$/.test(value)) {
          callback(new Error('商店名称仅能出现英⽂字符、数字与下划线，⻓度为3-10个字符！'))
        } else {
          callback()
        }
      }
    }
  },
  mounted() {
    // 获取用户信息和余额
    // this.getShopInfo()
    this.getBalance()
  },
  computed: {
    //* 使用 required: true 规定该输入框是必填的，如果用户未输入商店名称，则会弹出一个提示信息：“请输入商店名称”。
    //* 使用 trigger: 'blur' 规定在用户离开输入框时进行验证
    rules: function () {
      return {
        shopName: [
          {
            required: true,
            message: '商店名称不能为空',
            trigger: 'blur'
          },
          { validator: this.validateshopName, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getShopInfo() {
      // 发送请求获取用户信息
      try {
        // TODO: 未做session测试
        console.log(localStorage.getItem('id')) // 从session中拿数据像后端请求
        const response = await axios.get('http://localhost:9000/shop/displayInfo', {
          params: {
            shopId: localStorage.getItem('id') //获取cookie中的id
          }
        })
        // NOTE: 如果修改的话需要更新session
        sessionStorage.setItem('role', response.data.role)
        sessionStorage.setItem('id', response.data.id)
        sessionStorage.setItem('shopName', response.data.shopName)
        console.log(response.data)
        this.shopInfoForm = {
          //* 拿数据
          shopName: response.data.shopName,
          email: response.data.email,
          vendorId: response.data.vendorId,
          phoneNumber: response.data.phoneNumber
        }
        // // 前端写死的假数据
        // this.shopInfoForm = {
        //   shopName: 'Alice',
        //   email: 'alice@example.com',
        //   vendorId: '123456789012345678',
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
    async getBalance() {
      // 发送请求获取余额
      try {
        const response = await axios.get('http://localhost:9000/shop/displayAccount', {
          params: {
            shopId: localStorage.getItem('id') //获取cookie中的id
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
    recharge() {
      try {
        const response = axios.post('http://localhost:9000/shop/recharge', {
          shopId: localStorage.getItem('id'), //获取cookie中的id
          amount: this.balance
          // TODO: 这里amount和balance的命名和关系
        })
        // this.balance = response.data.balance
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
    changeInfo() {
      try {
        // NOTE: 验证表单是否符合规范
        this.$refs.shopInfo.validate((valid) => {
          console.log(valid)
          if (valid) {
            const response = axios.put('http://localhost:9000/shop/changeInfo', {
              shopId: localStorage.getItem('id'), //获取cookie中的id
              shopName: this.shopInfoForm.shopName,
              email: this.shopInfoForm.email,
              vendorId: this.shopInfoForm.vendorId,
              phoneNumber: this.shopInfoForm.phoneNumber
              // NOTE: 这里应该不需要password，因为修改信息不需要密码
            })
            if (response.code === 200) {
              ElMessage({
                showClose: true,
                type: 'success', //如果失败,未连接上后端
                message: '修改信息成功'
              })
              this.getShopInfo() //刷新信息
            } else {
              console.error('修改商店信息失败')
              ElMessage({
                showClose: true,
                type: 'error', //如果失败输出状态码
                message: '注册失败:' + response.msg
              })
            }
            // this.shopInfoForm = response.data
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
            const response = axios.put('http://localhost:9000/shop/changePassword', {
              shopId: localStorage.getItem('id'), //获取cookie中的id
              oldPassword: this.password.oldPassword,
              newPassword: this.password.newPassword
            })
            // this.password = response.data
            if (response.code === 200) {
              ElMessage({
                showClose: true,
                type: 'success', //如果失败,未连接上后端
                message: '修改密码成功'
              })
              this.getShopInfo() //刷新信息
            } else {
              console.error('修改密码失败')
              ElMessage({
                showClose: true,
                type: 'error', //如果失败输出状态码
                message: '注册失败:' + response.msg
              })
            }
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
    // confirmPasswordValidator(rule, value, callback) {
    //   if (value !== this.password.newPassword) {
    //     callback(new Error('两次输入的密码不一致'))
    //   } else {
    //     callback()
    //   }
    // },
    resetForm() {
      //* 重置表单
      this.$refs.shopInfo.resetFields()
      this.getShopInfo() //刷新表单
    }
  }
}
</script>

<style>
body {
  background-color: #2d2d2d;
  font-family: Arial, sans-serif;
}

.shop-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px;
  color: #ffffff;
}

.shop-info,
.shop-balance,
.change-password {
  background-color: #444444;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #66ccff;
}

.shop-form,
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
</style>

<!-- <style scoped>
.shop-center {
  display: flex;
  flex-wrap: wrap;
  background-color: #222831;
  padding: 2rem;
  color: #eeeeee;
  font-family: 'Roboto', sans-serif;
}

.shop-info,
.shop-balance,
.change-password {
  background-color: #393e46;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.shop-info h2,
.shop-balance h2,
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
.shop-center {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.shop-info,
.shop-balance,
.change-password {
  margin-bottom: 30px;
}

.shop-form,
.balance-form,
.password-form {
  max-width: 400px;
  margin: 20px auto;
}
</style> -->
