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
        <el-card
          class="commodity-card animated-card"
          shadow="hover"
          :class="{
            food: commodity.category === 'food',
            clothes: commodity.category === 'clothes',
            electronics: commodity.category === 'electronics'
          }"
        >
          <div slot="header" class="commodity-header">
            <div class="commodity-name">{{ commodity.commodityName }}</div>
          </div>
          <div class="commodity-content">介绍：{{ commodity.intro }}</div>
          <div class="commodity-content">价格：{{ commodity.price }}</div>
          <div class="commodity-action">
            <el-input-number
              v-model="commodityNum"
              :min="1"
              :max="10"
              label="数量"
              controls-position="right"
              style="width: 120px"
            ></el-input-number>
            <el-button
              type="primary"
              @click="
                addToCart(commodity.id, commodity.commodityName, commodityNum, commodity.price)
              "
              >添加到购物车</el-button
            >
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ElRow, ElCol, ElCard, ElButton, ElInputNumber, ElMessage } from 'element-plus'
import axios from 'axios'

export default {
  components: {
    ElRow,
    ElCol,
    ElCard,
    ElButton,
    ElInputNumber
  },
  data() {
    return {
      shopId: '', // 假设shopId已经从localStorage中获取
      commodities: []
      // commodityNum: 0 // 购物车数量
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
        price: commodity.price,
        commodityNum: 1 // 初始商品数量为1
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
    // NOTE: 添加商品到购物车
    addToCart(commodityId, name, quantity, price) {
      try {
        const response = axios
          .post('http://localhost:9000/shoppingCart/addCommodity/', {
            // NOTE: 传一个body
            // id: null,
            userId: localStorage.getItem('userId'),
            commodityId: commodityId,
            commodityName: name,
            commodityNum: quantity,
            commodityPrice: price
            // status: null
          })
          .then((response) => {
            console.log(response)
            console.log(`Adding commodity with ID ${commodityId} to cart`)
            if (response.data.code === 200) {
              // this.commodityNum += quantity // 将添加的商品数量加入购物车数量
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
          })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>
.commodity-view {
  margin: 24px;
}

.animated-card {
  background-color: #3a3f58;
  opacity: 100%;
  border-radius: 4px;
  padding: 24px;
  margin-bottom: 24px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.animated-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.commodity-card.food {
  background-color: #a5d6a7;
}

.commodity-card.clothes {
  background-color: #ffd54f;
}

.commodity-card.electronics {
  background-color: #90caf9;
}

.commodity-header {
  display: flex;
  justify-content: space-between;
}

.commodity-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  cursor: pointer;
  color: #fff;
}

.commodity-content {
  font-size: 14px;
  color: #cfd8dc;
  margin-bottom: 4px;
}

.commodity-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-input-number {
  width: 80px;
}

.el-button {
  margin-left: 10px;
}
</style>
