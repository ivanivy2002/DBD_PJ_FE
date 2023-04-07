<template>
  <!--  TODO: 一条条记录的表单怎么写-->
  一条条记录的表单怎么写?
  <el-button type="success" text @click="dialogFormVisible = true">+上架新商品</el-button>
  <div class="el-form">
    <el-dialog v-model="dialogFormVisible" title="申请上架商品">
      <el-form ref="form" :model="signForm" label-width="80px" :rules="rules">
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="signForm.userName"
            placeholder="请输入您的用户名以供确认"
            onfocus="if (this.placeholder == this.value) this.value = ''"
          ></el-input>
        </el-form-item>
        <el-form-item label="店名" prop="shopName">
          <el-input v-model="signForm.shopName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="商品类别">
          <el-input v-model="signForm.categories"></el-input>
        </el-form-item> -->
        <el-form-item label="商品类别" prop="categories">
          <el-checkbox-group v-model="signForm.categories">
            <el-checkbox label="food">食品</el-checkbox>
            <el-checkbox label="clothing">服装</el-checkbox>
            <el-checkbox label="electronics">电子产品</el-checkbox>
            <el-checkbox label="GPT">GPT</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNumber">
          <el-input v-model="signForm.idNumber"></el-input>
        </el-form-item>
        <el-form-item label="商店简介" prop="intro">
          <el-input v-model="signForm.intro"></el-input>
        </el-form-item>
        <el-form-item label="备案地址" prop="address">
          <el-input v-model="signForm.address"></el-input>
        </el-form-item>
        <el-form-item label="注册资金" prop="fund">
          <el-input v-model="signForm.fund"></el-input>
        </el-form-item>
        <el-form-item label="注册时间" prop="registrationTime">
          <el-input v-model="signForm.registrationTime" type="date"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="signin">申请</el-button>
          <el-button type="default" @click="resetForm">重置</el-button>
          <!-- <el-button type="default" @click="dialogFormVisible = false">取消</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CommodityView'
}
</script>

<style scoped></style>
