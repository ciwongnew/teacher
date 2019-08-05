<template>
    <div class="m-t10">
        <div v-for="data in attachments">
            <div v-if="data.file_url" :class="">
                <div class="img-box m-t20" v-if="data.file_type == 1">
                    <img :src="data.file_url" alt="" />
                </div>
                <div class="m-t20" v-else-if="data.file_type == 2">
                    <theAudio :src="data.file_url" :id="id" :playerObj="playerObj" @playedObj="playedObj"></theAudio>
                </div>
                <div class="video m-t20 center" v-else-if="data.file_type == 3">
                    <video :src="data.file_url" controls="controls" preload="auto" v-if="data.file_url.indexOf('letv://')"></video>
                    <embed v-else src="http://yuntv.letv.com/bcloud.swf" allowFullScreen="true" quality="high"  width="300" height="150" align="middle" allowScriptAccess="always" :flashvars="videoSrc(data.file_url)" type="application/x-shockwave-flash"></embed>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // 附件
    import theAudio from '../player/audio.vue'  // 音频组件
    export default {
        data(){
            return {
               letvFile:1 
            }
        },
        props:[
            'attachments',
            'playerObj',
            'id'
        ],
        components:{
            theAudio
        },
        watch:{

        },
        created(){
            this.$nextTick(function(){
                // this.handleUrl();
            })
        },
        mounted(){  // 同v1.*的ready

        },
        computed:{
            
        },
        methods:{
            handleUrl(data){
              let flagLetv = data.indexOf('letv://')
              if(flagLetv){
                this.letvFile = 0
              }else{
                return data
              }
            },
            playedObj(playerObj){
                this.$emit('playedObj', playerObj)
            },
            videoSrc:function(item){
              let src = item.substr(7);
              return 'pu=B6999F08EC&uu=2bfc338ed7&vu='+src+'&auto_play=1&width=656&height=504'
            },
        }
    }
</script>