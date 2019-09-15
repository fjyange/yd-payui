<template>
  <div class="page-container">
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
      
      <el-table-column fixed="right" align="center" width="400" label="操作">
        <template slot-scope="scope">
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
        :current-page="pageResult.page"
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
      
      filterColumns: [],
      pageRequest: { page: 1, size: 10 },
      pageResult: {},
    }
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
      this.$api.send.findPage(searchForm).then(res => {
        this.pageResult = res.result;
        this.loading = false;
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