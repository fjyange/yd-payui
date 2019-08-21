<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:dict:add" type="primary" @click="handleAdd" />
			</el-form-item>
		</el-form>
	</div>
	<!--表格内容栏-->
	<kt-table :height="350" permsEdit="sys:dict:edit" permsDelete="sys:dict:delete"
		:data="pageResult" :columns="filterColumns" 
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
	</kt-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
			label-position="right">
			<el-form-item label="ID" prop="ID" v-if="false">
				<el-input v-model="dataForm.ID" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="字典类型" prop="V_DICT_TYPE">
				<el-input v-model="dataForm.V_DICT_TYPE" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="字典值" prop="V_DICT_VALUE">
				<el-input v-model="dataForm.V_DICT_VALUE" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="字典文本" prop="V_DICT_TEXT">
				<el-input v-model="dataForm.V_DICT_TEXT" auto-complete="off"></el-input>
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
			size: 'small',
			filters: {
				V_DICT_TYPE: ''
			},
			columns: [],
			filterColumns: [],
			pageRequest: { page: 1, size: 10 },
			pageResult: {},
			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			dataFormRules: {
				V_DICT_TYPE: [
					{ required: true, message: '请输入字典类型', trigger: 'blur' }
				],
				V_DICT_VALUE: [
					{ required: true, message: '请输入字典值', trigger: 'blur' }
				],
				V_DICT_TEXT: [
					{ required: true, message: '请输入字典文本', trigger: 'blur' }
				]
			},
			// 新增编辑界面数据
			dataForm: {
				ID: '',
				V_DICT_TYPE: '',
				V_DICT_VALUE: '',
				V_DICT_TEXT:''
			}
		}
	},
	methods: {
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
			
			this.$api.dict.findPage(searchForm).then((res) => {
				this.pageResult = res.result
			}).then(data!=null?data.callback:'')
		},
		
		// 批量删除
		handleDelete: function (data) {
			this.$api.dict.batchDelete(data.params).then(data!=null?data.callback:'')
		},
		// 显示新增界面
		handleAdd: function () {
			this.dialogVisible = true
			this.operation = true
			this.dataForm = {
				ID: '',
				V_DICT_TYPE: '',
				V_DICT_VALUE: '',
				V_DICT_TEXT:''
			}
		},
		// 显示编辑界面
		handleEdit: function (params) {
			this.dialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, params.row)
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)				
						this.$api.dict.save(params).then((res) => {
							this.editLoading = false
							if(res.success) {
								this.$message({ message: '操作成功', type: 'success' })
								this.dialogVisible = false
								this.$refs['dataForm'].resetFields()
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
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
      	initColumns: function () {
			this.columns = [
				{prop:"V_DICT_TYPE", label:"字典类型", minWidth:120},
				{prop:"V_DICT_VALUE", label:"字典值", minWidth:120},
				{prop:"V_DICT_TEXT", label:"字典名称", minWidth:180}
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      	}
	},
	mounted() {
		this.initColumns()
	}
}
</script>

<style scoped>

</style>