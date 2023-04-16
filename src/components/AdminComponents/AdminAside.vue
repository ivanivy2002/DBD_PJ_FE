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
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="showRechargeDialog = false">取消</el-button>
                                <el-button type="primary" @click="recharge">确认充值</el-button>
                            </div>
                        </el-dialog>
                    </div>
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
    data() {
        return {
            activeTab: 'account',
            accountBalance: 1000,
            transferList: [
                {date: '2023-04-01', description: '购买商品', amount: '-100'},
                {date: '2023-03-31', description: '转账', amount: '+200'},
                {date: '2023-03-30', description: '充值', amount: '+500'}
            ],
            profitAccount: {
                balance: 10000,
            },
            middleAccount: {
                balance: 99999,
            },
            merchantAccounts: [
                {name: '商户1', balance: 5000},
                {name: '商户2', balance: 3000},
                {name: '商户3', balance: 2000}
            ],
            showRechargeDialog: false,
            rechargeForm: {
                amount: 0
            },
            rechargeAmount: 0,
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
