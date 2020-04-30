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
      dataPaths: [{ pathName: "商品管理" }, { pathName: "商品分类" }]
    };
  },
  components: {
    Bread
  }
};
</script>

<style lang="less" scoped></style>
