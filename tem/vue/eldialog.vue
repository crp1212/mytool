<template>
	<div>
		<el-dialog
			  :visible.sync="dialogVisible"
			  :size="size"
			  :before-close="handleClose"
		>
			  <span slot="title" class="dialog-title ft16" >文件上传</span>
			  
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="btnClick(0)">取 消</el-button>
			    <el-button type="primary" @click="btnClick(1)">确 定</el-button>
			  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		props:{
			isShow:[Boolean]
		},
		data:function(){
			return {
				dialogVisible:false,
				size:"small"
			}
		},
		methods:{
			handleClose(){
				this.dialogVisible = false 
			},
			btnClick(){
				this.dialogVisible = false 
			}
		},
		computed:{

		},
		components:{
			
		},
		watch:{
			isShow(){
				this.dialogVisible = true 
			}
		}
	}
</script>

<style  scoped>
	
</style>