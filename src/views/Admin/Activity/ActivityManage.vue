<template>
  <div class="container">
    <el-table :data="state.tableData" style="width: 100%" height="400px">
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
          <!--                    <el-button-->
          <!--                            type="danger"-->
          <!--                            size="small"-->
          <!--                            @click="stopActivity(row)"-->
          <!--                            :disabled="isStopButtonDisabled(row)"-->
          <!--                    >结束-->
          <!--                    </el-button>-->
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!--  <div class="container">-->
  <!--    <el-table :data="categoryState.categoryData" style="width: 100%">-->
  <!--      <el-table-column prop="id" label="类别编号" width="100px"></el-table-column>-->
  <!--      <el-table-column prop="category" label="商品类别" width="100px"></el-table-column>-->
  <!--    </el-table>-->
  <!--  </div>-->
  <div class="preset-board">
    <!--        @click="presetFormVisible = true"-->
    <PresetButton />
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
      categoryState: {
        categoryData: []
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
        const response = await axios.get('/api/activity/displayAll')
        // const response = await axios.get('/api/home/getActivity')
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
    fetchCategory: async function () {
      try {
        const response = await axios.get('/api/category/getAllCategoryList')
        // const response = await axios.get('/api/home/getActivity')
        console.log(response.data.data)
        this.categoryState.categoryData = response.data.data.map((row) => {
          console.log(row)
          return row
        })
        console.log(this.categoryState.categoryData)
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
    this.fetchCategory()
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
.container {
  position: relative;
  top: 40px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  justify-content: center;
}
</style>
