<template>
	<div class="tab_Topic">
		<ul class="clearfix tabBt">
			<li  :class="{topic_Active:topicActive==1}" @click="tabListen(1)">参考答案</li>
			<li  :class="{topic_Active:topicActive==2}" @click="tabListen(2)" v-if="listenTextModule&&listenTextModule.length>0&&listenTextModule[0].questionStem">听力原文</li>
		</ul>
		<div class="Topic_bg">
			<div v-if="topicActive==1" >
			  <span v-if="qtype==1" v-for="(val,answerindex) in infoAnswer">{{val.index | fromCharCode}}</span>
			  <p v-if="qtype==2" v-html="setRefAnswer(question.options,question.ref_info )"></p>
			  <p v-if="qtype==3" v-for="(val,stemIndex) in infoAnswer">
			  <span v-html="val.stem"></span></p>
			  <p v-if="qtype==6" v-html="infoAnswer.solving_idea"></p>
			  <p v-if="qtype==7" v-html="infoAnswer"></p>
			</div>
			<p v-if="topicActive==2&&listenTextModule" v-html="listenTextModule[0].questionStem"></p>
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return{
        topicActive:'1'
			}
		},
		props:[
      'infoAnswer',
      'listenTextModule',
      'qtype'
		],
		methods:{
			tabListen:function(index){
        this.topicActive = index;
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
      }
		}
	}
</script>
