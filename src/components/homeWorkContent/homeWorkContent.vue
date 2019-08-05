<template>
	<section class="homeWorkContent">
		<h4 :title="moduleInfo.moduleName">{{moduleInfo.moduleName}}</h4>
		<div class="mdlContent">
			<div v-for="(item,index) in selectedTextNumArr">
					<div class="main"  @click="increment($event, item, item.resourceType)" >
						<span class="noChoose" :class="{'choose': item.isChecked}">
						</span>
						<p :title="item.resourceName">{{item.resourceName}}</p>
						<span v-if="item.isPublished" class="publishedIcon"><img src="../../assets/img/published.png"	/></span>
					</div>
					<chooseText v-if="(moduleInfo.moduleId == 10 || moduleInfo.moduleId == 15 || moduleInfo.moduleId == 124 || moduleInfo.moduleId == 127) && item.isChecked"
								:moduleId="moduleInfo.moduleId"
								:item="item"
								:readTime = 'item.refLong'
								:key="index"
								:serviceId="serviceId"
								:packageId="packageId"
								:readtimes="item.readtimes"
								:speekingtype='item.speekingtype'
								:cId='cId' :index="index"
								@changeParams="changeParams">
					</chooseText>

			</div>
		</div>
	</div>
</section>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import chooseText from './../chooseText/chooseText.vue'
import fetch from './../../fetch'
import {formatDataToMinutes} from './../../filter'
export default {
	props: ['resourceName', 'sIndex', 'resourceList', 'serviceId', 'packageId', 'cId', 'moduleInfo','publishedBooks'],
	components: {
		chooseText
	},
	data() {
		return {
			ResType_DanCiGenDu: 'a7527f97-14e6-44ef-bf73-3039033f128e',
			ResType_Xuanzeduanluo: '992a5055-e9d0-453f-ab40-666b4d7030bb',
			parentVersion_Id: '',
			version_Id: '',
			selectModules: [],
			selectedTextNumArr: [],
			isChecked: false,
			userTimes: 0
		}
	},
	created() {
		this.$nextTick(() => {
			this.addKey();
		})
	},
	watch: {
		resourceList(val) {
			this.addKey();
		}
	},
	methods: {
		...mapGetters([
			'getUser'
		]),
		addKey() {
			const _this = this;
			this.selectedTextNumArr = this.resourceList

			this.selectedTextNumArr.forEach((item, i) => {
				this.selectedTextNumArr[i].isShow = false;
				if (this.moduleInfo.moduleId == 10 || this.moduleInfo.moduleId == 127) {
					//同步跟读
					if (item.resourceType == this.ResType_DanCiGenDu) {
						this.selectedTextNumArr[i].chooseText = "选择单词";
					} else if (item.resourceType == this.ResType_Xuanzeduanluo) {
						this.selectedTextNumArr[i].chooseText = "选择段落";
					}
				} else if (this.moduleInfo.moduleId == 15) {
					this.selectedTextNumArr[i].chooseText = "选择大题";
				} else if (this.moduleInfo.moduleId == 124) {
					this.selectedTextNumArr[i].chooseText = "预览";
				}			
			})

			this.getPublished()
		},
		getPublished() {
			
			console.log('this.publishedBooks',this.publishedBooks)
			this.resourceList.map((stitem)=> {
				stitem.isPublished = false
				this.publishedBooks.map(item=>{
					if (item.cId === this.cId * 1) {
						// let parentVersionIdList = item.parentVersionIdList
						// let versionIdList = item.versionIdList

						// if (stitem.parentVersionId == '0') {
						// 	versionIdList.map(vitem=> {								
						// 		if (vitem == stitem.versionId) {
						// 				stitem.isPublished = true
						// 		} 
						// 	})
						// } else if (stitem.versionId == '0'){
						// 	parentVersionIdList.map((pvitem)=> {
						// 		if (pvitem == stitem.parentVersionId) {
						// 			stitem.isPublished = true
						// 		} 
						// 	})
						// }

						let subjectList = item.subjectList
						subjectList.map(v=> {
							// debugger
							if (v.resourceName === stitem.resourceName) {
								stitem.isPublished = true
							}
						})
					}
				})				
			})	
			this.selectedTextNumArr = this.resourceList
		},
		increment(e, item, resourceType) {
			item.isChecked = !item.isChecked;
			let params ={
				isChecked: item.isChecked,
				versionId: item.versionId,
				parentVersionId: item.parentVersionId,
				change: true,
				moduleId: this.moduleInfo.moduleId,
				resourceType,
				requirementContent: {
					readtimes: 1,
					speekingtype: 1
				},
				time : 0
			}
			this.getUseTimes(params)
		},
		changeParams(res) {

			let params = {
				isChecked: true,
				versionId: res.versionId,
				change: false,
				moduleId: this.moduleInfo.moduleId,
				resourceType: res.resourceType,
				parentVersionId: res.parentVersionId,
				requirementContent: res.requirementContent
			}
			this.getUseTimes(params)
		},
		getUseTimes(res){
			// debugger
			let second = 0;
			switch(res.resourceType) {
				case 'a7527f97-14e6-44ef-bf73-3039033f128e':
				second = 10;
				break;
				case '992a5055-e9d0-453f-ab40-666b4d7030bb':
				second = 15;
				break;
				case 'fcfd6131-cdb6-4eb8-9cb9-031f710a8f15':
				second = 180;
				break;
				case 'c458a8d4-e3ca-403c-b6b2-ae166e955590':
				second = 60;
				break;
			}
			let params = {
				moduleId: res.moduleId,
				versionId: res.versionId,
				parentVersionId: res.parentVersionId,
				resourceType: res.resourceType
			}

			if(second){
				fetch.getAllCount(params).then(result=>{
					if(!result){
                      return false;
                  }
					if(result){
						let data = result.data; 
						
						if (params.resourceType === '992a5055-e9d0-453f-ab40-666b4d7030bb') {
							res.refLong = formatDataToMinutes(data.sentenceCount * second * res.requirementContent.readtimes);
						} else if (res.resourceType === 'c458a8d4-e3ca-403c-b6b2-ae166e955590' && data.refAnswerTime != 0) {
							res.refLong = data.refAnswerTime
						} else {
							res.refLong = formatDataToMinutes(data.itemCount * second * res.requirementContent.readtimes);
						}
			            res.count = data.itemCount  // 题目数量
						res.bigItemCount = data.bigItemCount || 0  // 题目数量
						res.sentenceCount = data.sentenceCount 
			            res.second = second;
			            if (res.time) {
			            	res.refLong = 0;
			            }
			            this.$emit('increment', res);
			        }
			    })
			} else {
				this.$emit('increment', res);
			}
		}
	}
}
</script>
