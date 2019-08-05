<template>
	<div>
    <!-- <button @click="videoPlay">点击播放</button> -->
		<div :id="videoId">
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		data(){
			return {
				videoId:'video_'+(+new Date()),
        letvPlayer:null
			}
		},
		props:[
      'pic',
      'videoVu'
		],
		created(){
			this.$nextTick(function(){
				this.loadJsLeVideo();
			})
		},
		methods:{
      videoPlay(){
        this.letvPlayer.sdk.replayVideo();
      },
			// 载入乐视视频
      loadJsLeVideo:function(){
        if(typeof CloudVodPlayer == 'function'){
            let letvPlayer = new CloudVodPlayer();
            letvPlayer.init({"loadingpic":"./../../assets/img/loadingOnline.gif","vu": this.videoVu.substr(7),"bgcolor": this.pic,"pu": "B6999F08EC","uu": "2bfc338ed7","posterType": 2,"gpcflag": 1, "skinnable":0,"width": "300","height": "150","lang": "zh_CN","callbackJs":function(e){
              console.log(1111,e);
            }},this.videoId);
            // setTimeout(function(){
            // 	// console.log(1)
            // 	// debugger
            // 	letvPlayer.sdk.pauseVideo()
            // },6000)
            this.letvPlayer = letvPlayer;
        }else{
        	// 没有乐视类就加载乐视js
        	this.loadLetvJS();
        }
      },
      // 载入乐视js
      loadLetvJS(callback){
      	let _this = this;
          let script = document.createElement('script');
          script.src = location.protocol+'//yuntv.letv.com/player/vod/bcloud.js';
          script.onload = function(){
          	_this.loadJsLeVideo();
          	if(callback) callback();
          }
          document.body.appendChild(script)

      }
		},
	}
</script>