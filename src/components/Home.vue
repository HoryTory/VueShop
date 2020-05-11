<template>
  <el-container class="homeContainer">
    <el-header>
      <div class="logoBox">
        <el-avatar shape="square" :size="50" fit="fill" :src="url"></el-avatar>
        <p>电商后台管理平台</p>
      </div>
      <div class="loginer">
        <p>
          欢迎您！<span>{{ loginer }}</span>
        </p>
        <el-avatar size="medium" :src="circleUrl"></el-avatar>
        <i class="el-icon-switch-button" @click="logout">&nbsp;退出</i>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#43425d"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menusLst"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
              ><template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main :class="isCollapse ? 'margin1' : 'margin2'">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      url: require("../assets/images/logo.jpg"),
      circleUrl: require("../assets/images/ava.jpg"),
      loginer: "",
      menusLst: [],
      iconsObj: {
        125: "iconfont icon-users",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao"
      },
      activePath: ""
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.loginer = sessionStorage.getItem("loginer");
      this.activePath = sessionStorage.getItem("activePath");
      const { data: res } = await this.$axios.get("menus");
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menusLst = res.data;
    },
    logout() {
      sessionStorage.clear();
      this.$router.push("/login");
      this.$message.warning("您已退出登录");
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.homeContainer {
  height: 100%;
  .el-header {
    position: fixed;
    z-index: 10;
    width: 100%;
    height: 70px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0px 2px 5px grey;
    .logoBox {
      display: flex;
      align-items: center;
      p {
        font-size: 22px;
        padding-left: 20px;
        font-weight: bold;
        text-shadow: 5px 2px 5px grey;
        border-left: 3px solid black;
      }
    }
    .loginer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        color: turquoise;
      }
      .el-avatar {
        margin: 0 20px;
      }
      i {
        color: tomato;
        font-size: 14px;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  .el-aside {
    position: fixed;
    height: 100%;
    margin-top: 60px;
    background-color: #43425d;
    .toggle-button {
      background-color: #5a5a79;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.3em;
      cursor: pointer;
    }
    .el-menu {
      border-right: none;
      .iconfont {
        margin-right: 10px;
        font-size: 20px;
      }
    }
  }
  .el-main {
    margin-top: 60px;
    background-color: #f7f7f7;
  }
  .margin1 {
    margin-left: 64px;
  }
  .margin2 {
    margin-left: 200px;
  }
}
</style>
