<template>
    <div class="border p-20">
        <div>
            <div>
                <b v-if="question.is_objective==0&&moduleId==124" title="该题为主观题，需要您手动批改" class="correctHand">批</b><span v-if="question.sid>-1&&moduleId!=15"> {{question.sid+1}}. </span> <div class="inline" v-html="question.stem"></div><span v-if="question.question_ref_sorce">（{{question.question_ref_sorce || 0}}分）</span>
            </div>
            <attachments  :attachments="question.attachments"  :playerObj="playerObj"  @playedObj="playedObj" :id="question.id"></attachments>
        </div>9
        <div v-if="isShowAnswer">
            <div class="u-question-item">
                <span class="color-999999">学生答案：</span>
                <span><theAudio :src="question.userAnswer&&question.userAnswer.answers[0].content" :id="id+1111111" :playerObj="playerObj" @playedObj="playedObj"></theAudio></span>
                <div class="u-shortAnswer">
                    <div class="assessIconBox" v-html="setAssessIcon(question.userAnswer)" @click.stop="setNewAns(question)"></div>
                    <span>（<span class="col-red" v-html="setAssess(question.userAnswer)"></span>/{{parseFloat(question.question_ref_sorce)}}分）</span>
                    <div class="handleScore clearfix" v-if="handle">
                        <span class="correcting" :class="{half_right:halfRight,half_right_hover:!halfRight}" @click.stop="handleHr(question)"></span>
                        <span class="correcting" :class="{C_right:Cright,C_right_hover:!Cright}" @click.stop="handleCr(question)"></span>
                        <span class="correcting" :class="{C_error:C_error,C_error_hover:!C_error}" @click.stop="handleCe(question)"></span>
                        <input type="number" class="scoreNow" v-model="scoreVal" @click.stop v-on:change="checkPrice(question,scoreVal)">
                        分
                        <input type="button" class="scoreSure" value="确定" @click.stop="sentNewSocre(question,question.question_ref_sorce/question.options.length,scoreVal)">
                    </div>
                </div>
            </div>
        </div>
        <listenTabTopic v-if="moduleId==15" :infoAnswer="question.ref_info.answers[0]" :listenTextModule="false" :qtype="7"></listenTabTopic>
        <tabTopic v-else :infoAnswer='question.options' :knowledgePoints="question.knowledge_points" :explains="question.explains" :tags="question.tags" :qtype="3"></tabTopic>
        </div>
    </div>
</template>

<script>
    // 模仿朗读或简答题
    import attachments from './attachments.vue'
    import theAudio from '../player/audio.vue'  // 音频组件
    import listenTabTopic from './listenTabTopic.vue' // 听说的tab
    export default {
        data(){
            return {
                myIsPlay:false,
                handle:false,
                scoreVal:'0',
                Cright:true,
                halfRight:true,
                C_error:true,
                correctContents:''
            }
        },
        props:[
            'question',
            'moduleId',
            'parentqtype',
            'isShowAnswer',
            'playerObj',
            'id'
        ],
        components:{
            attachments,
            theAudio,
            listenTabTopic
        },
        created () {
            document.body.addEventListener("click",() =>{
              this.handle = false
            })
        },
        computed:{

        },
        methods:{
            subPlayStatus(val){
                this.myIsPlay = val
                console.log(val)
            },
            // 设置得分的标签(assess= undefined或6:未作答  0:未批改 1:对 2:错 3:半对 4:未知  5:批改失败)
            setAssessIcon(userAnswer){
                var msg='',
                    answerIcon='';
                if(!userAnswer || userAnswer.assess===undefined || userAnswer.assess==6){
                    msg = '未作答';
                }else{
                    answerIcon = userAnswer.assess==1? 'f-correct':userAnswer.assess==2? 'f-error':userAnswer.assess==3?'f-party_correct':'';
                    if(answerIcon) answerIcon='<span class="f-status ' +answerIcon+'"></span>';

                    msg = userAnswer.assess==4?'未知':'';
                }
                if(msg) msg = '<span class="f-error_txt">'+msg+'</span>';
                return answerIcon || msg;
            },
            setAssess(userAnswer){
              var html='';
              if(userAnswer && userAnswer.score!==undefined){
                  if(userAnswer.assess===0){
                      html = '评分中'
                  }else if(userAnswer.assess===5){
                      html = '批改失败'
                  }else if(userAnswer.assess===4){
                    html = '<i class="f-status f-unknown"></i> 分'
                  }
                  else{
                      html = parseFloat(userAnswer.score) + '分'
                  }
              }else{
                  html = 0 + '分'
              }
              return html;
            },
            // 格式化答案
            formatAnswers(text){
                var regExp = /#YZSID:[A-Z0-9-_.]+#/; //口头作文id过滤
                var jsgExp = /#JSGF/;                //过滤简答题的答案
                if(regExp.test(text)){
                text = text.replace(regExp,'');
                }
                if(jsgExp.test(text)){
                text = '答案略';
                }
                return text.replace(/&nbsp;/g,' ');
            },
            subPlayStatus(val){
                this.myIsPlay = val
            },
            setNewAns(question){
                //过滤没有作答的 批改不显示
                if(question.userAnswer==undefined || question.userAnswer.assess==6 || question.is_objective==1){
                    return false;
                }
                this.handle=true;
                this.halfRight=true;
                this.Cright=true;
                this.C_error=true;
                this.scoreVal="";
            },
            handleHr(question){ //半对
                this.halfRight=false;
                this.Cright=true;
                this.C_error=true;
                this.scoreVal=(question.question_ref_sorce/2).toFixed(1)*1;
                let answers=question.userAnswer;
                this.question.userAnswer=answers;
                this.correctContents = answers;
            },
            handleCr(question){ //对
                this.Cright=false;
                this.halfRight=true;
                this.C_error=true;
                this.scoreVal=question.question_ref_sorce;
                let answers=question.userAnswer;
                this.question.userAnswer=answers;
                this.correctContents = answers;
            },
            handleCe(question){ //错
              this.C_error=false;
              this.halfRight=true;
              this.Cright=true;
              this.scoreVal=0;
              let answers=question.userAnswer;
              this.question.userAnswer=answers;
              this.correctContents = answers;
            },
            checkPrice(question,val){//输入值
                this.scoreVal=val*1;
                let maxScore=parseFloat((question.question_ref_sorce/question.options.length).toFixed(1));
                if(val>maxScore){
                    this.$toast('最大分数不能超过该题分值','error');
                    return false;
                }else if(val<0){
                    this.$toast('最小分数为0','error');
                    return false;
                }
                
                let answers=question.userAnswer;
                this.question.userAnswer=answers;
                this.correctContents = answers;
            },
            //确定
            sentNewSocre(question,maxScore,val){
                if(val>maxScore){
                    this.$toast('最大分数不能超过该题分值','error');
                    return false;
                }
                question.userAnswer.score=this.scoreVal; //一道题的分数改变
                question.userAnswer.answers.score=this.scoreVal;//单个选项的分数改变
                if(this.scoreVal==0){
                   question.userAnswer.assess=2;//改变批改状态
                }else if(this.scoreVal==maxScore){
                   question.userAnswer.assess=1;//改变批改状态
                }else{
                   question.userAnswer.assess=3;//改变批改状态
                }
                this.handle=false;
                this.$emit("correctScore",this.correctContents);
            },
            playedObj(playerObj){
                this.$emit('playedObj', playerObj)
            }
        }
    }
</script>
