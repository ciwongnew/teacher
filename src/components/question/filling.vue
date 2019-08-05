<template>
    <div>
        <div><b v-if="question.is_objective==0&&moduleId==124" title="该题为主观题，需要您手动批改" class="correctHand">批</b><span v-if="question.sid>-1&&moduleId!=15" class="inline-block"> {{question.sid+1}}. </span><div class="inline-b m-l10" v-html="fillFormatHtml(question.stem)"></div><span v-if="question.question_ref_sorce">（{{question.question_ref_sorce || 0}}分）</span></div>
        <attachments  :attachments="question.attachments"  :playerObj="playerObj"  @playedObj="playedObj" :id="question.id"></attachments>
        <div class="clearfix">
                <!-- <span class="color-999999">参考答案：</span><span v-html="option.stem"></span> -->
                <div v-if="isShowAnswer"  v-for="(option,$index) in question.options">
                    <div class="u-question-item">
                        <span class="color-999999">学生答案：</span><span v-html="setFillingAnswer(question.userAnswer,$index)"></span>
                        <div class="fr u-question-r">
                            <div class="assessIconBox f-error_txt" v-html="setAssessIcon(question,$index)" v-on:click.stop="setNewAns(question,$index)"></div>
                            <span>（<span class="col-red" v-html="setAssessFilling(question,$index)"></span> / {{parseFloat( (question.question_ref_sorce/question.options.length).toFixed(1) ) || 0}}分）</span>
                            <div class="handleScore clearfix" v-if="handle==$index">
                                <span class="correcting" :class="{half_right:halfRight,half_right_hover:!halfRight}" @click.stop="handleHr(question,$index)"></span>
                                <span class="correcting" :class="{C_right:Cright,C_right_hover:!Cright}" @click.stop="handleCr(question,$index)"></span>
                                <span class="correcting" :class="{C_error:C_error,C_error_hover:!C_error}" @click.stop="handleCe(question,$index)"></span>
                                <input type="number" class="scoreNow" v-model="scoreVal" @click.stop v-on:change="checkPrice(question,$index,scoreVal)">
                                分
                                <input type="button" class="scoreSure" value="确定" @click.stop="sentNewSocre(question,$index,scoreVal)">
                            </div>
                        </div>
                    </div>
                </div>
                <listenTabTopic v-if="moduleId==15" :infoAnswer="question.options" :listenTextModule="question.textModule[0]" :qtype="3"></listenTabTopic>
                <tabTopic v-else  :infoAnswer='question.options' :knowledgePoints="question.knowledge_points" :explains="question.explains" :tags="question.tags" :qtype="3"></tabTopic>
        </div>
    </div>
</template>

