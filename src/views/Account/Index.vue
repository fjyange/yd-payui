
<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
        <el-form :inline="true" :model="filters" :size="size">
          <el-form-item>
            <el-input v-model="filters.USER_NAME" placeholder="用户名"></el-input>
          </el-form-item>
         <el-form-item label="付款模式" prop="V_PAY_MODEL">
          <el-select v-model="filters.V_PAY_MODEL" placeholder="请选择" style="width: 100%;">
            <el-option label="图片扫码" value="0"></el-option>
            <!-- <el-option label="app固码" value="1"></el-option> -->
            <el-option label="转账" value="2"></el-option>
          </el-select>
        </el-form-item>
          <el-form-item>
            <kt-button
              icon="fa fa-search"
              :label="$t('action.search')"
              perms="sys:account:search"
              type="primary"
              @click="findPage(true)"
            />
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="fa fa-plus"
              :label="$t('action.add')"
              perms="sys:account:add"
              type="primary"
              @click="handleAdd"
            />
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="fa fa-refresh"
              label="刷新"
              perms="sys:order:search"
              type="primary"
              @click="findPage(false)"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--表格内容栏-->
    <el-table
      :data="pageResult.content"
      style="width: 100%"
      v-loading="loading"
      :element-loading-text="$t('action.loading')"
    >
      <el-table-column
        v-for="column in filterColumns"
        header-align="center"
        align="center"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :key="column.prop"
        :type="column.type"
        :formatter="column.formatter"
        :sortable="column.sortable==null?true:column.sortable"
      ></el-table-column>
      <el-table-column prop="V_PAY_TYPE" label="渠道类型" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.V_PAY_TYPE == '01'">支付宝</span>
          <span v-else-if="scope.row.V_PAY_TYPE == '02'">微信</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="V_FILEID" label="图片" width="120">
        <template slot-scope="scope">
          <el-popover placement="left" title trigger="hover" width="300">
            <img :src="getFileUrl(scope.row.V_FILEID)" width="300" height="300">
            <img
              slot="reference"
              :src="getFileUrl(scope.row.V_FILEID)"
              style="max-height: 80px;max-width: 80px; padding: 5px"
            >
          </el-popover>
        </template>
      </el-table-column> -->
      <el-table-column prop="V_IS_MATCH" label="是否匹配" width="120">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.V_IS_MATCH"
            active-color="#13ce66"
            active-value="Y"
            inactive-value="N"
            @change="accountMatch(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" width="320" label="操作">
        <template slot-scope="scope">
          <kt-button
            v-if="scope.row.V_IS_LOCK == 'N'"
            icon="fa fa-edit"
            label="锁住"
            perms="sys:account:lock"
            :size="size"
            @click="accountLock(scope.row,'Y')"
          />
          <kt-button
            v-if="scope.row.V_IS_LOCK == 'Y'"
            icon="fa fa-edit"
            label="解锁"
            perms="sys:account:lock"
            :size="size"
            @click="accountLock(scope.row,'N')"
          />
          <kt-button
            icon="fa fa-edit"
            :label="$t('action.edit')"
            perms="sys:account:edit"
            :size="size"
            @click="handleEdit(scope.row)"
          />
          <kt-button
            icon="fa fa-edit"
            label="支付金额配置"
            perms="sys:account:set"
            :size="size"
            @click="handlePayConf(scope.row)"
          />
          <kt-button
            icon="fa fa-trash"
            :label="$t('action.delete')"
            perms="sys:account:delete"
            :size="size"
            type="danger"
            @click="handleDelete(scope.row)"
          />
          <kt-button
            icon="fa fa-trash"
            label="测试链接"
            :size="size"
            perms="sys:account:test"
            @click="testUrl(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <el-pagination
        layout="total, prev, pager, next, jumper"
        @current-change="refreshPageRequest"
        :current-page="pageRequest.page"
        :page-size="pageResult.size"
        :total="pageResult.totalElements"
        style="float:right;"
      ></el-pagination>
    </div>

    <!--新增编辑界面-->
    <el-dialog
      title="用户支付配置"
      width="40%"
      :visible.sync="dialogPayConf"
      :close-on-click-modal="false"
    >
      <el-form :model="payConfForm" label-width="80px" :size="size" label-position="right">
        <el-form-item label="ID" prop="ID" v-if="false">
          <el-input v-model="payConfForm.ID" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付金额" prop="V_PAY_TOTAL">
          <el-input v-model="payConfForm.V_PAY_TOTAL" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogPayConf = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="payConfSubmit"
          :loading="editLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>

    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="40%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        label-width="100px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        label-position="right"
      >
        <el-form-item label="ID" prop="ID" v-if="false">
          <el-input v-model="dataForm.ID" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="账户名" prop="V_PAY_NAME">
          <el-input v-model="dataForm.V_PAY_NAME" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="V_PAY_ACCOUNT">
          <el-input v-model="dataForm.V_PAY_ACCOUNT" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="收款名" prop="V_PAY_NO">
          <el-input v-model="dataForm.V_PAY_NO" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片url" prop="V_URL_SCHEME">
          <el-input v-model="dataForm.V_URL_SCHEME" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="appid" prop="V_APP_ID">
          <el-input v-model="dataForm.V_APP_ID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="V_PAY_TYPE">
          <el-select v-model="dataForm.V_PAY_TYPE" placeholder="请选择" style="width: 100%;">
            <el-option label="支付宝" value="01"></el-option>
            <el-option label="微信" value="02"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款模式" prop="V_PAY_MODEL">
          <el-select v-model="dataForm.V_PAY_MODEL" placeholder="请选择" style="width: 100%;">
            <el-option label="图片扫码" value="0"></el-option>
            <!-- <el-option label="app固码" value="1"></el-option> -->
            <el-option label="转账" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否匹配" prop="V_IS_MATCH">
          <el-select v-model="dataForm.V_IS_MATCH" placeholder="请选择" style="width: 100%;">
            <el-option label="是" value="Y"></el-option>
            <el-option label="否" value="N"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片上传" prop="V_FILE_ID">
          <el-upload
            class="avatar-uploader"
            action="http://8.129.170.244/authorize/attach/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
      imageUrl: "",
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
      dialogPayConf: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        V_PAY_NAME: [
          { required: true, message: "请输入账户名", trigger: "blur" }
        ],
        V_PAY_ACCOUNT: [
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        V_PAY_NO: [
          { required: true, message: "请输入收款名", trigger: "blur" }
        ],
        V_URL_SCHEME: [
          { required: true, message: "请输入支付地址", trigger: "blur" }
        ]
      },
      // 新增编辑界面数据
      dataForm: {
        ID: "",
        V_PAY_NAME: "",
        V_PAY_ACCOUNT: "",
        V_PAY_NO: "",
        V_APP_ID: "",
        V_PAY_TYPE: "",
        V_IS_MATCH: "",
        V_FILE_ID: "",
        V_URL_SCHEME: "",
        V_PAY_MODEL:"0"
      },
      // 新增编辑界面数据
      payConfForm: {
        ID: "",
        V_PAY_TOTAL: ""
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
      this.$api.account
        .findPage(searchForm)
        .then(res => {
          this.pageResult = res.result;
          this.loading = false;
        })
        .then(res => {});
    },
    testUrl:function(data) {
      if(data.V_PAY_MODEL == '1') {
        window.open("http://8.129.170.244/showAccount.jsp?id=" + data.V_APP_ID);
      } else if(data.V_PAY_MODEL == '2') {
        window.open("http://8.129.170.244/showPayPc2.jsp?id=" + data.ID);
      } else {
        alert("图片转账无法测试")
      }
    },
    // 批量删除
    handleDelete: function(data) {
      this.$confirm("确认删除吗？", "提示", {}).then(() => {
        this.$api.account.batchDelete(data).then(res => {
          this.editLoading = false;
          if (res.success) {
            this.$message({ message: "操作成功", type: "success" });
          } else {
            this.$message({
              message: "操作失败, " + res.result,
              type: "error"
            });
          }
          this.findPage(false);
        });
      });
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.imageUrl = "";
      this.dataForm = {
        ID: "",
        V_PAY_NAME: "",
        V_PAY_ACCOUNT: "",
        V_PAY_NO: "",
        V_APP_ID: "",
        V_PAY_TYPE: "01",
        V_IS_MATCH: "Y",
        V_FILE_ID: "",
        V_URL_SCHEME: "",
        V_PAY_MODEL:"0"
      };
    },
    handlePayConf: function(params) {
      this.dialogPayConf = true;
      this.payConfForm = Object.assign({}, params);
    },
    // 显示编辑界面
    handleEdit: function(params) {
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params);
      this.imageUrl = this.getFileUrl(params.V_FILEID);
    },
    getFileUrl: function(id) {
      return "http://8.129.170.244/authorize/attach/getFile?ID=" + id;
    },
    payConfSubmit: function() {
      this.$confirm("确认提交吗？", "提示", {}).then(() => {
        this.editLoading = true;
        let params = Object.assign({}, this.payConfForm);
        this.$api.account
          .accountConf(params)
          .then(res => {
            this.payConfForm.ID = "";
            this.payConfForm.V_PAY_TOTAL = "";
            this.editLoading = false;
            if (res.success) {
              this.$message({ message: "操作成功", type: "success" });
              this.dialogPayConf = false;
            } else {
              this.$message({
                message: "操作失败, " + res.result,
                type: "error"
              });
            }
            this.findPage(null);
          })
          .catch(res => {
            this.editLoading = false;
            this.$message({
              message: res.message,
              type: "error"
            });
          });
      });
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            this.$api.account
              .save(params)
              .then(res => {
                this.imageUrl = "";
                this.dataForm.V_FILE_ID = "";
                this.dataForm.V_URL_SCHEME = "";
                this.dataForm.V_APP_ID = "";
                this.editLoading = false;
                if (res.success) {
                  this.$message({ message: "操作成功", type: "success" });
                  this.dialogVisible = false;
                  this.$refs["dataForm"].resetFields();
                } else {
                  this.$message({
                    message: "操作失败, " + res.result,
                    type: "error"
                  });
                }
                this.findPage(null);
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
    // 处理表格列过滤显示
    displayFilterColumnsDialog: function() {
      this.$refs.tableColumnFilterDialog.setDialogVisible(true);
    },
    // 处理表格列过滤显示
    handleFilterColumns: function(data) {
      this.filterColumns = data.filterColumns;
      this.$refs.tableColumnFilterDialog.setDialogVisible(false);
    },
    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [
        {
          prop: "USER_NAME",
          label: "用户名",
          minWidth: 120
        },
        {
          prop: "V_PAY_NAME",
          label: "账户名",
          minWidth: 120
        },
        {
          prop: "V_TOTAL_MONEY",
          label: "总收款",
          minWidth: 120
        },
        {
          prop: "V_PAY_NUM",
          label: "今日成功笔数",
          minWidth: 120
        },
        {
          prop: "V_ORDER_NUM",
          label: "今日收款笔数",
          minWidth: 120
        }
      ];
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));
    },
    handleAvatarSuccess(res, file) {
      this.dataForm.V_FILE_ID = res.result.ID;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        this.$message.error("图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过 2MB!");
      }
      return true;
    },
    accountLock: function(data, val) {
      let msg = "确定锁住该账户？";
      if (val == "N") {
        msg = "确定解锁该账户？";
      } else {
        msg = "确定锁住该账户？";
      }
      this.$confirm(msg, "提示", {}).then(() => {
        let params = {
          ID: data.ID,
          V_IS_LOCK: val
        };
        this.settingAccount(params);
      });
    },
    accountMatch: function(data) {
      let params = {
        ID: data.ID,
        V_IS_MATCH: data.V_IS_MATCH
      };
      this.settingAccount(params);
    },
    settingAccount: function(params) {
      this.$api.account
        .accountConf(params)
        .then(res => {
          this.editLoading = false;
          if (res.success) {
          } else {
            this.$message({
              message: "操作失败, " + res.result,
              type: "error"
            });
          }
          this.findPage(null);
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
    this.initColumns();
  }
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>