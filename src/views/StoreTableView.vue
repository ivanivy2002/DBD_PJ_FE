<template>
  <div class="info">
    <h1>商店页面</h1>
  </div>
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
          <div class="card-content card-intro">商店简介：{{ store.intro }}</div>
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
        // categories: store.categories.split(',').map((category) => category.trim()),
        categories: this.splitByComma(store.categories),
        intro: store.intro
      }))
      // console.log(store.categories)
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    splitByComma(str) {
      return str.split(',').map((category) => category.trim())
    },
    async fetchData() {
      try {
        // TODO: 相对路径（'api/home/display'）访问出错，这个问题应该和路由相关
        const response = await axios.get('/api/home/displayShop')
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
.info {
  width: 100%;
}

.info h1 {
  font-size: 40px;
  color: #4befc3;
  /* 蓝绿色 */
  text-transform: uppercase;
  /* 全部大写 */
  text-align: center;
  /* 居中 */
}

.dashboard {
  padding: 24px;
  background-color: #ffffff;
  min-height: 100vh;
}

.animated-card {
  background-color: #26d6cd;
  opacity: 100%;
  border-radius: 4px;
  padding: 24px;
  margin-bottom: 24px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;

  /* 添加渐变动画和阴影效果 */
  background-image: linear-gradient(-45deg, #24b8c6, #26d6cd);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
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
  font-size: 28px;
  font-weight: bold;
  font-family: 'Microsoft YaHei', Arial, Helvetica, sans-serif;
  margin-bottom: 12px;
  cursor: pointer;
  /* 鼠标悬停时显示手型 */
  color: #e3f0f0;
}

.card-content {
  font-size: 24px;
  color: #ffffff;
}

.card-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.category-title {
  margin-right: 5px;
  font-family: '宋体';
  color: #ffffff;
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

.card-intro {
  font-size: 24px;
  color: #ffffff;
  margin-top: 12px;
  font-family: 'songti';
}
</style>
