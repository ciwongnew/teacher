<template>
    <div>
        <div><span v-if="question.sid>-1&&moduleId!=15"> {{question.sid+1}}. </span><div class="inline-b" v-html="question.stem"> </div><span v-if="question.question_ref_sorce">（{{question.question_ref_sorce || 0}}分）</span></div>
        <attachments  :attachments="question.attachments"  :playerObj="playerObj"  @playedObj="playedObj" :id="question.id"></attachments>
        <div class="m-t20" v-for="(question, index) in question.children">
            <singleChoice   v-if="question.qtype==1"      :question="question"   :playerObj="playerObj"   @playedObj="playedObj"  :moduleId="moduleId" :parentqtype="question.qtype" :isShowAnswer="isShowAnswer"></singleChoice>
            <multipleChoice v-else-if="question.qtype==2" :question="question"   :playerObj="playerObj"   @playedObj="playedObj"  :moduleId="moduleId" :isShowAnswer="isShowAnswer"></multipleChoice>
            <filling        v-else-if="question.qtype==3" :question="question"   :playerObj="playerObj"   @playedObj="playedObj"  @correctScore="correctScore"  :moduleId="moduleId" :parentqtype="question.qtype" :isShowAnswer="isShowAnswer"></filling>
             <allFilling     v-else-if="question.qtype==4" :question="question"   :playerObj="playerObj"   @playedObj="playedObj" @correctScore="correctScore"  :moduleId="moduleId" :isShowAnswer="isShowAnswer"></allFilling>
            <shortanswer    v-else-if="question.qtype==6" :question="question" :id="question.id+index"  :playerObj="playerObj"    @playedObj="playedObj" @correctScore="correctScore"  :moduleId="moduleId" :parentqtype="question.qtype" :isShowAnswer="isShowAnswer"></shortanswer>
            <imitation      v-else-if="question.qtype==7" :question="question"   :playerObj="playerObj"   @playedObj="playedObj"  @correctScore="correctScore" :moduleId="moduleId" :parentqtype="question.qtype" :isShowAnswer="isShowAnswer"></imitation>
            <judge          v-else-if="question.qtype==8" :question="question"   :playerObj="playerObj"   @playedObj="playedObj"  :moduleId="moduleId" :isShowAnswer="isShowAnswer"></judge>
        </div>
    </div>
</template>

<script>
    // 阅读理解,该题型包含小题，小题类型有：1单选图、6简答题、7模仿朗读
    import attachments from './attachments.vue'         // 附件
    import singleChoice from './singleChoice.vue'       // 1单选题
    import multipleChoice from './multipleChoice.vue'   // 2多选题
    import filling from './filling.vue'                 // 3填空题
    import allFilling from './allFilling.vue'           // 4完形填空
    import shortanswer from './shortanswer.vue'         // 6简答题
    import imitation from './imitation.vue'             // 7模仿朗读or简答题
    import judge from './judge.vue'                     // 8判断题

    export default {
        data(){
            return {
            }
        },
        props:[
            'moduleId', 
            'question',
            'isShowAnswer',
            'playerObj'
        ],
        components:{
            attachments,
            singleChoice,
            multipleChoice,
            filling,
            allFilling,
            shortanswer,
            imitation,
            judge
        },
        mounted(){  // 同v1.*的ready

        },
        computed:{
            // debugger;
        },
        methods:{
            playedObj(playerObj){
                this.$emit('playedObj', playerObj)
            },
            correctScore(correctScore){
                this.$emit('correctScore',correctScore)
            }
        }
    }
</script>