<template>
  <div class="account-management">
    <h2 class="page-title">账户管理</h2>
    <div class="profit-account">
      <h3 class="section-title">商城利润账户</h3>
      <div class="account-info">
        <div class="balance">余额：{{ profitAccount.balance }}</div>
        <el-button type="primary" @click="showRechargeDialog = true">充值</el-button>
      </div>
      <div class="transaction-list">
        <h4>流水</h4>
        <el-table :data="profitAccount.transactions">
          <el-table-column prop="date" label="日期"></el-table-column>
          <el-table-column prop="type" label="类型"></el-table-column>
          <el-table-column prop="amount" label="金额"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="merchant-accounts">
      <h3 class="section-title">商城中间商户</h3>
      <el-table :data="merchantAccounts">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="balance" label="余额"></el-table-column>
      </el-table>
    </div>
    <el-dialog title="充值商城利润账户" :visible.sync="showRechargeDialog">
      <el-form :model="rechargeForm" label-width="80px">
        <el-form-item label="充值金额">
          <el-input v-model.number="rechargeForm.amount"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showRechargeDialog = false">取消</el-button>
        <el-button type="primary" @click="recharge">确认充值</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profitAccount: {
        balance: 10000,
        transactions: [
          { date: '2023-04-01', type: '收入', amount: 5000 },
          { date: '2023-04-02', type: '支出', amount: 2000 },
          { date: '2023-04-03', type: '收入', amount: 1000 }
        ]
      },
      merchantAccounts: [
        { name: '商户1', balance: 5000 },
        { name: '商户2', balance: 3000 },
        { name: '商户3', balance: 2000 }
      ],
      showRechargeDialog: false,
      rechargeForm: {
        amount: 0
      }
    }
  },
  methods: {
    recharge() {
      this.profitAccount.balance += this.rechargeForm.amount
      this.profitAccount.transactions.push({
        date: new Date().toISOString().substr(0, 10),
        type: '充值',
        amount: this.rechargeForm.amount
      })
      this.rechargeForm.amount = 0
      this.showRechargeDialog
    }
  }
}
</script>

<style scoped>
.account-management {
  margin: 20px;
  padding: 20px;
  background-color: #f0f0f0;
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
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.balance {
  margin-right: 20px;
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
</style>
