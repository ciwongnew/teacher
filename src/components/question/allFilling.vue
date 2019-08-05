<template>
    <div>
        <div><b v-if="question.is_objective==0&&moduleId==124" title="该题为主观题，需要您手动批改" class="correctHand">批</b><span v-if="question.question_ref_sorce">（{{question.question_ref_sorce || 0}}分）</span></span><div class="inline" v-html="fillFormatHtml(question.stem)"> </div></div>
        <attachments  :attachments="question.attachments"  :playerObj="playerObj"  @playedObj="playedObj" :id="question.id"></attachments>
        <div class="m-t20" v-for="(question, index) in question.children">
            <singleChoice   v-if="question.qtype==1"      :question="question"   :playerObj="playerObj"    @playedObj="playedObj"  :moduleId="moduleId" :parentqtype="question.qtype" :isShowAnswer="isShowAnswer"></singleChoice>
            <filling        v-else-if="question.qtype==3" :question="question"   :playerObj="playerObj"    @playedObj="playedObj"  @correctScore="correctScore"  :moduleId="moduleId" :parentqtype="question.qtype" :isShowAnswer="isShowAnswer"></filling>
            <shortanswer    v-else-if="question.qtype==6" :question="question"  :id="question.id+index" :playerObj="playerObj"    @playedObj="playedObj"  :moduleId="moduleId" :parentqtype="question.qtype" :isShowAnswer="isShowAnswer"></shortanswer>
            <imitation      v-else-if="question.qtype==7" :question="question"   :playerObj="playerObj"    @playedObj="playedObj"  :moduleId="moduleId" :parentqtype="question.qtype" :isShowAnswer="isShowAnswer"></imitation>
        </div>
    </div>
</template>

<script>
    // 阅读理解,该题型包含小题，小题类型有：1单选图、6简答题、7模仿朗读
    import attachments from './attachments.vue'         // 附件
    import singleChoice from './singleChoice.vue'       // 1单选题
    import filling from './filling.vue'                 // 3填空题
    import shortanswer from './shortanswer.vue'         // 6简答题
    import imitation from './imitation.vue'             // 7模仿朗读or简答题

    export default {
        data(){
            return {
            }
        },
        props:[
            'page',
            'moduleId', 
            'question',
            'isShowAnswer',
            'playerObj'
        ],
        components:{
            attachments,
            singleChoice,
            filling,
            shortanswer,
            imitation,
        },
        mounted(){  // 同v1.*的ready
         
        },
        computed:{
            // debugger;
        },
        methods:{
            // 格式化填空
            fillFormatHtml(val){
                return val.replace(/{#blank#}(\d*){#\/blank#}/g,'<span class="filling-txt"><i class="filling_bg">$1</i></span>')
            },
            playedObj(playerObj){
                this.$emit('playedObj', playerObj)
            },
            correctScore(correctScore){
                this.$emit('correctScore',correctScore);
            }
        }
    }
</script>