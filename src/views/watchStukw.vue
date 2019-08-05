<template>
    <div class="watchStukw">
      <div class="title">{{exampaperData.resourceName}}</div>
        <div>
            <watchStuHead :useInfo="useInfo" :userScore="userScore" :userRank="userRank"></watchStuHead>
        </div>
        <div class="watchStuCon">
            <div class="watchStuConT">
                <p class="stuConT-l fl">要求{{readText}}{{readTimes}}次；该题分值：{{exampaperData.workScore}}分。(实际{{readText}}{{exampaperData.submitCount}}次)</p>
                <div class="fr" v-if="false">
                    <!-- <div class="button play_button but-size" v-if='isShow' @click="IsShow">播放全部音频</div> -->
<!--                    {{allId}}   123  -->
                    <div class="fl" style="margin-right: 10px;">播放全部音频</div><div class="fl">
                        <theAudio :src="null" :allUrl="allUrl" :id="0" :playerObj="playerObj" @playedObj="playedObj"></theAudio>
                    </div>
                </div>
            </div>
            <div>
                <ul class="stuSubject">
                    <li class="stuSubCon" v-for="(sub,$index) in exampaperData.workAnswers">
                        <p class="stuSubM">{{matchCont(sub.answers[0].word)}}</p>
                        <div class="stuSubConFoot clearfix">
                            <div class="subConFoot-l fl">
                                <theAudio style="display: inline-block;" :src="sub.answers[0].audioUrl" :id="sub.versionId" :playerObj="playerObj" @playedObj="playedObj"></theAudio>
                            </div>
                            <div class="subConFoot-r fr">
                                <span class="subConSocre">{{sub.score}}</span>
                                <span>分</span>
                            </div>
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
    import theAudio from './../components/player/audio.vue'
    import watchStuHead from "./../components/watchStuHead/watchStuHead"
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
                this.setCrumb('句子跟读');
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
            IsShow(){
                this.isShow=!this.isShow;
            },
            playedObj(playerObj){
                this.playerObj = playerObj
            },
            toFetchDoWork(){
              this.userScore=this.$route.query.actualScore
              this.userRank=this.$route.query.index;
              fetch.getTeacherQuerstion({doWorkId:this.$route.query.doWorkId}).then(res =>{
                  if(!res){
                    return false;
                  }
                  this.exampaperData = res.data;
                  let userId= res.data.userId;
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
              })
            },
            getInfo(){
                fetch.getInfo({userId:this.$route.query.userId}).then(res=>{
                    if(!res){
                        return false;
                    }
                    this.useInfo=res.data;
                })
            },
            getAllUrl(){
                for(let item of this.exampaperData.workAnswers) {
                    this.allUrl.push(item.versionId)
                }
            },
            matchCont(val){
                return val.replace(/\{/g,'').replace(/\}/g,'');
            },
        }

}
</script>
