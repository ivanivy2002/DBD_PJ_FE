<template>
    <div class="store-info">
        <el-card class="store-info-card">
            <div slot="header" class="store-info-title">商店信息</div>
            <div class="store-info-content">
                <div class="store-info-item">
                    <span class="store-info-label">商店名称：</span>
                    <span class="store-info-value">{{ shopInfoForm.shopName }}</span>
                </div>
                <div class="store-info-item">
                    <span class="store-info-label">商品类别：</span>
                    <div class="store-info-value">
            <span
                    v-for="(category, index) in shopInfoForm.categories"
                    :key="index"
                    class="category-item"
            >{{ category }}</span
            >
                    </div>
                </div>
                <div class="store-info-item">
                    <span class="store-info-label">商店简介：</span>
                    <span class="store-info-value">{{ shopInfoForm.intro }}</span>
                </div>
                <div class="store-info-item">
                    <span class="store-info-label">备案地址：</span>
                    <span class="store-info-value">{{ shopInfoForm.address }}</span>
                </div>
                <div class="store-info-item">
                    <span class="store-info-label">商店资金：</span>
                    <span class="store-info-value">{{ shopInfoForm.fund }}</span>
                </div>
            </div>
            <el-button type="primary" class="store-info-btn" @click="gotoMCenter">修改商店</el-button>
        </el-card>
        <el-card class="commodity-card">
            <div slot="header" class="commodity-title">商品管理</div>
            <div class="commodity-content"></div>
            <el-button type="primary" class="commodity-btn" @click="gotoCommodity">修改商品</el-button>
        </el-card>
    </div>
</template>

<script>
// import {ref} from 'vue'
import axios from 'axios'
import {ElMessage} from 'element-plus'

export default {
    name: 'StoreInfoView',
    data() {
        return {
            shopInfoForm: {
                id: 21,
                vendorId: 21,
                shopName: 'gan1',
                userName: 'Ivan',
                idNumber: '30212566965845212X',
                categories: ['GPT', 'food'],
                intro: '加油',
                address: '江苏',
                regStatus: '正在营业',
                removeStatus: '待审核',
                fund: 1.0e7,
                // removeStatus: '未申请',
                createTime: '202022',
                deleteTime: '202022',
                updateTime: '202022'
            }
        }
    },
    async mounted() {
        await this.getShopInfo()
        console.log('Out: 2. After this.getShopInfo, mounted')
        console.log(this.shopInfoForm.shopName)
    },
    methods: {
        async getShopInfo() {
            // 发送请求获取商店信息
            try {
                // TODO: 未做session测试
                console.log(localStorage.getItem('userId')) // 从session中拿数据像后端请求
                console.log(localStorage.getItem('shopId')) // 从session中拿数据像后端请求
                // eslint-disable-next-line no-unused-vars
                const response = await axios
                    .get('http://localhost:9000/shop/displayInfo', {
                        params: {
                            // shopId: localStorage.getItem('shopId') //获取cookie中的id
                            shopId: localStorage.getItem('shopId') //获取cookie中的id
                        }
                    })
                    .then((response) => {
                        // NOTE: 如果修改的话需要更新session
                        console.log(response.data)
                        this.shopInfoForm = {
                            //* 拿数据
                            id: response.data.data.id,
                            vendorId: response.data.data.vendorId,
                            shopName: response.data.data.shopName,
                            userName: response.data.data.userName,
                            idNumber: response.data.data.idNumber,
                            categories: response.data.data.categories
                                .split('+')
                                .map((category) => category.trim()),
                            intro: response.data.data.intro,
                            address: response.data.data.address,
                            regStatus: response.data.data.regStatus,
                            removeStatus: response.data.data.removeStatus,
                            fund: response.data.data.fund,
                            // email: response.data.data.email,
                            createTime: response.data.data.createTime,
                            deleteTime: response.data.data.deleteTime,
                            updateTime: response.data.data.updateTime
                        }
                        console.log('Out: 1. After Fetching data into shopInfoForm')
                        console.log(this.shopInfoForm.shopName)
                    })
            } catch (error) {
                console.log(error)
                ElMessage({
                    showClose: true,
                    type: 'error', //如果失败,未连接上后端
                    message: '修改信息失败, 开发问题'
                })
            }
        },
        // getShopInfo() {
        //   this.store = {
        //     id: 85,
        //     vendorId: 10,
        //     fund: 74,
        //     categories: ['ut adipisicing ut', 'cupidatat amet', 'sit dolore', 'irure pariatur quis'],
        //     status: 'ex nulla Excepteur sit et',
        //     intro: 'Lorem quis veniam velit',
        //     address: '北京玉溪市尼玛县',
        //     productInfo: 'ullamco',
        //     userName: '孔秀兰',
        //     idNumber: 62,
        //     registrationTime: '2016-12-19 15:43:30',
        //     shopName: '属根际'
        //   }
        // },
        gotoMCenter() {
            this.$router.push('/home/vendor/mcenter')
        },
        gotoCommodity() {
            this.$router.push('/home/vendor/commodity')
        }
    }
}
</script>

<style scoped>
.el-button:hover{
    /*cursor: pointer;*/
    /*box-shadow: 0 0 1em rgba(14, 90, 164, 0.55);*/
    /*!*box-shadow: 0 0 1em #07070767;*!*/
    /*-webkit-transform: scale(1.01);*/
    /*transform: scale(1.01);*/
    /*transition: transform 0.7s ease, box-shadow 0.7s ease;*/
}
.el-card:hover {
    cursor: pointer;
    box-shadow: 0 0 1em rgb(255, 255, 255);
    /*box-shadow: 0 0 1em #07070767;*/
    -webkit-transform: scale(1.01);
    transform: scale(1.01);
    transition: transform 0.7s ease, box-shadow 0.7s ease;
}

.store-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
}

.store-info-card {
    width: 600px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.store-info-title {
    font-size: 20px;
    font-weight: bold;
}

.store-info-content {
    padding: 20px;
}

.store-info-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.store-info-label {
    font-size: 16px;
    font-weight: bold;
}

.store-info-value {
    font-size: 16px;
}

.category-item {
    margin-right: 5px;
    background-color: #19cde9;
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 14px;
    color: #333;
}

.store-info-btn,
.commodity-btn {
    margin-top: 20px;
}

.commodity-card {
    width: 600px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.commodity-title {
    font-size: 20px;
    font-weight: bold;
}

.commodity-content {
    padding: 20px;
}
</style>
