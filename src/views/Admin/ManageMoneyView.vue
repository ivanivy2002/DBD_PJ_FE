<template>
  <div class="account-management">
    <h2 class="page-title">账户管理</h2>
    <div class="profit-account">
      <h3 class="section-title">商城利润账户</h3>
      <div class="account-info">
        <div class="balance">余额：{{ profitAccount.balance }}</div>
        <el-form ref="balanceForm" label-width="120px" class="balance-form">
          <el-form-item label="充值金额" prop="balance">
            <el-input v-model="rechargeAmount" type="number"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="recharge(rechargeAmount)">充值</el-button>
          </el-form-item>
        </el-form>
        <!--                <el-button type="primary" @click="showRechargeDialog = true">充值</el-button>-->
      </div>
    </div>
    <div class="merchant-accounts">
      <h3 class="section-title">商城中间账户</h3>
      <el-table :data="merchantAccounts">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="balance" label="余额"></el-table-column>
      </el-table>
    </div>
    <el-dialog title="充值商城利润账户" v-model="showRechargeDialog">
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
import axios from 'axios'
import { ElMessage } from 'element-plus'

export default {
  data() {
    return {
      profitAccount: {
        balance: 10000
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
    // recharge() {
    //   this.profitAccount.balance += this.rechargeForm.amount
    //
    //   this.profitAccount.transactions.push({
    //     date: new Date().toISOString().substr(0, 10),
    //     type: '充值',
    //     amount: this.rechargeForm.amount
    //   })
    //   this.rechargeForm.amount = 0
    //   // this.showRechargeDialog
    // },
    recharge(rechargeAmount) {
      console.log('rechargeAmount before try ' + this.rechargeAmount)
      try {
        // this.shopId = localStorage.getItem('shopId')
        // eslint-disable-next-line no-unused-vars
        const response = axios
          .post('http://localhost:9000/admin/recharge', null, {
            params: {
              amount: rechargeAmount
              // TODO: 这里amount和balance的命名和关系
            }
          })
          // eslint-disable-next-line no-unused-vars
          .then((response) => {
            // console.log(response)
            console.log('rechargeAmount after post' + this.rechargeAmount)
            // this.balance = response.data.balance
            ElMessage({
              showClose: true,
              type: 'success', //如果失败,未连接上后端
              message: '充值成功'
            })
            this.getBalance() //刷新余额
          })
      } catch (error) {
        console.log(error)
        ElMessage({
          showClose: true,
          type: 'error', //如果失败,未连接上后端
          message: '充值失败, 开发问题'
        })
      }
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
