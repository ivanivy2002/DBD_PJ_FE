<template>
  <div>
    <el-table :data="state.tableData" style="width: 100%">
      <el-table-column prop="shopName" label="店名"></el-table-column>
      <el-table-column prop="categories" label="商品类别"></el-table-column>
<!--      <el-table-column prop="idNumber" label="身份证号"></el-table-column>-->
<!--      <el-table-column prop="intro" label="商店简介"></el-table-column>-->
<!--      <el-table-column prop="address" label="备案地址"></el-table-column>-->
      <el-table-column prop="fund" label="注册资金"></el-table-column>
      <!--            <el-table-column prop="registrationTime" label="注册时间"></el-table-column>-->
      <!-- NOTE:使用了解构赋值语法，将 row 对象从插槽数据中解构出来，然后使用它的 status 属性来决定 el-tag 标签的样式 -->
      <el-table-column prop="regStatus" label="注册状态">
        <template #default="{ row }">
          <!-- NOTE: 0是待审核，1是已通过，2是已拒绝 -->
          <el-tag
            :type="
              row.regStatus === '待审核'
                ? 'warning'
                : row.regStatus === '已通过'
                ? 'success'
                : 'danger'
            "
            >{{ row.regStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="removeStatus" label="申请删除状态">
        <template #default="{ row }">
          <!-- NOTE: 0是待审核，1是已通过，2是已拒绝 -->
          <el-tag
            :type="
              row.removeStatus === '待审核'
                ? 'warning'
                : row.removeStatus === '已通过'
                ? 'success'
                : 'danger'
            "
            >{{ row.removeStatus }}
          </el-tag>
        </template>
      </el-table-column>
        <el-table-column prop="activityStatus" label="活动状态">
            <template #default="{ row }">
                <el-tag
                        :type="
              row.activityStatus === '待审核'
                ? 'warning'
                : row.activityStatus === '已同意'
                ? 'success'
                : row.activityStatus === '已拒绝'
                ? 'danger'
                : 'info'
            "
                >{{ row.activityStatus }}
                </el-tag>
            </template>
        </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            type="success"
            size="small"
            @click="approveShopActivity(row)"
            :disabled="isButtonDisabled(row)"
            >同意
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="rejectShopActivity(row)"
            :disabled="isButtonDisabled(row)"
            >拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

export default {
  name: 'ManageStoreActivityView',
  data() {
    return {
      state: {
        tableData: []
      },
      storesData: [],
      ifApprove: 0,
      userName: ''
    }
  },
  // NOTE: 用computed来实现按钮的disabled属性，如果不是待审核状态，就禁用按钮
  // NOTE: 需要注意的是，这里的row是一个参数，要在调用的时候传入
  computed: {
    isButtonDisabled() {
      return (row) => {
        if (row.regStatus !== '待审核' && row.removeStatus !== '待审核') {
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
        const response = await axios.get('/api/admin/displayShop')
        this.storesData = response.data.data
        // TODO: 下面的函数需要修改（字符串解析）
        this.storesData = this.removeZerosInObjectArray(this.storesData)
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
    },
    approveShopActivity: async function (row) {
      try {
        this.ifApprove = 1
        console.log(row.id)
        if (row.activityStatus == '待审核') {
          const response = await axios.put('/api/admin/handleStoreJoinActivity', null, {
            params: {
              shopId: row.id,
              ifApprove: this.ifApprove
            }
          })
          if (response.data.code == 200) {
            ElMessage.success('已同意注销')
            await this.fetchData()
          } else if (response.data.code == 400) {
            ElMessage.error('同意注销失败，请重新尝试')
            await this.fetchData()
          }
        }
      } catch (error) {
        ElMessage.error('Sorry,好像有什么地方出错了')
        await this.fetchData()
        console.log(error)
      }
    },
    rejectShopActivity: async function (row) {
      try {
        this.ifApprove = 2
        console.log(row.id)
        this.id = row.id
        if (row.regStatus == '待审核') {
          await axios.put('/api/admin/handleStoreOpen', null, {
            params: {
              shopId: row.id,
              ifApprove: this.ifApprove
            }
          })
          ElMessage.success('已拒绝开店')
          await this.fetchData()
        }
        if (row.removeStatus == '待审核') {
          const response = await axios.put('/api/admin/handleStoreRemove', null, {
            params: {
              shopId: row.id,
              ifApprove: this.ifApprove
            }
          })
          if (response.data.code == 200) {
            ElMessage.success('已拒绝注销')
            await this.fetchData()
          } else if (response.data.code == 400) {
            ElMessage.error('拒绝注销失败，请重新尝试')
            await this.fetchData()
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    // NOTE: 去掉数组末尾多余的零
    removeTrailingZeros(arr) {
      if (arr == null) {
        console.log('这个店没有选商品类别')
        return arr
      } else {
        // NOTE: 用===的时候小心
        // TODO：后期优化可以确定类型之后用===，现在先用==
        while (arr[arr.length - 1] == 0) {
          arr.pop()
        }
        return arr
        // return arr.map((item) => item.toString().replace(/0+$/, '') || item);
      }
    },
    removeZerosInObjectArray(arr) {
      let i
      for (i = 0; i < arr.length; i++) {
        arr[i].categories = this.removeTrailingZeros(arr[i].categories)
      }
    }
  },
  mounted: function () {
    this.fetchData()
  }
}
</script>
