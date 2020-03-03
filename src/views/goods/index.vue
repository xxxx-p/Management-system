<template>
  <div>
    <el-form :inline="true" ref="searchFrom" :model="searchMap" style="margin-top:20px">
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编号"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <el-input
          @click.native="dialogVisiblea=true"
          v-model="searchMap.supplierName"
          placeholder="选择供应商"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <!--<el-button @click="resetForm('searchFrom')">重置</el-button>-->
      </el-form-item>
    </el-form>
    <el-table :data="list" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号" width="130"></el-table-column>
      <el-table-column prop="name" label="商品名称" width="130"></el-table-column>
      <el-table-column prop="code" label="商品编码" width="200"></el-table-column>
      <el-table-column prop="spec" label="商品规格" width="130"></el-table-column>
      <el-table-column prop="retailPrice" label="零售价" width="130"></el-table-column>
      <el-table-column prop="purchasePrice" label="进货价" width="130"></el-table-column>
      <el-table-column prop="storageNum" label="库存数量" width="130"></el-table-column>
      <el-table-column prop="supplierName" label="供应商" width="150"></el-table-column>
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
    <el-dialog title="选择供应商" readonly :visible.sync="dialogVisiblea" width="500px">
      <supplier @option-supplier="optionsupplier" :isDialog="true" />
    </el-dialog>
    <el-dialog title="编辑商品" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-position="right"
        label-width="100px"
        style="width:400px"
        :rules="rules"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="pojo.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="pojo.spec" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="pojo.retailPrice" type="textarea" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="purchasePrice">
          <el-input v-model="pojo.purchasePrice" type="textarea" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model="pojo.storageNum" type="textarea" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <el-input
            @click.native="editOptionSupplier"
            v-model="pojo.supplierName"
            type="textarea"
            autocomplete="off"
          ></el-input>
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
import goodsApi from "@/api/goods";
import Supplier from "@/views/supplier";

export default {
  components: {
    Supplier
  },
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示总数
      searchMap: {
        name: "",
        code: "",
        supplierName: "",
        linkname: "",
        mobile: ""
      }, //条件查询绑定值
      dialogVisible: false,
      dialogVisiblea: false,
      pojo: {
        id: null,
        name: "",
        code: "",
        spec: "",
        retailPrice: "",
        purchasePrice: "",
        storageNum: "",
        supplierName: ""
      },
      rules: {
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "商品编码不能为空", trigger: "blur" }
        ],
        retailPrice: [
          { required: true, message: "商品零售价不能为空", trigger: "blur" }
        ]
      },
      isEdit: false
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      // supplier.getList().then(response=>{
      goodsApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          this.list = resp.data.rows;
          this.total = resp.data.total;
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
    //父组件自定义事件接受子组件传过来的单项表单信息
    optionsupplier(currentRow) {
        console.log("!")
      if (this.isEdit) {
        this.pojo.supplierName = currentRow.name;
      } else {
        this.searchMap.supplierName = currentRow.name;
        this.searchMap.id = currentRow.id;
      }
      this.isEdit = false;
      this.dialogVisiblea = false;
    },
    //新增里的供应商弹出框
    editOptionSupplier() {
      this.dialogVisiblea = true;
      this.isEdit = true;
    },
    //弹出新增窗口并清除数据
    handleAdd() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
        this.pojo.id = null;
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
    //提交新增数据与校验
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          goodsApi.add(this.pojo).then(response => {
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
          goodsApi.update(this.pojo).then(response => {
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
      // this.handleAdd();
      goodsApi.getByid(id).then(response => {
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
    handleDelete(id) {
      this.$confirm("确认删除这条记录吗?", "提示", {
        confirmButtonText: "确认",
        cencelButtonText: "取消"
      })
        .then(() => {
          goodsApi.delete(id).then(response => {
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