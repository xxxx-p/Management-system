<template>
  <div>
    <el-form :inline="true" ref="searchFrom" :model="searchMap" style="margin-top:20px">
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="供应商名称"></el-input>
      </el-form-item>
      <el-form-item prop="linkname" v-if="!isDialog" >
        <el-input v-model="searchMap.linkname" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" v-if="!isDialog">
        <el-input v-model="searchMap.mobile" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd" v-if="!isDialog">新增</el-button>
        <el-button @click="resetForm('searchFrom')" v-if="!isDialog">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table highlight-current-row   @current-change="clickCurrentChange" :data="list" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="供应商名称"></el-table-column>
      <el-table-column prop="linkman" label="联系人" width="90"></el-table-column>
      <el-table-column prop="mobile" label="联系电话" v-if="!isDialog"></el-table-column>
      <el-table-column prop="remark" label="备注" v-if="!isDialog"></el-table-column>
      <el-table-column label="操作" width="148" v-if="!isDialog">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
    :layout="isDialog?'prev, pager, next':'total, sizes, prev, pager, next, jumper'"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      :total="total"
    ></el-pagination>
    <el-dialog title="供应商编辑" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-position="right"
        label-width="100px"
        style="width:400px"
        :rules="rules"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="pojo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item  label="联系人" prop="linkman">
          <el-input v-model="pojo.linkman" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="pojo.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="textarea">
          <el-input v-model="pojo.textarea" type="textarea" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button
          type="primary"
          @click="pojo.id===null?addData('pojoForm'):updateData('pojoForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import supplier from "@/api/supplier";
export default {
    props:{
        isDialog:Boolean
    },
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示总数
      searchMap: {
        name: "",
        linkname: "",
        mobile: ""
      }, //条件查询绑定值
      dialogVisible: false,
      pojo: {
        id: null,
        name: "",
        linkman: "",
        mobile: "",
        textarea: ""
      },
      rules: {
        name: [
          { required: true, message: "供应商名称不能为空", trigger: "blur" }
        ],
        linkman: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      // supplier.getList().then(response=>{
      supplier
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          this.list = resp.data.rows;
          this.total = resp.data.total;
        });
    },
    handleEdit(id) {},
    handleDelete(id) {},
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //弹出新增窗口并清除数据
    handleAdd() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
        this.pojo.id = null;
      });
    },
    //提交新增数据与校验
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          supplier.add(this.pojo).then(response => {
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
    //把数据传递给表单后再弹出表单
    handleAdds(resp) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
        this.pojo = resp.data;
      });
    },
    //打开编辑窗口
    handleEdit(id) {
      // this.handleAdd();
      supplier.getByid(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.handleAdds(resp);
          // this.pojo = resp.data;
        } else {
          this.$message({
            message: resp.message,
            type: "warning"
          });
        }
      });
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          supplier.update(this.pojo).then(response => {
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
    handleDelete(id) {
      this.$confirm("确认删除这条记录吗?", "提示", {
        confirmButtonText: "确认",
        cencelButtonText: "取消"
      })
        .then(() => {
          supplier.delete(id).then(response => {
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
    },
    //传递给父组件
    clickCurrentChange(currentRow){
        //表单选定后，当前页码修改后，单前单选的表单也会随着页码的修改自动触发事件
        if(currentRow===null)return
        this.$emit('option-supplier',currentRow)
    }
  }
};
</script>