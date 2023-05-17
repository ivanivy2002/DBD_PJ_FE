<template>

    <div class="activity-board" style="z-index: -1">
        <el-row gutter="24">
            <el-col  :xs="24" :sm="12" :md="8" :lg="6"
                    v-if="targetActivity" :key="targetActivity.id"
            >
                <el-card
                        class="animated-card-activity"
                        shadow="hover"
                        @click="navigateToActivity(targetActivity.id)"
                >
                    <div class="activity-card-header">
                        <!--              活动 {{ activity.id }}-->
                        <div class="activity-card-title">{{ targetActivity.activityName }}</div>
                    </div>
                    <!--                    <div class="activity-card-content">活动状态：{{ activity.status }}</div>-->
                    <div class="activity-card-content">{{ calRemainTime(targetActivity) }}</div>
                    <div class="activity-card-content">
                        <!--                        <span class="category-title">活动商品：</span>-->
                        <div class="category-list">
              <span v-for="(category, index) in targetActivity.categories" :key="index" class="category-span">
                  {{
                  category.category
                  }}</span>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
// import { reactive } from 'vue'
// import {ElCol, ElRow} from 'element-plus'
import axios from 'axios'

export default {
    name: "AdminActivity",
    components: {
        // ElRow,
        // ElCol
    },
    data() {
        return {
            stores: [],
            targetActivityId: null,
            activities: [
                {
                    activityName: '活动0',
                    id: 1,
                    lastTime: 999,
                    activityFund: 999999,
                    x: 10,
                    y: 20,
                    regFund: 100,
                    monthlySales: 2000,
                    monthlyAmount: 200,
                    status: '开启成功',
                    createTime: '2023-05-12 20:16:46',
                    originFund: 2000,
                    categories: []
                    // remainTimeString: '',
                }
            ]
        }
    },
    async mounted() {
        this.targetActivityId = localStorage.getItem('activityId')
        console.log('targetActivityId: ' + this.targetActivityId)
        // Activity
        await this.fetchActivity()

        //TODO: setInterval Disabled, 以下三行
        // setInterval(() => {
        //     this.fetchActivity()
        // }, 2000)

        // this.startTimer()
    },
    // beforeUnmount(){
    //     this.stopTimer();
    //     clearInterval(this.timer);  // 销毁定时器
    // },
    computed: {

        targetActivity() {
            return this.activities.find(activity => activity.id === localStorage.getItem('activityId'));
        }

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
    methods: {
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
                //TODO:BUG 500 ERR
                console.log(remainTime + ' ' + activity.activityName + ' to off')
                // const activityId = activity.id;
                // try {
                //     axios.put('/api/activity/stop', null, {
                //         params: {
                //             activityId: activity.id
                //         }
                //     })
                // } catch (error) {
                //     console.log(error)
                // }
            }
        },
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
                        monthlySales: activity.monthlySales,
                        monthlyAmount: activity.monthlyAmount,
                        status: activity.status,
                        createTime: activity.createTime,
                        originFund: activity.originFund,
                        remainTimeString: remainTimeString,
                        activityName: activity.activityName,
                    }
                })
                return response.data
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
                    const activity = this.activities.find(item => item.id === activityId);
                    if (activity) {
                        activity.categories = response.data.data;
                    }
                    return activity.categories
                })
        },
        navigateToCommodity(shopId) {
            localStorage.setItem('showShopId', shopId) // 注意：将showShopId存入localStorage
            // TODO: 这里的路由上面需不需要显示shopId
            // this.$router.push({ path: `/home/orduser/commodity/${shopId}` });
            if (localStorage.getItem('role') == '1') {
                this.$router.push({path: `/home/orduser/commodity`})
            }
            if (localStorage.getItem('role') == '2') {
                this.$router.push({path: `/home/vendor/commodityTable`})
            }
            if (localStorage.getItem('role') == '3') {
                this.$router.push({path: `/home/admin/commodityTable`})
            }
        },
        // eslint-disable-next-line no-unused-vars
        navigateToActivity(activityId) {
            localStorage.setItem('activityId', activityId) // 注意：将showShopId存入localStorage
            if (localStorage.getItem('role') == '3') {
                this.$router.push({path: `/home/admin/activity`})
            }
            if (localStorage.getItem('role') == '2') {
                this.$router.push({path: `/home/vendor/joinActivity`})
            }
        }
    }
    // filters: {
    //     formatTime(value) {
    //         const hours = Math.floor(value / 60);
    //         const minutes = value % 60;
    //         return `${hours}小时${minutes}分钟`;
    //     },
    // },
}
</script>
<style scoped>
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
    opacity: 100%;
    border-radius: 13px;
    /*padding: 100px;*/
    /*padding-left: 100px;*/
    /*padding-right: 100px;*/
    /*padding-inline: 20px;*/
    /*margin-bottom: 10px;*/
    width: 100%;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;
    /* 添加渐变动画和阴影效果 */
    background-image: linear-gradient(-45deg, #4120d0, #6c19d2);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
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
    color: #1D1D1D;
}

</style>