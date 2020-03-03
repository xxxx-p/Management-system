<template>
  <div>
    <el-form :inline="true" ref="searchFrom" :model="searchMap" style="margin-top:20px">
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd('pojoForm')">新增</el-button>
        <el-button @click="resetForm('searchFrom')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="username" label="账号"></el-table-column>
      <el-table-column prop="name" label="姓名" width="90"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="salary" label="薪酬"></el-table-column>
      <el-table-column prop="entryDate" label="入职时间"></el-table-column>
      <el-table-column label="操作" width="148">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-dialog title="会员编辑" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-position="right"
        label-width="100px"
        style="width:400px"
        :rules="rules"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="pojo.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="pojo.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="pojo.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="薪酬" prop="salary">
          <el-input v-model="pojo.salary" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entryDate">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="pojo.entryDate"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button
          type="primary"
          @click="!pojo.id?addData('pojoForm'):updateData('pojoForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import staffsApi from "@/api/staffs";
export default {
  data() {
    return {
      list: [],
      searchMap: {},
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      pojo: {
        id: "",
        username: "",
        name: "",
        age: "",
        mobile: "",
        salary: "",
        entryDate: ""
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      staffsApi
        .Search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          if (resp.flag) {
            this.total = resp.data.total;
            this.list = resp.data.rows;
          }
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    handleAdd(formName) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    //把数据传递给表单后再弹出表单
    handleAdds(resp) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
        this.pojo = resp.data;
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //提交新增数据与校验
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          staffsApi.add(this.pojo).then(response => {
            const res = response.data;
            if (res.flag) {
              this.$message(res.message);
              this.fetchData();
              this.dialogVisible = false;
            } else {
              this.$message(res.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          staffsApi.update(this.pojo).then(response => {
            const res = response.data;
            if (res.flag) {
              this.$message(res.message);
              this.fetchData();
              this.dialogVisible = false;
            } else {
              this.$message(res.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    handleEdit(id) {
      staffsApi.getByid(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
        //   this.dialogVisible = true; console.log(resp.data)
        //   this.pojo = resp.data;
           this.handleAdds(resp);
        } else {
          this.$message({
            message: resp.message,
            type: "warning"
          });
        }
      });
    },
    handleDelete(id) {
      this.$confirm("确认删除这条记录吗?", "提示", {
        confirmButtonText: "确认",
        cencelButtonText: "取消"
      })
        .then(() => {
          staffsApi.delete(id).then(response => {
            const resp = response.data;
            this.$message({
              message: resp.message,
              type: resp.flag ? "succuss" : "error"
            });
            if (resp.falg) {
              this.fetchData();
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>