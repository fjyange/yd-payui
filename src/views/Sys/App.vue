<template>
  <div class="page-container">
	<!--表格内容栏-->
    <el-table :data="pageResult.content" style="width: 100%"  v-loading="loading" :element-loading-text="$t('action.loading')">
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
      <el-table-column fixed="right" align="center" width="180" label="操作">
        <template slot-scope="scope">
          <kt-button
            icon="fa fa-edit"
            :label="$t('action.edit')"
            perms="sys:app:edit"
            :size="size"
            @click="handleEdit(scope.row)"
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
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="100px" :rules="dataFormRules" ref="dataForm" :size="size"
			label-position="right">
			<el-form-item label="ID" prop="V_USER_ID" v-if="false">
				<el-input v-model="dataForm.V_USER_ID" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="费率" prop="V_RATE" v-if="false">
				<el-input v-model="dataForm.V_RATE" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="允许接入" prop="V_IS_MATCH" v-if="false">
				<el-input v-model="dataForm.V_IS_MATCH" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="角色" prop="V_ROLE_ID" v-if="false">
				<el-input v-model="dataForm.V_ROLE_ID" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="ID" prop="ID" v-if="false">
				<el-input v-model="dataForm.ID" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="平台登录名" prop="V_USER_ACCOUNT">
				<el-input v-model="dataForm.V_USER_ACCOUNT" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="平台名称" prop="V_APP_NAME">
				<el-input v-model="dataForm.V_APP_NAME" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="手机" prop="V_USER_PHONE">
				<el-input v-model="dataForm.V_USER_PHONE" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput"
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
import { format } from "@/utils/datetime"
export default {
	components:{
		PopupTreeInput,
		KtTable,
		KtButton,
		TableColumnFilterDialog
	},
	data() {
		return {
			loading:false,
			size: 'small',
			filters: {
				V_APP_NAME: '',
				V_USER_ACCOUNT:''
			},
			columns: [],
			filterColumns: [],
			pageRequest: { page: 1, size: 10 },
			pageResult: {},
			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			dataFormRules: {
				V_USER_ACCOUNT: [
					{ required: true, message: '请输入平台登录名', trigger: 'blur' }
				],
				V_APP_NAME: [
					{ required: true, message: '请输入平台名称', trigger: 'blur' }
				],
				V_RATE: [
					{ required: true, message: '请输入费率', trigger: 'blur' }
				]
			},
			// 新增编辑界面数据
			dataForm: {
				ID:'',
				V_USER_ID: '',
				V_USER_ACCOUNT: '',
				V_APP_NAME: '',
				V_USER_PHONE:'',
				V_ROLE_ID:'',
				V_RATE:''
			},
			deptData: [],
			deptTreeProps: {
				label: 'name',
				children: 'children'
			},
			roles: []
		}
	},
	methods: {
		// 换页刷新
    refreshPageRequest: function(pageNum) {
      this.pageRequest.page = pageNum;
      this.findPage(false);
    },
		// 获取分页数据
		findPage: function (data) {
			if(data) {
				this.pageRequest = data.pageRequest
			}
			var searchForm = {}
			Object.assign(searchForm, this.filters, {
				page: JSON.stringify(this.pageRequest.page),
				size: JSON.stringify(this.pageRequest.size)
			})
			this.loading= true
			this.$api.app.findPage(searchForm).then((res) => {
				this.pageResult = res.result
				this.findUserRoles()
				this.loading = false;
			}).then(data!=null?data.callback:'')
		},
		// // 加载用户角色信息
		findUserRoles: function () {
			this.$api.role.findAll().then((res) => {
				// 加载角色集合
				this.roles = res.result	
			})
		},
		// 批量删除
		handleDelete: function (data) {
			this.$api.app.batchDelete(data).then((res) => {
							if(res.success) {
								this.$message({ message: '操作成功', type: 'success' })
							} else {
								this.$message({message: '操作失败, ' + res.result, type: 'error'})
							}
							this.findPage(null)
						})
		},
		// 显示新增界面
		handleAdd: function () {
			this.dialogVisible = true
			this.operation = true
			this.dataForm = {
				ID:'',
				V_USER_ID: '',
				V_USER_ACCOUNT: '',
				V_APP_NAME: '',
				V_USER_PHONE:'',
				V_ROLE_ID:'',
				V_RATE:''
			}
		},
		// 显示编辑界面
		handleEdit: function (params) {
			this.dialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, params)
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)
						this.$api.app.save(params).then((res) => {
							this.editLoading = false
							if(res.success) {
								this.$message({ message: '操作成功', type: 'success' })
								this.dialogVisible = false
								this.$refs['dataForm'].resetFields()
							} else {
								this.$message({message: '操作失败, ' + res.result, type: 'error'})
							}
							this.findPage(null)
						}).catch(res => {
							this.editLoading = false
							this.$message({
								message: res.message,
								type: "error"
							});
						});
					})
				}
			})
		},
		// 菜单树选中
      	deptTreeCurrentChangeHandle (data, node) {
        	this.dataForm.deptId = data.id
        	this.dataForm.deptName = data.name
		},
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	},
		// 处理表格列过滤显示
      	displayFilterColumnsDialog: function () {
			this.$refs.tableColumnFilterDialog.setDialogVisible(true)
      	},
		// 处理表格列过滤显示
      	handleFilterColumns: function (data) {
			this.filterColumns = data.filterColumns
			this.$refs.tableColumnFilterDialog.setDialogVisible(false)
      	},
		// 处理表格列过滤显示
      	initColumns: function () {
			this.columns = [
				// {prop:"USER_ID", label:"ID", minWidth:50},
				{prop:"V_APPID", label:"平台接入id", minWidth:120},
				{prop:"V_SECRET", label:"平台接入秘钥", minWidth:180},
				{prop:"V_APP_NAME", label:"平台名称", minWidth:120},
				{prop:"V_WX_COLLECTION", label:"微信收款", minWidth:120},
				{prop:"V_ALI_COLLECTION", label:"支付宝收款", minWidth:120},
				{prop:"V_TOTAL_COLLECTION", label:"总收款", minWidth:120},
				{prop:"V_CASH_COLLECTION", label:"可提现余额", minWidth:120},
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      	},
	appMatch: function(data) {
      let params = {
        ID:data.ID,
        V_IS_MATCH:data.V_IS_MATCH
      }
      this.settingApp(params)
    },
    settingApp:function(params){
      this.$api.app
          .appConf(params)
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
    },
	},
	mounted() {
		this.findPage(null);
		this.initColumns()
	}
}
</script>

<style scoped>

</style>