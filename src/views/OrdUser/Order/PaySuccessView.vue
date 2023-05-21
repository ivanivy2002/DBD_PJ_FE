<template>
  <!-- <div class="info">
    <span class="search">&#x1F50D;</span>
    <input type="text" placeholder="请按回车开始搜索..." v-model="searchContent" @keyup.enter="Search" />
  </div>

  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
  />

  <div class="classify">
    <h1>分类</h1>
    <h1 class="category"><i class="fas fa-shoe-prints"></i>女鞋 / 男鞋 / 箱包</h1>
    <h1 class="category"><i class="fas fa-utensils"></i>食品 / 生鲜 / 母婴</h1>
    <h1 class="category"><i class="fas fa-magic"></i>美妆 / 饰品 / 洗护</h1>
  </div> -->
  <div class="pay-success">
    <div class="success-icon">
      <i class="fas fa-check-circle"></i>
    </div>
    <div class="success-text">支付成功！😀</div>
  </div>

  <div class="commodity">
    <el-row>
      <el-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        v-for="(item, index) in showCommodityArray"
        :key="index"
      >
        <el-card
          shadow="hover"
          class="animated-card"
          @click="navigateToCommodityDetail(item.id, item.shopId)"
        >
          <div class="image">
            <!-- <img
                  v-for="imageUrl in getImageUrls(item.imagePath)"
                  :key="imageUrl"
                  :src="imageUrl"
                /> -->
            <img :src="getImageUrls(item.imagePath)[0]" />
          </div>
          <div class="good-info">
            <div class="good-title">{{ item.commodityName }}</div>
            <div class="good-price">￥{{ item.price }}</div>
            <div class="good-sales">销量：{{ item.salesNum }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<!-- other code remains the same -->

<script>
// import { reactive } from 'vue'
import { ElCol, ElRow } from 'element-plus'
import axios from 'axios'

export default {
  components: {
    ElRow,
    ElCol
  },
  data() {
    return {
      showCommodityArray: [], // 展示在页面上的商品数组
      userBasedArray: [], // 基于用户的推荐数组
      hotRecommendData: [], // 热门推荐数组
      userBasedThreshold: 4, // 基于用户的推荐阈值，如果小于​该值，则显示热门推荐
      searchContent: '',
      activities: [
        {
          activityName: '活动0',
          id: 1,
          lastTime: 999,
          activityFund: 999999,
          x: 10,
          y: 20,
          regFund: 100,
          // monthlySales: 2000,
          // monthlyAmount: 200,
          status: '开启成功',
          createTime: '2023-05-12 20:16:46',
          originFund: 2000,
          categories: []
          // remainTimeString: '',
        }
      ]
    }
  },
  computed: {},
  async mounted() {
    // TODO: setInterval Disabled, 以下三行
    // setInterval(() => {
    //   this.fetchActivity()
    // }, 1000)

    // await this.fetchActivity()
    await this.fetchRecommendData()
  },
  methods: {
    async fetchRecommendData() {
      await axios
        .get('/api/recommend/categoryBased', {
          params: {
            category: localStorage.getItem('category')
          }
        })
        .then((response) => {
          console.log(response.data)
          this.userBasedArray = response.data.data
          if (this.userBasedArray.length == 0) {
            // 如果低于阈值，就用热门推荐
            this.fetchHotRecommendData()
            return
          } else {
            this.showCommodityArray = this.userBasedArray
          }
        })
    },
    async fetchHotRecommendData() {
      await axios.get('/api/recommend/valueBased').then((response) => {
        console.log(response.data)
        this.hotRecommendData = response.data.data
        this.showCommodityArray = this.hotRecommendData
      })
    },
    navigateToCommodityDetail(commodityId, shopId) {
      localStorage.setItem('showCommodityId', commodityId)
      localStorage.setItem('showShopId', shopId)
      axios
        .put('/api/recommend/userOperationRecord', {
          // 用户点击记录
          userId: localStorage.getItem('userId'),
          commodityId: commodityId,
          // shopId: shopId,
          operationType: 0
        })
        .then((response) => {
          console.log(response.data)
          if (response.data.code == 200) {
            console.log('用户点击记录成功')
            this.$router.push('/home/orduser/commodity/detail')
          }
        })
    },
    async fetchActivity() {
      try {
        const response = await axios.get('/api/home/getActivity')
        // console.log(response.data)
        this.activities = response.data.data.map((activity) => {
          const remainTimeString = this.calRemainTime(activity)
          this.fetchCategories(activity.id)
          return {
            id: activity.id,
            lastTime: activity.lastTime,
            activityFund: activity.activityFund,
            x: activity.x,
            y: activity.y,
            regFund: activity.regFund,
            // monthlySales: activity.monthlySales,
            // monthlyAmount: activity.monthlyAmount,
            status: activity.status,
            createTime: activity.createTime,
            originFund: activity.originFund,
            remainTimeString: remainTimeString,
            activityName: activity.activityName
          }
        })
        return response.data.data
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    fetchCategories(activityId) {
      axios
        .get('/api/category/getActivityCategory', {
          params: {
            activityId: activityId
          }
        })
        .then((response) => {
          console.log(response.data.data)
          const activity = this.activities.find((item) => item.id === activityId)
          if (activity) {
            activity.categories = response.data.data
          }
          return activity.categories
        })
    },
    // eslint-disable-next-line no-unused-vars
    getImageUrls(imagePaths) {
      // NOTE: 从后端获取图片的url(特殊URL)
      //  || imagePaths == undefined || imagePaths == ''
      if (!imagePaths) {
        console.log('图片路径为空')
        return []
      }
      const baseUrl = '/api/display/commodity/'
      return imagePaths.split(',').map((imagePath) => `${baseUrl}${imagePath.trim()}`)
    }
  }
}
</script>

<style scoped>
.commodity {
  margin: 20px;
}

.el-row {
  margin: 0 -10px;
}

.el-col {
  padding: 0 10px;
}

.animated-card {
  transition: box-shadow 0.3s ease-in-out;
}

.animated-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.image {
  width: 100%;
  height: 100px;
  object-fit: cover;
}
img {
  width: 120px;
  height: 120px;
}

.good-info {
  padding: 10px;
  text-align: center;
}

.good-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.good-price {
  font-size: 16px;
  font-weight: bold;
  color: #f60;
  margin-bottom: 10px;
}

.good-sales {
  font-size: 14px;
  color: #999;
}
.info {
  width: 100%;
}
.info input[type='text'] {
  padding: 10px;
  border: none;
  border-radius: 20px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  font-size: 16px;
  width: 300px;
  /* height: 200px; */
  position: relative;
  top: 50px;
  left: 500px;
  outline: none;
}
.classify {
  background-color: #e3e6eb;
  width: 20%;
  height: 250px;
  position: relative;
  top: 70px;
  left: 10px;
}
.activity-parent {
  position: relative;
  top: 40px;
}
h1 {
  color: #8a9193;
}
.category {
  font-size: 15pt;

  color: #8a9193;
  margin: 20px 0;
}
.category i {
  margin-right: 15px;
  font-size: 1em;
}

.info input[type='text']:focus {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
.search {
  position: relative;
  top: 50px;
  left: 860px;
  font-size: 24px;
  color: #333;
}
.store-board {
  position: relative;
  top: 500px;
  padding: 24px;
  background-color: #ffffff;
  min-height: 100vh;
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
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.card-intro {
  font-size: 24px;
  color: #ffffff;
  margin-top: 12px;
  font-family: 'songti', serif;
}

/*//activity*/
.activity-board {
  display: flex;
  justify-content: center; /* 水平居中 */
  /*padding: 24px;*/

  /*background-color: #d91b1b;*/ /* TEST:WIDTH SEE */

  /*min-height: 100vh;*/
  /*min-width: 200vh;*/
  margin: 20px;
  width: 100%;
}

.animated-card-activity {
  /*margin: 0 auto;*/
  /*display: block;*/
  /*background-color: #26d6cd;*/
  /* opacity: 100%; */
  /* border: 1px solid #ccc; /* 添加边框 */
  border-radius: 20px;
  /*padding: 100px;*/
  /*padding-left: 100px;*/
  /*padding-right: 100px;*/
  /*padding-inline: 20px;*/
  /*margin-bottom: 10px;*/
  width: 100%;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;
  /* 添加渐变动画和阴影效果 */
  background-image: linear-gradient(-45deg, #b7ced4, #7dbac3);
  /* box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); */
  box-sizing: border-box; /* 设置子元素的box-sizing为border-box */
}

.activity-col {
  display: flex;
  width: 100%;
}

.animated-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
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

.activity-card-header {
  display: flex;
  /*justify-content: space-between;*/
  justify-content: center;
}

.activity-card-title {
  font-size: 40px;
  font-weight: bold;
  font-family: 'Microsoft YaHei', Arial, Helvetica, sans-serif;
  /*font-family: 'Microsoft YaHei', Arial, Helvetica, serif;*/
  /*font-family: SimSun,serif;*/

  margin-bottom: 12px;
  cursor: pointer;
  /* 鼠标悬停时显示手型 */
  color: #e3f0f0;
  justify-content: center;
}

.activity-card-content {
  font-size: 24px;
  color: #ffffff;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  /*text-align: center;*/
  justify-content: center;
}

.category-title {
  margin-right: 5px;
  font-family: '宋体', serif;
  color: #ffffff;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  /*background-color: rgba(69, 18, 238, 0.7);*/
  /*background-color: #4f46e5;*/
  /*color: #4f46e5;*/
}

.category-list span {
  margin-right: 5px;
  background-color: rgba(18, 29, 238, 0.3);
  border-radius: 5px;
  /*padding: 5px 10px;*/
  font-size: 18px;
  color: #ffffff;
}

.activity-carousel {
  position: relative;
  top: -220px;
  left: 330px;
  width: 60%;
  /* border: 1px solid rgb(172, 235, 235); //添加边框 */
  border-radius: 20px; /* 设置圆角 */
}

.el-carousel__item .el-card {
  height: 100vh;
  color: #475669;
  opacity: 0.75;
  /*line-height: 100px;*/
  margin: 0;
  /*text-align: center;*/
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.category-span {
  background-color: #4f46e5;
  color: #1d1d1d;
}

.pay-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.success-icon {
  font-size: 5rem;
  color: #52c41a;
  margin-bottom: 2rem;
}

.success-text {
  font-size: 2rem;
  color: #52c41a;
}
</style>
