<template>
  <div class="aside">
    <el-menu :default-active="activeSelect" class="el-menu-vertical-demo" @select="handleSelect">
      <el-menu-item index="1">
        <el-icon><Histogram /></el-icon>
        近一周流水
      </el-menu-item>
      <el-menu-item index="2">
        <el-icon><Histogram /></el-icon>近一月流水</el-menu-item
      >
    </el-menu>
  </div>
  <div class="container" v-if="activeTime == 1">
    <!-- <h1>近一周流水</h1> -->
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane label="入账" name="Receipt"
        >Receipt
        <el-table :data="tableReceiptData" style="width: 800px">
          <el-table-column prop="operateType" label="操作类型"></el-table-column>
          <el-table-column prop="sourceName" label="来源名称"></el-table-column>
          <el-table-column prop="destName" label="目标名称"></el-table-column>
          <el-table-column prop="amount" label="流水金额"></el-table-column>
          <el-table-column prop="operationTime" label="时间"></el-table-column>
          <!-- NOTE:使用了解构赋值语法，将 row 对象从插槽数据中解构出来，然后使用它的 status 属性来决定 el-tag 标签的样式 -->
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="出账" name="Expense"
        >Expense
        <el-table :data="tableExpenseData" style="width: 800px">
          <el-table-column prop="operateType" label="操作类型"></el-table-column>
          <el-table-column prop="sourceName" label="来源名称"></el-table-column>
          <el-table-column prop="destName" label="目标名称"></el-table-column>
          <el-table-column prop="amount" label="流水金额"></el-table-column>
          <el-table-column prop="operationTime" label="时间"></el-table-column>
          <!-- NOTE:使用了解构赋值语法，将 row 对象从插槽数据中解构出来，然后使用它的 status 属性来决定 el-tag 标签的样式 -->
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
  <div class="container" v-if="activeTime == 2">
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane label="入账" name="Receipt"
        >Receipt
        <el-table :data="tableReceiptData" style="width: 800px">
          <el-table-column prop="operateType" label="操作类型"></el-table-column>
          <el-table-column prop="sourceName" label="来源名称"></el-table-column>
          <el-table-column prop="destName" label="目标名称"></el-table-column>
          <el-table-column prop="amount" label="流水金额"></el-table-column>
          <el-table-column prop="operationTime" label="时间"></el-table-column>
          <!-- NOTE:使用了解构赋值语法，将 row 对象从插槽数据中解构出来，然后使用它的 status 属性来决定 el-tag 标签的样式 -->
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="出账" name="Expense"
        >Expense
        <el-table :data="tableExpenseData" style="width: 800px">
          <el-table-column prop="operateType" label="操作类型"></el-table-column>
          <el-table-column prop="sourceName" label="来源名称"></el-table-column>
          <el-table-column prop="destName" label="目标名称"></el-table-column>
          <el-table-column prop="amount" label="流水金额"></el-table-column>
          <el-table-column prop="operationTime" label="时间"></el-table-column>
          <!-- NOTE:使用了解构赋值语法，将 row 对象从插槽数据中解构出来，然后使用它的 status 属性来决定 el-tag 标签的样式 -->
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'
// import { ElMessage } from 'element-plus'
// import AdminAside from '@/components/AdminComponents/AdminAside.vue'

