<template>
	<div>
	  <watchStuHead :useInfo="useInfo" :userScore="userScore" :userRank="userRank"></watchStuHead>
		<exampaper :page="page" :exampaperData="exampaperData" :userAnswers="userAnswers" :moduleId="moduleId" :isShowAnswer="isShowAnswer" @correctScore="correctScore" :padShow="app_interaction"></exampaper>
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
				page:'checkOnlinePaper',		// 当前页面
				moduleId:124,					// 资源模块, 15[听说模考] / 124[在线作答]
        isShowAnswer:true,
				versionId:'',					// 试卷ID 	4675443382047446397
				doWorkId:'',					// 8176483212442072	
				exampaperData:null,				// 试卷信息
				userAnswers:null,				// 用户试卷答案
      	showdata:null,
      	useInfo:[],
      	userScore:0,        			// 显示的选题 Array(题目下标)
      	userRank:0,
      	correctContents:[],
      	actualScore:0,           //总分
      	app_interaction:false

			}
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
						this.app_interaction = window.localStorage.getItem('app_interaction');
		       	//获取用户信息  
		      })
	      	fetch.getInfo({userId:this.useInfo}).then(res=>{
       		if(!res){
              	return false;
           }
					 this.useInfo=res.data;
				  })
				  this.getOnlineAnswer(this.doWorkId);
				  this.getOnlineExamination(this.versionId);       
	    },
		methods:{
        	...mapActions([
        		'setCrumb'
        	]),
        	correctScore(correctScore){
        	   this.correctContents=[];
        	   this.actualScore=0;
        	   for(let i=0,lenA=this.userAnswers.length;i<lenA;i++){
        	   	 let itemA=this.userAnswers[i];
        	   	 if(itemA.versionId==correctScore.versionId){
        	   	 	itemA=correctScore;
        	   	 }
        	   	 this.actualScore+=itemA.score*1;
        	   	 this.correctContents.push(itemA);
        	   }
        	    this.userAnswers=this.correctContents;
        	    this.userScore=this.actualScore;
        	    let data={
	          		"doWorkId":this.doWorkId,
	          		"actualScore":this.actualScore,
	          		correctContents:this.correctContents
	            }
	            this.sentWorkSorce(data);
            },
            sentWorkSorce(data){
	            fetch.correctWork(data).then(res =>{
	                if(!res){
	                	return false;
	                }
						    this.$toast("批改成功","right");
		            },err =>{
						    console.log(err);
				     })
            },
            getOnlineAnswer(doWorkId){
                fetch.getWorkAnswers({doWorkId:this.doWorkId}).then(res =>{
		            if(!res){
		            	return false;
		            }
					this.userAnswers = res.data;
		        },err =>{
					console.log(err);
				})
            },
            getOnlineExamination(versionId){
            	 // 获取在线作答试卷
	            fetch.getOnlineExamination({versionId:versionId}).then(res =>{
	                if(!res){
	                	return false;
	                }
	                this.exampaperData = res.data;
	            },err =>{
					console.log(err);
				})
            }
		}
	}
</script>