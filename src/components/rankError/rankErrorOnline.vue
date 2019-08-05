<template>
    <div class="rankError">
      <img v-if="webloading" class="loading" :src="loadingImg">
      <ul v-else class="rankErrorBox" v-for="(items,indexF) in paperData">
         <p  class="rankErrorTit" :title="items.module_type_name">{{items.module_type_name}}</p>
         <ul style="margin-bottom: 30px;" >
           <li class="rankErrorTwo clearfix"  v-for="(item,indexChild) in items.children" @click="watchTotal(item)">
             <p class="fl" v-if="!item.stem">{{indexChild+1}}.</p>
             <p class="rankErrorTitP" :class="{fl:item.children.length==0}" :title="delHtmlTag(item.stem)" v-html="delHtmlTag(item.stem)"></p>
             <div  v-if="item.children.length==0">
                <div class="fr" v-if="item.is_objective==0">
                   <div class="progress">
                     <span class="progressChild bgOrange" :style="{width:(item.errorCount/answerData.submitCount)*100+'%'}"></span>
                   </div>
                   <div>
                     <span class="errorNum"><i :class="{orange:item.errorCount>=0}">{{item.errorCount>=0?item.errorCount:"--"}}</i> 人错误</span>
                   </div>
                </div>
                <div class="fr" v-else>
                   <div class="progress">
                     <span class="progressChild bgGreen" :style="{width:(item.avgScore/item.question_ref_sorce)*100+'%'}"></span>
                   </div>
                   <div>
                     <span class="errorNum">平均分: <i :class="{green:item.avgScore>=0}">{{item.avgScore>=0?toMathThree(item.avgScore):"--"}}</i> 分</span>
                   </div>
                </div>
             </div>
             <ul v-else>
               <li class="rankErrorTwo clearfix" v-for="(itemC,indexChildC) in item.children">
                 <p class="fl" v-if="!itemC.stem">{{indexChildC+1}}.</p>
                 <p class="rankErrorTitP fl" :title="delHtmlTag(itemC.stem)" v-html="delHtmlTag(itemC.stem)"></p>
                 <div class="fr" v-if="itemC.is_objective==0">
                   <div class="progress">
                     <span class="progressChild bgOrange" :style="{width:(itemC.errorCount/answerData.submitCount)*100+'%'}"></span>
                   </div>
                   <div>
                      <span class="errorNum"> <i :class="{orange:itemC.errorCount>=0}">{{itemC.errorCount>=0?itemC.errorCount:"--"}}</i> 人错误</span>
                   </div>
                 </div>
                 <div class="fr" v-else>

                   <div class="progress">
                     <span class="progressChild bgGreen" :style="{width:(itemC.avgScore/itemC.question_ref_sorce)*100+'%'}"></span>
                   </div>
                   <div>
                      <span class="errorNum">平均分: <i :class="{green:itemC.avgScore>=0}">{{itemC.avgScore>=0?toMathThree(itemC.avgScore):"--"}}</i> 分</span>
                   </div>
                 </div>
               </li>
             </ul>
           </li>
         </ul>
      </ul>
    </div>
</template>
<script>
    import fetch from './../../fetch'
    import {mapGetters, mapActions} from 'vuex'
    export default{
        data(){
            return {
              bottomShow:true,
              progressW:40,
              paperData:[],
              webloading:true,
              loadingImg: './img/loading.gif'
            }
        },
        props:[
         "workData",
         "answerData",
         "moduleId",
         "checkedResource"
        ],
        watch:{
         workData(val){
          this.mergeOnlineAnswer();
         }
        },
        created(){
           this.$nextTick(() => {
             // this.setCrumb('作业统计');
          })
        },
        methods:{
          //格式化题干 完型填空 qtype==3
          fillFormatHtml(val){
              return val.replace(/{#blank#}(\d*){#\/blank#}/g,'___$1___')
          },
          //过滤html标签
          delHtmlTag(str){
           str= this.fillFormatHtml(str)
           return str.replace(/<[^>]+>/g,"");
          },
          //处理试卷答案
          mergeOnlineAnswer(){
            let checkStr=this.checkedResource;
            let workDataParts = new Array();
            if(checkStr==""){
               workDataParts=this.workData.parts;
            }else{
              let strArr = new Array();
              strArr=checkStr.split(',');
              for(let l=0,lenL=strArr.length;l<lenL;l++){
              let itemL=strArr[l]*1; //筛选作业内容
              workDataParts.push(this.workData.parts[itemL]);
              }
            }
            if(!workDataParts) {
              return false;
            }
            for(let i=0,len=workDataParts.length;i<len;i++){
              let item=workDataParts[i];
              let itemChildren=item.children;
              for(let k=0,lenK=itemChildren.length;k<lenK;k++){
                let itemCC=itemChildren[k];
                if(itemCC.children.length==""){
                   for(let j=0,lenJ=this.answerData.statistics.length;j<lenJ;j++){
                    let itemAnswer=this.answerData.statistics[j];
                    if(itemAnswer.versionId==itemCC.version_id){
                      Object.assign(itemCC, itemAnswer);
                    }
                  }
                }else{
                  let itemCCC=itemCC.children;
                    for(let n=0,lenN=itemCCC.length;n<lenN;n++){
                      let itemCCCS=itemCCC[n];
                       for(let j=0,lenJ=this.answerData.statistics.length;j<lenJ;j++){
                        let itemAnswer=this.answerData.statistics[j];
                        if(itemAnswer.versionId==itemCCCS.version_id){
                          Object.assign(itemCCCS, itemAnswer);
                        }
                      }
                    }
                }
              }
            }
            this.paperData=workDataParts;
            this.webloading=false;
          },
          watchTotal(item){
            let versionid=item.version_id;
            this.$router.push({path:'watchSinglePaper', query: {vid:versionid,moduleId:this.moduleId}});
          },
          watchSigle(item){
            let version_id=item.version_id;
            this.$router.push({path:'watchSinglePaper', query: {vid:version_id,moduleId:this.moduleId}});
          },
          //转换成两位小数
          toMathThree(num){
            let str=str=parseFloat(parseFloat(num).toFixed(2));
            return str;
          },
        }
    }
</script>
