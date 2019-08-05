<template>
    <div>
        <div><b v-if="question.is_objective==0&&moduleId==124" title="该题为主观题，需要您手动批改" class="correctHand">批</b><span v-if="question.sid>-1&&moduleId!=15"> {{question.sid+1}}. </span><div class="inline" v-html="question.stem"></div><span v-if="question.question_ref_sorce">（{{question.question_ref_sorce || 0}}分）</span></div>
        <attachments  :attachments="question.attachments"  :playerObj="playerObj"  @playedObj="playedObj" :id="question.id"></attachments>
        <div class="option-box clearfix">
            <div class="option-item" v-for="(option,opIndex) in question.options">
                <span>{{opIndex | fromCharCode}}.</span>
                <span v-html="option.stem"></span>
                <attachments  :attachments="option.attachments"  :playerObj="playerObj"  @playedObj="playedObj" :id="question.id"></attachments>
            </div>
        </div>
        <div>
            <div v-if="isShowAnswer">
                <div class="u-question-item">
                    <span class="color-999999">学生答案：</span>
                    <span v-html="setUserAnswer(question.options,question.userAnswer)"></span> 
                    <div class="fr">
                        <div class="assessIconBox" v-html="setAssessIcon(question.userAnswer)"></div>
                        <span>（<span class="col-red" v-html="setAssess(question.userAnswer)"></span> / {{parseFloat(question.question_ref_sorce)}}分）</span>
                    </div>
                </div>
            </div>
            <listenTabTopic v-if="moduleId==15" :infoAnswer="question" :listenTextModule="question.textModule[0]" :qtype="2"></listenTabTopic>
            <tabTopic :infoAnswer='question' :knowledgePoints="question.knowledge_points" :explains="question.explains" :qtype="2" :tags="question.tags"  v-else-if="moduleId==124"></tabTopic>
        </div>
    </div>
</template>

<script>
    // 多选题
    import attachments from './attachments.vue' // 附件
    import tabTopic from './tabTopic.vue' // 附件
    import listenTabTopic from './listenTabTopic.vue' // 听说的tab
    export default {
        data(){
            return {
            }
        },
        props:[
            'question',
            'moduleId',
            'parentqtype',
            'isShowAnswer',
            'playerObj'
        ],
        components:{
            attachments,
            tabTopic,
            listenTabTopic
        },
        mounted(){  // 同v1.*的ready

        },
        computed:{

        },
        methods:{
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
            setRefAnswer(options,ref_info){
                var _this = this;
                var result = '';
                for(var i=0;i<options.length;i++){
                    var option = options[i]
                    if(ref_info){    // 不是参考答案
                        for(var j=0;j<ref_info.answers.length;j++){
                            var answer = ref_info.answers[j];
                            if(answer == option.id){
                                result += String.fromCharCode(65+i) + ' ';
                            }
                        }
                    }
                }

                return result;
            },
             // 用户答案选项
            setUserAnswer(options,userAnswer){
                var _this = this;
                var result = '';
                for(var i=0;i<options.length;i++){
                    var option = options[i]
                    if(userAnswer){    // 不是参考答案
                        var isCorrect = false;

                        for(var j=0;j<userAnswer.answers.length;j++){
                            var answer = userAnswer.answers[j];
                            if(_this.moduleId==15){
                                // 答案类型(1:音频文件 2:选项ID 3:填空题答案)
                                if(answer.answerType==2 && answer.content == option.id){
                                    result += String.fromCharCode(65+i) + ' ';
                                }
                            }else if(_this.moduleId==124){
                                // 答案类型(1:字符串 2:音频文件)
                                if(answer.content == option.id){
                                    result += String.fromCharCode(65+i) + ' ';
                                }
                            }
                        }
                    }
                }

                return result;
            },
            playedObj(playerObj){
                this.$emit('playedObj', playerObj)
            }
        }
    }
</script>
