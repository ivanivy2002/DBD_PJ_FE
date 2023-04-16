<template>
  <div class="dashboard">
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
          <div class="card-content">商店简介：{{ store.intro }}</div>
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
      stores: []
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
  },
  methods: {
    async fetchData() {
      try {
        // TODO: 相对路径（'api/home/display'）访问出错，这个问题应该和路由相关
        const response = await axios.get('http://localhost:9000/home/displayShop')
        // const response = await axios.get('api/home/display')
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
      if (localStorage.getItem('role') == '1') {
        this.$router.push({ path: `/home/orduser/commodity` })
      }
      if (localStorage.getItem('role') == '2') {
        this.$router.push({ path: `/home/vendor/commodityTable` })
      }
      if (localStorage.getItem('role') == '3') {
        this.$router.push({ path: `/home/admin/commodityTable` })
      }
    }
  }
}
</script>

<style scoped>
.dashboard {
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
