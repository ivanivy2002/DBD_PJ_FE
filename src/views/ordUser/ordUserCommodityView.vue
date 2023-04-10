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
            <div class="commodity-name">{{ commodity.commodityName }}</div>
          </div>
          <div class="commodity-content">介绍：{{ commodity.intro }}</div>
          <div class="commodity-content">价格：{{ commodity.price }}</div>
          <el-button type="primary" @click="addToCart(commodity.id)">添加到购物车</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ElRow, ElCol, ElCard, ElButton, ElMessage } from 'element-plus'
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
      shopId: '', // 假设shopId已经从localStorage中获取
      commodities: []
    }
  },
  async mounted() {
    try {
      const commoditiesResponse = await this.fetchData()
      console.log(commoditiesResponse.data)
      this.commodities = commoditiesResponse.data.map((commodity) => ({
        id: commodity.id,
        commodityName: commodity.commodityName,
        intro: commodity.intro,
        price: commodity.price
      }))
      // TODO: 选择哪一种？
      // `http://localhost:9000/home/displayCommodity/${this.shopId}`
      // `http://localhost:9000/commodity/displayQualified/`
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    async fetchData() {
      try {
        this.shopId = localStorage.getItem('shopId')
        const response = await axios.get('http://localhost:9000/commodity/displayQualified/', {
          params: { shopId: this.shopId }
        })
        console.log(response.data)
        return response.data
      } catch (error) {
        console.log(error)
      }
    },
    addToCart(commodityId) {
      try {
        const response = axios.post('http://localhost:9000/shoppingCart/addCommodity/', {
          // NOTE: 传一个body
          // id: null,
          userId: localStorage.getItem('userId'),
          commodityId: commodityId,
          commodityNum: 1
          // commodityPrice: null,
          // status: null
        })
        console.log(response)
        console.log(`Adding commodity with ID ${commodityId} to cart`)
        if (response.data.code === 200) {
          ElMessage({
            //用于弹出消息提示
            showClose: true,
            type: 'success', //如果成功
            message: '添加成功'
          })
        } else {
          ElMessage({
            showClose: true,
            type: 'error', //如果失败输出状态码
            message: '操作失败:' + response.data.msg
          })
        }
      } catch (error) {
        console.log(error)
      }
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
