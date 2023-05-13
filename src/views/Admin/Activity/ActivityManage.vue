<template>
  <div>
    <el-table :data="state.tableData" style="width: 100%">
      <el-table-column prop="id" label="活动编号" width="100px"></el-table-column>
      <el-table-column prop="lastTime" label="持续时间" width="100px"></el-table-column>
      <el-table-column prop="activityFund" label="活动资金" width="100px"></el-table-column>
      <el-table-column prop="regFund" label="注册资金阈值" width="110px"></el-table-column>
      <el-table-column prop="monthlySales" label="月销量阈值" width="100px"></el-table-column>
      <el-table-column prop="monthlyAmount" label="月销售阈值" width="100px"></el-table-column>
      <!--      <el-table-column prop="status" label="活动状态"></el-table-column>-->
      <el-table-column prop="originFund" label="初始资金" width="100px"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <!--            <el-table-column prop="x" label="X"></el-table-column>-->
      <!--            <el-table-column prop="y" label="Y"></el-table-column>-->
      <el-table-column prop="status" label="活动状态">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)" disable-transitions>{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            type="success"
            size="small"
            @click="openActivity(row)"
            :disabled="isOpenButtonDisabled(row)"
            >开始
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="stopActivity(row)"
            :disabled="isStopButtonDisabled(row)"
            >结束
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="preset-board">
    <!--        @click="presetFormVisible = true"-->
    <PresetButton />
  </div>
  <div>
    <el-dialog v-model="presetFormVisible" title="活动新开" class="preset-dialog">
      <!--        append-to-body-->
      <div class="preset-form">
        <div class="form-header">申请开店</div>
        <div class="form-container">
          <el-form ref="form" :model="presetForm" label-width="80px" :rules="rules">
            <!-- <el-form-item label="用户名" prop="userName">
                                <el-input
                                  v-model="presetForm.userName"
                                  placeholder="请输入您的用户名以供确认"
                                  onfocus="if (this.placeholder == this.value) this.value = ''"
                                ></el-input>
                              </el-form-item> -->
            <el-form-item label="店名" prop="shopName">
              <el-input v-model="presetForm.shopName"></el-input>
            </el-form-item>
            <!-- <el-form-item label="商品类别" prop="categories">
                                <el-checkbox-group v-model="presetForm.categories">
                                  <el-checkbox label="food">食品</el-checkbox>
                                  <el-checkbox label="clothing">服装</el-checkbox>
                                  <el-checkbox label="electronics">电子产品</el-checkbox>
                                  <el-checkbox label="GPT">GPT</el-checkbox>
                                  <el-input
                                    v-model="catagoryInput"
                                    placeholder="请输入自定义的商品类别："
                                    onfocus="if (this.placeholder == this.value) this.value = ''"
                                  ></el-input>
                                </el-checkbox-group>
                              </el-form-item> -->
            <el-form-item label="商品类别" prop="categories">
              <el-select
                v-model="categories"
                multiple
                filterable
                allow-create
                default-first-option
                :reserve-keyword="false"
                placeholder="Choose tags for your shop"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="身份证号" prop="idNumber">
              <el-input v-model="presetForm.idNumber"></el-input>
            </el-form-item>
            <el-form-item label="商店简介" prop="intro">
              <el-input v-model="presetForm.intro"></el-input>
            </el-form-item>
            <el-form-item label="备案地址" prop="address">
              <el-input v-model="presetForm.address"></el-input>
            </el-form-item>
            <el-form-item label="注册资金" prop="fund">
              <el-input v-model="presetForm.fund"></el-input>
            </el-form-item>
            <el-form-item label="注册时间" prop="registrationTime">
              <el-input v-model="presetForm.registrationTime" type="date"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="signIn" style="color: #fff">申请</el-button>
              <el-button type="primary" @click="resetForm" style="color: #fff">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import PresetButton from '@/components/AdminComponents/PresetButton.vue'
import { ref } from 'vue'

export default {
  name: 'ActivityManage',
  components: {
    PresetButton
  },
  setup() {
    const presetFormVisible = ref(false)
    return {
      presetFormVisible
    }
  },
  data() {
    return {
      state: {
        tableData: []
      },
      ifApprove: 0,
      userName: '',
      presetForm: {
        // TODO: userName之后需要改掉, 用sessionStorage来存储
        // userName: '',
        vendorId: '',
        shopName: '',
        // categories: '',
        // NOTE: 用数组传成功！！
        categories: '',
        idNumber: '',
        intro: '',
        address: '',
        fund: '',
        registrationTime: ''
        // TODO: 如何在这个时候传递用户名给后端
      }
    }
  },
  // NOTE: 用computed来实现按钮的disabled属性，如果不是待审核状态，就禁用按钮
  // NOTE: 需要注意的是，这里的row是一个参数，要在调用的时候传入
  computed: {
    isOpenButtonDisabled() {
      return (row) => {
        if (row.status !== '待开启') {
          return true
        } else {
          return false
        }
      }
    },
    isStopButtonDisabled() {
      return (row) => {
        if (row.status !== '开启成功') {
          return true
        } else {
          return false
        }
      }
    }
  },
  methods: {
    fetchData: async function () {
      try {
        // const response = await axios.get('/api/activity/display')
        const response = await axios.get('/api/home/getActivity')
        console.log(response.data.data)
        this.state.tableData = response.data.data.map((row) => {
          console.log(row)
          return row
        })
        console.log(this.state.tableData)
      } catch (error) {
        console.log(error)
      }
    },
    openActivity: async function (row) {
      try {
        console.log(row.id)
        if (row.status == '待开启') {
          const response = await axios.put('/api/activity/open', null, {
            params: {
              activityId: row.id
            }
          })
          if (response.data.code == 200) {
            ElMessage.success('已开启')
            await this.fetchData()
          } else if (response.data.code == 400) {
            ElMessage.error('开启失败')
            await this.fetchData()
          }
        }
      } catch (error) {
        ElMessage.error('Sorry,好像什么地方出错了..')
        await this.fetchData()
        console.log(error)
      }
    },
    stopActivity: async function (row) {
      try {
        this.ifApprove = 2
        console.log(row.id)
        this.id = row.id
        if (row.status == '开启成功') {
          await axios.put('/api/activity/stop', null, {
            params: {
              activityId: row.id
            }
          })
          ElMessage.success('已关闭')
          await this.fetchData()
        }
      } catch (error) {
        console.log(error)
      }
    },
    statusTagType(status) {
      switch (status) {
        case '待开启':
          return 'info'
        case '开启成功':
          return 'success'
        case '开启失败':
          return 'danger'
        case '活动结束':
          return 'warning'
        default:
          return ''
      }
    }
  },
  mounted: function () {
    this.fetchData()
  }
}
</script>

<style scoped>
.preset-board {
  display: flex;
  justify-content: center;
}

.preset-dialog {
  max-width: 600px;
  margin: 0 auto;
  background-image: linear-gradient(to bottom right, rgba(23, 206, 177, 0.89), #17e5ca);
  padding: 30px;
  border-radius: 10px;
}

.preset-form {
  max-width: 600px;
  margin: 0 auto;
  background-image: linear-gradient(to bottom right, rgba(23, 206, 177, 0.89), #17e5ca);
  padding: 30px;
  border-radius: 10px;
}

/*.el-dialog .preset-dialog{*/
/*    max-width: 600px;*/
/*    margin: 0 auto;*/
/*    background-color: #1cd5c9;*/
/*    padding: 30px;*/
/*    border-radius: 10px;*/
/*}*/
</style>
