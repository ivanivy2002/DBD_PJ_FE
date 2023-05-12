<template>
  <div class="sidebar-container">
    <el-menu
      default-active="1"
      class="sidebar-menu"
      :collapse-transition="false"
      :unique-opened="true"
      :background-color="'rgba(33,220,186,0.95)'"
      :text-color="'#fff'"
      :active-text-color="'#ffffff'"
    >
      <el-menu-item index="2-4" class="sidebar-menu-item" @click="gotoStorePage">
        <i class="el-icon-user"></i>
        <span slot="title">查看首页</span>
      </el-menu-item>
      <el-menu-item index="2-1" class="sidebar-menu-item" @click="gotoStoreManagePage">
        <i class="el-icon-user"></i>
        <span slot="title">管理店铺</span>
      </el-menu-item>
      <el-menu-item index="2-2" class="sidebar-menu-item" @click="gotoCommodityRegManagePage">
        <i class="el-icon-user"></i>
        <span slot="title">管理商品上架</span>
      </el-menu-item>
      <el-menu-item
        index="2-3"
        class="sidebar-menu-item"
        @click="gotoCommodityChangeInfoManagePage"
      >
        <i class="el-icon-user"></i>
        <span slot="title">管理商品信息修改</span>
      </el-menu-item>
      <el-menu-item index="2-3" class="sidebar-menu-item" @click="gotoManageMoneyPage">
        <i class="el-icon-user"></i>
        <span slot="title">管理账户</span>
      </el-menu-item>
      <el-menu-item index="2-3" class="sidebar-menu-item" @click="gotoCashFlowRecordPage">
        <i class="el-icon-user"></i>
        <span slot="title">查看流水</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'AdminAside',
  data() {
    return {
      activeTab: 'account',
      accountBalance: 1000,
      transferList: [
        { date: '2023-04-01', description: '购买商品', amount: '-100' },
        { date: '2023-03-31', description: '转账', amount: '+200' },
        { date: '2023-03-30', description: '充值', amount: '+500' }
      ],
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
    gotoStoreManagePage() {
      this.$router.push('/home/admin/manage')
    },
    gotoStorePage() {
      this.$router.push('/home/admin/store')
    },
    gotoCommodityTablePage() {
      this.$router.push('/home/admin/commodityTable')
    },
    gotoCommodityRegManagePage() {
      this.$router.push('/home/admin/commodityReg')
    },
    gotoCommodityChangeInfoManagePage() {
      this.$router.push('/home/admin/commodityChangeInfo')
    },
    gotoManageMoneyPage() {
      this.$router.push('/home/admin/manageMoney')
    },
    gotoCashFlowRecordPage() {
      this.$router.push('/home/admin/cashFlowRecord')
    },
    handleClick(tab) {
      this.activeTab = tab
    }
  }
}
</script>

<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.sidebar-menu {
  background-image: linear-gradient(to bottom right, rgba(23, 206, 177, 0.89), #17e5ca);
  width: 80px;
}

.sidebar-menu-item:hover {
  background-image: linear-gradient(to bottom right, rgba(23, 206, 177, 0.89), #17e5ca);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
}

.sidebar-menu-item {
  background-image: linear-gradient(to bottom right, rgba(23, 206, 177, 0.89), #17e5ca);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header .el-menu {
  background-image: linear-gradient(to bottom right, rgba(23, 206, 177, 0.89), #17e5ca);
  border: none;
  min-height: 100%;
}

.sidebar-content {
  flex: 1;
  padding: 20px;
}

.account-tab,
.transfer-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.account-balance {
  font-size: 24px;
  margin-bottom: 20px;
}

.account-btn,
.transfer-btn {
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  color: #fff;
  background-color: #ffd04b;
  cursor: pointer;
}
</style>
