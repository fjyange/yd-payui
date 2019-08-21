<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.USER_NAME" placeholder="提现申请人"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="$t('action.search')"
            perms="sys:apply:search"
            type="primary"
            @click="findPage(true)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            label="提现"
            perms="sys:apply:add"
            type="primary"
            @click="handleAdd"
          />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <el-table
      :data="pageResult.content"
      style="width: 100%"
      v-loading="loading"
      :element-loading-text="$t('action.loading')"
    >
      <el-table-column header-align="center" align="center" prop="V_MONEY" label="提现金额"></el-table-column>
      <el-table-column header-align="center" align="center" prop="V_REALITY" label="实际到账金额"></el-table-column>
      <el-table-column header-align="center" align="center" prop="V_USER_NAME" label="提现申请人"></el-table-column>
      <el-table-column header-align="center" align="center" prop="V_APPLY_TIME" label="提现申请时间"></el-table-column>
      <el-table-column header-align="center" align="center" prop="V_STATUS" label="申请状态">
        <template slot-scope="scope">
          <span style="color:red" v-if="scope.row.V_STATUS =='2'">提现失败</span>
          <span style="color:green" v-else-if="scope.row.V_STATUS =='1'">提现成功</span>
          <span v-else>待确认</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" width="180" label="操作">
        <template slot-scope="scope">
          <kt-button
            v-if="scope.row.V_STATUS ==='0'"
            icon="fa fa-edit"
            label="驳回"
            type="danger"
            perms="sys:apply:audit"
            :size="size"
            @click="reject(scope.row)"
          />
          <kt-button
            v-if="scope.row.V_STATUS ==='0'"
            icon="fa fa-edit"
            label="通过"
            perms="sys:apply:audit"
            :size="size"
            @click="pass(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <el-pagination
        layout="total, prev, pager, next, jumper"
        @current-change="refreshPageRequest"
        :current-page="pageResult.page"
        :page-size="pageResult.size"
        :total="pageResult.totalElements"
        style="float:right;"
      ></el-pagination>
    </div>

    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="40%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        label-width="80px"
        ref="dataForm"
        :size="size"
        label-position="right"
      >
        <el-form-item label="ID" prop="ID" v-if="false">
          <el-input v-model="dataForm.ID" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="金额" prop="V_MONEY">
          <el-input v-model="dataForm.V_MONEY" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitForm"
          :loading="editLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput";
import KtTable from "@/views/Core/KtTable";
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import { format } from "@/utils/datetime";
export default {
  components: {
    PopupTreeInput,
    KtTable,
    KtButton,
    TableColumnFilterDialog
  },
  data() {
    return {
      loading: false,
      size: "small",
      filters: {
        USER_NAME: ""
      },
      columns: [],
      filterColumns: [],
      pageRequest: { page: 1, size: 10 },
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      // 新增编辑界面数据
      dataForm: {
        ID: "",
        V_MONEY: 0,
        V_REALITY: 0
      }
    };
  },
  methods: {
    // 换页刷新
    refreshPageRequest: function(pageNum) {
      this.pageRequest.page = pageNum;
      this.findPage(false);
    },
    // 获取分页数据
    findPage: function(isLoad) {
      if (isLoad) {
        this.pageRequest.page = 1;
      }
      var searchForm = {};
      Object.assign(searchForm, this.filters, {
        page: JSON.stringify(this.pageRequest.page),
        size: JSON.stringify(this.pageRequest.size)
      });
      this.loading = true;
      this.$api.withdrawal
        .findPage(searchForm)
        .then(res => {
          this.pageResult = res.result;
          this.loading = false;
        })
        .then(res=>{
          
        });
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        ID: "",
        V_MONEY: 0,
        V_REALITY: 0
      };
    },
    // 显示编辑界面
    handleEdit: function(params) {
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params.row);
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            this.$api.withdrawal
              .save(params)
              .then(res => {
                this.editLoading = false;
                if (res.success) {
                  this.$message({ message: "操作成功", type: "success" });
                  this.dialogVisible = false;
                  this.$refs["dataForm"].resetFields();
                }
                this.findPage(false);
              })
              .catch(res => {
                this.editLoading = false;
                this.$message({
                  message: res.message,
                  type: "error"
                });
              });
          });
        }
      });
    },
    reject: function(data) {
      this.$confirm("确认驳回吗？", "提示", {}).then(() => {
        let params = {
          ID: data.ID,
          V_STATUS: "2"
        };
        this.audit(params);
      });
    },
    pass: function(data) {
      this.$confirm("确认通过吗？", "提示", {}).then(() => {
        let params = {
          ID: data.ID,
          V_STATUS: "1"
        };
        this.audit(params);
      });
    },
    audit: function(params) {
      this.$api.withdrawal
        .audit(params)
        .then(res => {
          this.editLoading = false;
          if (res.success) {
            this.$message({ message: "操作成功", type: "success" });
            this.findPage(false);
          } else {
          }
        })
        .catch(res => {
          this.editLoading = false;
          this.$message({
            message: res.message,
            type: "error"
          });
        });
    }
  },
  mounted() {
    this.findPage(true);
  }
};
</script>

<style scoped>
</style>