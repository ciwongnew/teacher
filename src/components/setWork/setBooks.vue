<template>
	<div class="setBooks_box">
		<div class="setBooks"  v-if="showPage">
			<div class="header clear">
				<form  class="search" @submit.prevent="search($event)" v-if="service.length != 0">
					<input type="text" placeholder="搜索书籍名称" class="field" v-model="keywords">
					<span :class="{'clearBtn': keywords.trim().length>0}" @click="clearInput($event)"></span>
					<!-- <button type="button" name="button" class="button green" @click="search($event)">搜索</button> -->
				</form>
				<div class="" style="float: right;" v-if="service.length != 0">

					<div class="selectService">
						<!-- <selecter :selectData="service" :autoIsShow="service.length==1?false:true" selectObj="service" @selecter="selecter" :selecterText="serviceText"></selecter> -->
						<origin-select :data="service" selectObj="service" :defValue="service.length===1?'':'全部服务'" @selecter="selecter"></origin-select>
					</div>
					<div class="selectGrads">
						<!-- <selecter :selectData="grads" :autoIsShow='true' selectObj="grad" @selecter="selecter" :selecterText="gradText"></selecter> -->
						<origin-select :data="grads" selectObj="grads" defValue='全部年级' @selecter="selecter"></origin-select>
					</div>
				</div>
			</div>
			<article class="book_list clear">
				<ul class="clear">
					<li   v-for="item in catalog">
						<book :booksData="item" :type="1" @setTop = "setTop"></book>
					</li>
				</ul>
				<div class="loading_books" v-if="loading">
					<div class="load_line"></div>
					<p>正在加载中...</p>
				</div>
			</article>
			<div v-if="catalog.length==0 && !isSearch && service.length!=0" class="noCatalog clear">
				<img src="./../../assets/img/noGrade.png" alt=""/>
				<p>暂时还没有书籍哦</p>
			</div>
			<div v-if="service.length==0" class="noCatalog clear">
				<img src="./../../assets/img/noGrade.png" alt=""/>
				<p>没有可以布置作业的书籍</p>
				<p>您可以联系"教育顾问"获取帮助</p>
			</div>
			<div v-if="catalog.length==0 && pageIndex==1 && isSearch" class="noResult clear">
				<img src="./../../assets/img/null.png" alt=""/>
				<p>搜索无结果</p>
			</div>

			<!-- <paging :PagenumId="pageIndex" :PageCount="pageCount" @mypagenum="pageNum" v-show="catalog.length!=0 && service.length!=0" v-if="pull_data"></paging> -->
			<!-- <div class="pull" @click="pull_work" v-else>
				加载更多
			</div> -->
		</div>
	</div>
