<template>
    <div class="rankWork">
        <div class="toggleTab">
            <ul class="swiperTabA" ref="swiperTab">
                <li :class="{active:activeIndex == -1}"  v-on:click="tabFun(-1)" >成绩汇总<span class='division'></span></li>
                <li v-for="(item, index) in  rankcontentList" v-on:click="tabFun(index)" :title="item.resourceName" :class="{active: activeIndex === index}">
                    {{item.resourceName}}
                    <span class='division'></span>
                </li>
            </ul>
        </div>
        <div class="tabContent" v-if="activeIndex==-1">
            <h3 class="tabConTitle" :title='currentTitle'>{{currentTitle}}</h3>
            <button class="button btn-size" :class='{green:stateTime=="stateGreen",gray:stateTime=="stateGray",orange:stateTime=="stateOrange"}'>{{stateText}}</button>
              <div v-if='stateTime=="stateOrange"' class="unPublish">
                <p class="unPublishTime"></p>
                <p class="tabConTip">距离发布时间还有：{{endTime}}</p>
              </div>
              <div v-else>
                <p class="tabConTip" v-if='stateBtn'>距离截止时间还剩：{{endTime}}</p>
                <ul class="tabConCount clearfix">
                  <li>
                    <b class="tabScore">{{rankStatistics.max | toMath(2, '-')}}</b>
                    <span class="tabScoreTip">最高分</span>
                  </li>
                  <li>
                    <b class="tabScore">{{rankStatistics.min | toMath(2, '-')}}</b>
                    <span class="tabScoreTip">最低分</span>
                  </li>
                  <li>
                    <b class="tabScore">{{rankStatistics.average | toMath(2, '-')}}</b>
                    <span class="tabScoreTip">平均分</span>
                  </li>
                </ul>
              </div>
        </div>
        <div class="tabContent" v-else-if="activeIndex!=-1">
            <h3 class="tabConTitle" >{{currentTitle}}</h3>

            <!-- <p class="tabConTip">{{currentModuleName}}</p> -->
            <button class="button btn-size" :class='{green:stateTime=="stateGreen",gray:stateTime=="stateGray",orange:stateTime=="stateOrange"}'>{{stateText}}</button>
              <div v-if='stateTime=="stateOrange"' class="unPublish">
                <p class="unPublishTime"></p>
                <p class="tabConTip">距离发布时间还有： {{endTime}}</p>
              </div>
            <ul v-else class="tabConCount clearfix">
                <li>
                    <b class="tabScore">{{rankStatistics.max | toMath(2, '-')}}</b>
                    <span class="tabScoreTip">最高分</span>
                </li>
                <li>
                    <b class="tabScore">{{rankStatistics.min | toMath(2, '-')}}</b>
                    <span class="tabScoreTip">最低分</span>
                </li>
                <li>
                    <b class="tabScore">{{rankStatistics.average | toMath(2, '-')}}</b>
                    <span class="tabScoreTip">平均分</span>
                </li>
                <li>
                    <b class="tabScore">{{rankStatistics.passRate | toPercent(0,'-')}}</b>
                    <span class="tabScoreTip">及格率</span>
                </li>
                <li>
                    <b class="tabScore">{{rankStatistics.excellentRate | toPercent(0,'-')}}</b>
                    <span class="tabScoreTip">优秀率</span>
                </li>
            </ul>
        </div>
        <div class="socreRank" v-if='activeIndex==-1'>
            <ul class="socreRankTitle">
                <li>
                    学生排名
                </li>
                <li style="float: right;cursor: pointer;" @click="rankWorkExcel">
                    <button class="button"><a class="exportExcel" :href='url'>导出成绩</a></button>
                </li>
            </ul>
            <div>
                <rankWorkTable :list="rankRecords" :unlist="unRecords" :hList="rankcontentList"></rankWorkTable>
            </div>
        </div>
        <div class="socreRank" v-else-if='activeIndex!=-1'>
            <ul class="socreRankTitle">
                <li :class="{active:activeTable==true}" @click="tableFun1()">
                    学生排名
                </li>
                <li :class="{active:activeTable==false}" @click="tableFun2()">
                    题目统计
                </li>
                <li class="socreRankTitleR">
                  已提交：<span class="submitCount">{{this.useAnswer.submitCount}}</span><span class="totalCount">/{{this.useAnswer.totalNum}}</span>
                </li>
            </ul>
            <div class="rankTable" v-if="activeTable">
                <rankTable :list="rankRecords" :unlist="unRecords" :btnState='stateTime'></rankTable>
            </div>
            <div v-else>
              <rankError :exampaperData="exampaperData" :checkedResource="checkedResource" :paperType="paperType" :useAnswer="useAnswer"></rankError>
            </div>
        </div>
    </div>
