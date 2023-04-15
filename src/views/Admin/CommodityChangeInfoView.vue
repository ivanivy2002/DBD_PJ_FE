<template>
  <el-tab-pane label="修改申请记录" name="displayChangeInfoRecord">
    <div>
      <el-table :data="stateRegRecord.tableData" style="width: 100%">
        <el-table-column prop="commodityName" label="商品名称"></el-table-column>
        <el-table-column prop="intro" label="商品简介"></el-table-column>
        <el-table-column prop="price" label="商品价格"></el-table-column>
        <!--        <el-table-column prop="categories" label="商品类别"></el-table-column>-->
        <!--      <el-table-column prop="imagePath" label="图片"></el-table-column>-->
        <!-- NOTE:使用了解构赋值语法，将 row 对象从插槽数据中解构出来，然后使用它的 regStatus 属性来决定 el-tag 标签的样式 -->
        <el-table-column prop="changeStatus" label="修改状态">
          <template #default="{ row }">
            <!-- NOTE: 0是待审核，1是已通过，2是已拒绝 -->
            <el-tag
              :type="
                row.changeStatus === '待审核'
                  ? 'warning'
                  : row.changeStatus === '已上架'
                  ? 'success'
                  : 'danger'
              "
              >{{ row.changeStatus }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-tab-pane>
</template>

<script>
export default {
  name: 'CommodityChangeInfoView'
}
</script>

<style scoped></style>
