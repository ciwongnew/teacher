<template>
	<div class="paper-question">
		<div  class="p-30 bg-fff m-t30">
		<singleChoice   v-if="question.qtype==1"  :playerObj="playerObj"  :moduleId="moduleId"   @playedObj="playedObj"   :question="question" ></singleChoice>
        <multipleChoice v-else-if="question.qtype==2"  :playerObj="playerObj" :moduleId="moduleId"  @playedObj="playedObj" :question="question"></multipleChoice>
        <filling        v-else-if="question.qtype==3"  :playerObj="playerObj" :moduleId="moduleId"   @playedObj="playedObj" :question="question"></filling>
        <allFilling     v-else-if="question.qtype==4"  :playerObj="playerObj" :moduleId="moduleId"  @playedObj="playedObj" :question="question"></allFilling>
        <reading        v-else-if="question.qtype==5"  :playerObj="playerObj" :moduleId="moduleId"  @playedObj="playedObj" :question="question"></reading>
        <shortanswer    v-else-if="question.qtype==6"  :playerObj="playerObj" :moduleId="moduleId" @playedObj="playedObj" :question="question"></shortanswer>
        <imitation      v-else-if="question.qtype==7"  :playerObj="playerObj" :moduleId="moduleId" @playedObj="playedObj" :question="question"></imitation>
        <judge          v-else-if="question.qtype==8"  :playerObj="playerObj" :moduleId="moduleId" @playedObj="playedObj" :question="question"></judge>
        </div>
	</div>
</template>

<script>
    import fetch from "../fetch"	// 接口
	 // 试卷
    import singleChoice from '../components/question/singleChoice.vue'       // 1单选题
    import multipleChoice from '../components/question/multipleChoice.vue'   // 2多选题
    import filling from '../components/question/filling.vue'                 // 3填空题
    import allFilling from '../components/question/allFilling.vue'           // 4完形填空
    import reading from '../components/question/reading.vue'                 // 5阅读理解
    import shortanswer from '../components/question/shortanswer.vue'         // 6简答题
    import imitation from '../components/question/imitation.vue'             // 7模仿朗读or简答题
    import judge from '../components/question/judge.vue'                     // 8判断题
	import {mapGetters, mapActions} from 'vuex'

	export default {
		 components:{
            singleChoice,
            multipleChoice,
            filling,
            judge,
            allFilling,
            reading,
            shortanswer,
            imitation,
        },
		data () {
			return {
				moduleId:'',
				question:{},
				playerObj:0
			}
		},
	    created () {
	       	this.$nextTick(() => {
	       		this.getData();
	       		this.setCrumb('查看详情');
	       	})
	    },
		methods:{
        	...mapActions([
        		'setCrumb'
        	]),
           getData(){
        		let params = this.$route.query;
        		this.moduleId=params.moduleId;
				// 获取题目信息
				fetch.getSingleWork(params).then(res =>{
					if(!res){
						return false;
					}
					let question = res.data[0];
					let flag=question.stem.match(/^\d{1,9}/);
					if(!flag){
						for(let i=0,lenq=question.children.length;i<lenq;i++){
						question.children[i].stem=(i+1)+"."+question.children[i].stem;
					    }
					}					
					this.question=this.setRefAnswer(question);
				},err =>{
					console.log(err);
				});
        	},
    	    setRefAnswer:function(question) {//选择题选项匹配
    	   	    var answerIdArr ="";
	            var options = "";
	            var result=[],arr = [];
    	   	    if(question.ref_info.answers!=""){
	    	   	    answerIdArr = question.ref_info.answers;
		            options = question.options;
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
		            return question;
    	   	    }else{//chil
    	   	    	for(let k=0,cLen=question.children.length;k<cLen;k++){
    	   	    		let cquestion=question.children[k];
    	   	    		answerIdArr=cquestion.ref_info.answers;
    	   	    		options=cquestion.options;
    	   	    		arr=[];
    	   	    		// 选择题答案解析
			            if(cquestion.qtype==1){
			                for (let i = 0; i < answerIdArr.length; i++) {
			                    for (let j = 0; j < options.length; j++) {
			                        options[j].is_answer = false;
			                        if (options[j].id == answerIdArr[i]) {
			                            options[j].index = j;
			                            options[j].is_answer = true;
			                            arr.push(options[j]);
			                            break;
			                        }
			                    }
			                }
			                if(arr !=''){
			                	cquestion.ref_info.answers=arr;
			                }
			            }
    	   	    	}    	   	    	
    	   	    	return question;
    	   	    }
            },
        	playedObj(playerObj){
                this.playerObj = playerObj
            }
	}
}
</script>
