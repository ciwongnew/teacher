<template>
	<div class="bigBox2">
		<section class="publishHomeWork clear" ref="allHeight">
			<!-- <h4 class="bookTitle" :title="bookName">{{bookName}}</h4> -->
			<div class="title">
	      <!-- <div class="go_back" @click="goBack">
	        <img src="./../../assets/img/go_back.png" alt="">
	        <span>返回</span>
	      </div> -->
	      <div class="select_book">
	        <h2>{{bookName}}</h2>
	      </div>
	    </div>
			<article class="box menu" ref="leftHeight">
				<h4 class="tip">单元目录</h4>
				<ul class="first">
					<li v-for="unit in catalog" class="first_li" :class="{'selectedUnit': unit.id == unitId && unit.children.length != 0, 'onlyUnit': unit.id == unitId && unit.children.length == 0}">
						<div @click="toggle(0, unit)" class="gridUnit" :class="{'chooseUnit': unit.id == unitId, 'noChooseUnit': unit.id != unitId}">
							<p class="" :title="unit.name">{{unit.name}}</p>
							<i class="icon arrow-icon" v-show="unit.children.length!=0" :class="{'arrow-down': unit.id == unitId}"></i>
							<span v-show="unit.count>0 && (unit.id != unitId || unit.children.length == 0)" class="count_style">{{unit.count}}</span>
						</div>
						<ul class="second" v-show="unit.id == unitId" v-if="unit.children.length">
							<li v-for="page in unit.children">
								<div @click="toggle(1, page)" class="gridPage" :class="{'choosePage': page.id == pageId && page.children.length == 0 , 'noChoosePage': page.id != pageId}">
									<p class="" :title="page.name">{{page.name}}</p>
									<i class="icon arrow-icon" v-show="page.children!=0" :class="{'arrow-down': page.id == pageId}"></i>
									<span class="count_style" v-show="page.count>0 && (page.id != pageId || page.children.length == 0)">{{page.count}}</span>
								</div>
								<ul class="third" v-show="page.id == pageId" v-if="page.children.length">
									<li v-for="item in page.children">
										<div @click="toggle(2, item)" class="gridItem" :title="item.name" :class="{'chooseItem': item.id == itemId, 'noChooseItem': item.id != itemId}">
											{{item.name}}
											<span class="count_style" style="right: 17px;" v-show="item.count > 0">{{item.count}}</span>
										</div>
									</li>
								</ul>
							</li>
						</ul>
					</li>
				</ul>
			</article>
			<div class="box content" ref="boxContent">
				<ul>
					<li v-for="(item, sIndex) in module" v-if="item.moduleInfo.moduleId != 30">
						<homeworkcontent
						:moduleInfo="item.moduleInfo"
						:resourceList="item.resourceList"
						:serviceId='serviceId'
						:packageId='packageId'
						@increment="increment"
						:sIndex="sIndex"
						:cId="cId"
						:publishedBooks="publishedBooks">
					</homeworkcontent>
				</li>
			</ul>
			<div class="noModule" v-show="module.length == 0">
				<img src="./../../assets/img/noGrade.png" alt="">
				<p>没有可以布置的内容！</p>
			</div>
		</div>

	</section>
	<!-- 计数所选题 -->
	<div class="box footers">
		<p>共选
			<i style="font-size: 20px; padding: 0 5px;">{{contents.length}}</i>
			条内容,
		</p>
		<p>预计<i style="font-size: 20px; padding: 0 5px;">{{allTimes}}</i>分钟</p>
		<span>
			<span class="button" :class="{'green': contents.length!=0, 'gray': contents.length==0}" @click="subQuestion">下一步</span>
			<span @click="back" style="color: #fff; float: right; display: inline-block; margin-top: 14px; margin-right: 30px; cursor: pointer;">上一步</span>
		</span>

	</div>
</div>
</template>
<script>
import homeworkcontent from "./../homeWorkContent/homeWorkContent.vue"
import { clientId, brandId } from './../../config'
import fetch from './../../fetch'
import {formatDataToMinutes} from './../../filter'
import { mapGetters, mapActions } from 'vuex'

