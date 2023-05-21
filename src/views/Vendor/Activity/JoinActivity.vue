<template>
  <div class="join-form">
    <!--        <div class="form-header">活动新开</div>-->
    <div class="form-container">
      <el-form ref="form" :model="joinForm" label-width="125px" :rules="rules">
        <el-form-item v-if="errorMessage == ''" label="参加商品类别" prop="category">
          <!--   这里的categoriesSend 是什么？？是绑定的数据去向-->
          <!--                    -->
          <el-checkbox-group v-model="categoriesSend">
            <el-checkbox v-for="category in categoryVector" :label="category" :key="category"
              >{{ category }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="errorMessage == '您的商店中没有此次活动的商品种类！'">
          <div class="error">
            {{ errorMessage }}
          </div>
        </el-form-item>

        <el-form-item v-if="errorMessage == ''">
          <el-button type="primary" @click="joinSend" style="color: #fff">参加</el-button>
          <!--                    <el-button type="primary" @click="resetForm" style="color: #fff">重置</el-button>-->
        </el-form-item>
        <el-form-item v-if="errorMessage == '您的商店中没有此次活动的商品种类！'">
          <el-button plain>
            <router-link to="/home/vendor/activity">返回</router-link>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <!-- <div class="activity-board">
    <el-row gutter="24">
      <el-col class="activity-col" v-for="activity in activities" :key="activity.id">
                     :xs="24" :sm="12" :md="8"  :lg="20"
        <el-card class="animated-card-activity" shadow="hover">
          <div class="card-header">
            <div class="card-title">活动 {{ activity.id }}</div>
          </div>
          <div class="card-content">活动状态：{{ activity.status }}</div>
          <div class="card-content">剩余时间：{{ calRemainTime(activity) }}</div>
          <div class="ActivityButton" @click="joinActivity()">
            <el-button> 确认参加</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div> -->
</template>

<script>
import { ElCol, ElMessage, ElRow } from 'element-plus'
import axios from 'axios'

export default {
  name: 'JoinActivity.vue',
  components: {
    ElRow,
    ElCol
  },
  // <!--/category/getCategoryList-->
  data() {
    return {
      categoryState: {
        categoryData: []
      },
      joinForm: {
        activityName: '活动' + Date.now(),
        activityFund: 10,
        lastTime: 2,
        x: 0,
        y: 0,
        regFund: 10,
        monthlySales: 5,
        monthlyAmount: 5,
        status: '待开启',
        creatTime: null,
        originFund: 500
      },
      stores: [],
      categoriesSend: [],
      categoryVector: [],
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
      ],
      errorMessage: '',
      $message: this.message //引入$message组件
    }
  },
  async mounted() {
    // Activity
    await this.fetchActivity()
    setInterval(() => {
      this.fetchActivity()
    }, 1000)
    this.activityId = localStorage.getItem('activityId')
    this.fetchCategory()
  },
  computed: {
    rules: function () {
      return {
        userName: [
          {
            required: true,
            message: '用户名不能为空！',
            trigger: 'blur'
          },
          { validator: this.validateUserName, trigger: 'blur' }
        ],
        activityFund: [
          {
            required: true,
            message: '资金不能为空！',
            trigger: 'blur'
          },
          { validator: this.validateActivityFund, trigger: 'blur' }
        ],

        idNumber: [{ required: true, validator: this.validateIdNumber, trigger: 'blur' }],
        intro: [
          {
            required: true,
            message: '商店简介不能为空！',
            trigger: 'blur'
          },
          { validator: this.validateIntro, min: 1, max: 128, trigger: 'blur' }
        ],
        address: [
          {
            required: true,
            message: '备案地址不能为空！',
            trigger: 'blur'
          },
          { validator: this.validateAddress, min: 1, max: 32, trigger: 'blur' }
        ],
        fund: [
          {
            required: true,
            message: '资金不能为空！',
            trigger: 'blur'
          },
          { validator: this.validateFund, message: '请输入足够的资金！', trigger: 'blur' }
        ],
        registrationTime: [
          {
            type: 'date',
            required: true,
            message: '注册时间不能为空',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              const date = new Date(value)
              const cutoff = new Date('2023-04-16')
              if (date > cutoff) {
                callback(new Error('注册时间不得晚于2023年4月16日'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async joinSend() {
      // NOTE: 前端检查是否符合规范
      // this.joinForm.vendorId = localStorage.getItem('userId')
      await this.$refs.form.validate((valid) => {
        console.log(valid)
        if (valid) {
          // TODO:加入 loading 遮罩层，在请求数据时显示加载动画，避免用户误以为页面卡顿或未响应。?
          //NOTE: 把注册成功后的弹窗放在后端响应成功的回调函数中，确保在后端成功保存数据后再弹窗。
          // NOTE: 处理注册逻辑
          this.joinForm.originFund = this.joinForm.activityFund
          console.log('申请提交', this.joinForm) // 控制台输出信息
          this.loading = true // 开启 loading 动画
          // this.joinForm.categories = this.joinWithComma(this.categories) //* 将多个单词用+拼起来
          // NOTE: 将 categoriesSend 数组中的每个元素添加到 URLSearchParams 对象中
          const params = new URLSearchParams()
          params.append('shopId', localStorage.getItem('shopId'))
          this.categoriesSend.forEach((category) => {
            params.append('categories', category)
          })
          // 添加 activityId 到 URLSearchParams 对象中
          params.append('activityId', this.activityId)
          axios
            .put('/api/shop/joinActivity?' + params)
            .then((response) => {
              console.log(response.data)
              // NOTE: 只有当后端返回200时显示注册成功
              if (response.data.code === 200) {
                console.log('成功')
                this.$message({
                  showClose: true,
                  type: 'success', //如果成功输出状态码
                  message: '申请成功'
                })
                this.$router.push('/home/vendor')
              } else {
                console.log(response.data)
                ElMessage({
                  showClose: true,
                  type: 'error', //如果失败输出状态码
                  message: '申请失败:' + response.data.msg
                })
              }
            })
            .catch((error) => {
              console.error(error)
              ElMessage({
                showClose: true,
                type: 'error', //如果失败，未连接上后端
                message: '活动预设失败:vue好像出错了。。'
              })
              // this.$message.error('数据保存失败，' + error.toString())
            })
            .finally(() => {
              this.loading = false // 关闭 loading 动画
            })
        } else {
          return false
        }
      })
    },
    fetchCategory: async function () {
      try {
        const response = await axios
          .get('/api/category/getCategoryList', {
            params: {
              shopId: localStorage.getItem('shopId'),
              activityId: this.activityId
            }
          })
          .then((response) => {
            if (response.data.code === 200) {
              console.log('获取分类成功')
              console.log(response.data.data)
              this.categoryState.categoryData = response.data.data.map((row) => {
                console.log(row)
                return row
              })
              // 使用 map 方法提取 category 字段，生成一个包含所有 category 值的向量
              this.categoryVector = this.categoryState.categoryData.map((item) => item.category)
              // 输出 categoryVector，可以看到它包含了所有 category 值
              console.log(this.categoryVector)
              console.log(this.categoryState.categoryData)
            } else {
              console.log('没有可选择的分类')
              this.errorMessage = response.data.msg
              ElMessage({
                showClose: true,
                type: 'error', //如果失败输出
                message: '抱歉，' + response.data.msg
              })
            }
          })
      } catch (error) {
        console.log(error)
      }
    },
    joinActivity() {
      try {
        // eslint-disable-next-line no-unused-vars
        const response = axios.put('/api/shop/joinActivity', null, {
          params: {
            shopId: localStorage.getItem('shopId'),
            categories: this.categories,
            activityId: localStorage.getItem('activityId')
          }
        })
      } catch (error) {
        console.log(error)
        throw error
      }
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
.error {
  font-size: 25px;
  color: brown;
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
  background-image: linear-gradient(-45deg, #5f45d3, #813fde);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
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
.form-container {
  font-weight: bold;
  color: #ffffff;
}

.join-form {
  max-width: 600px;
  margin: 0 auto;
  background-image: linear-gradient(
    to bottom right,
    rgba(177, 234, 221, 0.91),
    rgba(49, 231, 206, 0.71)
  );
  padding: 30px;
  border-radius: 10px;
}
</style>
