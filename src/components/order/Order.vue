<template>
  <div>
    <Bread :paths="dataPaths"></Bread>
  </div>
</template>

<script>
import Bread from "@/component/Breadcrumb";
export default {
  data() {
    return {
      dataPaths: [{ pathName: "订单管理" }, { pathName: "订单列表" }]
    };
  },
  components: {
    Bread
  }
};
</script>

<style lang="less" scoped></style>
