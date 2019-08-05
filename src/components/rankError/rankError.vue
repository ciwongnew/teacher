<template>
    <div>
       <rankErrorRead :workData="exampaperData" :checkedResource="checkedResource" :answerData="useAnswer" v-if="readShow=='ReadShow'"></rankErrorRead>
       <rankErrorText :workData="exampaperData" :checkedResource="checkedResource" :answerData="useAnswer" v-if="readShow=='TextShow'"></rankErrorText>
       <rankErrorOnline :workData="exampaperData" :checkedResource="checkedResource" :answerData="useAnswer" :moduleId="moduleId" v-if="readShow=='OnlineShow'"></rankErrorOnline>
    </div>
</template>
<script>
    import fetch from './../../fetch'
    import {mapGetters, mapActions} from 'vuex'
    import rankErrorOnline from "./rankErrorOnline"
    import rankErrorRead from "./rankErrorRead"
    import rankErrorText from "./rankErrorText"
    export default{
        data(){
            return {
              readShow:""
            }
        },
        components:{
          rankErrorOnline,
          rankErrorRead,
          rankErrorText
        },
        props:[
         "exampaperData",
         "paperType",
         "useAnswer",
         "moduleId",
         "checkedResource"
        ],
        watch:{
          //监听文件类型 
          paperType(val){
            this.isReadShow();
          }   
        },
        created(){
          this.$nextTick(() => {
            this.isReadShow();
          })
        },
        methods:{
          //格式化题干 qtype==3
          isReadShow(){  
            if(this.paperType=="a7527f97-14e6-44ef-bf73-3039033f128e"){
              this.readShow="ReadShow";
            }else if(this.paperType=="992a5055-e9d0-453f-ab40-666b4d7030bb"){
              this.readShow="TextShow";
            }else{
               this.readShow="OnlineShow";
            }
          }
        }
    }
</script>