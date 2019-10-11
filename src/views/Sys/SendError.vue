<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.V_ORDER_NO" placeholder="单号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.V_APP_NAME" placeholder="所属用户"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="$t('action.search')"
            perms="sys:send:search"
            type="primary"
            @click="findPage(true)"
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

      <el-table-column fixed="right" align="center" width="100" label="操作">
        <template slot-scope="scope">
          <kt-button
            icon="fa fa-edit"
            label="重新发送"
            perms="sys:send:deal"
            :size="size"
            @click="dealOrder(scope.row)"
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
      size: "small",
      filters: {
        V_ORDER_NO: "",
        V_APP_NAME: ""
      },
      filterColumns: [],
      pageRequest: { page: 1, size: 10 },
      pageResult: {},
      editLoading: false
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
        { prop: "V_ORDER_NO", label: "单号", minWidth: 120 },
        { prop: "V_APP_NAME", label: "所属平台", minWidth: 120 },
        { prop: "V_SEND_TIME", label: "发送时间", minWidth: 120 },
        { prop: "V_RETURN_TIME", label: "返回时间", minWidth: 120 },
        { prop: "V_RETURN_MSG", label: "返回内容", minWidth: 200 }
      ];
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));
    },
    dealOrder: function(data) {
      this.$confirm("确定重发订单么？", "提示", {}).then(() => {
        let params = {
          ID: data.ID
        };
        this.editLoading = true;
        this.$api.send
          .dealSend(params)
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
</style>