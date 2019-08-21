<template>
  <div class="page-container">
    工具栏
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="角色名"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="$t('action.search')"
            perms="sys:role:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            :label="$t('action.add')"
            perms="sys:role:add"
            type="primary"
            @click="handleAdd"
          />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <kt-table
      :height="220"
      permsEdit="sys:role:edit"
      permsDelete="sys:role:delete"
      :highlightCurrentRow="true"
      :stripe="false"
      :data="pageResult"
      :columns="columns"
      :showBatchDelete="false"
      @handleCurrentChange="handleRoleSelectChange"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
    ></kt-table>
    <!-- </el-col> -->
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
      >
        <el-form-item label="ID" prop="ID" v-if="false">
          <el-input v-model="dataForm.ID" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色名" prop="ROLE_NAME">
          <el-input v-model="dataForm.ROLE_NAME" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色别名" prop="ALIAS_NAME">
          <el-input v-model="dataForm.ALIAS_NAME" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序关键字" prop="ORDER_KEY">
          <el-input v-model="dataForm.ORDER_KEY" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注 " prop="ROLE_MEMO">
          <el-input v-model="dataForm.ROLE_MEMO" auto-complete="off" type="textarea"></el-input>
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
    <!--角色菜单，表格树内容栏-->
    <div class="menu-container" :v-if="true">
      <div class="menu-header">
        <span>
          <B>角色菜单授权</B>
        </span>
      </div>
      <el-tree
        :data="menuData"
        size="mini"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        style="width: 100%;pading-top:20px;"
        ref="menuTree"
        :render-content="renderContent"
        v-loading="menuLoading"
        element-loading-text="拼命加载中"
        :check-strictly="true"
        @check-change="handleMenuCheckChange"
      ></el-tree>
      <div style="float:left;padding-left:24px;padding-top:12px;padding-bottom:4px;">
        <el-checkbox
          v-model="checkAll"
          @change="handleCheckAll"
          :disabled="this.selectRole.ROLE_ID == null"
        >
          <b>全选</b>
        </el-checkbox>
      </div>
      <div style="float:right;padding-right:15px;padding-top:4px;padding-bottom:4px;">
        <kt-button
          :label="$t('action.reset')"
          perms="sys:role:edit"
          type="primary"
          @click="resetSelection"
          :disabled="this.selectRole.ROLE_ID == null"
        />
        <kt-button
          :label="$t('action.submit')"
          perms="sys:role:edit"
          type="primary"
          @click="submitAuthForm"
          :disabled="this.selectRole.ROLE_ID == null"
          :loading="authLoading"
        />
      </div>
    </div>
  </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable";
