<template>
  <div>
    <Bread :paths="dataPaths"></Bread>
    <el-card shadow="hover">
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
      >
      </el-alert>
      <div class="selectArea">
        <label>选择商品分类：</label>
        <el-cascader
          :props="cascaderProps"
          :options="cateLst"
          v-model="selectedKeys"
          @change="cateChanged"
          clearable
        ></el-cascader>
      </div>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            @click="showDialog('01')"
            :disabled="isBtnDisabled"
            >添加参数</el-button
          >
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showDialog('02', scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="showDialog('01')"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showDialog('02', scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 新增|修改窗口 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="40%"
      @close="dialogClosed"
    >
      <el-form
        :model="formData"
        ref="formDataRef"
        label-width="80px"
        :rules="formDataRules"
      >
        <el-form-item :label="formLabel" prop="attr_name">
          <el-input v-model="formData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Bread from "@/component/Breadcrumb";
export default {
  data() {
    return {
      dataPaths: [{ pathName: "商品管理" }, { pathName: "参数列表" }],
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      cateLst: [],
      selectedKeys: [],
      manyTableData: [],
      onlyTableData: [],
      // 被激活的tab
      activeName: "many",
      dialogVisible: false,
      dialogTitle: "",
      formLabel: "",
      formData: {
        attr_name: ""
      },
      formDataRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getCateLst();
  },
  methods: {
    async getCateLst() {
      const { data: res } = await this.$axios.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类列表数据失败！");
      }
      this.cateLst = res.data;
    },
    // 监听级联选择器的选择变化
    cateChanged() {
      this.getParams();
    },
    async getParams() {
      if (this.selectedKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      const { data: res } = await this.$axios.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败！");
      }

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        item.inputVisible=false;
        item.inputValue="";
      });
      console.log(res.data);

      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // Tab页签切换
    handleTabClick() {
      console.log(this.activeName);
      this.getParams();
    },
    // 控制标签的关闭
    handleClose(i, data) {},
    // 操作窗口关闭
    dialogClosed() {
      this.$refs.formDataRef.resetFields();
    },
    // 操作显示新增还是修改
    async showDialog(type, id) {
      console.log(id); 
      this.dialogTitle =
        type === "01" ? "添加" + this.titleText : "修改" + this.titleText;
      this.formLabel = this.activeName === "many" ? "动态参数" : "静态属性";
      if (type === "02") {
        const { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes/${id}`,
          {
            params: { attr_sel: this.activeName }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取参数信息失败！");
        }
        this.formData = res.data;
      } else {
        this.formData = {};
      }
      console.log(this.formData); 
      this.dialogVisible = true;
    },
    //删除某条
    async removeParams(id){
      let str = this.activeName === "many" ? "参数" : "属性";
      const confirmResult = await this.$confirm(
        "此操作将永久删除该条"+str+", 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$axios.delete(`categories/${this.cateId}/attributes/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败！");
      }
      this.$message.success("删除成功！");
      this.getParams();
    },
    // 控制标签的删除
    handleClose(i,row){
      row.attr_vals.splice(i,1);
      this.saveTagValues(row);
    },
    //文本框失去焦点或者被按下时触发
   handleInputConfirm(row){
      // 防止只输入了空格
      if(row.inputValue.trim().length===0){
        row.inputValue="";
        row.inputVisible=false;
        return;
      }
      //加输入的文本添加到attr_vals数组中
      row.attr_vals.push(row.inputValue);
      row.inputValue="";
      row.inputVisible=false; 
      //存入后台数据库
      this.saveTagValues(row);
    },
    async saveTagValues(row){
      const { data: res } = await this.$axios.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }
      this.$message.success('修改参数项成功！')
    },
    // 点击后切换成输入框
    showInput(row){
      row.inputVisible=true;
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    // 确定新增或修改
    sure() {
      this.$refs.formDataRef.validate(async valid => {
        if (!valid) return;
        if (this.dialogTitle.substr(0, 2) === "添加") {
          const { data: res } = await this.$axios.post(
            `categories/${this.cateId}/attributes`,
            {
            attr_name: this.formData.attr_name,
            attr_sel: this.activeName
          }
          );
          if (res.meta.status !== 201) return this.$message.error("添加失败");
        } else {
          const { data: res } = await this.$axios.put(
            `categories/${this.cateId}/attributes/${this.formData.attr_id}`,
            {attr_name:this.formData.attr_name,attr_sel:this.activeName}
          );
          if (res.meta.status !== 200) {
          return this.$message.error('修改失败！');
         }
        }
        this.$message.success('操作成功！');
        this.getParams();
        this.dialogVisible=false;
      });
    }
  },
  components: {
    Bread
  },
  computed: {
    // 当前选中的三级分类的Id
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2];
      }
      return null;
    },
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true;
      }
      return false;
    },
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    }
  }
};
</script>

<style lang="less" scoped>
.selectArea {
  margin: 15px 0;
}
.input-new-tag {
  width: 120px;
}
.el-tag {
  margin-right: 10px;
}
</style>
