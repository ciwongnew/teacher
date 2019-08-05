<template>
    <div class="watchStudc">
        <div class="title">{{exampaperData.resourceName}}</div>
        <div>
            <watchStuHead :useInfo="useInfo" :userScore="userScore" :userRank="userRank"></watchStuHead>
        </div>
        <div class="watchStuCon">
            <div class="watchStuConT">
                <p class="stuConT-l fl">要求{{readText}}{{readTimes}}次；该题分值：{{exampaperData.workScore}}分。(实际{{readText}}{{exampaperData.submitCount}}次)</p>
                <div class="fr" v-if="false">
                    <div class="fl" style="margin-right: 10px;">播放全部音频</div>
                    <div class="fl">
                        <theAudio :src="null" :allUrl="allUrl" :id="0" :playerObj="playerObj" @playedObj="playedObj"></theAudio>
                        <!-- <span class="button" :class="myIsPlay?'play':'pause'" @click="playOrPause">
                            <audio :src="allUrl[0]" :allUrl="allUrl" preload="auto" id='playAll'></audio>
                        </span> -->
                   </div>
            </div>
        </div>
        <div>
            <ul class="stuSubject clearfix">
                <li class="stuSubCon" v-for="(sub,$index) in exampaperData.workAnswers">
                <p class="word">{{sub.answers[0].word}}</p>
                <div class="stuSubConFoot clearfix">
                    <theAudio class="fl" :src="sub.answers[0].audioUrl"  :id="sub.versionId" :playerObj="playerObj" @playedObj="playedObj"></theAudio>
                    <p class="fr"><span class="stuSubConScore">{{sub.score}}</span> <span>分</span></p>
                </div>
            </li>
        </ul>
    </div>
</div>
</div>

</template>
<script type="text/javascript">
    import fetch from './../fetch'
    import {mapGetters, mapActions} from 'vuex'
    import watchStuHead from "./../components/watchStuHead/watchStuHead"
    import theAudio from './../components/player/audio.vue'
    export default{
        data(){
            return {
                myIsPlay:false,
                useInfo:[],
                useScore:[],
                exampaperData:"",
                readTimes:"",
                readText:"",
                playerObj:0,
                index:0,
                userScore:0,
                userRank:0,
                allUrl: []
            };
        },
        components:{
            watchStuHead,
            theAudio
        },
        created(){
            this.$nextTick(() => {
                this.setCrumb('单词跟读');
                this.getInfo();
                this.toFetchDoWork();
            })
        },
        methods:{
            ...mapGetters([
                'getWorks'
            ]),
            ...mapActions([
                'setWorks',
                'setCrumb'
            ]),
            subPlayStatus(val){
                this.myIsPlay = val
                console.log(val)
            },
            playedObj(playerObj){
                this.allPause()
                this.playerObj = playerObj;
            },
            allPause(){
                let audios = document.querySelectorAll('audio');
                for(let item of audios){
                    item.pause();
                }
            },
            toFetchDoWork(){
                this.userScore=this.$route.query.actualScore
                this.userRank=this.$route.query.index;
                fetch.getTeacherQuerstion({doWorkId:this.$route.query.doWorkId}).then(res =>{
                        if(!res){
                            return false;
                        }
                        console.log("danci",res.data)
                        this.exampaperData = res.data;
                        let requirementContent=this.exampaperData.requirementContent;
                        this.readTimes=requirementContent.readtimes;
                        if(requirementContent.speekingtype==1){
                            this.readText="跟读"
                        }else if(requirementContent.speekingtype==2){
                            this.readText="朗读"
                        }else{
                            this.readText="背诵"
                        }
                        this.getAllUrl();

                },err =>{
                    console.log(err);
                });
            },
            getInfo(){
                fetch.getInfo({userId:this.$route.query.userId}).then(res=>{
                    if(!res){
                        return false;
                    }
                    this.useInfo=res.data;
                })
            },
            playOrPause(){
              this.myIsPlay=!this.myIsPlay;
              this.allPlay();
            },
            getAllUrl(){
                for(let item of this.exampaperData.workAnswers) {
                   this.allUrl.push(item.versionId)
                }
            },
            allPlay(){
                let audios=document.getElementById("playAll");
                let that=this;
                audios.src = this.allUrl[that.index];
                audios.load();
                audios.addEventListener('loadedmetadata', function(){
                    audios.play();
                    audios.addEventListener('ended', function(){
                        this.index++;
                        if(this.index >= len){
                            return false;
                        }
                        this.allPlay()
                    })
                    that.index++;
                    console.log('current source num', that.index)
                    that.allPlay();
                })
            }
        }
    }
</script>
