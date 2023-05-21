<template>
  <div class="info">
    <span class="search">&#x1F50D;</span>
    <input
      type="text"
      placeholder="请按回车开始搜索..."
      v-model="searchContent"
      @keyup.enter="Search"
    />
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
  </div>
  <div class="activity-carousel">
    <el-carousel height="300px">
      <el-carousel-item class="activity-col" v-for="activity in activities" :key="activity.id">
        <!--              :xs="24" :sm="12" :md="8"  :lg="20"-->
        <el-card
          class="animated-card-activity"
          shadow="hover"
          @click="navigateToActivity(activity.id)"
        >
          <div class="activity-parent">
            <div class="activity-card-header">
              <!--              活动 {{ activity.id }}-->
              <div class="activity-card-title">{{ activity.activityName }}</div>
            </div>
            <div class="activity-card-content">满{{ activity.x }}减{{ activity.y }}</div>
            <!--                    <div class="activity-card-content">活动状态：{{ activity.status }}</div>-->
            <div class="activity-card-content">{{ calRemainTime(activity) }}</div>
            <div class="activity-card-content">
              <!--                        <span class="category-title">活动商品：</span>-->
              <div class="category-list">
                <span
                  v-for="(category, index) in activity.categories"
                  :key="index"
                  class="category-span"
                >
                  {{ category.category }}</span
                >
              </div>
            </div>
          </div>
        </el-card>
      </el-carousel-item>
    </el-carousel>
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
import { ElCol, ElRow, ElMessage } from 'element-plus'
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
      searchCommodityName: '',
      searchCommodityCategory: '',
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
  computed: {
    // calRemainTime() {
    //     return (endTime, activities) => {
    //         // 对所有的 activities 进行处理，计算出剩余时间并返回一个新数组
    //         return activities.map((activity) => {
    //             const createTimeInSeconds = Math.floor(Date.parse(activity.createTime) / 1000)
    //             const currentTime = Math.floor(Date.now() / 1000)
    //             const remainTime = Math.max(createTimeInSeconds + activity.lastTime * 3600 * 24 - currentTime, 0)
    //             const second = remainTime % 60
    //             let minute = Math.floor(remainTime / 60)
    //             let hour = Math.floor(minute / 60)
    //             minute = minute % 60
    //             const day = Math.floor(hour / 60)
    //             hour = hour % 60
    //             const remainTimeString= `${day}天${hour}小时${minute}分钟${second}秒`
    //             return {
    //                 ...activity,
    //                 remainTimeString,
    //             }
    //         });
    //     };
    //
    // },
  },
  async mounted() {
    // TODO: setInterval Disabled, 以下三行
    setInterval(() => {
      this.fetchActivity()
    }, 1000)

    await this.fetchActivity()
    await this.fetchRecommendData()
  },
  methods: {
    async fetchRecommendData() {
      await axios
        .get('/api/recommend/userBased', {
          params: {
            userId: localStorage.getItem('userId')
          }
        })
        .then((response) => {
          console.log(response.data)
          this.userBasedArray = response.data.data
          if (this.userBasedArray.length <= this.userBasedThreshold) {
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
    calRemainTime(activity) {
      //     createTime,lastTime
      const createTimeInSeconds = Math.floor(Date.parse(activity.createTime) / 1000)
      const currentTime = Math.floor(Date.now() / 1000)
      // const dateCreatTime = new Date(activity.createTime)
      // console.log(activity.createTime)
      // console.log(dateCreatTime)
      // console.log(createTimeInSeconds)
      // console.log(activity.lastTime)
      const remainTime = Math.max(
        createTimeInSeconds + activity.lastTime * 3600 * 24 - currentTime,
        0
      )
      this.checkStop(remainTime, activity)
      const second = remainTime % 60
      let minute = Math.floor(remainTime / 60)
      // const hour = Math.floor(remainTime / 3600)
      let hour = Math.floor(minute / 60)
      minute = minute % 60
      const day = Math.floor(hour / 24)
      hour = hour % 24
      // const minute = Math.floor((remainTime - 3600 * hour) / 60)
      const secondString = String(second).padStart(2, '0')
      const minuteString = String(minute).padStart(2, '0')
      const hourString = String(hour).padStart(2, '0')
      // const dayString = String(day).padStart(2, "0");
      return `${day}天${hourString}小时${minuteString}分钟${secondString}秒`
    },
    // startTimer() {
    //     // 每秒钟更新一次 remainTime 的值
    //     this.timer = setInterval(() => {
    //         // eslint-disable-next-line no-self-assign
    //         this.activities = this.activities
    //     }, 1000)
    // },
    // stopTimer() {
    //     clearInterval(this.timer) // 销毁定时器
    // },
    checkStop(remainTime, activity) {
      // console.log(remainTime)
      if (remainTime === 0) {
        //TODO:BUG 500 ERR 已解决
        console.log(remainTime + ' ' + activity.activityName + ' to off')
        const activityId = activity.id
        try {
          axios.put('/api/activity/stop', null, {
            params: {
              activityId: activity.id
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
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
    navigateToActivity(activityId) {
      // TODO: 这下面可能还要修正一下，统一命名
      localStorage.setItem('showActivityId', activityId) // 注意：将showActivityId存入localStorage
      localStorage.setItem('activityId', activityId)
      if (localStorage.getItem('role') == '3') {
        this.$router.push({ path: `/home/admin/activity` })
      }
      if (localStorage.getItem('role') == '2') {
        this.$router.push({ path: `/home/vendor/joinActivity` })
      }
      if (localStorage.getItem('role') == '1') {
        this.$router.push({
          path: '/home/orduser/activityCommodity'
        })
      }
    },
    getImageUrls(imagePaths) {
      // NOTE: 从后端获取图片的url(特殊URL)
      //  || imagePaths == undefined || imagePaths == ''
      if (!imagePaths) {
        console.log('图片路径为空')
        return []
      }
      const baseUrl = '/api/display/commodity/'
      return imagePaths.split(',').map((imagePath) => `${baseUrl}${imagePath.trim()}`)
    },
    Search(event) {
      // 获取输入框的值
      let value = event.target.value
      // 调用搜索功能
      this.doSearch(value)
    },
    doSearch(value) {
      console.log(value)
      // 具体搜索逻辑...
      axios
        .get('/api/commodity/findByCommodityName', {
          params: {
            name: value
          }
        })
        .then((response) => {
          console.log(response.data)
          this.searchCommodityName = response.data.data
          if (this.searchCommodityName.length > 0) {
            console.log('找到商品')
            this.showCommodityArray = this.searchCommodityName
          } else {
            console.log('没有找到商品')
            axios
              .get('/api/recommend/categoryBased', {
                params: {
                  category: value
                }
              })
              .then((response) => {
                console.log(response.data)
                this.searchCommodityCategory = response.data.data
                if (this.searchCommodityCategory.length > 0) {
                  console.log('找到商品')
                  this.showCommodityArray = this.searchCommodityCategory
                } else {
                  console.log('没有找到商品')
                  this.showCommodityArray = []
                  ElMessage({
                    showClose: true,
                    type: 'warning',
                    message: '没有找到想要的商品噢，换个商品试试吧！'
                  })
                }
              })
          }
        })
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
</style>
