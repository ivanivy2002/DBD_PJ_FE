<template>
  <div class="store-info">
    <el-card class="store-info-card">
      <!--slot="header"-->
      <div class="store-info-title">商店信息</div>
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
      <!-- :disabled="isRemoved()" -->
      <el-button
        :type="ButtonRemove"
        class="store-info-btn"
        @click="gotoMCenter"
        :disabled="disabled"
        >{{ gotoMCenterText }}
        <!--     修改商店信息/充值-->
      </el-button>
    </el-card>
    <el-card class="commodity-card">
      <!--            slot="header"-->
      <div class="commodity-title">商品管理</div>
      <div class="commodity-content">
        <el-row gutter="24">
          <el-col
            v-for="commodity in commodities"
            :key="commodity.commodityName"
            :xs="24"
            :sm="12"
            :md="10"
            :lg="12"
          >
            <el-card class="animated-card" shadow="hover">
              <div class="card-header">
                <div class="card-title">
                  {{ commodity.commodityName }}
                </div>
              </div>
              <div class="card-content">商品价格：{{ commodity.price }}</div>
              <div class="card-content">商品简介：{{ commodity.intro }}</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <!-- :disabled="isRemoved()" -->
      <el-button
        :type="ButtonRemove"
        class="commodity-btn"
        @click="gotoCommodity"
        :disabled="disabled"
        >{{ gotoCommodityText }}
      </el-button>
    </el-card>
  </div>
</template>

<script>
// import {ref} from 'vue'
import axios from 'axios'
import { ElRow, ElCol, ElCard, ElButton, ElMessage } from 'element-plus'

export default {
  components: {
    ElRow,
    ElCol,
    ElCard,
    ElButton
  },
  name: 'StoreInfoView',
  data() {
    return {
      disabled: false,
      shopInfoForm: {
        id: 0,
        vendorId: 0,
        shopName: '',
        userName: '',
        idNumber: '',
        categories: [],
        intro: '',
        address: '',
        regStatus: '待审核',
        removeStatus: '未申请',
        fund: 0,
        // removeStatus: '未申请',
        createTime: '202022',
        deleteTime: '202022',
        updateTime: '202022'
      },
      commodities: [],
      gotoMCenterText: '修改商店信息/充值',
      gotoCommodityText: '修改商品',
      ButtonRemove: 'primary'
    }
  },
  computed: {
    isRemoved() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.shopInfoForm.id = localStorage.getItem('shopId')
      console.log('isRemoved id ' + this.shopInfoForm.id)
      return () => {
        if (this.shopInfoForm.removeStatus == '已通过') {
          this.gotoMCenterText = '您的商店已注销'
          this.gotoCommodityText = '您的商店已注销'
          this.ButtonRemove = 'danger'
          return true
        }
        if (this.shopInfoForm.id == null) {
          this.gotoMCenterText = '您未开店'
          this.gotoCommodityText = '您未开店'
          this.ButtonRemove = 'warning'
          return true
        }
        return false
      }
    }
  },
  // This function is called when the component is mounted
  async mounted() {
    console.log('Out: 2. After this.getShopInfo, mounted')
    console.log(localStorage.getItem('shopId'))
    // NOTE: 这里的if里面语句不会被执行
    if (!localStorage.getItem('shopId')) {
      ElMessage({
        showClose: true,
        type: 'error',
        message: '您尚未申请开店'
      })
      this.disabled = true
      console.log(1111)
      return null
    }
    await this.getShopInfo()

    // console.log(this.shopInfoForm.shopName)
    // if (this.shopInfoForm.id !== null) {
    //     ElMessage({
    //         showClose: true,
    //         type: 'error',
    //         message: '您尚未申请开店',
    //     })
    //     return null
    // }
    try {
      const commoditiesResponse = await this.fetchData()
      console.log(commoditiesResponse.data)
      this.commodities = commoditiesResponse.data.map((commodity) => ({
        id: commodity.id,
        commodityName: commodity.commodityName,
        intro: commodity.intro,
        price: commodity.price
      }))
    } catch (error) {
      // console.error()
      // NOTE: 如果错误则设置disabled为true
      ElMessage({
        showClose: true,
        type: 'error',
        message: '您尚未申请开店'
      })
      this.disabled = true
      console.log(1111)
    }
  },
  methods: {
    async getShopInfo() {
      this.shopInfoForm.id = console.log('ShopId: ' + localStorage.getItem('shopId'))
      // if (localStorage.getItem('shopInfoForm.id') !== null) {
      //     ElMessage({
      //         showClose: true,
      //         type: 'error',
      //         message: '您尚未申请开店',
      //     })
      //     return null;
      // }
      if (this.shopInfoForm.id !== null) {
        // 发送请求获取商店信息
        try {
          // TODO: 未做session测试
          console.log(localStorage.getItem('userId')) // 从session中拿数据像后端请求
          console.log(localStorage.getItem('shopId')) // 从session中拿数据像后端请求
          // eslint-disable-next-line no-unused-vars
          const response = await axios
            .get('http://localhost:9000/shop/displayInfo', {
              params: {
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
                  .split(',')
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
            })
        } catch (error) {
          console.log(error)
          // ElMessage({
          //   showClose: true,
          //   type: 'error', //如果失败,未连接上后端
          //   message: '修改信息失败, 开发问题'
          // })
        }
      } else {
        ElMessage({
          showClose: true,
          type: 'error',
          message: '您尚未申请开店'
        })
      }
    },
    // 跳转到商家中心
    gotoMCenter() {
      this.$router.push('/home/vendor/mcenter')
    },
    // 跳转到商品管理
    gotoCommodity() {
      this.$router.push('/home/vendor/commodity')
    },
    async fetchData() {
      this.shopInfoForm.id = localStorage.getItem('shopId')
      if (this.shopInfoForm.id !== null) {
        try {
          const response = await axios.get('http://localhost:9000/commodity/displayQualified/', {
            params: { shopId: this.shopInfoForm.id }
          })
          console.log(response.data)
          return response.data
        } catch (error) {
          console.log(error)
        }
      } else {
        console.log('empty')
      }
    }
  }
}
</script>

