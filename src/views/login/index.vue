<template>
  <div class="login-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="login-form">
      <h2 class="login-title">梦学谷管理系统</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { login, getUserInfo } from "@/api/login";
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            this.$store.dispatch('Login',this.form).then(response=>{
              if(response.flag){
                this.$router.push('/');
              }else{
                this.$message({
                     message: response.message,
                     type: "warning"
                  });
              }
            })
            .catch(error=>{

            })

          // login(this.form.username, this.form.password).then(response => {
          //   const resp = response.data;
          //   if (resp.flag) {
          //     getUserInfo(resp.data.token).then(response => {
          //       const respUser = response.data;
          //       if (respUser.flag) {
          //         localStorage.setItem(
          //           "mxg-msm-user",
          //           JSON.stringify(respUser.data)
          //         );
          //         localStorage.setItem("mxg-msm-token", resp.data.token);
          //         this.$router.push("/");
          //       } else {
          //         this.$message({
          //           message: respUser.message,
          //           type: "warning"
          //         });
          //       }
          //     });
          //   } else {
          //     this.$message({
          //       message: resp.message,
          //       type: "warning"
          //     });
          //   }
          // });
        } else {
          this.$message({
            message: "账号密码不能为空",
            type: "warning"
          });
          return false;
        }
      });
    }
  }
};
</script>
<style>
.login-container {
  position: relative;
  height: 100%;
  width: 100%;
  background-image: url("../../assets/login.jpg");
  background-size: cover;
}
.login-form {
  position: absolute;
  width: 350px;
  margin-top: 160px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.7);
  padding: 30px;
  border-radius: 20px;
}
.login-title {
  color: #303133;
  text-align: center;
}
</style>
