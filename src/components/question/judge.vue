<template>
    <div>
        <div><b v-if="question.is_objective==0&&moduleId==124" title="该题为主观题，需要您手动批改">批</b><span v-if="question.sid>-1&&moduleId!=15"> {{question.sid+1}}.</span><div class="inline" v-html="question.stem"></div><span v-if="question.question_ref_sorce">（{{question.question_ref_sorce || 0}}分）</span></div>
        <attachments  :attachments="question.attachments"  :playerObj="playerObj"  @playedObj="playedObj" :id="question.id"></attachments>
        <div class="option-box clearfix">
            <div class="option-item">
                <span class="checkbox"><input type="checkbox" checked /></span><span class="m-l10">正确</span>
            </div>
            <div class="option-item">
                <span class="checkbox"><input type="checkbox" checked /></span><span class="m-l10">错误</span>
            </div>
        </div>
        <div>
            <div v-if="isShowAnswer">
                <div class="u-question-item">
                  <span class="color-999999">学生答案：</span>
                  <span v-if="question.userAnswer" v-html="setAnswers(question.userAnswer.answers[0].content)"></span>
                  <div class="fr">
                      <div class="assessIconBox" v-html="setAssessIcon(question.userAnswer)"></div>
                      <span>（<span class="col-red" v-html="setAssess(question.userAnswer)"></span> / {{parseFloat(question.question_ref_sorce)}}分）</span>
                  </div>
                </div>
            </div>
            <tabTopic :infoAnswer='question.ref_info.answers' :knowledgePoints="question.knowledge_points" :explains="question.explains" :qtype="8" :tags="question.tags"></tabTopic>
        </div>
    </div>
</template>

<script>
    // 判断题
    import attachments from './attachments.vue'
    import tabTopic from './tabTopic.vue' // 附件
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
            tabTopic
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
            //设置答案
            setAnswers(answers){
               return  answers.indexOf('1')?'错误':'正确';
            },
            playedObj(playerObj){
                this.$emit('playedObj', playerObj)
            }
        }
    }
</script>
