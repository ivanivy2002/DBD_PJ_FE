<template>
  <!--    <AdminAside/>-->
  <div class="account-management">
    <h2 class="page-title">账户管理</h2>
    <div class="profit-account">
      <h3 class="section-title">商城利润账户</h3>
      <div class="account-info">
        <div class="balance">余额：{{ profitAccount.balance }}</div>
        <div>
          <el-form ref="balanceForm" label-width="120px" class="balance-form">
            <el-form-item label="充值金额" prop="balance">
              <el-input v-model="rechargeAmount" type="number"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="recharge(rechargeAmount)">充值</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!--                <el-button type="primary" @click="showRechargeDialog = true">充值</el-button>-->
      </div>
    </div>
    <div class="middle-account">
      <h3 class="section-title">商城中间账户</h3>
      <div class="account-info">
        <div class="balance">余额：{{ middleAccount.balance }}</div>
      </div>
    </div>
    <el-dialog title="充值商城利润账户" v-model="showRechargeDialog">
      <el-form :model="rechargeForm" label-width="80px">
        <el-form-item label="充值金额">
          <el-input v-model.number="rechargeForm.amount"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="showRechargeDialog = false">取消</el-button>
        <el-button type="primary" @click="recharge">确认充值</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'
// import AdminAside from '@/components/AdminComponents/AdminAside.vue'
export default {
  components: {
    // AdminAside
  },
  data() {
    return {
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
        if (rechargeAmount <= 0) {
          ElMessage({
            showClose: true,
            type: 'error',
            message: '充值金额有误'
          })
          return
        }
          // eslint-disable-next-line no-unused-vars
        const response = axios
          .post('/api/admin/recharge', null, {
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
    },
    async getBalance() {
      // 发送请求获取余额
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await axios.get('/api/admin/displayProfitAccount').then((response) => {
          this.profitAccount.balance = response.data.data.balance
          console.log('profitAccount.balance ' + this.profitAccount.balance)
        })
      } catch (error) {
        console.log(error)
        ElMessage({
          showClose: true,
          type: 'error', //如果失败,未连接上后端
          message: '修改信息失败, 开发问题'
        })
      }
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await axios.get('/api/admin/displayMiddleAccount').then((response) => {
          this.middleAccount.balance = response.data.data.balance
          console.log('middleAccount.balance ' + this.middleAccount.balance)
        })
      } catch (error) {
        console.log(error)
        ElMessage({
          showClose: true,
          type: 'error', //如果失败,未连接上后端
          message: '修改信息失败, 开发问题'
        })
      }

      // // 前端写死的假数据
      // this.balance = 100.0
    }
  },
  mounted() {
    // 获取信息和余额
    this.getBalance()
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
  color: #ffffff;
}

.section-title {
  margin-top: 20px;
  margin-bottom: 10px;
  color: #ffffff;
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
</style>
