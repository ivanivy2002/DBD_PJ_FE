<template>
    <div class="info">
        <!--    <h1>商店页面</h1>-->
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
                    <div class="card-header">
                        <div class="card-title">活动 {{ activity.id }}</div>
                    </div>
<!--                    <div class="card-content">活动状态：{{ activity.status }}</div>-->
                    <div class="card-content">剩余时间：{{ calRemainTime(activity) }}</div>
                    <div class="card-content">活动商品：{{ activity.categories }}</div>
                </el-card>
            </el-carousel-item>
        </el-carousel>
    </div>
<!--    <div class="activity-board">-->
<!--        <el-row gutter="24">-->
<!--            <el-col class="activity-col" v-for="activity in activities" :key="activity.id">-->
<!--                &lt;!&ndash;              :xs="24" :sm="12" :md="8"  :lg="20"&ndash;&gt;-->
<!--                <el-card-->
<!--                        class="animated-card-activity"-->
<!--                        shadow="hover"-->
<!--                        @click="navigateToActivity(activity.id)"-->
<!--                >-->
<!--                    <div class="card-header">-->
<!--                        <div class="card-title">活动 {{ activity.id }}</div>-->
<!--                    </div>-->
<!--                    <div class="card-content">活动状态：{{ activity.status }}</div>-->
<!--                    <div class="card-content">剩余时间：{{ calRemainTime(activity) }}</div>-->
<!--                </el-card>-->
<!--            </el-col>-->
<!--        </el-row>-->
<!--    </div>-->
    <div class="store-board" style="z-index: -1">
        <el-row gutter="24">
            <el-col v-for="store in stores" :key="store.shopName" :xs="24" :sm="12" :md="8" :lg="6">
                <el-card class="animated-card" shadow="hover" @click="navigateToCommodity(store.id)">
                    <div class="card-header">
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
                    <div class="card-content card-intro">
                        <span class="category-title">商店简介：</span>{{ store.intro }}
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<!-- other code remains the same -->

<script>
// import { reactive } from 'vue'
import {ElCol, ElRow} from 'element-plus'
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
                    categories:[],
                    // remainTimeString: '',
                }
            ]
        }
    },
    async mounted() {
        // Store
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
                //TODO: categories is removed from the chart..
                // categories: this.splitByComma(store.categories),
                intro: store.intro
            }))
            // console.log(store.categories)
        } catch (error) {
            console.log(error)
        }
        // Activity
        await this.fetchActivity()
        // try {
        //     const activityResponse = await this.fetchActivity()
        //     // console.log("activity: \n")
        //     // console.log(activityResponse.data)
        //     this.activities = activityResponse.data.map((activity) => {
        //         const remainTimeString = this.calRemainTime(activity);
        //             return {
        //                 id: activity.id,
        //                 lastTime: activity.lastTime,
        //                 activityFund: activity.activityFund,
        //                 x: activity.x,
        //                 y: activity.y,
        //                 regFund: activity.regFund,
        //                 monthlySales: activity.monthlySales,
        //                 monthlyAmount: activity.monthlyAmount,
        //                 status: activity.status,
        //                 createTime: activity.createTime,
        //                 originFund: activity.originFund,
        //                 remainTimeString: remainTimeString
        //             };
        //         }
        //     )
        //
        // } catch (error) {
        //     console.log(error)
        // }

        //TODO: setInterval Disabled, 以下三行
        // setInterval(() => {
        //   this.fetchActivity()
        // }, 1000)

        // this.startTimer()
    },
    // beforeUnmount(){
    //     this.stopTimer();
    //     clearInterval(this.timer);  // 销毁定时器
    // },
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
        startTimer() {
            // 每秒钟更新一次 remainTime 的值
            this.timer = setInterval(() => {
                // eslint-disable-next-line no-self-assign
                this.activities = this.activities
            }, 1000)
        },
        stopTimer() {
            clearInterval(this.timer) // 销毁定时器
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

.store-board {
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
    background-color: #26d6cd;
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
    width: 100%;
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
    font-family: '宋体', serif;
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
.activity-carousel{

}
.el-carousel__item .el-card {
    color: #475669;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>
