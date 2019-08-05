<template>
  <div class="paper-question">
    <img v-if="webloading" class="loading" src="./../../assets/img/loading.gif">
    <div class="exampaperInfo" v-else>
          <div class="" style="border-bottom: 1px solid #e6e6e6; padding-bottom: 20px; margin-bottom: 30px;">
            <h3>{{exampaper.title}}</h3><span :class="{paperBtn:paperBtnInfo, paperBtnActive:!paperBtnInfo}" @click="paperInfo" v-if="page=='selectOnlinePaper' || page=='checkOnlinePaper'">试卷信息</span>
            <div v-if="page=='selectOnlinePaper' || page=='checkOnlinePaper'">
                <div class="examPaper clearfix" v-show="!paperBtnInfo">
                    <div class="fl width_60">
                      <p v-if="exampaper.ref_score">
                        <b class="paperInfoT">【总分】</b>
                        <span class="paperInfoC">{{exampaper.ref_score}}</span>
                      </p>
                      <p>
                        <b class="paperInfoT">【总答题时间】</b>
                        <span>{{exampaper.ref_answer_time}}</span>
                      </p>
                      <p v-if="exampaper.tags">
                        <b class="paperInfoT">【来源】</b>
                        <span class="p-l20 inline-block" v-for="(item,index) in exampaper.tags">{{item}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      </p>
                      <p v-if="exampaper.testItems.length>0" v-for="(item,index) in exampaper.testItems">
                        <b class="paperInfoT">【{{item.title}}】</b>
                        <span class="paperInfoC">{{item.content}}</span>
                      </p>
                    </div>
                    <!-- <p>涵盖知识点：</p><span>{{exampaper.tags}}</span> -->
                    <div class="fr" v-if="exampaper.videoReview">
                      <div class="coverUrl" v-if="videoPlay&&exampaper.videoReview.coverUrl!=null" @click="videoPlayer">
                          <img class="coverUrl" :src="exampaper.videoReview.coverUrl" >
                          <img src="./../../assets/img/player.png" class="coverUrlPlay">
                      </div>
                      <!-- <iframe :src="videoSrc(exampaper.videoReview.videoUnique)" ></iframe> -->
                      <embed v-if="exampaper.videoReview.videoUnique!=null&&!videoPlay" src="http://yuntv.letv.com/bcloud.swf" allowFullScreen="true" quality="high"  width="300" height="150" align="middle" allowScriptAccess="always" :flashvars="videoSrc(exampaper.videoReview.videoUnique)" type="application/x-shockwave-flash"></embed>
                    </div>
                </div>
            </div>
          </div>
       <div class="p-20 bg-fff border mb-40" v-for="(part,index) in exampaper.parts">
        <div v-if="page=='selectListenSpeak'&&selectFlag" class="fr">
            <div class="button choice" :class="{'checkedSel':part.isChecked, 'noCheck':!part.isChecked}" @click="choiceBigQ(part,index)">{{part.buttonText}}</div>
        </div>
        <div class="m-t10">
            <p>{{part.module_description}}答题说明</p>
            <span v-if="moduleId!=15">{{questionNum[index]}}、</span>{{part.module_type_name}}
        </div>
        <div class="m-t30
        " v-for="(question, index) in part.children">
            <singleChoice   v-if="question.qtype==1"  :playerObj="playerObj"    @playedObj="playedObj"   :question="question" :moduleId="moduleId"  :id="question.id+index" :isShowAnswer="isShowAnswer"></singleChoice>
            <multipleChoice v-else-if="question.qtype==2"  :playerObj="playerObj" :id="question.id+index"    @playedObj="playedObj" :question="question" :moduleId="moduleId" :isShowAnswer="isShowAnswer"></multipleChoice>
            <filling        v-else-if="question.qtype==3"  :playerObj="playerObj" :id="question.id+index"  :page="page"   @playedObj="playedObj" @correctScore="correctScore" :question="question" :moduleId="moduleId" :isShowAnswer="isShowAnswer"></filling>
            <allFilling     v-else-if="question.qtype==4"  :playerObj="playerObj" :id="question.id+index"  :page="page"  @playedObj="playedObj" :question="question" :moduleId="moduleId" :isShowAnswer="isShowAnswer"></allFilling>
            <reading        v-else-if="question.qtype==5"  :playerObj="playerObj" :id="question.id+index"    @playedObj="playedObj" @correctScore="correctScore" :question="question" :moduleId="moduleId" :isShowAnswer="isShowAnswer"></reading>
            <shortanswer    v-else-if="question.qtype==6"  :playerObj="playerObj" :id="question.id+index"  :page="page"   @playedObj="playedObj" @correctScore="correctScore" :question="question" :moduleId="moduleId" :isShowAnswer="isShowAnswer" :padShow="padShow"></shortanswer>
            <imitation      v-else-if="question.qtype==7"  :playerObj="playerObj" :id="question.id+index"    @playedObj="playedObj"  @correctScore="correctScore" :question="question" :moduleId="moduleId" :isShowAnswer="isShowAnswer"></imitation>
            <judge          v-else-if="question.qtype==8"  :playerObj="playerObj" :id="question.id+index"    @playedObj="playedObj" :question="question" :moduleId="moduleId" :isShowAnswer="isShowAnswer"></judge>
        </div>
      </div>
    </div>
    <div class="m-select-question" :class="{relativeBox:barHide}" v-if="(page=='selectListenSpeak' || page=='selectOnlinePaper')&&this.thirdParty">
      <div class="clearfix">
        <div class="fl" v-if="selectedExampaperArr.length">共选 {{ selectedExampaperArr.length || 0}} 条内容，预计<span style="padding: 0px 5px;"> {{doworkTime | formatDataToMinutes}} </span>分钟</div>
        <div class="fr">
          <div class="inline-block" @click="back" v-if='selectFlag' style="cursor: pointer;">取消</div>
          <div class="button inline-block m-l20 surebtn" @click="backQuestionArr">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    // 试卷
    import singleChoice from './singleChoice.vue'       // 1单选题
    import multipleChoice from './multipleChoice.vue'   // 2多选题
    import filling from './filling.vue'                 // 3填空题
    import allFilling from './allFilling.vue'           // 4完形填空
    import reading from './reading.vue'                 // 5阅读理解
    import shortanswer from './shortanswer.vue'         // 6简答题
    import imitation from './imitation.vue'             // 7模仿朗读or简答题
    import judge from './judge.vue'                     // 8判断题

    import {mapGetters} from 'vuex'

    export default {
        components:{
            singleChoice,
            multipleChoice,
            filling,
            judge,
            allFilling,
            reading,
            shortanswer,
            imitation
        },
        data(){
            return {
                exampaper:{parts:[]},
                barHide:false,
                myUserAnswers:[],
                playerObj: 0,
                checkedResource:'',
                webloading:true,
                selectedExampaperArr:[],
                videoPlay: true,
                paperBtnInfo: true,
                questionNum: ['一','二','三','四','五','六','七','八','九','十','十一','十二'],
                doworkTime:0
            }
        },
        props:[
            'page',
            'selectFlag',
            'moduleId',                 // 资源模块, 15[听说模考] / 124[在线作答]
            'exampaperData',            // 试卷
            'userAnswers',              // 用户答案
            'showdata',                 // 作业详情【显示的选题】
            'isShowAnswer',
            'packageId',
            'cId',
            'serviceId',
            'versionId',
            'padShow',
            'thirdParty',
            'doworkTimes'
        ],
        watch:{
            barHide(val){
                this.barHide = val
            },
            exampaperData(val){
                this.exampaperData = val;
                if(this.thirdParty){
                  const contents = this.getWorks().contents;
                  if(this.page=='selectListenSpeak' || this.page=='selectOnlinePaper'){
                      for(var i = 0,len = contents.length;i<len;i++){
                          if(this.versionId == contents[i].versionId){
                              this.checkedResource = contents[i].checkedResource;
                          }
                      }
                      // if(this.exampaperData.checkedResourceEmpty==0){
                      //    this.checkedResource = [];
                      // }
                      //给每个数据加上一个选中字段
                    if(this.selectFlag){
                      for (var i = 0, len = this.exampaperData.parts.length; i < len; i++) {
                        var item = this.exampaperData.parts[i];
                        item.isChecked = false;
                        item.buttonText = "选择大题";
                        if(this.checkedResource.length == 0 || this.checkedResource.indexOf(i)>-1){
                          this.selectedExampaperArr.push(i);
                          item.isChecked = true;
                          item.buttonText = "取消选择";
                        }
                      }
                    }
                    if(this.page=='selectListenSpeak'){
                      this.doworkTime = this.selectedExampaperArr.length * 180 ||  this.exampaperData.parts.length * 180
                    }else if(this.page=='selectOnlinePaper'){
                      this.doworkTime = this.doworkTimes * 60
                    }
                  }
                }
                this.mergeAnswerToExampaper()

            },
            userAnswers(val){
                this.myUserAnswers = val;
                if(this.myUserAnswers && this.exampaperData){
                    this.mergeAnswerToExampaper()
                }
            },
            exampaper(val){
                // 空数组为全选状态
                if(this.selectedExampaperArr && this.selectedExampaperArr.length==0 && this.exampaper.parts){
                    for(var i=0;i<this.exampaper.parts.length;i++){
                        this.selectedExampaperArr.push(i);
                    }
                }
            }
        },
        created(){
        },
        methods:{
            ...mapGetters([
                'getWorks'
            ]),
            choiceBigQ(item,index){

                item.isChecked = !item.isChecked;
                this.exampaperData.parts[index] = item;
                this.selectedExampaperArr = [];
                for (var i = 0, len = this.exampaperData.parts.length; i < len; i++) {
                    var item = this.exampaperData.parts[i];
                    if(item.isChecked){
                        item.buttonText = "取消选择"
                        this.selectedExampaperArr.push(i);
                    }else if(!item.isChecked){
                        item.buttonText = "选择大题";
                    }
                }

                this.doworkTime = this.selectedExampaperArr.length * 180 || this.exampaperData.parts.length * 180   // 等于0的时候就是全选
            },
            back(){
                if(this.selectFlag){
                  this.$router.push({path:"publishHomeWork",query: {serviceId:this.serviceId,packageId: this.packageId,cId:this.cId,isFirst:0}});
                }else{
                  this.$router.back(-1);
                }
            },
            // 题目数组回传
            backQuestionArr(){
                if(this.selectFlag){
                    let count = this.selectedExampaperArr.length;
                    let score = 0;
                    //累加选中的题目分值
                    for(let i = 0,len =this.selectedExampaperArr.length;i<len;i++){
                        let item = this.exampaper.parts[this.selectedExampaperArr[i]].children;
                        if (item.length > 1) {
                          item.forEach((item1,index1) => {
                            score = score+item1.question_ref_sorce;
                          })
                        } else if (item.length === 1) {
                          if (item[0].children.length > 0){
                            for(let j =0,len1=item[0].children.length;j<len1;j++){
                              score = score+item[0].children[j].question_ref_sorce;
                            }
                          }else if(item[0].children.length === 0){

                            score = score + item[0].question_ref_sorce
                          }
                        }
                    }
                    if(this.selectedExampaperArr.length === 0) {
                      count = this.exampaper.parts.length
                    }
                    if(this.exampaper.parts && this.selectedExampaperArr.length == this.exampaper.parts.length && this.selectedExampaperArr.length === 0){
                        // 全选状态为空数组
                        this.selectedExampaperArr = [];
                        score = this.exampaper.ref_score
                    }
                    this.$emit('submitExampaper',this.selectedExampaperArr,count,score,this.exampaperData.parts.length)
                } else {
                     this.$router.back(-1);
                }

            },
            // 合并答案到试卷
            mergeAnswerToExampaper(){
                var exampaperData = JSON.parse(JSON.stringify(this.exampaperData));
                var userAnswers = JSON.parse(JSON.stringify(this.myUserAnswers));
                exampaperData = this.showPartList(exampaperData,this.showdata)
                for(var index=0;index<exampaperData.parts.length;index++){
                    exampaperData.parts[index] = this.setUserAnswer(exampaperData.parts[index],userAnswers)
                    exampaperData.parts[index] = this.sortAttachments(exampaperData.parts[index])
                }

                this.exampaper = exampaperData;
                this.webloading=false;
            },
            // --------------------------答案处理函数-----------------------------------------
            // 只显示老师布置的作业题
            showPartList:function(result,showdata){
                if (showdata && showdata.length > 0) {
                    var _showdata = showdata.split(",");
                    var arrayObj = new Array(); //创建一个数组
                    _showdata.forEach((d,i)=>{
                        var l = result.parts.length - 1;
                        if (d <= l) {
                            var ret = result.parts[d];
                            arrayObj.push(ret);
                        }
                    })
                    var _result = { title: result.title, ref_score: result.ref_score, curriculum_id: result.curriculum_id, parts: arrayObj, id: result.id, version_id: result.version_id };
                    result = _result;
                }
                return result;
            },
            // 设置参考答案
            // answerIdArr:正确答案选项组，options：题目选项
            setRefAnswer:function(question) {
                // if(!question) return false;
                var answerIdArr = question.ref_info.answers
                var options = question.options
                var result=[],arr = [];
                // 选择题答案解析
                if(question.qtype==1){
                    for (var i = 0; i < answerIdArr.length; i++) {
                        for (var j = 0; j < options.length; j++) {
                            options[j].is_answer = false;
                            if (options[j].id == answerIdArr[i]) {
                                options[j].index = j;
                                options[j].is_answer = true;
                                arr.push(options[j]);
                                break;
                            }
                        };
                    }
                }

                if(arr != ''){
                    question.options = options;
                    question.ref_info.answers = arr;
                }
                this.webloading=false;
                return question;
            },
            // 设置用户答案
            setUserAnswer:function(questions,userAnswers){
                var _this = this;
                if(questions && questions.children){
                    questions.children.forEach((question,index)=> {
                        question = _this.setRefAnswer(question)
                        question.userAnswer = _this.findUserAnswer(userAnswers, question.version_id);
                        question.children && question.children.length > 0 && _this.setUserAnswer(question, userAnswers);
                        questions.children[index] = question;
                    });
                }
                return questions;
            },
            // 查找对应试卷id用户答案
            findUserAnswer:function(userAnswers, versionId){
                var result;
                userAnswers.forEach((m)=>{
                   if ( (m.versionId && m.versionId == versionId) || (m.version_id && m.version_id == versionId) ) {
                      result = m;
                    }
                })
                if (result && !(result.answers instanceof Array) ) {
                    result.answers = JSON.parse(result.answers);
                }
                return result;
            },
            // 附件排序
            sortAttachments:function(questions){
                if(questions && questions.children){
                    questions.children.forEach((question,index)=>{
                        var atta = question.attachments,
                            audioArr = [],
                            imgArr = [],
                            videoArr = [];
                        for (var i = 0,len=atta.length; i < len; i++) {
                            if(atta[i].file_type==1) imgArr.push(atta[i])
                            if(atta[i].file_type==2) audioArr.push(atta[i])
                            if(atta[i].file_type==3) videoArr.push(atta[i])
                        }
                        question.attachments = audioArr.concat(videoArr).concat(imgArr)
                        questions.children[index] = question;
                    });
                }
                return questions;
            },
            videoSrc:function(item){
              return 'pu=B6999F08EC&uu=2bfc338ed7&vu='+item+'&auto_play=1&width=656&height=504'
            },
            paperInfo:function(){
              this.paperBtnInfo = !this.paperBtnInfo;
            },
            videoPlayer:function(){
              this.videoPlay = false;
            },
            playedObj(playerObj){
                this.playerObj = playerObj
            },
            correctScore(correctScore){
                this.$emit('correctScore',correctScore)
            }
        }
    }
</script>
