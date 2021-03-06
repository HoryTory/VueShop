<template>
  <div>
    <Bread :paths="dataPaths"></Bread>
    <el-card shadow="hover">
      <el-row>
        <el-col :span="8">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            clearable
            @clear="getOrderLst"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderLst"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderData" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="400">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="80">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showProgressDialog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="40%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 查看物流信息对话框 -->
    <el-dialog
      title="查看物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
      <el-timeline reverse>
        <el-timeline-item
          v-for="(progress, index) in progressInfo"
          :key="index"
          :timestamp="progress.time"
          placement="top"
        >
          {{ progress.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "@/assets/js/citiesData.js";
import Bread from "@/component/Breadcrumb";
export default {
  data() {
    return {
      dataPaths: [{ pathName: "订单管理" }, { pathName: "订单列表" }],
      orderData: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ""
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },
      cityData,
      progressDialogVisible: false,
      progressInfo: []
    };
  },
  mounted() {
    this.getOrderLst();
  },
  methods: {
    async getOrderLst() {
      console.log(this.queryInfo);
      const { data: res } = await this.$axios.get("orders", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取订单列表失败！");
      this.orderData = res.data.goods;
      console.log(res);
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderLst();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderLst();
    },
    // 显示省市区弹窗
    showEditDialog() {
      this.addressVisible = true;
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },
    // 显示物流信息
    async showProgressDialog() {
      const { data: res } = await this.$axios.get("/kuaidi/804909574412544580");

      if (res.meta.status !== 200) {
        return this.$message.error("获取物流进度失败！");
      }
      this.progressInfo = res.data;
      this.progressDialogVisible = true;
      console.log(this.progressInfo);
    }
  },
  components: {
    Bread
  }
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
