<template>
  <div>
    <Bread :paths="dataPaths"></Bread>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>
      <!-- 步骤条 -->
      <el-steps
        :active="activeIndex - 0"
        align-center
        :space="200"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- 侧边栏tabs -->
        <el-tabs
          :tab-position="tabPosition"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name"
              ><el-input v-model="addForm.goods_name"></el-input
            ></el-form-item>
            <el-form-item label="商品价格" prop="goods_price"
              ><el-input v-model="addForm.goods_price" type="number"></el-input
            ></el-form-item>
            <el-form-item label="商品重量" prop="goods_weight"
              ><el-input v-model="addForm.goods_weight" type="number"></el-input
            ></el-form-item>
            <el-form-item label="商品数量" prop="goods_number"
              ><el-input v-model="addForm.goods_number" type="number"></el-input
            ></el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                :options="catelist"
                :props="cateProps"
                v-model="addForm.goods_cat"
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
              ><el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox> </el-checkbox-group
            ></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input> </el-form-item
          ></el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action为后台对应的地址; on-preview为处理图片预览； on-remove为处理图片移除 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <el-button type="primary" class="btnAdd" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览窗口 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="40%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import Bread from "@/component/Breadcrumb";
export default {
  data() {
    return {
      dataPaths: [{ pathName: "商品管理" }, { pathName: "添加商品" }],
      // tabs和steps被激活的索引
      activeIndex: "0",
      // tab的方向
      tabPosition: "left",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        //图片上传成功后返回的临时路径组成的数组
        pics: [],
        goods_introduce: ""
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: blur }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: blur }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: blur }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: blur }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      // 级联选择器分类列表数据
      catelist: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 动态参数
      manyTableData: [],
      //  静态属性
      onlyTableData: [],
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      // 由于图片上传组件没有用到axios而是自己内部封装的ajax，所以即便为每个请求挂载了token请求头也没用，故需要使用headers属性自定义一个请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      previewVisible: false,
      previewPath: ""
    };
  },
  mounted() {
    this.getCateLst();
  },
  methods: {
    async getCateLst() {
      const { data: res } = await this.$axios.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败！");
      }
      this.catelist = res.data;
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // 离开老tab进入新tab时触发
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类!");
        return false;
      }
    },
    async tabClicked() {
      if (this.activeIndex === "1") {
        const { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" }
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取动态参数列表失败!");
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
        console.log(res.data);
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" }
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取静态属性失败!");
        this.onlyTableData = res.data;
      }
    },
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    handleRemove(file) {
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 2. 从 pics 数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath);
      // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },
    handleSuccess(response) {
      // 1. 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      // 2. 将图片信息对象，push 到pics数组中
      this.addForm.pics.push(picInfo);
      console.log(this.addForm);
    },
    add() {}
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  },
  components: {
    Bread
  }
};
</script>

<style lang="less" scoped>
.el-steps {
  margin: 20px;
}
.el-checkbox {
  margin: 0 10px 0 0;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 20px;
}
</style>
