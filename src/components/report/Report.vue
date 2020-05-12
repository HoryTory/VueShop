<template>
  <div>
    <Bread :paths="dataPaths"></Bread>

    <el-card>
      <!-- 2. 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width:750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import Bread from "@/component/Breadcrumb";
import echarts from "echarts";
export default {
  data() {
    return {
      dataPaths: [{ pathName: "数据统计" }, { pathName: "数据报表" }],
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  },
  mounted() {
    this.loadChart();
  },
  components: {
    Bread
  },
  methods: {
    async loadChart() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("main"));

      const { data: res } = await this.$axios.get("reports/type/1");
      if (res.meta.status !== 200) {
        return this.$message.error("获取折线图数据失败！");
      }

      const result = this.merge(res.data, this.options);

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(result);
    },
    isObj(val) {
      const type = typeof val;
      return val !== null && (type === "object" || type === "function");
    },
    merge(source, other) {
      if (!this.isObj(source) || !this.isObj(other)) {
        return other === undefined ? source : other;
      }
      return Object.keys({ ...source, ...other }).reduce(
        (acc, key) => {
          acc[key] = this.merge(source[key], other[key]);
          return acc;
        },
        Array.isArray(source) ? [] : {}
      );
    }
  }
};
</script>

<style lang="less" scoped></style>
