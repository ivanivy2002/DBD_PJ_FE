<template>
  <div class="addressManage">
    <div class="create-address">
      <el-button type="success" @click="createAddress" plain>新增收货地址</el-button>
      <br />
      <br />
    </div>
    <el-card class="box-card" v-for="(address, index) in addresses" :key="index">
      <div slot="header" class="clearfix">
        <div class="defaultAddress" v-if="address.ifDefault == true">
          <span>默认地址</span>
        </div>
        <span
          ><div class="address-name">{{ address.name }}</div></span
        >
        <el-button @click="deleteAddress(address.id)" style="float: right" type="danger"
          >删除</el-button
        >
        <el-button
          @click="
            editAddress(
              address.id,
              address.name,
              address.phoneNumber,
              address.address,
              address.ifDefault
            )
          "
          style="float: right"
          type="primary"
          >修改</el-button
        >
      </div>

      <div class="text item">
        <strong>联系电话：</strong>
        {{ address.phoneNumber }}
      </div>
      <div class="text item">
        <strong>详细地址：</strong>
        {{ address.address }}
      </div>
      <el-button @click="selectAddress(address.id)">选择</el-button>
    </el-card>

    <el-dialog title="编辑地址" v-model="dialogVisible">
      <el-form ref="addressForm" :model="addressForm" label-width="120px">
        <el-form-item
          label="姓名"
          prop="name"
          :rules="{ required: true, message: '请输入姓名', trigger: 'blur' }"
        >
          <el-input v-model="addressForm.name"></el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="phoneNumber"
          :rules="{ required: true, validator: validatePhoneNumber, trigger: 'blur' }"
        >
          <el-input v-model="addressForm.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item
          label="地址"
          prop="address"
          :rules="{ required: true, message: '请输入地址', trigger: 'blur' }"
        >
          <el-input v-model="addressForm.address"></el-input>
        </el-form-item>
        <el-form-item label="是否为默认地址">
          <el-radio-group v-model="addressForm.ifDefault">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAddress">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'AddressManage',
  data() {
    return {
      dialogVisible: false,
      selectAddressId: '',
      addresses: [],
      addressForm: {
        userId: '',
        name: '',
        phoneNumber: '',
        address: ''
      },
      defaultAddress: '', //*默认地址
      // NOTE: 以下为前端输入格式检查
      //* 中国大陆手机号格式：以数字 1 开头、第二位是 3-9 中的任意一个数字，后面紧跟着 9 个数字的字符串
      validatePhoneNumber: (rule, value, callback) => {
        if (!/^1[3-9]\d{9}$/.test(value)) {
          callback(new Error('请输入正确的手机号！'))
        } else {
          callback()
        }
      }
    }
  },
  mounted() {
    this.getAddressInfo()
    this.addressForm.userId = localStorage.getItem('userId')
  },
  computed: {
    //* 使用 required: true 规定该输入框是必填的，如果用户未输入用户名，则会弹出一个提示信息：“请输入用户名”。
    //* 使用 trigger: 'blur' 规定在用户离开输入框时进行验证
    rules: function () {
      return {
        phoneNumber: [{ required: true, validator: this.validatePhoneNumber, trigger: 'blur' }]
      }
    }
  },
  methods: {
    selectAddress(addressId) {
      // this.$confirm('确定选择改地址吗？', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(() => {
      this.$emit('select-address', addressId)
      // this.$emit('close-select-address')
      // })
      // .catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消选择'
      //   })
      // })
    },
    async getAddressInfo() {
      // 拿地址的数据
      await axios
        .get('/api/address/display', {
          params: {
            userId: localStorage.getItem('userId') //获取cookie中的id
          }
        })
        .then((response) => {
          if (response.data.code === 200) {
            this.addresses = response.data.data
          } else {
            ElMessage({
              showClose: true,
              type: 'error', //如果失败输出状态码
              message: '获取地址失败:' + response.data.msg
            })
          }
        })
    },
    createAddress() {
      this.dialogVisible = true
    },
    deleteAddress(id) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios
            .put('/api/address/remove', null, {
              params: {
                addressId: id
              }
            })
            .then((response) => {
              if (response.data.code === 200) {
                ElMessage({
                  showClose: true,
                  type: 'success',
                  message: '删除成功'
                })
                this.getAddressInfo() //刷新信息
              } else {
                ElMessage({
                  showClose: true,
                  type: 'error',
                  message: '删除失败:' + response.data.msg
                })
              }
            })
        })
        .catch(() => {
          ElMessage({
            showClose: true,
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    editAddress(id, name, phoneNumber, address, ifDefault) {
      this.dialogVisible = true
      this.addressForm.id = id
      this.addressForm.name = name
      this.addressForm.phoneNumber = phoneNumber
      this.addressForm.address = address
      this.addressForm.ifDefault = ifDefault
      // this.form = { ...this.addresses[index] }
      // this.editIndex = index
    },
    saveAddress() {
      this.$refs.addressForm.validate((valid) => {
        if (valid) {
          axios.post('/api/address/createOrUpdate', this.addressForm).then((response) => {
            if (response.data.code === 200) {
              ElMessage({
                showClose: true,
                type: 'success',
                message: '操作成功'
              })
              this.getAddressInfo() //刷新信息
            } else {
              ElMessage({
                showClose: true,
                type: 'error', //如果失败输出状态码
                message: '操作失败:' + response.data.msg
              })
            }
          })
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    resetForm() {
      //* 重置表单
      this.$refs.userInfo.resetFields()
      this.getUserInfo() //刷新表单
    },
    handleSelect(index) {
      this.activeSelect = index // 根据点击的菜单项更新显示的栏目
    }
  }
}
</script>

<style>
/* body {
    background-color: #2d2d2d;
    font-family: Arial, sans-serif;
  } */

.personal-center {
  margin-top: 50px; /* 顶栏的高度 */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px;
  color: #ffffff;
}

.personal-info,
.personal-balance,
.change-password {
  background-image: linear-gradient(-45deg, #24b8c6, #26d6cd);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #fcfcfc;
}

.user-form,
.balance-form,
.password-form {
  margin-top: 20px;
}

.el-form-item {
  margin-bottom: 15px;
}

.el-button {
  background-color: #66ccff;
  border: none;
  cursor: pointer;
  padding: 10px 20px;
  font-size: 16px;
  color: #ffffff;
  margin-right: 10px;
}

.el-button:hover {
  background-color: #4db8ff;
}

.el-button[type='primary'] {
  background-color: #4db8ff;
}

.el-button[type='primary']:hover {
  background-color: #3da6ff;
}

.el-input {
  /* background-color: #666; */
  color: #ffffff;
  border-radius: 4px;
  border: none;
  padding: 0 10px;
  box-shadow: none;
  transition: all 0.3s ease;
}

.el-input::placeholder {
  color: #aaa;
}

.el-input:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(102, 204, 255, 0.5);
  border-color: #66ccff;
}

.aside {
  margin: 20px;
  float: left;
  margin-right: 20px;
}

/* 设置菜单栏的宽度和高度 */
.el-menu-vertical-demo {
  width: 200px;
  height: 100%;
}

/* 设置菜单项的字体大小和颜色 */
.el-menu-item {
  font-size: 16px;
  color: #606266;
}

/* 鼠标悬停在菜单项上时的背景色 */
.el-menu-item:hover {
  background-color: #f5f7fa;
}

/* 设置菜单的边框和背景色 */
.aside {
  border: 1px solid #ebeef5;
  background-color: #fff;
}

.box-card {
  background-image: linear-gradient(-45deg, #24b8c6, #26d6cd);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
  width: 500px;
  max-width: 600px;
}

.address-name {
  /* font-family: 'songti'; */
  font-size: 25px;
  font-weight: 500;
  font-style: normal;
  color: #000000;
}
.defaultAddress {
  display: inline-block;
  padding: 4px 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}
.defaultAddress span {
  margin-right: 4px;
}
</style>