<script>
    // 填空题
    import attachments from './attachments.vue'
    import tabTopic from './tabTopic.vue' // 附件
    import listenTabTopic from './listenTabTopic.vue' // 听说的tab
    export default {
        data(){
            return {
                fillIndex:'',
                handle:-1,
                scoreVal:'0',
                Cright:true,
                halfRight:true,
                C_error:true,
                correctContents:'',
                changeAnswer:''
            }
        },
        props:[
            'page',
            'question',
            'parentqtype',
            'isShowAnswer',
            'moduleId',
            'playerObj'
        ],
        created () {
            document.body.addEventListener("click",() =>{
              this.handle = -1
            })
            // this.altData();
  	       	this.$nextTick(() => {
  	       		this.altData();
  	       	})
  	    },
        watch :{
            question(old){
                this.altData();
            }
        },
        components:{
            attachments,
            tabTopic,
            listenTabTopic
        },
        methods:{
          altData(){
            let options = this.question.options;
            for(var i=0; i<options.length;i++){
              let stem = options[i].stem;
              try{
                 stem = JSON.parse(stem)
                 if(stem instanceof Array) {
                   options[i].stem = stem.join('/')
                 }
             }catch(e){}

            }
            this.question.options = []
            this.question.options = options
          },
            // 格式化{}填空
            fillFormatHtml(val){
                return val.replace(/{#blank#}(\d*){#\/blank#}/g,'<span class="filling-txt"><i class="filling_bg">$1</i></span>')
            },
            // 设置填空题得分(0:未批改 1:对 2:错 3:半对 4:未知)
            setAssessFilling(question,index){
                var html;
                var theAnswer;
                question.userAnswer && question.userAnswer.answers.forEach((answer)=>{
                    if(answer.sid == index) return theAnswer = answer;
                })

                if(theAnswer!==undefined){
                    if(theAnswer.assess===0){ // 未批改
                        html = '评分中'
                    }else if(theAnswer.assess===4){
                      return '<i class="f-status f-unknown"></i> 分'
                    }else{
                        html = theAnswer.assess==1 ? ((question.question_ref_sorce/question.options.length).toFixed(1) || 0) : (theAnswer.score || theAnswer.item_score || 0)
                        html = parseFloat(html) + '分'
                    }
                }else{
                    html = 0 + '分'
                }

                return html;
            },
            // 设置得分的标签(assess= undefined或6:未作答  0:未批改 1:对 2:错 3:半对 4:未知  5:批改失败)
            setAssessIcon(question,index){
                var msg='',
                    answerIcon='';
                var userAnswer;
                question.userAnswer && question.userAnswer.answers.forEach((answer)=>{
                    if(answer.sid == index) return userAnswer = answer;
                })

                if(!userAnswer || userAnswer.assess===undefined || userAnswer.assess==6){
                    msg = '未作答';
                }else{
                    answerIcon = userAnswer.assess==1? 'f-correct':userAnswer.assess==2? 'f-error':userAnswer.assess==3?'f-party_correct':userAnswer.assess==4?'f-bandui':'';
                    if(answerIcon) answerIcon='<span class="f-status ' +answerIcon+'"></span>';
//                    msg = userAnswer.assess==4?'?':'';
                }
//                if(msg) msg = '<span class="f-error_txt">'+msg+'</span>';
                return answerIcon || msg;
            },
            // 填空题用户答案
            setFillingAnswer(userAnswer,index){
                let result = '';
                userAnswer && userAnswer.answers.forEach((answer)=>{
                    if(answer.sid == index) return result = answer.content;
                })
                return result;
            },
            setNewAns(question,$index){
                //过滤掉userAnswer 没有 或者分数为0的
                if(question.userAnswer.assess==6 || question.userAnswer.answers[$index].assess==6 || question.is_objective==1){
                    return false;
                }
                let lenAns=question.userAnswer.answers.length-1;
                let flag=$index>lenAns;
                if(flag){
                    return false;
                }
                this.halfRight=true;
                this.Cright=true;
                this.C_error=true;
                this.handle=$index;
                this.scoreVal="";
            },
            handleHr(question,ind){
                this.halfRight=false;
                this.Cright=true;
                this.C_error=true;
                this.scoreVal=((question.question_ref_sorce/question.options.length)/2).toFixed(1)*1;
                let answers=question.userAnswer;
                this.question.userAnswer=answers;
                this.correctContents = answers;
            },
            handleCr(question,ind){
                this.Cright=false;
                this.halfRight=true;
                this.C_error=true;
                this.scoreVal=(question.question_ref_sorce/question.options.length).toFixed(1)*1;
                let answers=question.userAnswer;
                this.question.userAnswer=answers;
                this.correctContents = answers;
            },
            handleCe(question,ind){
              this.C_error=false;
              this.halfRight=true;
              this.Cright=true;
              this.scoreVal=0;
              let answers=question.userAnswer;
              this.question.userAnswer=answers;
              this.correctContents = answers;
            },
            checkPrice(question,ind,val){//输入值
                let maxScore=parseFloat((question.question_ref_sorce/question.options.length).toFixed(1));
                if(val>maxScore){
                    this.$toast('最大分数不能超过该题分值','error');
                    return false;
                }else if(val<0){
                     this.$toast('最小分数为0','error');
                    return false;
                }
                this.scoreVal=val*1;
                let answers=question.userAnswer;
                this.question.userAnswer=answers;
                this.correctContents = answers;
            },
            //确定
            sentNewSocre(question,ind,val){
                let maxScore=parseFloat((question.question_ref_sorce/question.options.length).toFixed(1));
                let arrFlag=[0,0,0];
                if(val>maxScore){
                    this.$toast('最大分数不能超过该题分值','error');
                    return false;
                }
                question.userAnswer.answers[ind].score=this.scoreVal;//单个选项的分数改变
                if(this.scoreVal==0){
                    question.userAnswer.answers[ind].assess=2;//错
                }else if(this.scoreVal==maxScore){
                    question.userAnswer.answers[ind].assess=1;//全对
                }else {
                     question.userAnswer.answers[ind].assess=3;//半对
                }
                this.handle=-1;
                this.correctContents.score=0;
                for(let i=0,len=this.correctContents.answers.length;i<len;i++){
                  let item=this.correctContents.answers[i];
                  if(!item.score){
                    item.assess==1?item.score=maxScore:(item.assess==3?item.score=maxScore/2:item.score=0);
                  }
                   this.correctContents.score+=item.score*1;
                   if(item.assess==1){//dui
                     arrFlag[0]++
                   }else if(item.assess==2){//cuo
                     arrFlag[1]++
                   }else if(item.assess==3){//bandui
                     arrFlag[2]++
                   }
                }
                if(arrFlag[0]==3){
                  this.correctContents.score = question.question_ref_sorce*1;
                }
                let flag=question.options.length //参考答案的长度
                flag==arrFlag[0]?this.correctContents.assess=1:(arrFlag[2]>0||arrFlag[0]>0?this.correctContents.assess=3:this.correctContents.assess=2)
                this.$emit("correctScore",this.correctContents);
            },
            playedObj(playerObj){
            this.$emit('playedObj', playerObj);
            }
        }
    }
</script>
