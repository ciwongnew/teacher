<template>
    <div class="historyWork">
        <div class="timeBox">
          <p>{{content.publishDate | timeAxis(content.currentTime)}}</p>
        </div>
        <div class="historyHead">
            <div class="headContent clear">
                <span>{{content.workName}}</span>
                <span class="workName" v-show="content.serviceType != 0">{{content.bookName}}</span>
            </div>
            <div class="titleAndState">
                <div class="publishTime fr " :class="{unpublished:content.state == 1, underway: content.state == 0}">{{content.stateText}}</div>
                <!-- <span class="publishTime fr unpublished">结束时间还剩: 20小时3分</span> -->
                <div class="state fr" :class="{underway: content.state == 0,unpublished:content.state == 1,end:content.state == -1}">
                  <i class="point" :class="{underway: content.state == 0,unpublished:content.state == 1,end:content.state == -1}"></i>
                  {{Timetext[content.state+1]}}
                </div>
            </div>
        </div>
        <div class="" style="background-color: #fff;">
          <div class="historyContent" v-for="(item, index) in content.workList">
            <div class="receiveObj">
              <div class="">
                <span>布置对象</span>
                <p :title="item.reviceObject">{{item.reviceObject}}</p>
              </div>
              <div class="recall_btn" @click="recall(item,index)">

                  <span>撤回作业</span>

              </div>

              <div class="rush_btn" @click="rush(item,index)">
                <span v-if="item.rush_state === 1">一键催交</span>
                <span v-else-if="item.rush_state === 2">
                  <img src="./../../assets/img/loading_work.gif" alt="" style="vertical-align: text-top;"/>
                </span>
                <span v-else>
                  <span v-if="!item.rush_result" style="color: #ec2828;">催交失败</span>
                  <span v-else><img src="./../../assets/img/success_work.png" alt="" style="vertical-align: text-top;"/></span>
                </span>

              </div>
            </div>
            <div class="bar clear">
                <progress-bar
                :index_id="PageIndex.toString() + delIndex.toString() + index.toString()"
                :completeRate = "item.complete_rate"
                :decimalsRate="item.decimals_rate"
                :PageIndex="PageIndex">
                </progress-bar>
            </div>
            <div class="">
              <div class="workContent" v-for="(item2, index2) in item.workContents"  @click="toRank(item2,index2,index)">
                <span>{{item2.resourceName}}</span>
                <span>
                  <i>已完成</i>
                  <i style="color: #22c39e;">{{item2.submitCount }}</i>
                   / {{item.totalNum}}</span>

              </div>

            </div>
            <div class="summary" @click="toRank(item,-1,index)">

                成绩汇总
            </div>

          </div>
        </div>
        <notice :params="params" :isNotice="isNotice" @isConfirm="isConfirm"></notice>
    </div>
</template>

<script>
    import fetch from './../../fetch'
    import notice from "./../../components/notice/notice.vue"
    import selecter from "./../../components/selecter/selecter.vue"
    import progressBar from "./../../components/progressBar/progressBar.vue"
    import { timeAxis } from './../../filter'


    export default{
        data(){
            return {
                TimeStatus: 2,
                timeStamp:"",
                timeStampText:"",
                Timetext:["已结束","进行中","待发布"],
                d:"",
                h:"",
                m:"",
                isNotice:false,
                params:{},
                operationText:'操作',
                operations:[{name:'一键催交'},{name:'撤回作业'}],
                index:'', //用户点击操作的对应的下标
                option_text: ["一键催交", "成绩汇总", "撤回作业"]
            };
        },
        components:{
            notice,
            selecter,
            progressBar
        },
        props: ['content','delIndex', "PageIndex"],
        created(){
            this.$nextTick(() => {
            })
        },

        methods: {
            isConfirm(val){
                if(val){
                    let contents = this.content.workList[this.index];

                    fetch.delWork({workId: contents.workId}).then(res => {
                        if(!res){
                            return false;
                        }
                        this.$emit('removeWork',this.index,this.delIndex)
                        this.$toast('撤回作业成功', 'right')
                    })
                }
            },
            toRank(item,index,index2){
                let flag = false;

                let contents = this.content.workList[index2];

                if(!item.resourceType){
                  //否则是从汇总成绩按钮点进来的
                  for (var i = 0, len = item.workContents.length; i < len; i++) {
                      if (item.workContents[i].resourceType != '803ef46d-e0cc-4f97-b1eb-b3ef411d058e' && item.workContents[i].resourceType != 'eb5d05a2-d604-4879-8f9a-be5a45ae414e') {
                          flag = true;
                      }
                  }

                }else {
                  //这是从每个作业点进来的
                  if(item.resourceType=='803ef46d-e0cc-4f97-b1eb-b3ef411d058e' || item.resourceType=='eb5d05a2-d604-4879-8f9a-be5a45ae414e'){
                      return false;
                  }
                  this.$router.push({path: 'rankWork',  query: {workId: contents.workId,content:JSON.stringify(contents.workContents),effectiveDate:contents.effectiveDate,sendDate:contents.sendDate,index:index,workName:contents.workName}});
                }
                if(flag){
                    this.$router.push({path: 'rankWork',  query: {workId: contents.workId,content:JSON.stringify(contents.workContents),effectiveDate:contents.effectiveDate,sendDate:contents.sendDate,index:index,workName:contents.workName}});
                }
            },
            rush(item, index){
              item.rush_state = 2
              let userId = window.localStorage.user.userId
              fetch.urgeWorks({eventName:'workReminder',eventArgs:{workId:item.workId,userId:userId}}).then(res =>{
                  if(!res){
                      return false;
                  }
                item.rush_state = 3;
                  if(res){
                      item.rush_result = true
                      const timer = setTimeout(()=>{
                        item.rush_state = 1
                      },5000)
                  } else {
                    item.rush_result = false
                    const timerSe = setTimeout(()=>{
                      item.rush_state = 1
                    },5000)
                  }
              })
            },
            recall(item, index){

              this.index = index;

              this.isNotice = !this.isNotice;

              let contents = this.content.workList[this.index];



              this.params = {type:1, noticeText:"您是否要撤回本次作业？",noticeTitle:"撤回操作"}
            },
            isClickBtn(item,index){
              item.isShow_recall = !item.isShow_recall;
            }
        }
    }
</script>
