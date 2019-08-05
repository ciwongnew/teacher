<template>
    <div class="rankError">
      <ul class="rankErrorBox" v-for="(items,index) in paperData">
         <li class="rankErrorTwo clearfix">
             <p class="rankErrorTit fl" :title="items.content">{{index+1}}.{{items.content}}</p>
             <div class="fr">
                   <div class="progress">
                     <span class="progressChild bgGreen" :style="{width:(items.avgScore/100)*100+'%'}"></span>
                   </div>
                   <div>
                     <span class="errorNum">平均分: <i :class="{green:items.avgScore>=0}">{{items.avgScore>=0?toMathThree(items.avgScore):"--"}}</i> 分</span>
                     <!-- <span class="errorNum" v-else>--</span> -->
                   </div>
              </div> 
           </li>
      </ul>
    </div>
</template>
<script>
    import fetch from './../../fetch'
    import {mapGetters, mapActions} from 'vuex'
    export default{
        data(){
            return {
              paperData:[],
              progressW:30
            }
        },
        props:[
         "workData",
         "answerData",
         "checkedResource"
        ],
        watch:{
         workData(val){
          this.mergeAnswer();
         }
        },
        created(){
          this.$nextTick(() => {
            this.mergeAnswer();
          })
        },
        methods:{
          mergeAnswer(){
            let checkedWorkData=new Array();
            let checkStr=this.checkedResource;
            if(checkStr==""){
              checkedWorkData=this.workData;
            }else{
              let strArr = new Array();
              strArr=checkStr.split(',');
              for(let j=0,len=this.workData.length;j<len;j++){
                 let sigleData=this.workData[j];
                 for(let k=0,lenK=strArr.length;k<lenK;k++){
                    let checkWord=strArr[k];
                    if(sigleData.versionId==checkWord*1){
                      checkedWorkData.push(sigleData);
                    }
                 }
              }
            }
            let workData= [];
            for(let i=0,len=checkedWorkData.length;i<len;i++){
              let item=checkedWorkData[i];
              for(let j=0,lenJ=this.answerData.statistics.length;j<lenJ;j++){
                let itemAnswer=this.answerData.statistics[j];
                if(itemAnswer.versionId==item.versionId){
                  Object.assign(item, itemAnswer);
                }
              }
              workData.push(item);
            }
            this.paperData = workData
          },
          //转换成两位小数
          toMathThree(num){
            let str=str=parseFloat(parseFloat(num).toFixed(2));
            return str;
          },
        }
    }
</script>