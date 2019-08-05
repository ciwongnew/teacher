<template>
	<section class="layerSch" ref="unfold">
		<div class="content">
			<header class="top">
				<h4>更换学校</h4>
				<span class="close" @click="close"></span>
			</header>
			<div class="main">
				<div class="selectArea">
					<checkArea @selectAreas="selectAreas"></checkArea>
				</div>
				<p>
				<input  type="password" style="width:0;height:0;float:left;visibility:hidden"/>
					<input type="text" class="field" placeholder="搜索学校名称" v-model="keyWords" @keyup.enter="search">
				</p>

				<div class="prompt" v-show="schoolList.length != 0">
					<p>您可能想添加:</p>
					<ul class="clear">
						<li v-for="item in schoolList" :title="item.schoolName">{{item.schoolName}}</li>
					</ul>
				</div>
				<p v-show="schoolList.length == 0">未找到相关学校，若需创建学校，请联系客服(400-800-5500)</p>
			</div>
		</div>
		<div class="noticeMask"></div>
	</section>
</template>
<script>
	import checkArea from "./../checkArea/checkArea.vue"
	import fetch from './../../fetch'

	export default{
		data(){
			return{
				areaCode:'',
				keyWords:'',
				params:{},
				schoolList:[]
			}
		},
		components:{
			checkArea
		},
		props:['layerSch'],
		watch:{
			layerSch(val){

				this.$refs.unfold.style.display = 'block';
				this.getData();
			}
		},
		created(){
			this.$nextTick(()=>{
				this.getData();
			})
		},
		methods:{
			close(){
				this.keyWords = '';
				this.$refs.unfold.style.display = "none";
			},
			setParams(){
				this.params = {
					page: 1,
					pagesize:9
				}
				if(this.keyWords || this.areaCode){
					this.params.areaCode = this.areaCode;
					this.params.wd = this.keyWords;
				}

			},
			selectAreas(obj){
				let id = obj.id;
				this.areaCode = id;
				this.getData();
			},
			getData(){
				this.setParams();
				fetch.getSchool(this.params).then(res =>{
					if(!res){
						return false;
					}
					this.schoolList = res.data;
				})
			},
			search(){
				if(!this.keyWords.trim()){
					this.getData();
				}
				this.getData();
			}
		}

	}
</script>
