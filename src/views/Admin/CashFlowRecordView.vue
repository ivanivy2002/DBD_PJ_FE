<template>
  <div class="container">
    <el-table :data="state.tableData" style="width: 100%">
      <el-table-column prop="operateType" label="操作类型"></el-table-column>
      <el-table-column prop="sourceName" label="来源名称"></el-table-column>
      <el-table-column prop="destName" label="目标名称"></el-table-column>
      <el-table-column prop="amount" label="流水金额"></el-table-column>
      <el-table-column prop="operationTime" label="时间"></el-table-column>
      <!-- NOTE:使用了解构赋值语法，将 row 对象从插槽数据中解构出来，然后使用它的 status 属性来决定 el-tag 标签的样式 -->
    </el-table>
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
      state: {
        tableData: []
      },
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
    fetchData: async function () {
      try {
        const response = await axios.get('/api/admin/displayCashFlow')
        //?
        // this.state = response.data.data
        // TODO: 下面的函数需要修改（字符串解析）
        this.state.tableData = response.data.data.map((row) => {
          // row.goodsInfo = row.goodsInfo.replace(/\+/g, ' ')
          console.log(row)
          // row = this.removeZerosInObjectArray(row)
          return row
        })
        // console.log(this.state.tableData)
        // this.state.tableData = this.removeZerosInObjectArray(this.state.tableData)
        console.log(this.state.tableData)
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    // 获取信息和余额
    this.fetchData()
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
  width: 30%;
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  justify-content: center;
}
</style>
