<template>
  <div class="dashboard">
    <el-row>
      <!-- <el-col v-for="(store, index) in stores" :key="index" :xs="24" :sm="12" :md="8" :lg="6"> -->
      <el-col v-for="store in stores" :key="store.shopName">
        <div class="card">
          <div class="card-title">{{ store.shopName }}</div>
          <!-- <div class="card-content">商品类别：{{ store.categories }}</div> -->
          <div class="card-content">
            <span class="category-title">商品类别：</span>
            <div class="category-list">
              <span v-for="(category, index) in store.categories" :key="index">{{ category }}</span>
            </div>
          </div>
          <div class="card-content">商店简介：{{ store.intro }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

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
    const storesData = await this.fetchData()
    console.log(storesData)
    this.removeZerosInObjectArray(storesData)
    console.log(storesData)
    this.stores = storesData.map((store) => ({
      // store.categories = store.categories.map((category) => category.replace(/0+$/, '')),
      shopName: store.shopName,
      categories: this.removeTrailingZeros(store.categories),
      // categories: store.categories,
      intro: store.intro
    }))
    // console.log(store.categories)
  },
  methods: {
    async fetchData() {
      const response = await axios.get('http://localhost:9000/home/display')
      // BUG: 无法访问，这个问题应该和路由相关
      // const response = await axios.get('api/home/display')
      console.log(response.data)
      return response.data
    },
    // NOTE: 去掉数组末尾多余的零
    removeTrailingZeros(arr) {
      if (arr == null) {
        console.log('这个店没有选商品类别')
        return arr
      } else {
        // NOTE: 用===的时候小心
        // TODO：后期优化可以确定类型之后用===，现在先用==
        while (arr[arr.length - 1] == 0) {
          arr.pop()
        }
        return arr
        // return arr.map((item) => item.toString().replace(/0+$/, '') || item);
      }
    },
    removeZerosInObjectArray(arr) {
      let i
      for (i = 0; i < arr.length; i++) {
        arr[i].categories = this.removeTrailingZeros(arr[i].categories)
      }
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 24px;
  background-color: transparent;
}

.card {
  background-color: transparent;
  opacity: 100%;
  /* #fff; */
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
}

.card-content {
  font-size: 24px;
}

.card-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.category-title {
  margin-right: 5px;
  font-weight: bold;
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
