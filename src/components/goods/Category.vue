<template>
  <div>
    <Bread :paths="dataPaths"></Bread>
    <el-card shadow="hover">
      <el-button type="primary" @click="showAddDialog">添加分类</el-button>
      <tree-table
        :data="goodsCateLst"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        ><template v-slot:isvalid="scope">
          <i
            :class="
              scope.row.cat_deleted === false
                ? 'el-icon-success'
                : 'el-icon-error'
            "
            :style="
              scope.row.cat_deleted === false
                ? 'color: lightgreen;'
                : 'color:red;'
            "
          ></i
        ></template>
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template v-slot:opt="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCateById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加弹窗 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClosed"
      >
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!-- options 用来指定数据源 -->
            <!-- props 用来指定配置对象 -->
            <el-cascader
              :props="cascaderProps"
              :options="parentCateList"
              v-model="selectedKeys"
              @change="parentCateChanged"
              clearable
            >
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改分类 -->
      <el-dialog
        title="修改分类"
        :visible.sync="editCateDialogVisible"
        width="50%"
        @close="editCateDialogClosed"
        ><el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input> </el-form-item
        ></el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Bread from "@/component/Breadcrumb";
export default {
  data() {
    return {
      dataPaths: [{ pathName: "商品管理" }, { pathName: "商品分类" }],
      goodsCateLst: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        { label: "分类名称", prop: "cat_name" },
        {
          label: "是否有效",
          // 表示，将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "isvalid"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      parentCateList: [],
      //被选中的节点的id数组
      selectedKeys: [],
      //级联选择器配置对象
      cascaderProps: {
        expandTrigger: "hover",
        // 选定的
        value: "cat_id",
        // 看到的
        label: "cat_name",
        // 父子节点之间通过什么属性来嵌套
        children: "children",
        checkStrictly: true
      },
      editId: ""
    };
  },
  mounted() {
    this.getGoodsCateLst();
  },
  methods: {
    async getGoodsCateLst() {
      const { data: res } = await this.$axios.get("categories", {
        params: this.queryInfo
      });
      // console.log(res);

      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类列表失败!");
      this.goodsCateLst = res.data.result;
      this.total = res.data.total;
    },
    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsCateLst();
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsCateLst();
    },
    // 弹出新增的对话框
    async showAddDialog() {
      this.getParentCateLst();
      this.addCateDialogVisible = true;
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    editCateDialogClosed() {},
    // 获取父级分类的数据列表
    async getParentCateLst() {
      const { data: res } = await this.$axios.get("categories", {
        params: { type: 2 }
      });
      // console.log(res);

      if (res.meta.status !== 200)
        return this.$message.error("获取父级分类列表失败!");
      this.parentCateList = res.data;
    },
    // 监听节点变化
    parentCateChanged() {
      // console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        this.addCateForm.cat_level = 0;
        this.addCateForm.cat_pid = 0;
      }
    },
    async showEditDialog(id) {
      this.editId = id;
      const { data: res } = await this.$axios.get("categories/" + id);
      if (res.meta.status !== 200)
        return this.$message.error("获取该分类信息失败！");
      this.addCateForm = res.data;
      console.log(res.data);
      this.editCateDialogVisible = true;
    },
    addCate() {
      console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201)
          return this.$message.error("添加分类失败!");
        this.$message.success("添加分类成功!");
        this.addCateDialogVisible = false;
        this.getGoodsCateLst();
      });
    },
    editCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.put(
          "categories/" + this.editId,
          { cat_name: this.addCateForm.cat_name }
        );
        if (res.meta.status !== 200)
          return this.$message.error("修改分类失败!");
        this.$message.success("修改分类成功！");
        this.editCateDialogVisible = false;
        this.getGoodsCateLst();
      });
    },
    async removeCateById(id) {
      const confirmRes = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
      ).catch(error => error);
      if (confirmRes !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$axios.delete("categories/" + id);
      if (res.meta.status !== 200) return this.$message.error("删除该分类失败");
      this.$message.success("删除成功");
      this.getGoodsCateLst();
    }
  },
  components: {
    Bread
  }
};
</script>

<style lang="less" scoped>
.zk-table {
  margin-top: 20px;
}
</style>
