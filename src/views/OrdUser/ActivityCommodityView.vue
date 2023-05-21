<template>
    <div class="commodity-view">
        <el-row gutter="24">
            <el-col
                    v-for="commodity in commodities"
                    :key="commodity.id"
                    :xs="24"
                    :sm="12"
                    :md="8"
                    :lg="6"
            >
                <el-card
                        class="commodity-card animated-card"
                        shadow="hover"
                        :class="{
            food: commodity.category === 'food',
            clothes: commodity.category === 'clothes',
            electronics: commodity.category === 'electronics'
          }"
                >
                    <div slot="header" class="commodity-header">
                        <div class="commodity-name">{{ commodity.commodityName }}</div>
                    </div>
                    <div class="commodity-content">介绍：{{ commodity.intro }}</div>
                    <div class="commodity-content">价格：{{ commodity.price }}</div>
                    <div class="commodity-content">商店：{{ commodity.shopName }}</div>
                    <div class="commodity-action">
                        <el-input-number
                                v-model="commodityNum"
                                :min="1"
                                :max="10000"
                                label="数量"
                                controls-position="right"
                                style="width: 120px"
                        ></el-input-number>
                        <el-button
                                type="primary"
                                @click="addToCart(commodity.id, commodityNum, commodity.price)"
                        >添加到购物车
                        </el-button
                        >
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
    <div class="commodity-board" style="z-index: -1">
        <el-row gutter="24">
            <el-col v-for="commodity in commodities" :key="commodity.commodityName" :xs="24" :sm="12" :md="8" :lg="6">
                <el-card class="animated-card" shadow="hover" @click="navigateToCommodity(commodity.id)">
                    <div class="card-header">
                        <div class="card-title">
                            {{ commodity.commodityName }}
                        </div>
                    </div>
                    <div class="card-content">
                        <span class="category-title">商品类别：</span>
                        <div>
                            {{
                            commodity.category
                            }}
                        </div>
                    </div>
                    <div class="card-content card-intro">
                        <span class="category-title">商店简介：</span>{{ commodity.intro }}
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {ElButton, ElCard, ElCol, ElInputNumber, ElMessage, ElRow} from 'element-plus'
import axios from 'axios'

export default {
    name: 'ActivityCommodityView',
    components: {
        ElRow,
        ElCol,
        ElCard,
        ElButton,
        ElInputNumber
    },
    data() {
        return {
            activityId: null,
            stores: [{
                shopId: null,
                shopName: null,
            }],
            commodities: [{
                shopName: null,
                shopId: null,
            }],
        }
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
        async fetchCommodity() {
            try {
                this.activityId = localStorage.getItem('activityId')
                const response = await axios.get('/api/home/getCommodityInActivity', {
                    params: {
                        activityId: localStorage.getItem('activityId')
                    }
                })
                // const response = await axios.get('api/home/display')
                console.log(response.data.data)
                this.commodities = response.data.data.map((commodity) => {
                    console.log('what')
                    console.log(commodity.shopId)
                    const commodityShop = this.fetchShopName(commodity.shopId)
                    console.log(commodityShop)
                    commodity.shopName=commodityShop.shopName
                    // console.log(commodityShop)
                    // this.fetchShopCategories(commodity.id)
                    return {
                        id: commodity.id,
                        shopId: commodity.shopId,
                        intro: commodity.intro,
                        // activityId: commodity.activityId,
                        category: commodity.category,
                        commodityName: commodity.commodityName,
                        imagePath: commodity.imagePath,
                        price: commodity.price,
                        salesNum: commodity.salesNum,
                        regStatus: commodity.regStatus,
                        changeStatus: commodity.changeStatus,
                        createTime: commodity.createTime,
                        updateTime: commodity.updateTime,
                        deleteTime: commodity.deleteTime,
                    }
                })
                // /category/getShopCategory
                return response.data.data
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
        fetchShopName(id) {
            try {
                axios.get('/api/shop/displayInfo', {
                    params: {
                        shopId: id
                    }
                }).then((response) => {
                    console.log('fetchShopName')
                    console.log(response.data.data)
                    return response.data.data
                })
            } catch (error) {
                console.log(error)
            }
        },
        fetchShopCategories(id) {
            axios
                .get('/api/category/getShopCategory', {
                    params: {
                        shopId: id
                    }
                })
                .then((response) => {
                    console.log(response.data.data)
                    const commodity = this.commodities.find((item) => item.id === id)
                    if (commodity) {
                        commodity.categories = response.data.data
                    }
                    return commodity.categories
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
            if (localStorage.getItem('role') == '1') {
                this.$router.push({
                    path: '/home/orduser/activityCommodity'
                })
            }
        }
    },
    addToCart(commodityId, quantity, price) {
        try {
            const response = axios
                .post('/api/Commodity/', {
                    // NOTE: 传一个body
                    // id: null,
                    userId: localStorage.getItem('userId'),
                    commodityId: commodityId,
                    commodityNum: quantity,
                    commodityPrice: price
                    // status: null
                })
                .then((response) => {
                    console.log(response)
                    console.log(`Adding commodity with ID ${commodityId} to cart`)
                    if (response.data.code === 200) {
                        // this.commodityNum += quantity // 将添加的商品数量加入购物车数量
                        ElMessage({
                            //用于弹出消息提示
                            showClose: true,
                            type: 'success', //如果成功
                            message: '添加成功'
                        })
                    } else {
                        ElMessage({
                            showClose: true,
                            type: 'error', //如果失败输出状态码
                            message: '操作失败:' + response.data.msg
                        })
                    }
                })
        } catch (error) {
            console.log(error)
        }
    },
    async mounted() {
        // commodity
        // try {
        //     const commoditysResponse = await this.fetchCommodity()
        //     console.log(commoditysResponse.data)
        //     // commoditysData = commoditysResponse.data //* 无须重新赋值
        //     // this.removeZerosInObjectArray(commoditysData)
        //     this.commoditys = commoditysResponse.data.map((commodity) => (
        //         {
        //             id: commodity.id,
        //             shopName: commodity.shopName,
        //             // NOTE: 先使用 split('+') 方法将字符串按照 + 号拆分为多个子字符串，然后使用 map() 方法遍历每个子字符串并使用 trim() 方法去除首尾空格
        //             // TODO: 目前categories字段的值不能为NULL，否则会报错
        //             // categories: commodity.categories.split(',').map((category) => category.trim()),
        //             //TODO: categories is removed from the chart..
        //             // categories: this.splitByComma(commodity.categories),
        //
        //             intro: commodity.intro
        //         }))
        //     // console.log(commodity.categories)
        // } catch (error) {
        //     console.log(error)
        // }
        // Activity
        await this.fetchCommodity()
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
        //     this.fetchActivity()
        // }, 2000)

        // this.startTimer()
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

.commodity-board {
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
    color: #1d1d1d;
}

.commodity-view {
    margin: 24px;
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

.commodity-card.food {
    background-color: #a5d6a7;
}

.commodity-card.clothes {
    background-color: #ffd54f;
}

.commodity-card.electronics {
    background-color: #90caf9;
}

.commodity-header {
    display: flex;
    justify-content: space-between;
}

.commodity-name {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 12px;
    cursor: pointer;
    color: #fff;
}

.commodity-content {
    font-size: 14px;
    color: #cfd8dc;
    margin-bottom: 4px;
}

.commodity-action {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.el-input-number {
    width: 80px;
}

.el-button {
    margin-left: 10px;
}
</style>
