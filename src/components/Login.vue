<template>
  <div class="loginContainer">
    <h1>电商后台管理系统登录</h1>
    <div class="loginBox">
      <!-- 登录表单区域-->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
            placeholder="请输入用户名"
            v-focus
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456"
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          {
            required: true,
            message: "请输入您的用户名",
            trigger: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur"
          }
        ],
        // 验证密码是否合法
        password: [
          {
            required: true,
            message: "请输入您的登录密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.post("login", this.loginForm);
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error("登录失败！");
        this.$message.success("登录成功");
        window.sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("loginer", res.data.username);
        this.$router.push("/home");
      });
    },
    reset() {
      this.$refs.loginFormRef.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.loginContainer {
  background-image: radial-gradient(at center bottom, #eda7f7, #62b9f5);
  height: 100%;
  position: relative;
  h1 {
    position: absolute;
    top: 20%;
    left: 38%;
    text-shadow: 2px 4px 5px grey;
  }
  .loginBox {
    position: absolute;
    width: 450px;
    height: 300px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 5px;
    box-shadow: 0px 4px 10px grey;
    display: flex;
    justify-content: center;
    align-items: center;
    .login_form {
      margin-top: 30px;
      .el-input {
        width: 300px;
        margin: 10px;
        opacity: 0.8;
      }
      .btns {
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        .el-button {
          width: 120px;
          margin: 10px;
        }
      }
    }
  }
}
</style>