</template>
<script>
    import fetch from './../../fetch'
    import {mapGetters, mapActions} from 'vuex'
    import Temporalitaet from "./../../unit/Temporalitaet"
    import rankTable from "../rankTable/rankTableA.vue"
    import rankWorkTable from "../rankWorkTable/rankWorkTableA.vue"
    import rankError from "../rankError/rankError.vue"
    import {clientId, brandId, http} from './../../config'
    export default{
        data(){
            return {
                activeIndex: -1,      //tab索引
                activeTable:true,     //表格tab状态
                rankcontentList:[],   //tab栏内容
                rankStatistics:[],    //分数
                unRecords:[],         //学生记录（有成绩或者班级信息）
                rankRecords:[],
                allWorkId:'',         //记录总成绩ID
                currentTitle:'',      //当前tab栏对应的title
                endTime:'',           //作业结束时间
                stateTime:"",         //未发布
                stateText:'进行中',   //作业状态
                stateBtn:true,
                exampaperData:[],     //试卷内容
                paperType:[],
                useAnswer:[],         //试卷答案
                url:'',
                allData:new Array()   //存储所有数据
            }
        },
        components:{
            rankTable,
            rankWorkTable,
            rankError
        },
        watch:{
           exampaperData(val){
            // console.log(1)
           }
        },
        created(){
            this.$nextTick(() => {
                this.setCrumb('作业统计');
                this.rank();
                let arrowLen=this.rankcontentList.length-1;
                if(arrowLen>=4){
                this.arrShow=true;
                }
            })
        },
        methods:{
            ...mapGetters([
                'getWorks',
                'getUser'
            ]),
            ...mapActions([
                'setWorks',
                'setCrumb'
            ]),
            tabFun: function(index){
              this.activeIndex = index;
              /*每次点击前清空原有数据*/
              this.rankRecords=[];
              this.unRecords=[];
              this.rankStatistics=[];
              this.exampaperData=[];
              this.paperType="";
              this.activeTable=true;
              //index ==-1 请求总排行的数据
              if(index==-1){
                this.toFetchWorkId(this.allWorkId)
                this.arrowShowR=true;
                this.arrowShowL=false;
              }else{
                this.arrowShowR=true;
                this.arrowShowL=true;
                if(this.activeIndex==this.rankcontentList.length-1){
                  this.arrowShowR=false;
                }
                this.currentTitle  = this.rankcontentList[index].resourceName;
                this.paperType = this.rankcontentList[this.activeIndex].resourceType;
                /*点击TAb请求数据*/
                this.toFetchContentId(this.rankcontentList[this.activeIndex].contentId);

                this.toFetchStatistics(this.rankcontentList[this.activeIndex].workId,this.rankcontentList[this.activeIndex].contentId);
              }
            },
            tableFun1(){
              this.activeTable=true;
            },
            tableFun2(){
              this.activeTable=false;
              this.toJudgeType(this.rankcontentList[this.activeIndex].resourceType);
            },
            rank(){
                let params=this.$route.query;
                let rankcontentList=JSON.parse(params.content);
                let removeCount = 0;  //4
                this.activeIndex=params.index*1;
                //过滤视频教程
                for(let k=0,len=rankcontentList.length;k<len;k++){
                  let itemR=rankcontentList[k];
                  if(itemR.resourceType!="eb5d05a2-d604-4879-8f9a-be5a45ae414e"&&itemR.resourceType!="803ef46d-e0cc-4f97-b1eb-b3ef411d058e"){
                    this.rankcontentList.push(itemR);
                  } else {
                    removeCount+=1;
                  }

                  if(this.activeIndex == k) {
                    this.activeIndex -= removeCount;
                  }
                }

                 this.currentTitle  = params.workName;
                 this.allWorkId = params.workId;
                 this.toChangeTime(params.sendDate,params.effectiveDate);
                  //数据初始化
                 this.rankRecords=[];
                 this.unRecords=[];

                //等于-1  请求总数据
                if(this.activeIndex==-1){
                 this.toFetchWorkId(this.allWorkId);
                }else{
                 this.paperType = this.rankcontentList[this.activeIndex].resourceType;
                 this.toFetchContentId(this.rankcontentList[this.activeIndex].contentId);
                 this.toFetchStatistics(this.rankcontentList[this.activeIndex].workId,this.rankcontentList[this.activeIndex].contentId);
                }
            },
            rankWorkExcel(){
                const userInformation = this.getUser();
                const accessToken = userInformation.accessToken;

                let url= http + "/gateway/v2/epaperwork/ExportWorkReport?"+'accessToken='+accessToken+'&clientId='+clientId+'&brandId'+brandId+'&workId='+this.allWorkId;
                this.url = url;
            },
            //作业状态转换
            toChangeTime(sendDate,effectiveDate){
               const differenceTimePub = (sendDate-parseInt(new Date().getTime() / 1000));
               if(differenceTimePub>0){
                  this.stateText="待发布"
                  this.stateTime="stateOrange";
                  this.endTime=Temporalitaet.timeStamp(differenceTimePub);
                  }else{
                    const differenceTimeEff = (effectiveDate-parseInt(new Date().getTime() / 1000));
                    if(differenceTimeEff<0){
                      this.stateText="已结束"
                      this.stateTime="stateGray";
                      this.stateBtn=false;
                    }else{
                      this.endTime=Temporalitaet.timeStamp(differenceTimeEff);
                      this.stateTime="stateGreen";
                    }
              }
            },
            //判断作业类型，请求数据
            toJudgeType(resourceType){
              let versionId= this.rankcontentList[this.activeIndex].versionId==0?this.rankcontentList[this.activeIndex].parentVersionId:this.rankcontentList[this.activeIndex].versionId;
              switch(resourceType){
                case "fcfd6131-cdb6-4eb8-9cb9-031f710a8f15":
                this.toFetchExamination(versionId);
                break;
                case "c458a8d4-e3ca-403c-b6b2-ae166e955590":
                this.toFetchOnlineWork(versionId);
                break;
                case "a7527f97-14e6-44ef-bf73-3039033f128e":
                this.toFetchGetWords(versionId);
                break;
                case "992a5055-e9d0-453f-ab40-666b4d7030bb":
                this.toFetchGetText(versionId);
                break;
                case "1f693f76-02f5-4a40-861d-a8503df5183f":
                this.toFetchOnlineWork(versionId);
                break;
                case "992a5055-e9d0-453f-ab40-666b4d7030bb":
                this.toFetchGetText(versionId);
                break;
                default:
                console.log("没有对应资源");
                break;
                }
            },
            //请求总成绩数据
            toFetchWorkId(workId){
               fetch.rankWork({workId:workId}).then(res =>{
                    if(!res){
                      return false;
                    }
                    let rankHeader=res.data.header;
                    this.currentTitle  = res.data.work.workName;
                    this.unRecords=[];
                    if(res.data.records.length<1){
                        let allStudents=res.data.receivers
                        for(let i=0,len = allStudents.length;i<len;i++){
                          let item = allStudents[i];
                          item.isShow = 0;
                          item.tabDatas = new Array(rankHeader[2].length);
                          this.unRecords.push(item);
                        }
                        this.rankRecords=[];
                        this.rankStatistics.max="-";
                        this.rankStatistics.min="-";
                        this.rankStatistics.average="-";
                     }else {
                        this.rankStatistics=res.data.statistics;
                        //学生信息合并
                        let allStudents = res.data.receivers;
                        let rankRecords=res.data.records;
                        let unreceivers = res.data.unreceivers;

                        for(let i=0,len = allStudents.length;i<len;i++){
                          let item = allStudents[i];
                          item.isShow = 0;
                          item.tabDatas = new Array(rankHeader[2].length);

                          for(let j=0,rLen = rankRecords.length; j<rLen; j++) {
                            if(rankRecords[j].userId == item.userId) {
                              Object.assign(item, rankRecords[j]);
                              item.isShow = 1
                              this.rankRecords.push(item)
                            }
                          }
                          if(item.isShow==0){
                            this.unRecords.push(item)
                          }
                        }
                        for(let k=0,kLen = unreceivers.length;k<kLen;k++) {
                          let item = unreceivers[k];
                          item.isShow = -1;
                          item.tabDatas = new Array(rankHeader[2].length);
                          this.unRecords.push(item);
                        }
                      }
                })
            },
            //请求单项的成绩数据
            toFetchContentId(contentId){
              fetch.rankContent({contentId:contentId}).then(res=>{
                if(!res){
                  return false;
                }
                this.unRecords=[];
                if(!res.data.records || res.data.records.length<1){
                  this.unRecords=res.data.receivers;
                  this.rankRecords=[];
                }else{
                  this.rankStatistics=res.data.statistics;
                  //学生信息合并
                  let allStudents = res.data.receivers;
                  let rankRecords=res.data.records;
                  let unreceivers = res.data.unreceivers;

                  for(let i=0,len = allStudents.length;i<len;i++){
                    let item = allStudents[i];
                    item.isShow = 0;
                    for(let j=0,rLen = rankRecords.length; j<rLen; j++) {
                      if(rankRecords[j].userId == item.userId) {
                        Object.assign(item, rankRecords[j]);
                        item.isShow = 1
                        this.rankRecords.push(item);
                      }
                    }
                    if(item.isShow==0){
                      this.unRecords.push(item)
                    }
                  }
                  for(let k=0,kLen = unreceivers.length;k<kLen;k++) {
                    let item = unreceivers[k];
                    item.isShow = -1;
                    this.unRecords.push(item);
                  }
                }
              })
            },
            // 获取在线作答
            toFetchOnlineWork(versionId){
              fetch.getOnlineExamination({versionId:versionId}).then(res =>{
               if(!res){
                return false;
               }
               this.exampaperData = res.data;
              },err =>{
                console.log(err);
              })
            },
            // 获取听说试卷
            toFetchExamination(versionId){
              fetch.getExamination({versionId:versionId}).then(res =>{
                if(!res){
                  return false;
                }
                this.exampaperData = res.data;
              },err =>{
                console.log(err);
              })
            },
            // 获取单词试卷
            toFetchGetWords(versionId){
              fetch.getWords({versionId:versionId}).then(res =>{
                if(!res){
                  return false;
                }
                this.exampaperData = res.data;

              })
            },
            // 获取课文
            toFetchGetText(versionId){
              fetch.getClassText({versionId:versionId}).then(res =>{
                if(!res){
                  return false;
                }
                  this.exampaperData = res.data;

              })
            },
            //获取作业统计
            toFetchStatistics(workId,contentId){
              fetch.rankStatistics({workId:workId,contentId:contentId}).then(res =>{
                if(!res){
                  return false;
                }
                this.useAnswer = res.data;
                this.checkedResource=res.data.checkedResource;
               })
            }
        }
    }
</script>
