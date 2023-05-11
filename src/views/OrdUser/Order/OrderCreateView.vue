<template>
  <h1>订单创建</h1>
  <div>
    <form>
      <label for="phone">电话：</label>
      <input type="text" id="phone" name="phone" /><br /><br />
      <label for="name">姓名：</label>
      <input type="text" id="name" name="name" /><br /><br />
      <label for="address">地址：</label>
      <input type="text" id="address" name="address" /><br /><br />
      <label for="product">产品：</label>
      <select id="product" name="product">
        <option value="product1">产品1</option>
        <option value="product2">产品2</option>
        <option value="product3">产品3</option>
        <option value="product4">产品4</option></select
      ><br /><br />
      <label for="quantity">数量：</label>
      <input type="number" id="quantity" name="quantity" /><br /><br />
      <button type="submit" @click.prevent="createOrder">提交订单</button>
    </form>
  </div>
</template>

<style scoped></style>

<script>
import axios from 'axios'
export default {
  name: 'orderCreate',
  data() {
    return {
      name: '',
      phone: '',
      address: '',
      product: '',
      quantity: ''
    }
  },
  methods: {
    createOrder() {
      axios
        .post('/api/orders', {
          name: this.name,
          phone: this.phone,
          address: this.address,
          product: this.product,
          quantity: this.quantity
        })
        .then((response) => {
          console.log(response)
          alert('订单创建成功')
        })
        .catch((error) => {
          console.log(error)
          alert('订单创建失败')
        })
    }
  }
}
</script>
