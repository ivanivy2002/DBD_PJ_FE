<template>
  <div class="aside">
    <el-menu :default-active="activeSelect" class="el-menu-vertical-demo" @select="handleSelect">
      <el-menu-item index="1">
        <el-icon><HomeFilled /></el-icon>
        中间账户
      </el-menu-item>
      <el-menu-item index="2">
        <el-icon><WalletFilled /></el-icon>商城利润账户</el-menu-item
      >
    </el-menu>
  </div>
  <div class="container" v-if="activeAccount == 1">
    <!-- <h1>近一周流水</h1> -->
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane label="近一周" name="Week">
        <div class="displayMoney">
          <div class="receipt">
            <div style="display: inline-block">周入账金额：</div>
            <div style="display: inline-block">{{ receiptWeekMoney | formatMoney }}</div>
          </div>
          <div class="expense">
            <div style="display: inline-block">周出账金额：</div>
            <div style="display: inline-block">{{ expenseWeekMoney | formatMoney }}</div>
          </div>
          <div class="profit">
            <div style="display: inline-block">周净利润：</div>
            <div style="display: inline-block">
              {{ (receiptWeekMoney - expenseWeekMoney) | formatMoney }}
            </div>
          </div>
        </div>
        <el-table :data="tableWeekData" style="width: 800px">
          <el-table-column prop="operateType" label="操作类型"></el-table-column>
          <el-table-column prop="sourceName" label="转出方"></el-table-column>
          <el-table-column prop="destName" label="转入方"></el-table-column>
          <el-table-column prop="amount" label="流水金额"></el-table-column>
          <el-table-column prop="operationTime" label="时间"></el-table-column>
          <!-- NOTE:使用了解构赋值语法，将 row 对象从插槽数据中解构出来，然后使用它的 status 属性来决定 el-tag 标签的样式 -->
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="近一月" name="Month">
        <div class="displayMoney">
          <div class="receipt">
            <div style="display: inline-block">月入账金额：</div>
            <div style="display: inline-block">{{ receiptMonthMoney | formatMoney }}</div>
          </div>
          <div class="expense">
            <div style="display: inline-block">月出账金额：</div>
            <div style="display: inline-block">{{ expenseMonthMoney | formatMoney }}</div>
          </div>
          <div class="profit">
            <div style="display: inline-block">月净利润：</div>
            <div style="display: inline-block">
              {{ (receiptMonthMoney - expenseMonthMoney) | formatMoney }}
            </div>
          </div>
        </div>
        <el-table :data="tableMonthData" style="width: 800px">
          <el-table-column prop="operateType" label="操作类型"></el-table-column>
          <el-table-column prop="sourceName" label="转出方"></el-table-column>
          <el-table-column prop="destName" label="转入方"></el-table-column>
          <el-table-column prop="amount" label="流水金额"></el-table-column>
          <el-table-column prop="operationTime" label="时间"></el-table-column>
          <!-- NOTE:使用了解构赋值语法，将 row 对象从插槽数据中解构出来，然后使用它的 status 属性来决定 el-tag 标签的样式 -->
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
  <div class="container" v-if="activeAccount == 2">
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane label="近一周" name="Week">
        <div class="displayMoney">
          <div class="receipt">
            <div style="display: inline-block">周入账金额：</div>
            <div style="display: inline-block">{{ receiptWeekMoney | formatMoney }}</div>
          </div>
          <div class="expense">
            <div style="display: inline-block">周出账金额：</div>
            <div style="display: inline-block">{{ expenseWeekMoney | formatMoney }}</div>
          </div>
          <div class="profit">
            <div style="display: inline-block">周净利润：</div>
            <div style="display: inline-block">
              {{ (receiptWeekMoney - expenseWeekMoney) | formatMoney }}
            </div>
          </div>
        </div>
        <el-table :data="tableWeekData" style="width: 800px">
          <el-table-column prop="operateType" label="操作类型"></el-table-column>
          <el-table-column prop="sourceName" label="转出方"></el-table-column>
          <el-table-column prop="destName" label="转入方"></el-table-column>
          <el-table-column prop="amount" label="流水金额"></el-table-column>
          <el-table-column prop="operationTime" label="时间"></el-table-column>
          <!-- NOTE:使用了解构赋值语法，将 row 对象从插槽数据中解构出来，然后使用它的 status 属性来决定 el-tag 标签的样式 -->
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="近一月" name="Month">
        <div class="displayMoney">
          <div class="receipt">
            <div style="display: inline-block">月入账金额：</div>
            <div style="display: inline-block">{{ receiptMonthMoney | formatMoney }}</div>
          </div>
          <div class="expense">
            <div style="display: inline-block">月出账金额：</div>
            <div style="display: inline-block">{{ expenseMonthMoney | formatMoney }}</div>
          </div>
          <div class="profit">
            <div style="display: inline-block">月净利润：</div>
            <div style="display: inline-block">
              {{ (receiptMonthMoney - expenseMonthMoney) | formatMoney }}
            </div>
          </div>
        </div>
        <el-table :data="tableMonthData" style="width: 800px">
          <el-table-column prop="operateType" label="操作类型"></el-table-column>
          <el-table-column prop="sourceName" label="转出方"></el-table-column>
          <el-table-column prop="destName" label="转入方"></el-table-column>
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
  name: 'CashFlowRecord',
  components: {
    // AdminAside
  },
  data() {
    return {
      activeSelect: '1',
      activeAccount: '1',
      activeTab: 'Week',
      tableWeekData: [],
      tableMonthData: [],
      receiptWeekMoney: 0,
      expenseWeekMoney: 0,
      receiptMonthMoney: 0,
      expenseMonthMoney: 0,
      netProfitMoney: 0,
      showRechargeDialog: false,
      rechargeForm: {
        amount: 0
      },
      rechargeAmount: 0
    }
  },
  filters: {
    formatMoney(value) {
      if (typeof value !== 'number') {
        return value
      }
      const fixedValue = value.toFixed(2)
      return fixedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  mounted() {
    // 获取信息和余额
    this.fetchData()
  },
  methods: {
    fetchData() {
      //根据选择的不同拿取数据
      this.receiptMonthMoney = 0
      this.expenseMonthMoney = 0
      this.receiptWeekMoney = 0
      this.expenseWeekMoney = 0
      this.tableMonthData = []
      this.tableWeekData = []
      if (this.activeAccount == 1) {
        this.displayMiddleWeek()
        this.displayMiddleMonth()
      } else {
        this.displayProfitWeek()
        this.displayProfitMonth()
      }
    },
    displayMiddleWeek() {
      console.log('displayMiddleWeek')
      this.displayMiddleReceipt(7)
      this.displayMiddleExpense(7)
    },
    displayMiddleMonth() {
      console.log('displayMiddleMonth')
      this.displayMiddleReceipt(30)
      this.displayMiddleExpense(30)
    },
    displayProfitWeek() {
      console.log('displayProfitWeek')
      this.displayProfitReceipt(7)
      this.displayProfitExpense(7)
    },
    displayProfitMonth() {
      console.log('displayProfitMonth')
      this.displayProfitReceipt(30)
      this.displayProfitExpense(30)
    },
    displayMiddleReceipt(time) {
      console.log('displayMiddleReceipt')
      axios
        .get('/api/cashFlow/displayMiddleReceipt', {
          params: {
            days: time,
            destId: 1
          }
        })
        .then((response) => {
          console.log(response)
          if (response.data.code == 200) {
            response.data.data.forEach((item) => {
              if (time == 7) {
                this.tableWeekData.push(item)
                this.receiptWeekMoney += item.amount
              } else {
                this.tableMonthData.push(item)
                this.receiptMonthMoney += item.amount
              }
            })
          } else {
            console.log('获取数据失败')
          }
        })
    },
    displayMiddleExpense(time) {
      console.log('displayMiddleExpense')
      axios
        .get('/api/cashFlow/displayMiddleExpense', {
          params: {
            days: time,
            sourceId: 1
          }
        })
        .then((response) => {
          console.log(response)
          if (response.data.code == 200) {
            response.data.data.forEach((item) => {
              if (time == 7) {
                this.tableWeekData.push(item)
                this.expenseWeekMoney += item.amount
              } else {
                this.tableMonthData.push(item)
                this.expenseMonthMoney += item.amount
              }
            })
          } else {
            console.log('获取数据失败')
          }
        })
    },
    displayProfitReceipt(time) {
      console.log('displayProfitReceipt')
      axios
        .get('/api/cashFlow/displayProfitReceipt', {
          params: {
            days: time,
            destId: 2
          }
        })
        .then((response) => {
          console.log(response)
          if (response.data.code == 200) {
            response.data.data.forEach((item) => {
              if (time == 7) {
                this.tableWeekData.push(item)
                this.receiptWeekMoney += item.amount
              } else {
                this.tableMonthData.push(item)
                this.receiptMonthMoney += item.amount
              }
            })
            console.log(1111)
            console.log(this.tableWeekData)
          } else {
            console.log('获取数据失败')
          }
        })
    },
    displayProfitExpense(time) {
      console.log('displayProfitExpense')
      axios
        .get('/api/cashFlow/displayProfitExpense', {
          params: {
            days: time,
            sourceId: 2
          }
        })
        .then((response) => {
          console.log(response)
          if (response.data.code == 200) {
            response.data.data.forEach((item) => {
              if (time == 7) {
                this.tableWeekData.push(item)
                this.expenseWeekMoney += item.amount
              } else {
                this.tableMonthData.push(item)
                this.expenseMonthMoney += item.amount
              }
            })
          } else {
            console.log('获取数据失败')
          }
        })
    },
    handleSelect(index) {
      this.activeAccount = index // 根据点击的菜单项更新显示的栏目
      this.fetchData()
    }
  }
}
</script>

<style scoped>
.aside,
.container {
  position: relative;
  top: 30px;
}
.netProfit {
  font-size: 30px;
  color: #5693a3;
}
.displayMoney {
  /* position:relative;
  top:50px;
  left:30px; */
  font-size: 20px;
  color: rgb(148, 142, 142);
}
.receipt,
.expense {
  color: rgb(148, 142, 142);
  font-size: 20px;
  font-weight: bold;
}
.profit {
  font-size: 27px;
  color: #5693a3;
  font-weight: bold;
}
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
  margin-left: auto;
}
</style>
