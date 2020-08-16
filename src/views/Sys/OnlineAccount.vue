
<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
        <el-form :inline="true" :model="filters" :size="size">
          <el-form-item>
            <el-input v-model="filters.USER_NAME" placeholder="用户名"></el-input>
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
      pageResult: {}
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
        .onlineAccount(searchForm)
        .then(res => {
          this.pageResult = res.result;
          this.loading = false;
        })
        .then(res => {});
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
          prop: "V_BANK_NAME",
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