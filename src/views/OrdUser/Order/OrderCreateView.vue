<template>
  <div class="order-create-container">
    <strong>填写并核对订单信息~</strong>
    <br />
    <br />
    <div class="order-create">
      <div class="address">
        <h3>选择收货地址</h3>
        <el-divider></el-divider>
        <el-form :model="addressForm" :rules="addressRules" ref="addressForm" label-width="80px">
          <el-form-item label="收货人" prop="name">
            <el-input v-model="addressForm.name"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="addressForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="收货地址" prop="address">
            <el-input v-model="addressForm.address"></el-input>
          </el-form-item>
          <el-form-item label="邮政编码" prop="zipCode">
            <el-input v-model="addressForm.zipCode"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="order-detail">
        <h3>订单详情</h3>
        <el-divider></el-divider>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="商品名称"></el-table-column>
          <el-table-column prop="quantity" label="购买件数"></el-table-column>
          <el-table-column prop="shopName" label="店铺名称"></el-table-column>
          <el-table-column prop="price" label="单价"></el-table-column>
        </el-table>
      </div>
      <div class="settlement">
        <h3>结算金额</h3>
        <el-divider></el-divider>
        <div class="total-price">
          <span>总价：</span>
          <span>{{ totalPrice }}</span>
        </div>
        <div class="submit-btn">
          <el-button type="primary" @click="submitOrder">提交订单</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderCreateView',
  data() {
    return {
      addressForm: {
        name: '',
        phone: '',
        address: '',
        zipCode: ''
      },
      addressRules: {
        name: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        address: [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
        zipCode: [{ required: true, message: '请输入邮政编码', trigger: 'blur' }]
      },
      tableData: [
        {
          name: '商品1',
          quantity: 2,
          shopName: '店铺1',
          price: 100
        },
        {
          name: '商品2',
          quantity: 1,
          shopName: '店铺2',
          price: 50
        }
      ]
    }
  },
  computed: {
    totalPrice() {
      let total = 0
      this.tableData.forEach((item) => {
        total += item.quantity * item.price
      })
      return total
    }
  },
  methods: {
    submitOrder() {
      this.$refs.addressForm.validate((valid) => {
        if (valid) {
          // 提交订单
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.order-create-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px;
}
.address {
  width: 80%;
}
.order-detail {
  width: 80%;
}
.order-summary {
  width: 80%;
}
.settlement {
  width: 80%;
}
.total-price {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
}
.submit-btn {
  margin-top: 20px;
  text-align: center;
}
.order-create {
  /* background-image: linear-gradient(-45deg, #24b8c6, #26d6cd); */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  margin-top: 20px;
  margin-bottom: 20px;
  width: 600px;
  max-width: 600px;
}
</style>
