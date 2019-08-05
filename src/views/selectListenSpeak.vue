<template>
	<div class="m-t120">
		<exampaper :page="page" :selectFlag="selectFlag" :thirdParty="thirdParty" :exampaperData="exampaperData" :serviceId="serviceId" :packageId="packageId" :cId="cId" :moduleId="moduleId" @submitExampaper ="submitExampaper" :versionId="versionId"></exampaper>
	</div>
</template>

<script>
  import fetch from "../fetch"	// 接口
	import exampaper from '../components/question/exampaper.vue'	// 所有题型组件
	import {mapGetters, mapActions} from 'vuex'
    import {formatDataToMinutes} from './../filter'

	export default {
		components:{
			exampaper
		},
		data () {
			return {
				page:'selectListenSpeak',		// 当前页面
				versionId:'',// 试卷ID 5413356909901475565
				exampaperData:{},				// 试卷信息
				worksData:{},					// 外部作业数据
				selectedWork: {},
				index:-1,
        serviceId:"",
        packageId:"",
        parentVersionId:"",
				cId:"",
        moduleId:15,
        checkedResource:'',
        selectFlag: 0,
        thirdParty:true
			}
		},
	    created () {
		    let params = this.$route.query;
        this.versionId = params.versionId;
        this.serviceId = params.serviceId;
        this.packageId = params.packageId;
        this.cId = params.cId;
        this.checkedResource = params.checkedResource;
        this.parentVersionId = params.parentVersionId;
        let selectFlag = params.selectFlag
        if(selectFlag){
          this.selectFlag = 1
        }
        this.$nextTick(() => {
          this.setCrumb('选择听说模考大题');
          this.getHomeWork();
        })
        },
      methods:{
        ...mapGetters([
          'getWorks',
          'getSubject'
        ]),
        ...mapActions([
          'setWorks',
          'setCrumb',
          'setSuject'
        ]),
			getHomeWork(){
				this.worksData = this.getWorks().contents;
//				let _this = this;
//				this.worksData && this.worksData.forEach((item,index)=>{
//					if(item.versionId==_this.versionId){
//						_this.index = index;
//					}
//				})
			},
			submitExampaper (arr,count,score,num){
        let _this = this;
        //传回选择大题数目
        let contents = this.getWorks().contents;
        if(contents && count){
          contents.map((item, index) => {
            if (item.versionId == _this.versionId && item.parentVersionId == _this.parentVersionId) {
              item.count = count;
              item.refLong = formatDataToMinutes(count * 180);
              item.checkedResource = arr.join(',');
              item.workScore = score;
            }
          })
        }
        this.setWorks({contents: []});
        this.setWorks({contents:contents});
        this.$router.push({path:"publishHomeWork",query: {serviceId:this.serviceId,packageId: this.packageId,cId:contents[0].cId,isFirst:0}});
			}
		},
      mounted(){
        let listenData={
          parentVersionId:this.parentVersionId,
          versionId:this.versionId,
          moduleId:this.moduleId,
          checkedResource:this.checkedResource
        }
        fetch.filterListen(listenData).then(res =>{
           if(!res){
            return false;
          }
          let json = typeof res == 'string' ? JSON.parse(res) : res;
          if((json.errcode==undefined || json.errcode!=0) || !json.data){
           console.log('服务器报错:'+JSON.stringify(json));
         }else{
          this.exampaperData = json.data;
          this.selectFlag == 0 ?this.exampaperData.checkedResourceEmpty=1:this.exampaperData.checkedResourceEmpty=0;
        }
      },err =>{
        console.log(err);
      })
    }
	}
</script>
