<template>
  <div class="payment">
    <div class="payment-header">
      <h2>支付订单</h2>
    </div>
    <div class="payment-content">
      <div class="payment-details">
        <h3>订单详情</h3>
        <p>订单编号: {{ order.orderNumber }}</p>
        <p>订单金额: {{ order.amount }}</p>
        <p>订单状态: {{ order.status }}</p>
      </div>
      <div class="payment-form">
        <h3>支付信息</h3>
        <el-form :model="paymentInfo" ref="paymentForm" label-width="100px">
          <el-form-item label="银行卡号" prop="cardNumber">
            <el-input v-model="paymentInfo.cardNumber"></el-input>
          </el-form-item>
          <el-form-item label="持卡人姓名" prop="cardHolder">
            <el-input v-model="paymentInfo.cardHolder"></el-input>
          </el-form-item>
          <el-form-item label="CVV" prop="cvv">
            <el-input v-model="paymentInfo.cvv"></el-input>
          </el-form-item>
          <el-form-item label="有效期" prop="expiryDate">
            <el-input v-model="paymentInfo.expiryDate"></el-input>
          </el-form-item>
          <el-button type="primary" @click="submitPayment">支付</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'

export default {
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton
  },
  data() {
    return {
      order: {
        orderNumber: '123456789',
        amount: 100.0,
        status: '待支付'
      },
      paymentInfo: {
        cardNumber: '',
        cardHolder: '',
        cvv: '',
        expiryDate: ''
      }
    }
  },
  methods: {
    submitPayment() {
      this.$refs.paymentForm.validate((valid) => {
        if (valid) {
          // 执行支付操作，此处省略具体实现
          this.payOrder()
        } else {
          this.$message.error('请填写正确的支付信息')
        }
      })
    },
    payOrder() {
      // 发起支付请求，此处省略具体实现
      // 示例：假设支付成功，并更新订单状态
      this.order.status = '已支付'
      this.$message.success('订单支付成功')
    }
  }
}
</script>

<style scoped>
.payment {
  padding: 20px;
}

.payment-header {
  text-align: center;
  margin-bottom: 20px;
}

.payment-content {
  display: flex;
}

.payment-details {
  flex: 1;
  padding: 20px;
  background-color: #c7e0e0;
}

.payment-form {
  flex: 1;
  padding: 20px;
  background-color: #a6caca;
}
</style>