export default {
  name: 'vendorCashFlowView',
  components: {
    // AdminAside
  },
  data() {
    return {
      activeTime: '1',
      activeTab: 'Receipt',
      tableReceiptData: [],
      tableExpenseData: [],
      shopId: '',
      profitAccount: {
        balance: 10000
      },
      middleAccount: {
        balance: 99999
      },
      merchantAccounts: [
        { name: '商户1', balance: 5000 },
        { name: '商户2', balance: 3000 },
        { name: '商户3', balance: 2000 }
      ],
      showRechargeDialog: false,
      rechargeForm: {
        amount: 0
      },
      rechargeAmount: 0
    }
  },
  methods: {
    // fetchData: async function () {
    //   try {
    //     const response = await axios.get('/api/admin/displayCashFlow')
    //     //?
    //     // this.state = response.data.data
    //     // TODO: 下面的函数需要修改（字符串解析）
    //     this.tableData = response.data.data.map((row) => {
    //       // row.goodsInfo = row.goodsInfo.replace(/\+/g, ' ')
    //       console.log(row)
    //       // row = this.removeZerosInObjectArray(row)
    //       return row
    //     })
    //     // console.log(this.tableData)
    //     // this.tableData = this.removeZerosInObjectArray(this.tableData)
    //     console.log(this.tableData)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
    fetchData() {
      //根据选择的不同拿取数据
      if (this.activeTime == 1) {
        this.displayShopReceiptLastMonth()
        this.displayShopExpenseLastMonth()
      } else {
        this.displayShopReceiptLastWeek()
        this.displayShopExpenseLastWeek()
      }
    },
    displayShopReceiptLastMonth() {
      console.log('displayShopReceiptLastMonth')
      axios
        .get('/api/cashFlow/displayShopReceiptLastMonth', {
          params: {
            shopId: this.shopId
          }
        })
        .then((response) => {
          console.log(response)
          if (response.data.code == 200) {
            this.tableReceiptData = response.data.data
          } else {
            console.log('获取数据失败')
          }
        })
    },
    displayShopExpenseLastMonth() {
      console.log('displayShopExpenseLastMonth')
      axios
        .get('/api/cashFlow/displayShopExpenseLastMonth', {
          params: {
            shopId: this.shopId
          }
        })
        .then((response) => {
          console.log(response)
          if (response.data.code == 200) {
            this.tableExpenseData = response.data.data
          } else {
            console.log('获取数据失败')
          }
        })
    },
    displayShopReceiptLastWeek() {
      console.log('displayShopReceiptLastWeek')
      axios
        .get('/api/cashFlow/displayShopReceiptLastWeek', {
          params: {
            shopId: this.shopId
          }
        })
        .then((response) => {
          console.log(response)
          if (response.data.code == 200) {
            this.tableReceiptData = response.data.data
          } else {
            console.log('获取数据失败')
          }
        })
    },
    displayShopExpenseLastWeek() {
      console.log('displayShopExpenseLastWeek')
      axios
        .get('/api/cashFlow/displayShopExpenseLastWeek', {
          params: {
            shopId: this.shopId
          }
        })
        .then((response) => {
          console.log(response)
          if (response.data.code == 200) {
            this.tableExpenseData = response.data.data
          } else {
            console.log('获取数据失败')
          }
        })
    },
    handleSelect(index) {
      this.activeTime = index // 根据点击的菜单项更新显示的栏目
      this.fetchData()
    }
  },
  mounted() {
    // 获取信息和余额
    this.fetchData()
    this.shopId = localStorage.getItem('shopId')
  }
}
</script>

<style scoped>
.account-management {
  margin: 20px;
  padding: 20px;
  /* background-color: #f0f0f0; */
  background-image: linear-gradient(-45deg, #24b8c6, #26d6cd);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.page-title {
  color: #1e90ff;
}

.section-title {
  margin-top: 20px;
  margin-bottom: 10px;
  color: #1e90ff;
}

.account-info {
  /*display: flex;*/
  align-items: center;
  margin-bottom: 10px;
  width: 80%;
}

.balance {
  /*border-color: #2d2d2d;*/
  margin-left: 0px;
  /*margin-right: 20px;*/
}

.balance-form {
  margin-top: 20px;
}

.transaction-list {
  max-height: 300px;
  overflow: auto;
}

.el-dialog__body {
  padding: 20px;
}

.el-table__body {
  background-color: #fff;
}

.el-table__row--striped:nth-child(even) {
  background-color: #f5f5f5;
}
.container {
  width: 800px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  justify-content: center;
}
</style>
