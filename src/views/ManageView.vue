<template>
  <div>
    <el-table :data="state.tableData" style="width: 100%">
      <el-table-column prop="shopName" label="店名"></el-table-column>
      <el-table-column prop="categories" label="商品类别"></el-table-column>
      <el-table-column prop="idNumber" label="身份证号"></el-table-column>
      <el-table-column prop="intro" label="商店简介"></el-table-column>
      <el-table-column prop="address" label="备案地址"></el-table-column>
      <el-table-column prop="fund" label="注册资金"></el-table-column>
      <el-table-column prop="registrationTime" label="注册时间"></el-table-column>
      <!-- NOTE:使用了解构赋值语法，将 row 对象从插槽数据中解构出来，然后使用它的 status 属性来决定 el-tag 标签的样式 -->
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <!-- NOTE: 0是待审核，1是已通过，2是已拒绝 -->
          <el-tag
            :type="
              row.status === '待审核' ? 'warning' : row.status === '已通过' ? 'success' : 'danger'
            "
            >{{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <!-- <el-button
            v-if="row.status === '待审核'"
            type="primary"
            size="small"
            @click="approveShop(row)"
          >
            同意
          </el-button> -->
          <el-button type="success" size="small" @click="approveShop(row)" :disabled="isButtonDisabled(row)">同意</el-button>
          <el-button type="danger" size="small" @click="rejectShop(row)" :disabled="isButtonDisabled(row)">拒绝</el-button>
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
  name: 'MyComponent',
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
      if (row.status !== '待审核') {
        return true;
      } else {
        return false;
      }
    };
  },
},
  methods: {
    fetchData: async function () {
      try {
        const response = await axios.get('http://localhost:9000/admin/display')
        this.storesData = response.data
        this.storesData = this.removeZerosInObjectArray(this.storesData)
        this.state.tableData = response.data.map((row) => {
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
    approveShop: async function (row) {
      try {
        this.ifApprove = 1
        console.log(row.userName)
        const response = await axios.get('http://localhost:9000/admin/handleRequest', {
          params: {
            // userName: 'penny',
            userName: row.userName,
            ifApprove: this.ifApprove
          }
        })
        if (response.data.code == 200) {
          ElMessage.success('已同意开店')
          this.fetchData()
        } else if (response.data.code == 400) {
          ElMessage.error('同意开店失败，请重新尝试')
          this.fetchData()
        }
      } catch (error) {
        ElMessage.error('Sorry,好像有什么地方出错了')
        this.fetchData()
        console.log(error)
      }
    },
    rejectShop: async function (row) {
      try {
        this.ifApprove = 2
        this.userName = row.userName
        await axios.get('http://localhost:9000/admin/handleRequest', {
          params: {
            userName: row.userName,
            ifApprove: this.ifApprove
          }
        })
        ElMessage.success('已拒绝开店')
        this.fetchData()
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
