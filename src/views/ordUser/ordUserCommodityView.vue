<template>
  <div class="commodity-view">
    <el-row gutter="24">
      <el-col
        v-for="commodity in commodities"
        :key="commodity.id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
      >
        <el-card class="commodity-card" shadow="hover">
          <div slot="header" class="commodity-header">
            <div class="commodity-name">{{ commodity.name }}</div>
          </div>
          <div class="commodity-content">价格：{{ commodity.price }}</div>
          <div class="commodity-content">库存：{{ commodity.stock }}</div>
          <el-button type="primary" @click="addToCart(commodity.id)">添加到购物车</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ElRow, ElCol, ElCard, ElButton } from 'element-plus'
import axios from 'axios'

export default {
  components: {
    ElRow,
    ElCol,
    ElCard,
    ElButton
  },
  data() {
    return {
      storeId: '', // 假设storeId已经从localStorage中获取
      commodities: []
    }
  },
  async mounted() {
    try {
      const response = await axios.get(
        `http://localhost:9000/home/orduser/commodity/${this.storeId}`
      )
      this.commodities = response.data
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    addToCart(commodityId) {
      console.log(`Adding commodity with ID ${commodityId} to cart`)
    }
  }
}
</script>

<style scoped>
.commodity-view {
  padding: 24px;
  background-color: #f5f5f5;
}

.commodity-card {
  transition: transform 0.3s;
  border: 1px solid #d9d9d9;
  background-color: #f9f9f9;
}

.commodity-card:hover {
  transform: scale(1.05);
}

.commodity-header {
  background-color: #a9d5ff;
  padding: 8px;
  border-radius: 4px;
}

.commodity-name {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.commodity-content {
  font-size: 14px;
  margin-bottom: 12px;
}
</style>
