<template>
  <div>
    <Bread :paths="dataPaths"></Bread>

    <el-card shadow="hover">
      <el-table :data="rightsData" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'" type="primary">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success"
              >二级</el-tag
            >
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Bread from "@/component/Breadcrumb";
export default {
  data() {
    return {
      dataPaths: [{ pathName: "权限管理" }, { pathName: "权限列表" }],
      rightsData: []
    };
  },
  mounted() {
    this.getRightsLst();
  },
  methods: {
    async getRightsLst() {
      const { data: res } = await this.$axios.get("rights/list");
      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表失败");
      this.rightsData = res.data;
    }
  },
  components: {
    Bread
  }
};
</script>

<style lang="less" scoped></style>