export default {
	components: {
		homeworkcontent
	},
	data() {
		return {
			catalog: [],   // 章节信息!!!!
			package: {},
			module: [],
			resourceName: '',
			cId: '',
			contents: [],
			unitId: -1,
			pageId: -1,
			itemId: -1,
			works: {},
			packageId: 0,
			serviceId: 0,
			subjectId: 0,
			serviceName: '',
			bookName: '',
			selected: false,
			selectedWorkName: '',	//存储选中单元
			bookId: '',
			allTimes: 0,
			publishedBooks: []
		}
	},
	created() {
		const that = this;
		this.$nextTick(() => {
			let params = this.$route.query;
			this.bookId = params.bookId || this.getWorks().bookId;
			this.serviceId = params.serviceId || this.getWorks().serviceId;
			this.packageId = params.packageId || this.getWorks().packageId;
			this.bookName = params.bookName || this.getWorks().bookName;
			this.cId = params.cId;
			
			this.getRecengBook()
			let catalog = this.getCatalog();
			if (params.isFirst) {
				subject = [];
			}
			//重新选书清空记录
			if(this.getWorks().bookId != this.bookId) {
				this.setWorks({ contents: [] })
				this.setSuject([])
			}

			let subject = this.getSubject();   // 题目信息!!!!
			if (subject.length) {
				this.contents = this.getWorks().contents || [];
				this.module = subject;
				this.initQuestion()
			}
			if(catalog.length && this.getWorks().bookId == this.bookId) {
				this.catalog = catalog;
        		this.firstInitPage(this.catalog)
			} else {
				this.getCatalogs();
			}
  })
	},
	watch: {
		'$route': 'getCatalog'
	},
	methods: {
		...mapActions([
			'setWorks',
			'setCrumb',
			'removeWorks',
			'setSuject',
			'setCatalog'
			]),
		...mapGetters([
			'getWorks',
			'getSubject',
			'getCatalog',
			'getUser'
			]),
		initData() {
			let params = {
				workType: this.serviceId,
				packageId: this.packageId,
				workMessageType: 1,
				brandId: brandId,
				sourceType: clientId,
				publishType: 1,
				bookId: this.bookId,
				bookName: this.bookName
			}
			this.setWorks(params)
		},
		getCatalogs() {
			fetch.catalogues({ packageId: this.packageId, serviceId: this.serviceId }).then(res => {
				if (!res) {
					return false;
				}
				let data = res.data[0];
				this.catalog = data.catalogues;
				// this.bookName = data.packages.book_name;
				this.bookId = data.packages.package_id;
				this.setWorks({ subjectId: data.packages.subject_id });
				this.setCatalog(data.catalogues)

				this.catalog.map(item=>{
					item.count = 0;
				})
				this.initData();
				// this.firstInitPage(data.catalogues)
				if (this.$route.query.isFirst) {
					this.firstInitPage(data.catalogues)
				};
			})
		},
		firstInitPage(catalogues) {
			if(!catalogues || !catalogues.length) return false;
			let first;
			let cId = 0;
			let name = '';
			let contents = this.getWorks().contents;
			if(contents && contents.length>0){
				cId = this.getSubject()[0].moduleInfo.packageCatalogueId;  //获取到最后一次显示章节内容的ID,下次显示对应章节
        	let _this = this;
				// 默认打开选中的第一个,下面逻辑处理显示对应章节
				catalogues.map((catalog,index)=>{
					if(catalog.children.length==0){
						if(catalog.id == cId){
							name = catalog.name;
							_this.unitId = catalog.id;
						}
					}else{
						catalog.children.map((catalog2,index2)=>{
							if(catalog2.children.length==0){
								if(catalog2.id == cId){
									name = catalog2.name;
									_this.unitId = catalog.id;
									_this.pageId = catalog2.id;
								}
							}else{
								catalog2.children.map((catalog3,index3)=>{
									if(catalog3.children.length==0){
										if(catalog3.id == cId){
											name = catalog3.name;
											_this.unitId = catalog.id;
											_this.pageId = catalog2.id;
											_this.itemId = catalog3.id;
										}
									}
								})
							}
						})
					}
				})
				!name && (cId=0);
			}else{
				first = catalogues[0];
				this.unitId = first.id;
				if (!first.children.length) {
					cId = first.id;
					name = first.name;
				} else {
					let second = first.children[0];
					this.pageId = second.id
					if (!second.children.length) {
						cId = second.id;
						name = second.name;
					} else {
						let third = second.children[0];
						cId = third.id;
						name = third.name;
						this.itemId = cId;
					}
				}
			}
			this.selectedWorkName = name;//选中单元赋值
			this.cId = cId;

			this.getResources(cId)
		},
		getRecengBook() {
                let params = {
                    bookId: this.packageId,
                    userId: this.getUser().userId
                }
                fetch.getRecentPublishBokk(params).then(res=>{
                    if (!res) {
                        return false
                    }
					this.publishedBooks = res.data
                })
            },
		toggle(index, item) {
			if (index == 1) {
				this.pageId = item.id;
			} else if (index == 0) {
				this.unitId = item.id;
			} else if (index == 2) {
				this.itemId = item.id;
			}
			if (item.children.length) {
				return false;
			}
			this.selectedWorkName = item.name;//选中单元赋值
			this.selected = true;
			this.resourceName = item.name;
			this.cId = item.id;  //每次点完的cid要保存到一个地方
			this.module = [];
			this.getResources(item.id);
		},
		getResources(cId) {
			let params = {
				packageId: this.packageId,
				cId: cId,
				moduleIds: '10,15,124,126,123,127'
			}
			fetch.resources(params).then(res => {
				if(!res){
                      return false;
                  }
				if (res) {
					
					this.module = res.data;
					this.setSuject([])
					// this.setWorks({ contents: [] });
					// this.contents = [];
					this.initQuestion()
				}
			})
		},
		initQuestion(){
			let contents = this.getWorks().contents;
			if(!contents){
				return false;
			}
			this.allTimes = 0;
			contents.map((item) => {
				if(item.refLong) {
					this.allTimes+= item.refLong;
				}
				this.getNewData({moduleId: item.moduleId, versionId: item.versionId, parentVersionId: item.parentVersionId, requirementContent: item.requirementContent, count: item.count, refLong: item.refLong,bigItemCount : item.bigItemCount, sentenceCount: item.sentenceCount},
					true)
			})
		},
		subQuestion() {
			if (!this.contents.length) {
				return false;
			}
			let title = this.addCatalogCount(0);
			let params = {
				selectedWorkName: title,
				type:1
			}
			this.setWorks({ allTimes: this.allTimes });
			this.$router.push({path:"publishBooks",query:params})

		},

		increment(res) {
			// debugger
			let _this = this;
			let selectContents = _this.getWorks().contents || [];
			let contents = [];
			let params = {
				packageId: this.packageId,
				cId: this.cId,
				checkedResource: '',
				requirementContent: '',
				workTag: 1,
				refLong: res.refLong,
				bigItemCount : res.bigItemCount,
				count: res.count,
				sentenceCount: res.sentenceCount
			}

			selectContents.map((item) => {
				// debugger
				if (item.moduleId == res.moduleId && item.versionId == res.versionId && item.parentVersionId == res.parentVersionId) {
				    if (res.isChecked) {
						  this.allTimes -= item.refLong;

						  
						if (res.resourceType === '992a5055-e9d0-453f-ab40-666b4d7030bb') {
							item.refLong = formatDataToMinutes(item.sentenceCount * res.second * res.requirementContent.readtimes);
						} else {
							item.refLong = formatDataToMinutes(item.count * res.second * res.requirementContent.readtimes);
						}

				  	    // item.refLong = formatDataToMinutes(res.requirementContent.readtimes * res.second * item.count);
				    }
					Object.assign(params, item)
				} else {
					contents.push(item)
				}
			})
			res.refLong = params.refLong;
			res.count = params.count;
			res.sentenceCount = params.sentenceCount
			if (res.isChecked) {
				if(this.contents.length >= 10 && res.change) {
					this.$toast("您最多可以勾选10条内容！", 'error')
					return false;
				}
				if(res.refLong) {
					this.allTimes += params.refLong;
				}
				this.getNewData(res, true, (item, moduleId, index) => {
					params.moduleId = moduleId;
					params.requirementContent = '{\"readtimes\":' + res.requirementContent.readtimes + ', \"speekingtype\":' + res.requirementContent.speekingtype + '}';
					Object.assign(params, item);
					contents.push(params);
					if(res.change){
						// this.addCatalogCount(this.cId, 1)
					}
				})
			} else {
				this.getNewData(res, false)
				// this.addCatalogCount(this.cId, -1)
				if(params.refLong){
					this.allTimes -= params.refLong;
				}
			}
			this.setWorks({ contents: [] });
			this.setWorks({ contents: contents });
			this.contents = contents;
			this.catalogCount();
		},
		catalogCount(){
			let catalog = this.catalog;
			if(this.contents.length==0){
				catalog.map(item => {
					item.count = 0;
					item.children.map(item2=>{
						item2.count = 0;
						item2.children.map(item3=>{
							item3.count = 0;
						})
					})
				})
			}else{
				this.contents.map((res,index)=>{
					let cid = res.cId;
					catalog.map(item => {
						if(index==0) item.count = 0;
						if(!item.children.length) {
							if(item.id === cid){
								item.count++;
							}
						} else {
							let children = item.children;
							children.map(citem=>{
								if(index==0) citem.count = 0;
								if(!citem.children.length){
									if(cid === citem.id) {
										item.count++;
										if(!citem.count) {
											citem.count = 0
										}
										citem.count++;
									}
								} else {
									let grandson = citem.children;
									grandson.map(gitem=>{
										if(index==0) gitem.count = 0;
										if(!gitem.children.length) {
											if(cid == gitem.id) {
												!citem.count && (citem.count = 0)
												citem.count++;
												item.count++;
												if(!gitem.count) {
													gitem.count = 0
												}
												gitem.count++;
											}
										}
									})
								}
							})
						}
					})
				})
			}
			this.catalog = catalog;
			this.setCatalog(this.catalog)
		},
		addCatalogCount(cid, num){
			let title = '';
			this.catalog.map(item => {
				// item.count = 0;
				if(!item.children.length) {
					if(item.id === cid){
						item.count+=num;
					}
					if(item.count){
						title+=item.name+',';
					}
				} else {
					let children = item.children;
					children.map(citem=>{
						if(!citem.children.length){
							if(cid === citem.id) {
								item.count+=num;
								if(!citem.count) {
									citem.count = 0
								}
								citem.count+=num;
							}
							if(citem.count){
								title+=citem.name+',';
							}
						} else {
							let grandson = citem.children;
							grandson.map(gitem=>{
								if(!gitem.children.length) {
									if(cid == gitem.id) {
										!citem.count && (citem.count = 0)
										citem.count+=num;
										item.count+=num;
										if(!gitem.count) {
											gitem.count = 0
										}
										gitem.count+=num;
									}
								}
								if(gitem.count){
									title+=gitem.name+',';
								}
							})
						}
					})
				}
			})
			this.setCatalog(this.catalog)
			return title;
		},
		getNewData(res, isChecked, cb) {
			// debugger
			let newData = [];
			this.module.map((item, index) => {
				let moduleInfo = item.moduleInfo;
				if (moduleInfo.moduleId != 30) {
					let resourceList = item.resourceList;
					let obj = {};
					obj.moduleInfo = moduleInfo;
					obj.resourceList = [];
					resourceList.map((rItem, rIndex) => {
						if (obj.moduleInfo.moduleId == res.moduleId && rItem.versionId == res.versionId && rItem.parentVersionId == res.parentVersionId) {
							rItem.isChecked = isChecked;
							rItem.readtimes = res.requirementContent.readtimes;
							rItem.speekingtype = res.requirementContent.speekingtype;
							rItem.count = res.count;
							rItem.refLong = res.refLong
							rItem.bigItemCount = res.bigItemCount
							rItem.sentenceCount = res.sentenceCount
							if (cb) {
								cb(rItem, moduleInfo.moduleId, rIndex)
							}
						}

						obj.resourceList.push(rItem);
					})
					newData.push(obj)
				}
			})

			this.setSuject([]);
			this.setSuject(newData);
			this.module = newData;
		},
		back() {
      		let classIds = JSON.parse(window.sessionStorage.getItem("classIds")).classId;
			this.$router.push({path:"setHomework",query: {bookType : 1,classIdstr:classIds}});
    	}
	}
}
</script>
