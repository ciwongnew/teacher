
<template>
    <div class="rankWork">
        <div class="toggleTab">
            <ul class="swiperTab" ref="swiperTab">
                <li :class="{active:activeIndex == -1}"  v-on:click="tabFun(-1)" >成绩汇总</li>
                <li v-for="(item, index) in  rankcontentList" v-on:click="tabFun(index)" :title="item.resourceName" :class="{active: activeIndex === index}">
                    {{item.resourceName}}
                    <!-- <span class='division'></span> -->
                </li>
            </ul>
            <div v-if='arrShow'>
              <i v-if="arrowShowL" class='arrow-l' @click='moveLeft'>&lt;</i>
              <i v-if="arrowShowR" class='arrow-r' @click='moveRight'>&gt;</i>
            </div>
        </div>
        <div class="tabContent" v-if="activeIndex==-1">
            <h3 class="tabConTitle" :title='currentTitle'>{{currentTitle}}</h3>
              <!-- <p class="bookName">书籍名称：{{bookName}}</p> -->
              <div v-if='stateTime=="stateOrange"' class="unPublish">
                <p class="unPublishTime"></p>
                <p class="tabConTip">距离发布时间还有：{{endTime}}
                 <i class="state-btn stateOrang">{{stateText}}</i>
                </p>
              </div>
              <div v-else>
                <div class="tabConTip">
                  <span v-if='stateBtn'>距离截止时间还剩：{{endTime}}</span>
                  <span v-else>距离截止时间还剩：00:00</span>
                  <i class="state-btn" :class="{stateGreen:stateBtn,stateGray:!stateBtn}">{{stateText}}</i>
                </div>
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
            <!-- <p class="bookName">书籍名称：{{bookName}}</p> -->
            <span class="shareBtn" v-if="isShool" @click="getClass">分享给家长</span>
              <div v-if='stateTime=="stateOrange"' class="unPublish">
                <p class="tabConTip">距离发布时间还有：{{endTime}}
                 <i class="state-btn stateOrang">{{stateText}}</i>
                </p>
              </div>
              <div v-else>
                 <div class="tabConTip">
                  <span v-if='stateBtn'>距离截止时间还剩：{{endTime}}</span>
                  <span v-else>距离截止时间还剩：00:00</span>
                  <i class="state-btn" :class="{stateGreen:stateBtn,stateGray:!stateBtn}">{{stateText}}</i>
                 </div>
                <ul class="tabConCount clearfix">
                  <li>
                      <b class="tabScore">{{SrankStatistics.max | toMath(2, '-')}}</b>
                      <span class="tabScoreTip">最高分</span>
                  </li>
                  <li>
                      <b class="tabScore">{{SrankStatistics.min | toMath(2, '-')}}</b>
                      <span class="tabScoreTip">最低分</span>
                  </li>
                  <li>
                      <b class="tabScore">{{SrankStatistics.average | toMath(2, '-')}}</b>
                      <span class="tabScoreTip">平均分</span>
                  </li>
                  <li>
                      <b class="tabScore">{{SrankStatistics.passRate | toPercent(0,'-')}}</b>
                      <span class="tabScoreTip">及格率</span>
                  </li>
                  <li>
                      <b class="tabScore">{{SrankStatistics.excellentRate | toPercent(0,'-')}}</b>
                      <span class="tabScoreTip">优秀率</span>
                  </li>
                </ul>
              </div>

        </div>
        <div class="socreRank" v-if='activeIndex==-1'>
            <ul class="socreRankTitle">
                <li>
                    学生排名
                </li>
                <li style="float: right;cursor: pointer;" @click="rankWorkExcel">
                    <button class="button export"><a class="exportExcel" :href='url'>导出成绩</a></button>
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
                <li v-if="false" :class="{active:activeTable==false}" @click="tableFun2()">
                    题目统计
                </li>
                <li class="socreRankTitleR">
                  已提交：<span class="submitCount">{{this.useAnswer.submitCount}} </span><span class="totalCount"> / {{this.useAnswer.totalNum}}</span>
                </li>
            </ul>
            <div class="rankTable" v-if="activeTable">
                <rankTable :list="rankSRecords" :unlist="unSRecords" :btnState='stateTime'  :index="activeIndex"></rankTable>
            </div>
            <div v-else>
              <rankError :exampaperData="exampaperData" :checkedResource="checkedResource" :paperType="paperType" :useAnswer="useAnswer" :moduleId="moduleId"></rankError>
            </div>
        </div>
        <div class="share" v-if="share_url.length != 0">
          <div class="share_title">
            <p>把成绩分享给家长</p>
            <span class="close" @click="close"></span>
          </div>
          <div class="share_main">
            <vue-q-art :config="config" :downloadButton="downloadButton"></vue-q-art>
            <div class="" style="text-align: left;margin-left: 20%;margin-top: 40px; padding-bottom: 30px;">
              <p style="margin-bottom: 30px;">方法1：微信扫描二维码，然后分享链接到家长微信群.</p>
              <p style="margin-bottom: 10px;">方法2：拷贝下链接，发送到家长QQ群</p>
              <p style="margin-left: 50px;color: #00BA8F;">{{share_url}}</p>
            </div>
          </div>
        </div>
        <div class="noticeMask" v-if="share_url.length != 0">

        </div>
    </div>
