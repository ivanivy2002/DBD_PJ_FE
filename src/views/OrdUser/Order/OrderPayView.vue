<template>
  <div class="payment-page">
    <div class="payment-box">
      <h2>订单支付ヾ(•ω•`)o</h2>
      <el-row>
        <el-col :span="24">
          <div class="detail-item">
            <strong>您的账户余额：</strong>
            {{ userBalance }}
          </div>
          <div class="detail-item">
            <strong>订单号：</strong>
            {{ orderId }}
          </div>
          <div class="detail-item">
            <strong>订单价格：</strong>
            {{ orderPrice }}
          </div>
          <div class="button-container">
            <el-button type="primary" @click="payOrder">支付订单</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      userBalance: 0,
      orderPrice: 0,
      orderId: 0
    }
  },
  mounted() {
    this.getUserBalance()
    this.orderPrice = localStorage.getItem('orderPrice')
    this.orderId = localStorage.getItem('orderId')
    // this.getOrderPrice()
  },
  methods: {
    async getUserBalance() {
      // 发送请求获取用户余额
      await axios
        .get('/api/user/displayAccount', {
          params: { userId: localStorage.getItem('userId') }
        })
        .then((res) => {
          console.log(res.data)
          this.userBalance = res.data.data.balance
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async getOrderPrice() {
      // 发送请求获取订单价格
      // await axios.get('/api/order/displayOrder', {
      //   params: {orderId: localStorage.getItem('orderId')}
      // })
      //   .then(res => {
      //     this.orderPrice = res.data.data.price;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   })
    },
    payOrder() {
      // if (parseFloat(this.userBalance) >= parseFloat(this.order.price)) {
      //   console.log('支付成功！');
      //   this.userBalance -= this.order.price;
      if (userBalance >= orderPrice) {
        console.log('支付成功！')
        // userBalance -= orderPrice;
        axios.put('/api/order/pay', {
          params: {
            orderId: localStorage.getItem('orderId')
          }
            .then((res) => {
              if (res.data.code == 200) {
                console.log(res.data)
                ElMessage({
                  showClose: true,
                  type: 'success',
                  message: '支付成功！'
                })
              } else {
                ElMessage({
                  showClose: true,
                  type: 'error',
                  message: '支付失败: ' + res.data.msg
                })
              }
            })
            .catch((err) => {
              console.log(err)
            })
        })
      } else {
        ElMessage({
          showClose: true,
          type: 'error',
          message: '余额不足'
        })
        console.log('余额不足！')
      }
    }
  }
}
</script>

<style scoped>
.payment-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #ffffff; /* 蓝绿色背景 */
}

.payment-box {
  padding: 40px;
  background-color: #37cac5;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.detail-item {
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  justify-content: center;
}
</style>
