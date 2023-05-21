<template>
  <div class="info">
    <!-- TODO: 我希望能在这里显示店铺名称，或者存到localStorage里面？ -->
    <h1>商品页面</h1>
  </div>
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
          <div class="commodity-info">
            <div class="commodity-content">介绍：{{ commodity.intro }}</div>
            <div class="commodity-content">价格：{{ commodity.price }}</div>
            <div class="commodity-image">
              <!-- BUG: 图片轮播失败 -->
              <swiper
                :slides-per-view="1"
                :space-between="8"
                navigation
                :pagination="{ clickable: true }"
                :autoplay="{ delay: 3000 }"
                effect="fade"
                observer
                observeParents
                class="swiper-container"
              >
                <swiper-wrapper>
                  <swiper-slide
                    v-for="imageUrl in getImageUrls(commodity.imagePath)"
                    :key="imageUrl"
                  >
                    <img :src="imageUrl" />
                  </swiper-slide>
                </swiper-wrapper>
                <div class="swiper-pagination"></div>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
              </swiper>
            </div>
            <div class="commodity-action">
              <el-input-number
                v-model="commodityNum"
                :min="1"
                :max="10000"
                label="数量"
                controls-position="right"
                style="width: 120px"
              ></el-input-number>
              <el-button color="#626aef" @click="PunchaseDirect(commodity.id, commodityNum)">
                直接购买
              </el-button>
              <el-button type="primary" @click="addToCart(commodity.id, commodityNum)"
                ><el-icon><ShoppingCart /></el-icon
              ></el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ElRow, ElCol, ElCard, ElButton, ElInputNumber, ElMessage } from 'element-plus'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.min.css'
import CommoditySwiper from '../../components/CommoditySwiper.vue'

export default {
  components: {
    ElRow,
    ElCol,
    ElCard,
    ElButton,
    ElInputNumber,
    Swiper,
    SwiperSlide,
    CommoditySwiper
  },
  data() {
    return {
      imageUrls: [],
      swiperOptions: {
        pagination: {
          el: '.swiper-pagination'
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      shopId: '', // 假设shopId已经从localStorage中获取
      commodities: [],
      commodityInfoArray: []
      // commodityNum: 0 // 购物车数量
    }
  },
  async mounted() {
    try {
      const commoditiesResponse = await this.fetchData()
      console.log(commoditiesResponse.data)
      this.commodities = commoditiesResponse.data.map((commodity) => ({
        id: commodity.id,
        commodityName: commodity.commodityName,
        intro: commodity.intro,
        price: commodity.price,
        imagePath: commodity.imagePath,
        commodityNum: 1 // 初始商品数量为1
      }))
      console.log(this.commodities)
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    async fetchData() {
      try {
        this.shopId = localStorage.getItem('showShopId')
        const response = await axios.get('/api/commodity/displayQualified/', {
          params: { shopId: this.shopId }
        })
        console.log(response.data)
        return response.data
      } catch (error) {
        console.log(error)
      }
    },
    // NOTE: 添加商品到购物车
    addToCart(commodityId, quantity) {
      try {
        const response = axios
          .post('/api/shoppingCart/addCommodity/', {
            // NOTE: 传一个body
            id: null,
            userId: localStorage.getItem('userId'),
            shopId: localStorage.getItem('showShopId'),
            commodityId: commodityId,
            commodityNum: quantity,
            status: '有效'
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
    // NOTE: 直接购买商品
    PunchaseDirect(commodityId, Num) {
      this.$confirm('确定要直接购买吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.getCommodityInfo(commodityId, Num)

        // this.$nextTick(() => {
        //   console.log(commodityInfo)
        //   localStorage.setItem('commodityArray', JSON.stringify(commodityInfo))
        //   this.$router.push('/home/orduser/order/create')
        // })
      })
      // .catch(() => {
      //   // this.$message({
      //   //   type: 'info',
      //   //   message: '已取消购买'
      //   // })
      // })
    },
    // NOTE: 通过commodityId查询commodity的各个属性
    async getCommodityInfo(commodityId, Num) {
      let commodityInfo = {}
      await axios
        .get('/api/commodity/displayInfo', {
          params: { commodityId: commodityId }
        })
        .then((response) => {
          console.log(response)
          if (response.data.code == 200) {
            console.log('成功获取商品信息')
            console.log(response.data.data)
            commodityInfo = response.data.data
            commodityInfo.commodityNum = Num
            commodityInfo.userId = localStorage.getItem('userId')
            commodityInfo.commodityId = commodityId
            // console.log(commodityInfo)
            this.commodityInfoArray.push(commodityInfo)
            localStorage.setItem('commodityArray', JSON.stringify(this.commodityInfoArray))
            this.$router.push('/home/orduser/order/create')
          } else {
            console.log('获取商品信息失败')
            commodityInfo = {} // 返回一个空对象
          }
        })
        .catch((error) => {
          console.log(error)
          commodityInfo = {} // 返回一个空对象
        })
      return commodityInfo
    },
    // async fetchImages() {
    //   // 从后端获取图片URL并存储在imageUrls数组中
    //   const response = await fetch('/api/images');
    //   const data = await response.json();
    //   this.imageUrls = data.imageUrls;
    // },
    getImageUrls(imagePaths) {
      // NOTE: 从后端获取图片的url(特殊URL)
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
.info {
  width: 100%;
}

.info h1 {
  font-size: 40px;
  color: #4befc3;
  text-transform: uppercase;
  text-align: center;
}

.commodity-view {
  margin: 24px;
}

.animated-card {
  background-color: #26d6cd;
  border-radius: 4px;
  padding: 24px;
  margin-bottom: 24px;
  cursor: default;
  transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;
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
  cursor: default;
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

.commodity-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.commodity-image {
  width: 100%;
  height: 100%;
  margin-bottom: 12px;
  overflow: hidden;
}

.commodity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

/* Swiper styles */
.swiper-slide {
  text-align: center;
  width: 100%;
  height: auto;
  position: relative;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.swiper-pagination-bullet {
  width: 8px;
  height: 8px;
  background-color: #fff;
  opacity: 0.5;
  border-radius: 50%;
  margin: 0 8px;
  cursor: pointer;
}

.swiper-pagination-bullet-active {
  opacity: 1;
}
</style>
