<template>
  <div class="Aside">
    <el-menu
      style="width: 200px; min-height: calc(100vh - 50px); margin: 0; padding: 0"
      active-text-color="#53A6FC"
      background-color="#ffffff"
      class="el-menu-vertical-demo"
      default-active="1"
      text-color="#000"
      @open="handleOpen"
      @close="handleClose"
    >
      <router-link class="list-group-item" active-class="active" to="/home">
        <el-menu-item index="1">
          <!--          <el-icon>-->
          <!--            <icon-menu/>-->
          <!--          </el-icon>-->
          <span> Home </span>
        </el-menu-item>
      </router-link>

      <router-link class="list-group-item" active-class="active" to="/table">
        <el-menu-item index="2">
          <!--          <el-icon>-->
          <!--            <icon-menu/>-->
          <!--          </el-icon>-->
          <span> {{ textSecond }}</span>
        </el-menu-item>
      </router-link>
      <router-link class="list-group-item" active-class="active" to="/login">
        <el-menu-item index="5">
          <!--          <el-icon>-->
          <!--            <icon-menu/>-->
          <!--          </el-icon>-->
          <span> LoginGPT</span>
        </el-menu-item>
      </router-link>
      <el-sub-menu index="3">
        <template #title>
          <!--          <el-icon>-->
          <!--            <location/>-->
          <!--          </el-icon>-->
          <span>Manage</span>
        </template>
        <el-menu-item-group title="StoreItem">
          <el-menu-item index="3-1">Store1</el-menu-item>
          <el-menu-item index="3-2">Store2</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Aside',
  data() {
    return {
      textSecond: 'Sign Up for Vendor'
    }
  }
}
</script>

<style scoped>
.list-group-item {
  margin: 0;
  padding: 0;
  /* 去掉下划线 */
  text-decoration-line: none;
}

.Aside {
  margin: 0;
  padding: 0;
}

el-menu-item {
  margin: 0;
  padding: 0;
}

span {
  margin: 0;
  padding: 0;
}
</style>
