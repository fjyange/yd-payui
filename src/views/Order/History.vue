<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.USER_NAME" placeholder="所属用户"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.V_APP_NAME" placeholder="所属平台"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.V_ORDER_NO" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="$t('action.search')"
            perms="sys:order:search"
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

    <!--表格内容栏-->
    <el-table
      :data="pageResult.content"
      style="width: 100%"
      class="order_tb"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :element-loading-text="$t('action.loading')"
    >
      <el-table-column header-align="center" align="center" prop="V_ORDER_NO" label="订单号"></el-table-column>
      <el-table-column header-align="center" align="center" prop="V_MONEY" label="订单金额"></el-table-column>
      <el-table-column header-align="center" align="center" prop="V_PAY_TYPE" label="支付方式">
        <template slot-scope="scope">
          <span v-if="scope.row.V_PAY_TYPE =='01'">支付宝</span>
          <span v-else-if="scope.row.V_PAY_TYPE =='02'">微信</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="V_APP_NAME" label="所属平台"></el-table-column>
      <el-table-column header-align="center" align="center" prop="USER_NAME" label="所属用户"></el-table-column>
      <el-table-column header-align="center" align="center" prop="V_PAY_NAME" label="支付账户"></el-table-column>
      <el-table-column header-align="center" align="center" prop="V_CREATE_TIME" label="订单时间"></el-table-column>
      <el-table-column header-align="center" align="center" prop="V_STATUS" label="订单状态">
        <template slot-scope="scope">
          <span v-if="scope.row.V_STATUS =='3'">已补单</span>
          <span v-else-if="scope.row.V_STATUS =='1'">已确认</span>
          <span v-else-if="scope.row.V_STATUS =='2'">超时</span>
          <span v-else-if="scope.row.V_STATUS =='4'">驳回</span>
          <span v-else>待确认</span>
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
import KtTable from "@/views/Core/KtTable";
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import { format } from "@/utils/datetime";
export default {
  components: {
    KtTable,
    KtButton,
    TableColumnFilterDialog
  },
  data() {
    return {
      loading: false,
      className: "",
      size: "small",
      filters: {
        USER_NAME: "",
        V_APP_NAME: "",
        V_ORDER_NO: ""
      },
      columns: [],
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
    findPage: function(isFirst) {
      if (isFirst) {
        this.pageRequest.page = 1;
      }
      var searchForm = {};
      Object.assign(searchForm, this.filters, {
        page: JSON.stringify(this.pageRequest.page),
        size: JSON.stringify(this.pageRequest.size)
      });
      this.loading = true;
      this.$api.order
        .findHistory(searchForm)
        .then(res => {
          this.loading = false;
          this.pageResult = res.result;
        })
        .then(res => {});
    },

    tableRowClassName: function({ row, rowIndex }) {
      if (row.V_STATUS == "1") {
        return "success-row";
      } else if (row.V_STATUS == "2") {
        return "out-row";
      } else if (row.V_STATUS == "3") {
        return "bd-row";
      } else if (row.V_STATUS == "4") {
        return "warning-row";
      }
    }
  },
  mounted() {
    this.findPage(false);
  }
};
</script>

<style>
.el-table .warning-row {
  background: #ffe4e1;
}

.el-table .success-row {
  background: #b7e8b5;
}
.el-table .out-row {
  background: #f7e5f3;
}
.el-table .bd-row {
  background: #eaf518;
}
.order_tb .el-table__body tr:hover > td {
  background: none !important;
}
</style>