<style scoped>
.el-button {
  float: right;
  margin-bottom: 20px;
  margin-right: 35px;
  scale: 1.25;
}

.el-button:hover {
  /*cursor: pointer;*/
  cursor: pointer;
  /*box-shadow: 0 0 1em rgba(14, 90, 164, 0.55);*/
  /*!*box-shadow: 0 0 1em #07070767;*!*/
  /*-webkit-transform: scale(1.01);*/
  /*transform: scale(1.01);*/
  /*transition: transform 0.7s ease, box-shadow 0.7s ease;*/
  /*padding: 20px;*/
  transform: scale(1.1);
  transition: transform 0.4s ease;
}

.el-card {
  /*width:100%;*/
  /*  padding:0px;*/
}

.el-card:hover {
  box-shadow: 0 0 1em rgb(255, 255, 255);
  /*box-shadow: 0 0 1em #07070767;*/
  -webkit-transform: scale(1.01);
  transform: scale(1);
  transition: transform 0.7s ease, box-shadow 0.5s ease;
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
  /*font-size: xx-large;*/
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

.card-header {
  display: flex;
  justify-content: space-between;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  cursor: pointer; /* 鼠标悬停时显示手型 */
  color: #19cde9;
}

.card-content {
  font-size: 14px;
  color: rgba(1, 0, 73, 0.75);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.animated-card {
  background-color: rgb(255, 255, 255);
  opacity: 100%;
  border-radius: 4px;
  padding: 24px;
  margin-bottom: 24px;
  cursor: pointer; /* 鼠标悬停时显示手型 */
  transition: transform 0.3s, box-shadow 0.3s;
}

.animated-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}
</style>
