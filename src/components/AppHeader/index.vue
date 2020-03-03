<template>
  <div class="header">
    <a href>
      <img src="@/assets/logo.png" alt class="logo" />
      <span class="company">梦学谷会员管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{user.name}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" command="a">修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-refresh-left" command="b">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="修改密码" width="400px" :visible.sync="dialogVisible">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        style="width:300px"
      >
        <el-form-item label="原密码" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model.number="ruleForm.checkPass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="$refs['ruleForm'].resetFields();">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { logout } from "@/api/login";
import passwordApi from "@/api/password";
export default {
  data() {
    const validateoldPass = (rule, value, callback) => {
      passwordApi.checkPwd(this.user.id, value).then(response => {
        const resp = response.data;
        if (resp.flag) {
          callback();
        } else {
          callback(new Error(resp.message));
        }
      });
    };
    const validatePass = (rule, value, callback) => {
      if (value == this.ruleForm.pass) {
        callback();
      } else {
        callback(new Error("两次输入密码不一致"));
      }
    };
    return {
      user: this.$store.state.user.user,
      ruleForm: { oldPass: "", pass: "", checkPass: "" },
      rules: {
        oldPass: [{ validator: validateoldPass, trigger: "blur" }],
        pass: [{ required: true, message: "新密码不能为空", trigger: "blur" }],
        checkPass: [{ validator: validatePass, trigger: "change" }]
      },
      dialogVisible: false
    };
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "a":
          //修改密码
          this.handlePwd();
          break;
        case "b":
          //退出系统
          this.handleLogout();
          break;
        default:
          break;
      }
    },
    handleLogout() {
      this.$store.dispatch('Logout').then(response=>{
        if(response.flag){
          this.$router.push("/login");
        }else {
           this.$message(response.data.message);
         }
      })
      // logout(localStorage.getItem("mxg-msm-token")).then(response => {
      //   if (response.data.flag) {
      //     localStorage.removeItem("mxg-msm-token");
      //     localStorage.removeItem("mxg-msm-user");
      //     this.$router.push("/login");
      //   } else {
      //     this.$message(response.data.message);
      //   }
      // });
    },
    handlePwd() {
      this.dialogVisible = true;
      this.$nextTick(()=>{
        this.$refs['ruleForm'].resetFields()
      })
    },
    // resetForm(formName){
    //   this.$refs[formName].resetFields();
    // },
    submitForm(formName) {
      this.$refs[formName].validate(valid=>{
        if(valid){
          passwordApi.updatePwd(this.user.id,this.ruleForm.pass).then(response=>{
            const resp =response.data;
            if(resp.flag){
              this.$message(resp.message);
            this.handleLogout()
            }else{
                this.$message(resp.message);
            }
          })
        }else{
          return false;
        }
      })
    }
  }
};
</script>
<style scoped>
.logo {
  width: 25px;
  vertical-align: middle;
  margin: 0 10px 0 40px;
}
.company {
  color: white;
}
.el-dropdown {
  position: absolute;
  right: 40px;
}
.el-dropdown-link {
  cursor: pointer;
  color: white;
}
</style>