</template>
<script>
	import book from './../book/book.vue'
	import paging from "./../paging/paging.vue"
	import OriginSelect from './../../components/originSelect/originSelect'
	import selecter from "./../selecter/selecter.vue"
	import grads from './../../data/grads'
	import fetch from './../../fetch'
	import {mapActions } from 'vuex'

	export default {
		components: {
			book,
			paging,
			selecter,
			OriginSelect
		},
		props: ['loadData'],
		data() {
			return {
				showPage: false,
				catalog: [],
				service: [],
    		grads: grads,
    		keywords:'',
    		serviceName: '',
				serviceId: 0,
				brandId: '',
				params: {},
				gradID: '',
				pageIndex: 1,
				pageCount: 2,
				catalogues:[],
				LastBookArr:[],		//最近布置书
				gradText:'全部年级',
				serviceText:'全部服务',
				pull_data: true,
				isSearch: false,
				classIds: '',
				loading: false
			}
		},
	  created () {

			this.$nextTick(() => {

		    	this.brandId = JSON.parse(window.localStorage.getItem('user')).brandId || 0;
					let params = this.$route.query;

					if(params.classIdstr){
						this.classIds = params.classIdstr;
						window.sessionStorage.setItem("classIds",JSON.stringify({"classId":this.classIds}))
					}else{
						this.classIds = JSON.parse(window.sessionStorage.getItem("classIds")).classId;
					}

					// window.addEventListener('load', this.windowOnLoad);

					this.getServices();
					this.getCatalog();
			})
	  },
    watch:{
    	'$route': ['getServices', 'getCatalog'],
			loadData(val) {
				if(val.loadMore && val.currentName.indexOf('setHomework') && this.pageIndex < this.pageCount) {
					this.loading = true
					this.pull_work()
				}
			}
    },
		methods: {
			...mapActions([
				'setCrumb'
			]),
			windowOnLoad(){
				this.pageIndex = 1;
				 let path = this.$route.path;
				 if(path.indexOf("/api") > -1){
					 this.pull_data = false;
				 }

			},
			// getGrads(periodid){
			// 	let arr = [];
			// 	if(!periodid) {
			// 		this.grads = grads;
			// 		return false
			// 	}
			// 	grads.forEach((item,i)=>{
		  //   		if(item.periodid == periodid){
		  //   			arr.push(item);
		  //   		}
		  //   	})
		  //   	this.grads = arr;
			// },
			clearInput(e) {
					this.keywords = '';
			},
			search(e){
				this.isSearch = true;
				if(!this.keywords.trim()){
					this.getCatalog();
				}
				this.pageIndex = 1;
				this.setParams();
				this.getCatalog();
			},
			selecter(obj){
				// if(obj.key == 'grad') {
				// 	this.gradId = obj.value;
				// 	this.gradText = obj.text;
				// } else if(obj.key == 'service') {
				// 	this.serviceId = obj.value;
				// 	this.serviceText = obj.text;
				// 	this.gradText = '全部';
				// 	this.gradId = 0;
				// 	this.getGrads(obj.periodid);
				// }


				if(obj.key == 'grads') {
					if(isNaN(obj.index)) {
						this.gradId = ''
					}else {
						this.gradId = this.grads[obj.index].id
						this.gradText = obj.value;
					}

				} else if(obj.key == 'service') {
					if(isNaN(obj.index)) {
						this.serviceId = 0
					}else {
						this.serviceId = this.service[obj.index].id
						this.serviceText = obj.value;
					}

					// this.gradText = '全部';
					// this.gradId = 0;
					// this.getGrads(this.service[obj.index].periodid);
				}

				this.pageIndex = 1;
				this.getCatalog();
			},
			setParams(){
				this.params = {
					serviceId: this.serviceId,
					classIds: this.classIds,
					gradeId: this.gradId,
					keyWords: this.keywords.trim(),
					pageIndex: this.pageIndex,
					pageSize: 12
				}
			},
			getServices(){
				if(window.sessionStorage.service && window.sessionStorage.service != "underfined"){
					// let arr = JSON.parse(window.sessionStorage.getItem("service"))
					this.service = JSON.parse(window.sessionStorage.getItem("service"));
					// this.service = arr.splice(-1, 1)
					if(this.service.length == 1) {
						this.serviceText = this.service[0].name;
						this.serviceId = this.service[0].id;
					}
				}
			},
			getCatalog(){
				this.setParams();
				fetch.serviceProducts(this.params).then(res=>{
					if(!res) {
						this.catalog=[];
						return false;
					}
					if(!res.data.pageList){
						return false;
					}
					if(this.pageIndex == res.data.pageIndex){
						let catalogData = res.data.pageList;
						this.pageCount = Math.ceil(res.data.totalCount/this.params.pageSize);

						// if(this.pageIndex > 1 && !this.pull_data) {
						// 	this.catalog = this.catalog.concat(catalogData);
						// }else{
						// 	this.catalog = catalogData;
						// }

						// this.catalog = this.catalog.concat(catalogData);

						if(!this.keywords && !this.gradId && !this.serviceId && this.pageCount !== 1) {
							this.catalog = this.catalog.concat(catalogData);
						}else {
							this.catalog = []
							this.catalog = catalogData;
						}
					}
					this.showPage = true;
					this.loading = false
				  this.getServiceText(this.serviceId);

				})
			},
			setTop(res){
				let params = {
					productid: res.productId,
					serviceid: res.serviceId,
					istop: res.top
				}
				fetch.setBookTop(params).then(res=>{
					if(res.ret || res.errcode){
						return false;
					}
					this.$toast("书籍置顶成功!","right");
				})
			},
			getServiceText(id){
			  let services = this.service;
			  for(let item of services) {
				  if(item.id == id) {
					 this.serviceName = item.name;
				  }
			  }
			},
			pageNum(pageIndex){
				this.pageIndex = pageIndex;
				this.getCatalog();
			},
			pull_work(){
					this.pageIndex++;
					this.getCatalog();
			}
		}

	}
</script>
