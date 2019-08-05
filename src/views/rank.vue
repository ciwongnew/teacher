<template>
    <!-- <img src="../assets/img/loading.gif"> -->
    <div class="rank mt120" :style="{minWidth: minWidth+'px'}" v-on:click="moreInfoHide">
        <img class="loading" src="./../assets/img/loading.gif"v-if="pcLoading">
        <div v-else>
          <div class="tabContent viewport">
              <div class="tabtitleBox">
                <img src="./../assets/img/morePc.png" class="morePc" v-on:click="moreToggleInfoShow">
                <h3 class="tabConTitle" :title='currentTitle'>{{currentTitle}}</h3>
                <div class="moreInfo" v-if="pcmoreInfo" v-on:click="moreInfoShow">
                  <div class="pcWorkName">
                     <span class="pcWorkNameL">作业名称:</span>
                     <span class="pcWorkNameR">{{currentTitle}}</span>
                  </div>
                  <div class="pcSendDate">
                    <span class="pcWorkNameL">布置时间:</span>
                    <span class="pcWorkNameR">{{sendDate}}</span>
                  </div>
                  <div class="pcEffectiveDate">
                    <span class="pcWorkNameL">截止时间:</span>
                    <span class="pcWorkNameR">{{effectiveDate}}</span>
                  </div>
                  <div class="pcLeaveMessge">
                    <span class="pcWorkNameL">作业留言:</span>
                    <span class="pcWorkNameR">{{WorkMessage}}</span>
                  </div>
                </div>
              </div>
              <p class="tabConTip">{{ReviceObject}}</p>
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
          <div class="socreRank viewport">
              <ul class="socreRankTitle">
                  <li class="active">
                      成绩排名
                  </li>
                  <!-- <li>
                      错题统计
                  </li> -->
              </ul>
              <div class="rankWorkTable">
                  <rankPCWorkTable :list="rankRecords" :unlist="unRecords" :hList="rankcontentList"></rankPCWorkTable>
              </div>
          </div>
        </div>
    </div>
</template>
<script>
    import fetch from '../fetch'
    import {nowDate, formatDate, aroundDate, timeStamp} from '../filter'
    import {mapGetters, mapActions} from 'vuex'
    import Temporalitaet from "./../unit/Temporalitaet"
    import {parseParam} from './../filter'
    import rankPCWorkTable from "./../components/rankPCWorkTable/rankPCWorkTable" 
    export default{
      components:{
          rankPCWorkTable
      },
      data(){
          return {
              rankcontentList:[],   //tab栏内容
              rankStatistics:[],    //分数
              unRecords:[],       //学生记录（有成绩或者班级信息）
              rankRecords:[],
              allWorkId:'',         //记录总成绩ID
              currentTitle:'',      //当前tab栏对应的title
              endTime:'',           //作业结束时间
              arrShow:false,        //箭头显示与隐藏
              stateText:'进行中',   //作业状态
              stateTime:'',
              stateBtn:true,
              minWidth: 960, 
              arrShow:false,        //tab栏箭头状态 
              pcmoreInfo:false,
              sendDate:"",
              effectiveDate:"",
              WorkMessage:"",
              ReviceObject:"",
              pcLoading:true,
              allData:new Array()   //存储所有数据
          }
      },
      created(){
          this.$nextTick(() => {
              this.rankData();
          })
      },
      watch:{
          '$route': 'rankData'
      },
      methods:{
        ...mapGetters([
            'getWorks'
        ]),
        ...mapActions([
            'setWorks',
            'setCrumb'
        ]), 
        //点击图标切换布置信息
        moreToggleInfoShow(e){
          e.stopPropagation();
          this.pcmoreInfo=!this.pcmoreInfo;
        },
        //点击弹框不消失
        moreInfoShow(e){
          e.stopPropagation();
          this.pcmoreInfo=true;
        },
        //点击页面消失
        moreInfoHide(){
          this.pcmoreInfo=false;
        },
        rankData(){
            let url = window.location.href;
            let params = parseParam(url);
            this.ReviceObject=decodeURI(params.ReviceObject);
            this.WorkMessage=decodeURI(params.WorkMessage);
            this.allWorkId = params.workId; 
            this.sendDate=formatDate(params.sendDate,'yyyy-MM-dd W hh:mm');
            this.effectiveDate=formatDate(params.effectiveDate,'yyyy-MM-dd W hh:mm');
            this.rankStatistics=[];
            const differenceTimePub = (params.sendDate-parseInt(new Date().getTime() / 1000));
            // alert(differenceTimePub)
            if(differenceTimePub>0){
                this.stateText="待发布";
                this.stateTime="stateOrange";
                this.endTime=Temporalitaet.timeStamp(differenceTimePub);
            }else{
                const differenceTimeEff = (params.effectiveDate-parseInt(new Date().getTime() / 1000));
                if(differenceTimeEff<0){
                    this.stateText="已结束";
                    this.stateTime="stateGray";
                    this.stateBtn=false;
                }else{
                    this.endTime=Temporalitaet.timeStamp(differenceTimeEff);
                    this.stateGreen="stateGreen";
                }
            }
            this.rankcontentList=[];
            this.unRecords=[];
            this.rankRecords=[];
            this.toFetchWorkId(params)
        },
        toFetchWorkId(params){
             fetch.rankWork(params).then(res =>{
              if(!res){
                return false;
              }
              this.pcLoading=false;
              let rankHeader=res.data.header;
              this.rankcontentList=res.data.header[2];
              console.log("111",this.rankcontentList)
              this.currentTitle  = res.data.work.workName;
              this.minWidth = (this.rankcontentList.length + 3) * 160;
              this.minWidth = this.minWidth>960?this.minWidth: 960;
              if(res.data.records<1){
                  let allStudents=res.data.classInfo.members 
                  this.rankStatistics=[]
                  for(let i=0,len = allStudents.length;i<len;i++){
                    let item = allStudents[i];
                    item.isShow = 0;
                    item.tabDatas = new Array(rankHeader[2].length);
                    this.unRecords.push(item);
                    this.rankRecords=[];
                  }            
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
        }
      }
    }
</script>