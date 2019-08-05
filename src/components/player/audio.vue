<template>
<section class="inline-block">
    <div class="button" :class="myIsPlay?'play':'pause'" @click="player" :id="id">

        <audio :src="src" preload="auto"></audio>
    </div>
    <!-- {{id}} /{{playerObj}} -->
</section>
</template>

<script>
    // 音频组件
    export default {
        data(){
            return {
                myIsPlay: false,
                toParentIsPlay:false,
                audio: null,
                index: 0,
                stopPlayAll: false
            }
        },
        props:[
            'playerObj',
            'src',
            'id',
            'allUrl'
        ],
        watch:{
            playerObj(newVal, oldVal){
                if(newVal == oldVal || !this.audio) {
                    return false;
                }
              
                if(!newVal.id && newVal.id == this.id) {
                    if(this.playerObj.isPlay){
                        this.myIsPlay = true;

                        this.index = 0;
                        this.allPlay();
                    } else {
                        this.myIsPlay = false;
                        this.stopPlayAll = true;
                    }
                    return false;
                }

                if(newVal.id == this.id && this.playerObj.isPlay){ 
                    this.myIsPlay = true;
                    
                    this.stopPlayAll = true;
                    this.allPause()
                    this.audio.play();
                    this.playEnd();
                }else{
                    this.audio.pause()
                    this.myIsPlay = false;
                }
            }
        },
        methods:{
            player(event){
                this.audio = event.target.querySelector('audio');
                this.$emit('playedObj', {id: this.id, isPlay: !this.myIsPlay})
            },
            playEnd(cb){
                let _this = this;
                this.audio.addEventListener('ended', function(){
                    _this.myIsPlay = false;
                    if(cb){cb()}
                })
            },
            allPause(){
                 let audios = document.querySelectorAll('audio');
                 for(let item of audios){
                    item.pause();
                 }
            },
            allPlay(){
                let that = this;
                let urls = this.allUrl;
                // let len = urls.length;
               
                console.log(this.index)
                if(that.stopPlayAll){
                    console.log(0,0)
                    return false;
                }
                
                // this.audio.src = urls[this.index];
                // that.audio.load();
                // this.audio.addEventListener('loadedmetadata', function(){
                //     that.audio.play();
                //     that.playEnd(function(){
                //         that.index++;
                //         if(that.index >= len){
                //             return false;
                //         }
                //         that.allPlay()
                //     });
                //     console.log('current source num', this.index)

                // })

                /*****************************************/

                let audios = document.querySelectorAll('audio');
                let len = audios.length;
                
                this.loopPlay();
                
            },
            loopPlay(){
                let that = this;
                let len = this.allUrl.length;
                let audio = document.getElementById(this.allUrl[this.index]).children[0];
                // if(this.stopPlayAll) {
                //     console.log(11111111111)
                //     return false;
                // }
                audio.play();
                audio.addEventListener('ended', function(){
                    that.index++;
                    if(that.index >= len || that.stopPlayAll){
                        return false;
                    }
                    console.log('current source num', that.index)

                    that.loopPlay()                  
                })
            },
            play(){
                this.myIsPlay = true;
                this.audio.play();
                this.playEnd();
            }
        }
    }
</script>