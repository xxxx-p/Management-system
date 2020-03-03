<template>
  <div class="div-table">
    <el-form :inline="true" ref="searchFrom" :model="searchMap" style="margin-top:20px">
      <el-form-item prop="cardName">
        <el-input v-model="searchMap.cardName" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员名称"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型">
          <el-option
            v-for="option of payTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="searchMap.birthday"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="resetForm('searchFrom')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" height="80%" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="cardNum" label="会员卡号"></el-table-column>
      <el-table-column prop="name" label="会员姓名" width="90"></el-table-column>
      <el-table-column prop="birthday" label="会员生日"></el-table-column>
      <el-table-column prop="phone" label="手机号码"></el-table-column>
      <el-table-column prop="integral" label="可用积分"></el-table-column>
      <el-table-column prop="money" label="开卡金额"></el-table-column>
      <el-table-column prop="payType" label="支付类型">
        <template slot-scope="scope">
          <span>{{scope.row.payType|payTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="会员地址"></el-table-column>
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
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="pojo.birthday"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojo.money" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojo.integral" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select v-model="pojo.payType" placeholder="请选择支付类型">
            <el-option
              v-for="option of payTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input v-model="pojo.address" type="textarea" autocomplete="off"></el-input>
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
import memberApi from "@/api/member";

const payTypeOptions = [
  { type: "1", name: "现金" },
  { type: "2", name: "微信" },
  { type: "3", name: "支付宝" },
  { type: "4", name: "银行卡" }
];
export default {
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示总数
      searchMap: {
        cardName: "",
        name: "",
        payType: "",
        birthday: ""
      }, //条件查询绑定值
      payTypeOptions,
      dialogVisible: false,
      pojo: {
        id: '',
        cardNum: "",
        name: "",
        birthday: "",
        phone: "",
        money: "",
        payType: "",
        address: ""
      },
      rules: {
        cardNum: [{ required: true, message: "卡号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        payType: [
          { required: true, message: "支付类型不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    fetchData() {
      //   memberApi.getList().then(reponse => {
      memberApi
        .Search(this.currentPage, this.pageSize, this.searchMap)
        .then(reponse => {
          const rep = reponse.data;
          this.list = rep.data.rows;
          this.total = rep.data.total;
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleDelete(id) {
      this.$confirm('确认删除这条记录吗?','提示',{
        confirmButtonText:'确认',
           cencelButtonText:'取消',
      }).then(()=>{
        memberApi.delete(id).then(response=>{
          const resp = response.data;
          this.$message({
            message:resp.message,
            type:resp.flag?'succuss':'error'
          })
          if(resp.falg){
            this.fetchData()
          }
        })
      }).catch(()=>{
      })
    },
    //提交新增数据与校验
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          memberApi.add(this.pojo).then(response => {
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
    //弹出新增窗口并清除数据
    handleAdd() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
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
      memberApi.getByid(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.handleAdds(resp)
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
          memberApi.update(this.pojo).then(response => {
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
    }
  },
  filters: {
    payTypeFilter(type) {
      const payObj = payTypeOptions.find(obj => obj.type === type);
      return payObj ? payObj.name : null;
    }
  }
};
</script>
<style scoped>
.div-table {
  height: 90%;
}
</style>