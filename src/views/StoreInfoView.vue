<template>
  This is StoreInfo
  <div class="box">
    <div class="card">
      <div class="card-title">商店名称: {{ store.shopName }}</div>
      <!-- <div class="card-content">商品类别：{{ store.categories }}</div> -->
      <div class="card-content">
        <span class="category-title">商品类别：</span>
        <div class="category-list">
          <span v-for="(category, index) in store.categories" :key="index">{{ category }}</span>
        </div>
      </div>
      <div class="card-content">商店简介：{{ store.intro }}</div>
    </div>
    <el-button type="normal" @click="gotoMCenter">修改商店</el-button>
  </div>
  <div class="box">
    <div class="cardCommodity">商品们</div>
  </div>

  <!--  <div class="flex justify-between items-center flex-wrap">-->
  <!--    <div-->
  <!--        v-for="(shadow, i) in shadowGroup"-->
  <!--        :key="i"-->
  <!--        class="flex flex-col justify-center items-center"-->
  <!--        m="auto"-->
  <!--        w="46"-->
  <!--    >-->
  <!--      <div-->
  <!--          class="inline-flex"-->
  <!--          h="30"-->
  <!--          w="30"-->
  <!--          m="2"-->
  <!--          :style="{-->
  <!--          boxShadow: `var(${getCssVarName(shadow.type)})`,-->
  <!--        }"-->
  <!--      />-->
  <!--      <span p="y-4" class="demo-shadow-text" text="sm">-->
  <!--        {{ shadow.name }}-->
  <!--      </span>-->
  <!--      <code text="xs">-->
  <!--        {{ getCssVarName(shadow.type) }}-->
  <!--      </code>-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<script>
// import {ref} from 'vue'
import axios from 'axios'

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
      store: []
    }
  },
  mounted() {
    this.getShopInfo()
  },
  methods: {
    getShopInfo() {
      this.store = {
        id: 85,
        vendorId: 10,
        fund: 74,
        categories: ['ut adipisicing ut', 'cupidatat amet', 'sit dolore', 'irure pariatur quis'],
        status: 'ex nulla Excepteur sit et',
        intro: 'Lorem quis veniam velit',
        address: '北京玉溪市尼玛县',
        productInfo: 'ullamco',
        userName: '孔秀兰',
        idNumber: 62,
        registrationTime: '2016-12-19 15:43:30',
        shopName: '属根际'
      }
    },
    gotoMCenter() {
      this.$router.push('/home/vendor/mcenter')
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
  justify-content: center;
  /*justify-items: center;*/
}
</style>