</template>
<script>
    import VueQArt from 'vue-qart'
    import fetch from './../../fetch'
    import {mapGetters, mapActions} from 'vuex'
    import Temporalitaet from "./../../unit/Temporalitaet"
    import rankTable from "../rankTable/rankTable"
    import rankWorkTable from "../rankWorkTable/rankWorkTable"
    import rankError from "../rankError/rankError.vue"
    import {clientId, brandId, http, schoolId} from './../../config'
    export default{
        data(){
            return {
                activeIndex: -1,      //tab索引
                activeTable:true,     //表格tab状态
                rankcontentList:[],   //tab栏内容
                rankStatistics:[],    //分数
                SrankStatistics:[],
                unRecords:[],         //学生记录（有成绩或者班级信息）
                rankRecords:[],
                unSRecords:[],         //学生记录（有成绩或者班级信息）
                rankSRecords:[],
                allWorkId:'',         //记录总成绩ID
                currentTitle:'',      //当前tab栏对应的title
                endTime:'',           //作业结束时间
                stateTime:"",         //未发布
                arrShow:false,        //箭头显示与隐藏
                arrowShowL:false,     //箭头显示与隐藏
                arrowShowR:true,      //箭头显示与隐藏
                stateText:'进行中',   //作业状态
                stateBtn:true,
                bookName:"暂无书籍",
                moduleId:'',
                exampaperData:[],     //试卷内容
                paperType:[],
                useAnswer:[],        //试卷答案
                url:'',
                classId: '',
                config:'',
                downloadButton:false,
                share_url:'',
                className:'',
                isShool: false,
                currentTime: '',
                params:'',
                flagClick: true
            }
        },
        components:{
            rankTable,
            rankWorkTable,
            rankError,
            VueQArt
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
                let index = window.sessionStorage.index ? window.sessionStorage.index * 1 : false
                if(index === 0 || index){
                  this.activeIndex = index
                  this.tabFun(index)
                  window.sessionStorage.removeItem('index')
                }
                if (schoolId === 0) {
                  this.isShool = true
                }
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
            //点击滑动 每次滑192px
            moveRight(){
              let arrowLen= this.rankcontentList.length;
              if (!this.flagClick) {
                return false
              }
              if(this.activeIndex!=arrowLen){
                this.activeIndex+=1;
                this.$refs.swiperTab.style.left = -192*(this.activeIndex-3 <=0?0:(this.activeIndex-3))+'px';
                this.tabFun(this.activeIndex);
                if(this.activeIndex==arrowLen){
                  this.arrowShowR=false;
                } else if (this.activeIndex <=4) {
                  this.arrowShowL=true
                }
              }

            },
            moveLeft(){
              let arrowLen= this.rankcontentList.length-1;
              if (!this.flagClick) {
                return false
              }
              if(this.activeIndex != -1){
              this.activeIndex-=1;
              this.$refs.swiperTab.style.left = -192*(this.activeIndex<3?0:this.activeIndex-3)+"px";
              this.tabFun(this.activeIndex);
              if(this.activeIndex < 3){
                this.arrowShowL = false;
              } else {
                this.arrowShowR = true
              }
              }
            },
            tabFun: function(index){
              if (!this.flagClick) {
                return false
              }
              this.activeIndex = index;
              /*每次点击前清空原有数据*/
              this.rankRecords=[];
              this.unRecords=[];
              this.rankStatistics=[];
              this.SrankStatistics=[];
              this.exampaperData=[];
              this.paperType="";
              this.activeTable=true;
              //index ==-1 请求总排行的数据
              if(index <= 3){
                if(index == -1){
                  this.toFetchWorkId(this.allWorkId)
                } else {
                  this.toFetchContentId(this.rankcontentList[this.activeIndex].contentId);
                  this.toFetchStatistics(this.allWorkId,this.rankcontentList[this.activeIndex].contentId);
                }
                this.arrowShowR=true;
                this.arrowShowL=false;
                this.$refs.swiperTab.style.left = '0px';
              }else{
                this.arrowShowR=true;
                this.arrowShowL=true;
                this.$refs.swiperTab.style.left = -192 * (this.activeIndex-3) + 'px'
                if(this.activeIndex==this.rankcontentList.length-1){
                  this.arrowShowR=false;
                }
                this.currentTitle  = this.rankcontentList[index].resourceName;
                this.paperType = this.rankcontentList[this.activeIndex].resourceType;
                /*点击TAb请求数据*/
                this.toFetchContentId(this.rankcontentList[this.activeIndex].contentId);
                // this.toFetchStatistics(this.rankcontentList[this.activeIndex].workId,this.rankcontentList[this.activeIndex].contentId);
                this.toFetchStatistics(this.allWorkId,this.rankcontentList[this.activeIndex].contentId);

              }
            },
            tableFun1(){
              this.activeTable=true;
            },
            tableFun2(){
              this.activeTable=false;
              console.log(this.rankcontentList[this.activeIndex])
              this.toJudgeType(this.rankcontentList[this.activeIndex].resourceType);
            },
            rank(){

                this.params = this.$route.query;
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
                  //数据初始化
                 this.rankRecords=[];
                 this.unRecords=[];
                //等于-1  请求总数据
                if(this.activeIndex==-1){
                 this.toFetchWorkId(this.allWorkId);
                }else{
                 this.paperType = this.rankcontentList[this.activeIndex].resourceType;
                 this.toFetchContentId(this.rankcontentList[this.activeIndex].contentId);
                 this.toFetchStatistics(this.allWorkId,this.rankcontentList[this.activeIndex].contentId);
                 if (this.activeIndex >= 4) {
                     this.$refs.swiperTab.style.left = -192 * (this.activeIndex-3) + 'px';
                     this.arrowShowR=true;
                     this.arrowShowL=true;
                 }
                }
            },
            rankWorkExcel(){
                let url= http + "/gateway/h5/v2/epaperwork/ExportWorkReport?"+'&clientId='+clientId+'&brandId='+brandId+'&workId='+this.allWorkId;
                this.url = url;
            },
            //作业状态转换
            toChangeTime(sendDate,effectiveDate){
               const differenceTimePub = (sendDate-this.currentTime);
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
                this.currentTime = res.data.currentTime
               this.toChangeTime(this.params.sendDate,this.params.effectiveDate);
                let rankHeader=res.data.header;
                this.unRecords=[];
                this.rankRecords=[];
                this.currentTitle  = res.data.work.workName;
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
               this.flagClick = false;
               fetch.rankContent({contentId:contentId}).then(res=>{
                    if(!res){
                      return false;
                    }
                 this.currentTime = res.data.currentTime
                 this.toChangeTime(this.params.sendDate,this.params.effectiveDate);
                    this.moduleId=res.data.currentContent.moduleId;
                    this.unSRecords=[];
                    this.rankSRecords = [];
                    if(res.data.classInfo){
                      this.classId = res.data.classInfo.classId;
                    }
                    if(res.data.records.length<1){
                      this.unSRecords=res.data.receivers;
                      this.rankSRecords=[];
                      this.SrankStatistics=[];
                    }else{
                      this.SrankStatistics=res.data.statistics;
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
                            this.rankSRecords.push(item);
                          }
                        }
                        if(item.isShow==0){
                          this.unSRecords.push(item)
                        }
                      }
                      for(let k=0,kLen = unreceivers.length;k<kLen;k++) {
                        let item = unreceivers[k];
                        item.isShow = -1;
                        this.unSRecords.push(item);
                      }
                    }
                    this.flagClick = true
                  })
            },
            // 获取在线作答
            toFetchOnlineWork(versionId){
              fetch.getOnlineExamination({versionId:versionId}).then(res =>{
                console.log(res)
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
            },
            getClass(){
              let grads_params = {
        				userRole: 2,
        				exists: 1
        			}
        			fetch.grads(grads_params).then(res => {
                if(res.ret || res.errcode){
                  return false;
                }
        				let grads = res.data;
                console.log("grads",grads)
                for(var i=0;i<grads.length;i++){
                  if(grads[i].classId == this.classId){
                     this.className = grads[i].className;
                     this.shareUrl();
                     return;
                  }
                }
        			})
            },
            shareUrl(){
              let params=this.$route.query;
              let effectiveDate = params.effectiveDate;
              let userInfo = this.getUser();
              let userId = userInfo.userId;

              let url = "https://m.teacher.jiaofuyun.com/epaperwork/?#/finisher/";

              let content = this.rankcontentList[this.activeIndex];
              console.log("contentgttgggg",content)
              let type = (content.moduleId == 10);
              // let title = this.wirteUtf(content.resourceName);
              let title = encodeURIComponent(content.resourceName);
              let className = encodeURIComponent(this.className);
              let url_params = this.allWorkId + '/' + content.contentId +'/'+JSON.stringify(content.requirementContent) +'/' + className + '/' + effectiveDate + '/' + type + '/' + content.workScore+'/'+title.replace(/\?/g, '')

              url+=url_params;
              url+='?userId='+userId+'&openid=oHI020WJDek34eteH6vQ8cKuXZAQ&'+'brandId='+brandId+'&clientId='+clientId+'&wappid=wx6d19dc7ac924e936&state=3'

              fetch.toShare({url:url}).then(res=>{
                console.log("res",res)
                if(res.ret || res.errcode){
                  return false;
                }
                this.share_url = res.data;
                this.config = {
                  value: this.share_url,
                  imagePath: './static/ewm.jpg',
                  filter: 'color'
                }

              })
            },
            close(){
              this.share_url = '';
            },
            wirteUtf(str, isGetBytes){
              var back = [];
              var byteSize = 0;
              for (var i = 0; i < str.length; i++) {
                  var code = str.charCodeAt(i);
                  if (0x00 <= code && code <= 0x7f) {
                        byteSize += 1;
                        back.push(code);
                  } else if (0x80 <= code && code <= 0x7ff) {
                        byteSize += 2;
                        back.push((192 | (31 & (code >> 6))));
                        back.push((128 | (63 & code)))
                  } else if ((0x800 <= code && code <= 0xd7ff)
                          || (0xe000 <= code && code <= 0xffff)) {
                        byteSize += 3;
                        back.push((224 | (15 & (code >> 12))));
                        back.push((128 | (63 & (code >> 6))));
                        back.push((128 | (63 & code)))
                  }
               }
               for (i = 0; i < back.length; i++) {
                    back[i] &= 0xff;
               }
               if (isGetBytes) {
                    return back
               }
               if (byteSize <= 0xff) {
                    return [0, byteSize].concat(back);
               } else {
                    return [byteSize >> 8, byteSize & 0xff].concat(back);
                }
            }
        }
    }
</script>
