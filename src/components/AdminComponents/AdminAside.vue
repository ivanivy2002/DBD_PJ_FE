<template>
  <div class="sidebar-container">
    <el-menu
      default-active="1"
      class="sidebar-menu"
      :collapse-transition="false"
      :unique-opened="true"
      :background-color="'#2e2e2e'"
      :text-color="'#fff'"
      :active-text-color="'#ffd04b'"
    >
      <el-menu-item index="1" class="sidebar-menu-item" @click="handleClick('account')">
        <i class="el-icon-user"></i>
        <span slot="title">商城账户</span>
      </el-menu-item>
      <el-menu-item index="2" class="sidebar-menu-item" @click="handleClick('transfer')">
        <i class="el-icon-document"></i>
        <span slot="title">转账流水</span>
      </el-menu-item>
    </el-menu>
    <div class="sidebar-content">
      <transition name="fade" mode="out-in">
        <div v-if="activeTab === 'account'" key="account" class="account-tab">
          <p class="account-balance">当前账户余额: {{ accountBalance }}</p>
          <button class="account-btn">充值</button>
        </div>
        <div v-else-if="activeTab === 'transfer'" key="transfer" class="transfer-tab">
          <ul class="transfer-list">
            <li v-for="(item, index) in transferList" :key="index">
              <span>{{ item.date }}</span>
              <span>{{ item.description }}</span>
              <span>{{ item.amount }}</span>
            </li>
          </ul>
          <button class="transfer-btn">新建转账</button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminAside',
  // components: { AdminAside },
  data() {
    return {
      activeTab: 'account',
      accountBalance: 1000,
      transferList: [
        { date: '2023-04-01', description: '购买商品', amount: '-100' },
        { date: '2023-03-31', description: '转账', amount: '+200' },
        { date: '2023-03-30', description: '充值', amount: '+500' }
      ]
    }
  },
  methods: {
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
  width: 80px;
}

.sidebar-menu-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
