<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item, index) in paths" :key="index">
      {{ item.pathName }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: ["paths"]
};
</script>

<style></style>
