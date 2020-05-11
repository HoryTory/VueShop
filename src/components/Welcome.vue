<template>
  <div class="mainContainer">
    <p>电商管理后台欢迎您！</p>
    <el-carousel :interval="3000" arrow="always">
      <el-carousel-item v-for="(item, index) in pics" :key="index">
        <img :src="item.picUrl" class="image" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pics: [
        { picUrl: require("../assets/images/1.jpg") },
        { picUrl: require("../assets/images/2.jpg") },
        { picUrl: require("../assets/images/3.jpg") }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
.mainContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3%;
  p {
    text-shadow: #ff0000 4px -2px 10px;
    color: white;
    font-size: 30px;
    margin-bottom: 5%;
  }
  .el-carousel {
    height: 350px;
    width: 600px;
    .image {
      height: 100%;
      width: 100%;
      opacity: 0.8;
      border-radius: 20px;
    }
  }
}
</style>
