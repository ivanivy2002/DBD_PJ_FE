<template>
  <div class="activity-board">
    <el-row gutter="24">
      <el-col v-for="activity in activities" :key="activity.id" :xs="24" :sm="12" :md="8" :lg="10">
        <el-card
          class="animated-card-activity"
          shadow="hover"
          @click="navigateToActivity(activity.id)"
        >
          <div slot="header" class="card-header">
            <div class="card-title">活动 {{ activity.id }}</div>
          </div>
          <div class="card-content">活动状态：{{ activity.status }}</div>
          <div class="card-content">活动资金：{{ activity.regFund }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <div class="store-board">
    <el-row gutter="24">
      <el-col v-for="store in stores" :key="store.shopName" :xs="24" :sm="12" :md="8" :lg="6">
        <el-card class="animated-card" shadow="hover" @click="navigateToCommodity(store.id)">
          <div slot="header" class="card-header">
            <div class="card-title">
              {{ store.shopName }}
            </div>
          </div>
          <div class="card-content">
            <span class="category-title">商品类别：</span>
            <div class="category-list">
              <span v-for="(category, index) in store.categories" :key="index">{{ category }}</span>
            </div>
          </div>
          <div class="card-content">
            <span class="category-title">商店简介：</span>
            <!--                        商店简介：-->
            {{ store.intro }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<!-- other code remains the same -->

<script>
// import { reactive } from 'vue'
import { ElRow, ElCol } from 'element-plus'
import axios from 'axios'

export default {
  components: {
    ElRow,
    ElCol
  },
  data() {
    return {
      stores: [],
      activities: [
        {
          id: 1,
          lastTime: 7,
          activityFund: 999999,
          x: 10,
          y: 20,
          regFund: 100,
          monthlySales: 2000,
          monthlyAmount: 200,
          status: '开启成功',
          createTime: '2023-05-12 16:16:46',
          originFund: 2000
        }
      ]
    }
  },
  async mounted() {
    try {
      const storesResponse = await this.fetchData()
      console.log(storesResponse.data)
      // storesData = storesResponse.data //* 无须重新赋值
      // this.removeZerosInObjectArray(storesData)
      this.stores = storesResponse.data.map((store) => ({
        id: store.id,
        shopName: store.shopName,
        // NOTE: 先使用 split('+') 方法将字符串按照 + 号拆分为多个子字符串，然后使用 map() 方法遍历每个子字符串并使用 trim() 方法去除首尾空格
        // TODO: 目前categories字段的值不能为NULL，否则会报错
        categories: store.categories.split('+').map((category) => category.trim()),
        intro: store.intro
      }))
      // console.log(store.categories)
    } catch (error) {
      console.log(error)
    }
    // try {
    //     const activityResponse = await this.fetchActivity()
    //     console.log(activityResponse.data)
    //     this.activities = activityResponse.data.map((activity) => ({
    //         id: activity.id,
    //         lastTime: activity.lastTime,
    //         activityFund: activity.activityFund,
    //         x: activity.x,
    //         y: activity.y,
    //         regFund: activity.regFund,
    //         monthlySales: activity.monthlySales,
    //         monthlyAmount: activity.monthlyAmount,
    //         status: activity.status,
    //         createTime: activity.createTime,
    //         originFund: activity.originFund,
    //     }))
    // } catch (error) {
    //     console.log(error)
    // };
  },
  methods: {
    async fetchActivity() {
      try {
        const response = await axios.get('/api/home/getActivity')
        console.log(response.data)
        return response.data
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async fetchData() {
      try {
        // TODO: 相对路径（'api/home/display'）访问出错，这个问题应该和路由相关
        const response = await axios.get('/api/home/displayShop')
        // const response = await axios.get('/api/home/display')
        console.log(response.data)
        return response.data
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    navigateToCommodity(shopId) {
      localStorage.setItem('shopId', shopId) // 将shopId存入localStorage
      // TODO: 这里的路由上面需不需要显示shopId
      // this.$router.push({ path: `/home/orduser/commodity/${shopId}` });
      this.$router.push({ path: `/home/orduser/commodity/` })
    },
    navigateToActivity(activityId) {}
  }
}
</script>

<style scoped>
.store-board {
  padding: 24px;
  background-color: #232836;
  min-height: 100vh;
}

.animated-card {
  background-color: #2c3b4d;
  opacity: 100%;
  border-radius: 4px;
  padding: 24px;
  margin-bottom: 24px;
  cursor: pointer; /* 鼠标悬停时显示手型 */
  transition: transform 0.3s, box-shadow 0.3s;
}

.animated-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  cursor: pointer; /* 鼠标悬停时显示手型 */
  color: #19cde9;
}

.card-content {
  font-size: 24px;
  color: #cfd8dc;
}

.card-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.category-title {
  margin-right: 5px;
  font-weight: bold;
  color: #cfd8dc;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.category-list span {
  margin-right: 5px;
  background-color: #19cde9;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 14px;
  color: #333;
}
</style>
