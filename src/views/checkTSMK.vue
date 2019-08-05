<template>
	<div>
		<watchStuHead :useInfo="useInfo" :userScore="userScore" :userRank="userRank"></watchStuHead>
		<exampaper :page="page" :exampaperData="exampaperData" :userAnswers="userAnswers" :showdata="showdata" :isShowAnswer="isShowAnswer" :moduleId="moduleId" @correctScore="correctScore"></exampaper>
	</div>
</template>

<script>
    import fetch from "../fetch"	// 接口
	import exampaper from '../components/question/exampaper.vue'	// 所有题型组件
	import {mapActions} from 'vuex'
	import watchStuHead from "./../components/watchStuHead/watchStuHead.vue"

	export default {
		components:{
			exampaper,
            watchStuHead
		},
		data () {
            return {
              page: 'checkTSMK',		// 当前页面
              moduleId: 15,			// 资源模块, 15[听说模考] / 124[在线作答]
			        isShowAnswer:true,
              versionId: '',			// 试卷ID 	4675443382047446397
              doWorkId: '',			// 8176483212442072
              exampaperData: null,		// 试卷信息
              userAnswers: null,		// 用户试卷答案
              showdata: null,         // 显示的选题 Array(题目下标)
              useInfo: [],
              userScore:0,        			// 显示的选题 Array(题目下标)
            	userRank:0,
            	actualScore:0
            };
		},
	    created () {
		    const record = JSON.parse(this.$route.query.record);
            this.versionId = record.versionId;
            this.doWorkId = record.doWorkId;
						this.useInfo= record.userId;
						this.userRank= record.index;
						this.userScore= record.actualScore;
		       	this.$nextTick(() => {
		       		this.setCrumb('查看详情');
	               })
			   	//获取用户信息
			   	fetch.getInfo({userId:this.useInfo}).then(res=>{
			   		if(!res){
	                	return false;
	                }
			   			this.useInfo=res.data;
			   	})
			// 获取试卷
				this.getListenExamination(this.versionId);
				this.getListenAnswer(this.doWorkId);	
		    },
		methods:{
        	...mapActions([
        		'setCrumb'
        	]),
        	correctScore(correctScore){
        	   this.correctContents=[];
        	   this.actualScore=0; 
        	   console.log(correctScore)   	   	
        	   for(let i=0,lenA=this.userAnswers.length;i<lenA;i++){
        	   	 let itemA=this.userAnswers[i];
        	   	 if(itemA.versionId==correctScore.versionId){
        	   	 	itemA=correctScore;
        	   	 }
        	   	 this.actualScore+=itemA.score*1;
        	   	 this.correctContents.push(itemA);
        	   }
        	   this.actualScore=this.actualScore==NaN?correctScore.score:this.actualScore;
        	   this.userAnswers=this.correctContents;
        	   this.userScore=this.actualScore;
        	    let data={
	          		doWorkId:this.doWorkId,
	          		submitUserId:this.useInfo.userId,
	          		actualScore:this.actualScore,
	          		codeId:0,
	          		correctContents:this.correctContents
	            }
	            // console.log("correctContents",data)
	            this.sentWorkSorce(data);
            },
            sentWorkSorce(data){
	            fetch.correctListenWork(data).then(res =>{
	                if(!res){
	                	return false;
	                }
								this.$toast("批改成功","right");
				            },err =>{
								console.log(err);
							})
            },
            getListenExamination(versionId){
            	fetch.getExamination({versionId:versionId}).then(res =>{
                if(!res){
                  return false;
                }
                this.exampaperData = res.data;
	                
							},err =>{
								console.log(err);
							})
            },
            getListenAnswer(doWorkId){
            	// 获取用户答案与老师布置题目
	            fetch.getTeacherQuerstion({doWorkId:doWorkId}).then(res =>{
	                if(!res){
	                	return false;
	                }
								this.userAnswers = res.data.workAnswers;
								this.showdata = res.data.checkedResource.join();   //选择布置作业数组               
							},err =>{
								console.log(err);
							})
            }
		}
	}
</script>