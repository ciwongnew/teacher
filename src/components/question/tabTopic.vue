<template>
	<div class="tab_Topic">
	    <ul class="clearfix tabBt">
		      <li @click='topicAct(1)' :class="{topic_Active:topicActive==1}">参考答案</li>
	        <li @click='topicAct(2)' :class="{topic_Active:topicActive==2}" v-show="knowledgePoints.length>0">考点</li>
	        <li @click='topicAct(3)' :class="{topic_Active:topicActive==3}" v-show="explains[0]">讲解</li>
	        <!-- <li @click='topicAct(4)' :class="{topic_Active:topicActive==4}" v-show="tags">标签</li> -->
	    </ul>
  	   <div v-if="topicActive==1" class="Topic_bg">
  	   	  <span v-if="qtype==1" v-for="(val,answerindex) in infoAnswer">{{val.index | fromCharCode}}</span>
  	   	  <span v-if="qtype==2" v-html="setRefAnswer(infoAnswer.options,infoAnswer.ref_info )"></span>
  	   	  <p v-if="qtype==3" v-for="(val,stemIndex) in infoAnswer">
  	   	  <span v-html="val.stem"></span></p>
  	   	  <p v-if="qtype==8">{{setAnswers(infoAnswer)}}</p>
  	   	  <p v-if="qtype==6" v-html="infoAnswer"></p>
  	   </div>
       <div class="Topic_bg" v-if="topicActive==2" v-for="(item,index) in knowledgePoints">
       	<span>{{item.point_displayname}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
       </div>
       <div class="Topic_bg" v-if="topicActive==3&&explains">
         	<div class="clearfix m-b20" v-html="explains[0].context"></div>
         	<div class="m-b20" v-if="explains[0].attachments.length>0" v-for='(item,index) in explains[0].attachments'>
         		<div  v-if="item.file_type==2" class="button" :class="myIsPlay?'play':'pause'" @click="player">
         	   <audio :src="item.file_url" preload="auto"></audio>
         		</div>
            <div class="coverUrl" v-if="item.file_type==3 && videoP" @click="videoPlayer">
                <img :src="item.cover_Url" class="coverVodio">
                <img src="./../../assets/img/player.png" class="coverUrlPlay">
            </div>
         	  <embed v-show="item.file_type==3 && !videoP" src="http://yuntv.letv.com/bcloud.swf" pic="item.cover_Url" allowFullScreen="true" quality="high"  width="300" height="150" align="middle" allowScriptAccess="always" :flashvars="videoSrc(item.file_url)" type="application/x-shockwave-flash"></embed>
            <!-- <videoletv v-if="item.file_type==3" :pic="item.cover_Url" :videoVu="item.file_url"></videoletv> -->
         	</div>
       	  <span v-if='explains[0].lecturer!=null'>{{explains[0].lecturer}}&nbsp;&nbsp;&nbsp;&nbsp;{{explains[0].tags}}</span>
       </div>
       <!-- <div class="Topic_bg" v-if="topicActive==4">
       	<span  v-for="(item,index) in tags">{{item}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
       </div> -->
	</div>
</template>
<script>
  import videoletv from '../player/video.vue'
	export default{
		data(){
			return{
        topicActive:'1',
        videoP:true,
        myIsPlay:false,
        audio:null
			}
		},
		props:[
      'infoAnswer',
      'knowledgePoints',
      'explains',
      'tags',
      'qtype'
		],
    components:{
     videoletv
    },
		methods:{
			topicAct:function(index){
        this.topicActive = index;
			},
			videoSrc:function(item){
				let src = item.substr(7);
        // return 'http://yuntv.letv.com/bcloud.html?uu=2bfc338ed7&vu='+ src +'&width=300&height=150&&pu=B6999F08EC'
        return 'pu=B6999F08EC&uu=2bfc338ed7&vu='+src+'&auto_play=1&width=656&height=504'
			},
			setAnswers(answers){
			   return  answers.indexOf('1')?'错误':'正确';
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
			player:function(){
			  this.audio = document.querySelector('audio');
			  this.audio.play();
        this.myIsPlay = true;
        let _this = this;
        this.audio.addEventListener('ended',function(){
        	_this.myIsPlay = false;
        })
			},
			videoPlayer:function(){
				this.videoP = false;
			}
		}
	}
</script>
	