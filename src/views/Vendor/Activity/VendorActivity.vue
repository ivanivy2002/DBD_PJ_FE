<template>
  <div class="activity-board">
    <el-row gutter="24">
      <el-col class="activity-col" v-for="activity in activities" :key="activity.id">
        <!--              :xs="24" :sm="12" :md="8"  :lg="20"-->
        <el-card
          class="animated-card-activity"
          shadow="hover"
          @click="navigateToActivity(activity.id)"
        >
          <div class="card-header">
            <div class="card-title">{{ activity.activityName }}</div>
          </div>
          <!--这里应该不用展示活动状态-->
          <!-- <div class="card-content">活动状态：{{ activity.status }}</div> -->
          <div class="card-content">剩余时间：{{ calRemainTime(activity) }}</div>
          <div class="card-content">商品类别：{{ activity.category }}</div>
          <div class="ActivityButton" @click="navigateToActivity(activity.id)">
            <el-button> 参加活动</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ElCol, ElRow } from 'element-plus'
import axios from 'axios'

export default {
  name: 'VendorActivity',
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
          lastTime: 999999,
          activityFund: 999999,
          x: 10,
          y: 20,
          regFund: 100,
          monthlySales: 2000,
          monthlyAmount: 200,
          status: '开启成功',
          createTime: '2023-05-12 20:16:46',
          originFund: 2000

          // remainTimeString: '',
        }
      ]
    }
  },
  async mounted() {
    // Activity
    await this.fetchActivity()
    setInterval(() => {
      this.fetchActivity()
    }, 1000)
  },
  computed: {},
  methods: {
    navigateToActivity(activityId) {
      localStorage.setItem('activityId', activityId) // 将activityId存入localStorage
      console.log(localStorage.getItem('activityId'))
      // this.$router.push({ path: `/home/orduser/commodity/${activityId}` });
      this.$router.push({ path: `/home/vendor/joinActivity` })
    },
    calRemainTime(activity) {
      const createTimeInSeconds = Math.floor(Date.parse(activity.createTime) / 1000)
      const currentTime = Math.floor(Date.now() / 1000)
      const remainTime = Math.max(
        createTimeInSeconds + activity.lastTime * 3600 * 24 - currentTime,
        0
      )
      const second = remainTime % 60
      let minute = Math.floor(remainTime / 60)
      // const hour = Math.floor(remainTime / 3600)
      let hour = Math.floor(minute / 60)
      minute = minute % 60
      const day = Math.floor(hour / 24)
      hour = hour % 24
      const secondString = String(second).padStart(2, '0')
      const minuteString = String(minute).padStart(2, '0')
      const hourString = String(hour).padStart(2, '0')
      return `${day}天${hourString}小时${minuteString}分钟${secondString}秒`
    },
    splitByComma(str) {
      return str.split(',').map((category) => category.trim())
    },
    async fetchActivity() {
      try {
        const response = await axios.get('/api/home/getActivity')
        // console.log(response.data)
        this.activities = response.data.data.map((activity) => {
          const remainTimeString = this.calRemainTime(activity)
          return {
            id: activity.id,
            activityName: activity.activityName,
            lastTime: activity.lastTime,
            activityFund: activity.activityFund,
            x: activity.x,
            y: activity.y,
            regFund: activity.regFund,
            monthlySales: activity.monthlySales,
            monthlyAmount: activity.monthlyAmount,
            status: activity.status,
            createTime: activity.createTime,
            originFund: activity.originFund,
            remainTimeString: remainTimeString
          }
        })
        return response.data
      } catch (error) {
        console.log(error)
        throw error
      }
    }
  }
}
</script>

<style scoped>
.info h1 {
  font-size: 40px;
  color: #4befc3;
  /* 蓝绿色 */
  text-transform: uppercase;
  /* 全部大写 */
  text-align: center;
  /* 居中 */
}

/*//activity*/
.activity-board {
  display: flex;
  justify-content: center; /* 水平居中 */
  margin: 20px;
  width: 100%;
}

.animated-card-activity {
  background-color: #26d6cd;
  opacity: 100%;
  width: 100%;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;
  /* 添加渐变动画和阴影效果 */
  background-image: linear-gradient(-45deg, #63d5cd, #50b9b0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  box-sizing: border-box; /* 设置子元素的box-sizing为border-box */
  border-radius: 15px;
}

.activity-col {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
}
.ActivityButton {
  position: relative;
  top: -50px;
  left: 420px;
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

.category-list span {
  margin-right: 5px;
  background-color: #19cde9;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 14px;
  color: #333;
}

.ActivityButton {
  padding-right: 10px;
}

.kuuki {
  color: rgba(11, 80, 52, 0.78);
  background-color: rgba(110, 194, 175, 0.53);
  text-decoration-color: rgba(150, 125, 90, 0.96);
}
</style>
