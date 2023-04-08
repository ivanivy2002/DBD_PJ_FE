<template>
  <!--  This is StoreInfo-->
  <!--  <div class="shop_info">-->
  <!--    <el-form class="shop_info_form" label-width="200px">-->
  <!--      <el-form-item label="商店名称" prop="shopName"> </el-form-item>-->
  <!--    </el-form>-->
  <!--  </div>-->
  <div class="box">
    <div class="card">
      <div class="card-title">商店名称: {{ shopInfoForm.shopName }}</div>
      <!-- <div class="card-content">商品类别：{{ store.categories }}</div> -->
      <div class="card-content">
        <span class="category-title">商品类别：</span>
        <div class="category-list">
          <span v-for="(category, index) in shopInfoForm.categories" :key="index">{{
            category
          }}</span>
        </div>
      </div>
      <div class="card-content">商店简介：{{ shopInfoForm.intro }}</div>
    </div>
    <el-button type="normal" @click="gotoMCenter">修改商店</el-button>
  </div>
  <div class="box">
    <div class="cardCommodity">商品们</div>
    <el-button type="normal" @click="gotoCommodity">修改商品</el-button>
  </div>
</template>

<script>
// import {ref} from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

export default {
  name: 'StoreInfoView',
  setup() {
    // const shadowGroup = ref([
    //   {
    //     name: 'Basic Shadow',
    //     type: '',
    //   },
    //   {
    //     name: 'Light Shadow',
    //     type: 'light',
    //   },
    //   {
    //     name: 'Lighter Shadow',
    //     type: 'lighter',
    //   },
    //   {
    //     name: 'Dark Shadow',
    //     type: 'dark',
    //   },
    // ])
    // function getCssVarName(type) {
    //   return `--el-box-shadow${type ? '-' : ''}${type}`;
    // }
    // return{
    //   getCssVarName,
    //   shadowGroup,
    // }
  },
  data() {
    return {
      shopInfoForm: {
        shopName: 'gan',
        idNumber: '30212566965845212X',
        id: 21,
        vendorId: 21,
        userName: 'ivan',
        categories: 'GPT',
        intro: ' 加油',
        address: '浙江',
        regStatus: '已通过',
        removeStatus: '未申请',
        fund: 1.0e7
      }
    }
  },
  mounted() {
    this.getShopInfo()
  },
  methods: {
    async getShopInfo() {
      // 发送请求获取商店信息
      try {
        // TODO: 未做session测试
        console.log(localStorage.getItem('id')) // 从session中拿数据像后端请求
        const response = await axios.get('http://localhost:9000/shop/displayInfo', {
          params: {
            shopId: localStorage.getItem('id') //获取cookie中的id
          }
        })
        // NOTE: 如果修改的话需要更新session
        console.log(response.data)
        this.shopInfoForm = {
          //* 拿数据
          userName: response.data.userName,
          email: response.data.email,
          idNumber: response.data.idNumber,
          phoneNumber: response.data.phoneNumber
        }
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
.box {
  width: 500px;
  /*height: 200px;*/
  border: 2px solid #ccc;
  margin: auto;
  margin-top: 150px;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 0 10px #999;
  /*display: flex;*/
  /*justify-content: center;*/
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: white;
  /*background-color: transparent;*/
  opacity: 100%;
  /* #fff; */
  border-radius: 4px;
  /*box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);*/
  padding: 24px;
  /*margin-bottom: 24px;*/
  /*justify-items: center;*/
}
.card-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
}
.card-content {
  font-size: 24px;
}

.card-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.category-title {
  margin-right: 5px;
  font-weight: bold;
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
</style>
