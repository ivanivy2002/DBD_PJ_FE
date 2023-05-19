<template>
  <div class="order-create-container">
    <strong>填写并核对订单信息~</strong>
    <br />
    <br />
    <div class="order-create">
      <div class="address">
        <h3>收货地址</h3>
        <el-button v-if="selectAddress == false" @click="turnOnAddress">选择收货地址</el-button>
        <div v-if="selectAddress == true">
          <address-manage @select-address="handleSelectAddress"></address-manage>
        </div>
        <div v-if="ifselectedAddress == true">
          <el-card>
            <div slot="header">
              <strong>姓名： </strong>
              {{ selectAddressInfo.name }}
            </div>
            <div><strong>手机号： </strong>{{ selectAddressInfo.phoneNumber }}</div>
            <div><strong>地址： </strong>{{ selectAddressInfo.address }}</div>
          </el-card>
        </div>

        <!-- <div>
          <address-selector @close-select-address="handleCloseSelectAddress"></address-selector>
        </div> -->

        <!-- <el-divider></el-divider>
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
        </el-form> -->
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
import axios from 'axios'
import AddressManage from '../../../components/OrdUserComponents/AddressManage.vue'
import { ElMessage } from 'element-plus'
export default {
  name: 'OrderCreateView',
  components: { AddressManage },
  data() {
    return {
      selectAddress: false, // 还没开始选择的时候会设置成false
      ifselectedAddress: false, // 如果选好了，会设置成true
      selectAddressId: '',
      selectAddressInfo: {},
      commodityArray: [],
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
  mounted() {
    this.commodityArray = JSON.parse(localStorage.getItem('commodityArray'))
    console.log(this.commodityArray)
  },
  methods: {
    turnOnAddress() {
      this.selectAddress = true
    },
    handleSelectAddress(addressId) {
      // 接受子组件传来的地址ID
      console.log('Selected address ID:', addressId)
      this.selectAddress = false
      this.selectAddressId = addressId
      this.ifselectedAddress = true
      console.log('11111')
      this.getSelectAddressInfo() //​根据选择的地址ID获取地址信息
    },
    async getSelectAddressInfo() {
      // 根据选择的地址ID获取地址信息
      console.log('22222')
      await axios
        .get('/api/address/displayAddressInfo', {
          params: {
            addressId: this.selectAddressId
          }
        })
        .then((response) => {
          if (response.data.code == 200) {
            console.log('获取信息成功')
            this.selectAddressInfo = response.data.data
          } else {
            ElMessage({
              showClose: true,
              type: 'error', //如果失败输出状态码
              message: '获取信息失败:' + response.data.msg
            })
          }
        })
    },
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
/* 这里是你的Vue.js组件的样式 */
.el-card {
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.el-card__header {
  font-size: 16px;
  font-weight: bold;
  padding: 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.el-card__body {
  padding: 16px;
}

.el-card__footer {
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #ebeef5;
}
</style>