import KtButton from "@/views/Core/KtButton";
import TableTreeColumn from "@/views/Core/TableTreeColumn";
import { format } from "@/utils/datetime";
export default {
  components: {
    KtTable,
    KtButton,
    TableTreeColumn
  },
  data() {
    return {
      size: "small",
      filters: {
        name: ""
      },
      columns: [
        { prop: "ROLE_NAME", label: "角色名", minWidth: 120 },
        { prop: "ALIAS_NAME", label: "备注", minWidth: 120 },
        { prop: "ROLE_MEMO", label: "创建人", minWidth: 120 }
        // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
        // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
      ],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        ROLE_NAME: [
          { required: true, message: "请输入角色名", trigger: "blur" }
        ],
        ALIAS_NAME: [
          { required: true, message: "请输入角色别名", trigger: "blur" }
        ]
      },
      // 新增编辑界面数据
      dataForm: {
        ROLE_ID: "",
        ROLE_NAME: "",
        ALIAS_NAME: "",
        ORDER_KEY: "",
        ROLE_MEMO: ""
      },
      selectRole: {},
      menuData: [],
      menuSelections: [],
      menuLoading: false,
      authLoading: false,
      checkAll: false,
      currentRoleMenus: [],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      }
      var searchForm = {};
      Object.assign(searchForm, this.filters, {
        page: JSON.stringify(this.pageRequest.page),
        size: JSON.stringify(this.pageRequest.size)
      });
      this.$api.role
        .findPage(searchForm)
        .then(res => {
          this.pageResult = res.result;
          this.findTreeData();
        })
        .then(data != null ? data.callback : "");
    },
    // 批量删除
    handleDelete: function(data) {
      this.$api.role
        .batchDelete({ ROLE_ID: data.params.ROLE_ID })
        .then(data.callback);
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        ROLE_ID: "",
        ROLE_NAME: "",
        ALIAS_NAME: "",
        ORDER_KEY: "",
        ROLE_MEMO: ""
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
            this.$api.role.save(params).then(res => {
              this.editLoading = false;
              if (res.success) {
                this.$message({ message: "操作成功", type: "success" });
                this.dialogVisible = false;
                this.$refs["dataForm"].resetFields();
              }
              this.findPage(null);
            });
          });
        }
      });
    },
    // 获取数据
    findTreeData: function() {
      this.menuLoading = true;
      this.$api.menu.findMenuTree().then(res => {
        this.menuData = res.result;
        this.menuLoading = false;
      });
    },
    // 角色选择改变监听
    handleRoleSelectChange(val) {
      if (val == null || val.val == null) {
        return;
      }
      this.selectRole = val.val;
      this.$api.role.findRoleMenus({ ROLE_ID: val.val.ROLE_ID }).then(res => {
        this.currentRoleMenus = res.result;
        this.$refs.menuTree.setCheckedNodes(res.result);
      });
    },
    // 树节点选择监听
    handleMenuCheckChange(data, check, subCheck) {
      if (check) {
        // 节点选中时同步选中父节点
        let parentId = data.parentId;
        this.$refs.menuTree.setChecked(parentId, true, false);
      } else {
        // 节点取消选中时同步取消选中子节点
        if (data.children != null) {
          data.children.forEach(element => {
            this.$refs.menuTree.setChecked(element.id, false, false);
          });
        }
      }
    },
    // 重置选择
    resetSelection() {
      this.checkAll = false;
      this.$refs.menuTree.setCheckedNodes(this.currentRoleMenus);
    },
    // 全选操作
    handleCheckAll() {
      if (this.checkAll) {
        let allMenus = [];
        this.checkAllMenu(this.menuData, allMenus);
        this.$refs.menuTree.setCheckedNodes(allMenus);
      } else {
        this.$refs.menuTree.setCheckedNodes([]);
      }
    },
    // 递归全选
    checkAllMenu(menuData, allMenus) {
      menuData.forEach(menu => {
        allMenus.push(menu);
        if (menu.children) {
          this.checkAllMenu(menu.children, allMenus);
        }
      });
    },
    // 角色菜单授权提交
    submitAuthForm() {
      let roleId = this.selectRole.ROLE_ID;
      if ("admin" == this.selectRole.ROLE_NAME) {
        this.$message({
          message: "超级管理员拥有所有菜单权限，不允许修改！",
          type: "error"
        });
        return;
      }
      this.authLoading = true;
      let checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true);
      let rolemenus = "";
      for (let i = 0, len = checkedNodes.length; i < len; i++) {
        // let roleMenu = { roleId:roleId, menuId:checkedNodes[i].id }
        // roleMenus.push(roleMenu)
        rolemenus += checkedNodes[i].id + ",";
      }
      let params = {
        ROLE_ID: roleId,
        MENU_ID: rolemenus.substring(0, rolemenus.length - 1)
      };
      this.$api.role
        .saveRoleMenus(params)
        .then(res => {
          if (res.success) {
            this.$message({ message: "操作成功", type: "success" });
          }
          this.authLoading = false;
        })
        .catch(res => {
          this.authLoading = false;
          this.$message({
            message: res.message,
            type: "error"
          });
        });
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="column-container">
          <span style="text-algin:center;margin-right:80px;">{data.name}</span>
          <span style="text-algin:center;margin-right:80px;">
            <el-tag
              type={data.type === 0 ? "" : data.type === 1 ? "success" : "info"}
              size="small"
            >
              {data.type === 0 ? "目录" : data.type === 1 ? "菜单" : "按钮"}
            </el-tag>
          </span>
          <span style="text-algin:center;margin-right:80px;">
            {" "}
            <i class={data.icon} />
          </span>
          <span style="text-algin:center;margin-right:80px;">
            {data.parent_name ? data.parent_name : "顶级菜单"}
          </span>
          <span style="text-algin:center;margin-right:80px;">
            {data.url ? data.url : "\t"}
          </span>
        </div>
      );
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property]);
    }
  },
  mounted() {}
};
</script>
<style scoped>
.menu-container {
  margin-top: 10px;
}
.menu-header {
  padding-left: 8px;
  padding-bottom: 5px;
  text-align: left;
  font-size: 16px;
  color: rgb(20, 89, 121);
}
</style>