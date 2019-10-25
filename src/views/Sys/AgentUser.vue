<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.USER_ACCOUNT" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.USER_NAME" placeholder="用户真实姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.BELONGUSER" placeholder="所属用户"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="$t('action.search')"
            perms="sys:user:search"
            type="primary"
            @click="findPage(true)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            :label="$t('action.add')"
            perms="sys:user:add"
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
      <el-table-column prop="IS_MATCH" label="是否匹配" width="120">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.IS_MATCH"
            active-color="#13ce66"
            active-value="Y"
            inactive-value="N"
            @change="userMatch(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="USER_LEVEL" label="是否置顶" width="120">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.USER_LEVEL"
            active-color="#13ce66"
            active-value="1"
            inactive-value="2"
            @change="settUserLevel(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" width="400" label="操作">
        <template slot-scope="scope">
          <kt-button
            icon="fa fa-edit"
            label="返佣设置"
            perms="sys:agent:rate"
            :size="size"
            @click="handleRate(scope.row)"
          />
          <kt-button
            icon="fa fa-edit"
            :label="$t('action.payConf')"
            perms="sys:user:payConf"
            :size="size"
            @click="handleOtherConf(scope.row)"
          />
          <kt-button
            icon="fa fa-edit"
            label="重置密码"
            perms="sys:user:payConf"
            :size="size"
            @click="handlePassword(scope.row)"
          />
          <kt-button
            icon="fa fa-edit"
            :label="$t('action.edit')"
            perms="sys:user:edit"
            :size="size"
            @click="handleEdit(scope.row)"
          />
          <kt-button
            icon="fa fa-trash"
            :label="$t('action.delete')"
            perms="sys:user:delete"
            :size="size"
            type="danger"
            @click="handleDelete(scope.row)"
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

    <!--修改返佣界面-->
    <el-dialog title="用户设置返佣" width="40%" :visible.sync="showRate" :close-on-click-modal="false">
      <el-form :model="rateConf" label-width="80px" :size="size" label-position="right">
        <el-form-item label="ID" prop="USER_ID" v-if="false">
          <el-input v-model="rateConf.V_USER_ID" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="返佣费率" prop="USER_RATE">
          <el-input v-model="rateConf.V_RATE" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="showRate = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="rateSubmitForm"
          :loading="editLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
    <!--新增编辑界面-->
    <el-dialog title="用户支付配置" width="40%" :visible.sync="showPayConf" :close-on-click-modal="false">
      <el-form :model="userConfData" label-width="80px" :size="size" label-position="right">
        <el-form-item label="ID" prop="USER_ID" v-if="false">
          <el-input v-model="userConfData.V_USER_ID" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付次数" prop="V_PAY_NUM">
          <el-input-number
            v-model="userConfData.V_PAY_NUM"
            controls-position="right"
            :min="0"
            label="支付次数"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="showPayConf = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="otherConfSubmitForm"
          :loading="editLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>

    <!--新增编辑界面-->
    <el-dialog
      title="用户重置密码"
      width="40%"
      :rules="dataFormRules"
      :visible.sync="showPassword"
      :close-on-click-modal="false"
    >
      <el-form :model="passwordConf" label-width="80px" :size="size" label-position="right">
        <el-form-item label="ID" prop="USER_ID" v-if="false">
          <el-input v-model="passwordConf.V_USER_ID" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="PASSWORD">
          <el-input v-model="passwordConf.PASSWORD" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="showPassword = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="passwordSubmitForm"
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
        label-width="80px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        label-position="right"
      >
        <el-form-item label="ID" prop="USER_ID" v-if="false">
          <el-input v-model="dataForm.USER_ID" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="USER_ACCOUNT">
          <el-input v-model="dataForm.USER_ACCOUNT" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="USER_NAME">
          <el-input v-model="dataForm.USER_NAME" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="USER_PHONE">
          <el-input v-model="dataForm.USER_PHONE" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号" prop="BANK_ACCOUNT">
          <el-input v-model="dataForm.BANK_ACCOUNT" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="银行名称" prop="BANK_NAME">
          <el-input v-model="dataForm.BANK_NAME" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="ROLE_ID">
          <el-select v-model="dataForm.ROLE_ID" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in roles"
              :key="item.ROLE_ID"
              :label="item.ROLE_NAME"
              :value="item.ROLE_ID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属用户" prop="CREATE_USER">
          <el-select v-model="dataForm.CREATE_USER" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in belonglist"
              :key="item.USER_ID"
              :label="item.USER_NAME"
              :value="item.USER_ID"
            ></el-option>
          </el-select>
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
        USER_TYPE: "1",
        USER_NAME: "",
        USER_ACCOUNT: "",
        BELONGUSER: ""
      },
      columns: [],
      filterColumns: [],
      pageRequest: { page: 1, size: 10 },
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      showPayConf: false,
      showPassword: false,
      showRate: false,
      editLoading: false,
      dataFormRules: {
        USER_NAME: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        USER_ACCOUNT: [
          { required: true, message: "请输入用户真实姓名", trigger: "blur" }
        ],
        PASSWORD: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      rateConf: {
        V_USER_ID: "",
        V_RATE: ""
      },
      passwordConf: {
        V_USER_ID: "",
        PASSWORD: ""
      },
      userConfData: {
        V_USER_ID: "",
        V_PAY_NUM: 0
      },
      // 新增编辑界面数据
      dataForm: {
        USER_ID: "",
        USER_ACCOUNT: "",
        USER_NAME: "",
        USER_PHONE: "",
        BANK_ACCOUNT: "",
        BANK_NAME: "",
        ROLE_ID: "",
        CREATE_USER:''
      },
  belonglist:[],
      roles: []
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
      this.$api.user.findPage(searchForm).then(res => {
        this.pageResult = res.result;
        this.findUserRoles();
        this.findBelongUser();
        this.loading = false;
      });
    },
    // 加载用户角色信息
    findBelongUser: function() {
      this.$api.user.belongUserList().then(res => {
        this.belonglist = res.result;
      });
    },
    // // 加载用户角色信息
    findUserRoles: function() {
      this.$api.role.findAll().then(res => {
        // 加载角色集合
        this.roles = res.result;
      });
    },
    // 批量删除
    handleDelete: function(data) {
      this.$confirm("确认进行删除么？", "提示", {}).then(() => {
       this.$api.user.batchDelete(data).then(res => {
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
    handleOtherConf: function(data) {
      this.userConfData.V_USER_ID = data.USER_ID;
      this.showPayConf = true;
    },
    handleRate: function(data) {
      this.rateConf.V_USER_ID = data.USER_ID;
      this.rateConf.V_RATE = data.USER_RATE;
      this.showRate = true;
    },
    handlePassword: function(data) {
      this.passwordConf.V_USER_ID = data.USER_ID;
      this.showPassword = true;
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        USER_ID: "",
        USER_ACCOUNT: "",
        USER_NAME: "",
        USER_PHONE: "",
        BANK_ACCOUNT: "",
        BANK_NAME: "",
        ROLE_ID: "",
        CREATE_USER:''
      };
    },
    // 显示编辑界面
    handleEdit: function(params) {
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params);
    },
    settUserLevel: function(data) {
      let params = {
        USER_ID: data.USER_ID,
        USER_LEVEL: data.USER_LEVEL
      };
      this.settingUser(params);
    },
    userMatch: function(data) {
      let params = {
        USER_ID: data.USER_ID,
        IS_MATCH: data.IS_MATCH
      };
      this.settingUser(params);
    },
    settingUser: function(params) {
      this.$api.user
        .userConf(params)
        .then(res => {
          this.editLoading = false;
          if (res.success) {
          } else {
            this.$message({
              message: "操作失败, " + res.result,
              type: "error"
            });
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
    },
    rateSubmitForm: function() {
      this.editLoading = true;
      let params = Object.assign({}, this.rateConf);
      this.$api.user
        .rateConf(params)
        .then(res => {
          this.editLoading = false;
          if (res.success) {
            this.$message({ message: "操作成功", type: "success" });
            this.showRate = false;
            this.rateConf.V_USER_ID = "";
            this.rateConf.V_RATE = "";
          } else {
            this.$message({
              message: "操作失败, " + res.result,
              type: "error"
            });
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
    },
    passwordSubmitForm: function() {
      this.editLoading = true;
      let params = Object.assign({}, this.passwordConf);
      this.$api.user
        .passwordConf(params)
        .then(res => {
          this.editLoading = false;
          if (res.success) {
            this.$message({ message: "操作成功", type: "success" });
            this.showPassword = false;
            this.userConfData.V_USER_ID = "";
            this.passwordConf.PASSWORD = "";
          } else {
            this.$message({
              message: "操作失败, " + res.result,
              type: "error"
            });
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
    },
    otherConfSubmitForm: function() {
      this.$confirm("确认提交吗？", "提示", {}).then(() => {
        this.editLoading = true;
        let params = Object.assign({}, this.userConfData);
        this.$api.user
          .userPayConf(params)
          .then(res => {
            this.editLoading = false;
            if (res.success) {
              this.$message({ message: "操作成功", type: "success" });
              this.showPayConf = false;
              this.userConfData.V_USER_ID = "";
              this.userConfData.V_PAY_NUM = 0;
            } else {
              this.$message({
                message: "操作失败, " + res.result,
                type: "error"
              });
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
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            this.$api.user
              .save(params)
              .then(res => {
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
    // 菜单树选中
    deptTreeCurrentChangeHandle(data, node) {
      this.dataForm.deptId = data.id;
      this.dataForm.deptName = data.name;
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property]);
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
        { prop: "USER_ACCOUNT", label: "用户名", minWidth: 120 },
        { prop: "USER_NAME", label: "真实姓名", minWidth: 120 },
        { prop: "BELONG_USER", label: "所属用户", minWidth: 120 },
        { prop: "V_COUNT_RECEIVABLES", label: "总收款", minWidth: 120 },
        { prop: "V_SURPLUS_BOND", label: "剩余保证金", minWidth: 120 },
        { prop: "V_ALI_RECEIVABLES", label: "支付宝收款", minWidth: 120 },
        { prop: "RATE_COUNT", label: "返佣金额", minWidth: 120 },
        { prop: "USER_RATE", label: "费率", minWidth: 120 },
        { prop: "V_WX_RECEIVABLES", label: "微信收款", minWidth: 120 },
        { prop: "BELONG_COUNT", label: "下属代理收款", minWidth: 120 },
        { prop: "USER_PHONE", label: "手机号", minWidth: 100 },
        { prop: "BANK_ACCOUNT", label: "银行卡号", minWidth: 120 },
        { prop: "BANK_NAME", label: "银行名称", minWidth: 100 }
      ];
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));
    }
  },
  mounted() {
    this.findPage(true);
    this.initColumns();
  }
};
</script>

<style scoped>
</style>