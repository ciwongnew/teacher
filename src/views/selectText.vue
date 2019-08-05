<template>
        <div>
            <selectText @submitSentence="submitSentence" :checked="selecteSentencedArr" :resourceName="resourceName"></selectText>
        </div>
</template>
<script>
    import selectText from "./../components/selectText/selectText.vue"
    import {mapGetters, mapActions} from 'vuex'
    import {formatDataToMinutes} from './../filter'


    export default{
        data(){
            return{
                selecteSentencedArr:[] ,    //
                worksData: [],
                index: 0,
                versionId:"",
                resourceName:"",
                serviceId:"",
                packageId:"",
                parentVersionId:"",
                cId:""
            }
        },
        components:{
            selectText
        },
        created () {
            this.$nextTick(() => {
                this.setCrumb('筛选段落');
                this.getHomeWork();
            })
        },
        methods:{
            ...mapGetters([
                'getWorks',
                'getSubject'
            ]),
            ...mapActions([
                'setWorks',
                'setCrumb',
                'setSuject'
            ]),
            getHomeWork(){
                let params = this.$route.query;
                this.serviceId = params.serviceId;
                this.packageId = params.packageId;
                this.versionId = params.versionId;
                // this.cId = this.getWorks().contents[0].cId;
                this.parentVersionId = params.parentVersionId;
                this.resourceName = params.resourceName;
                this.timesId = params.timesId
//                this.worksData = this.getWorks().contents;
//                //遍历
//                //get (item, index)
//                this.worksData.forEach((item,index)=> {
//                    if(item.versionId==this.versionId){
//                        this.index = index;
//                    }
//                })
            },
            submitSentence(arr,count,allCount,num,indexArr){
//
              let _this = this;

              let contents = this.getWorks().contents;
              if(contents && count && allCount){
                contents.map((item, index) => {
                  if (item.moduleId == this.$route.query.moduleId && item.versionId == _this.versionId && item.parentVersionId == _this.parentVersionId) {
                    item.count = count;
                    item.sentenceCount = allCount
                    item.refLong = formatDataToMinutes(allCount * 15 * this.timesId);
                    item.checkedResource = arr.join(',');
                    item.workScore = 100;
                    item.indexArr = indexArr
                  }
                })
              }
              if (count === 0) {
                contents.map((item, index) => {
                  if (item.moduleId == this.$route.query.moduleId && item.versionId == _this.versionId && item.parentVersionId == _this.parentVersionId) {
                    item.count = num;
                    item.sentenceCount = allCount
                    item.refLong = formatDataToMinutes(num * 15 * this.timesId);
                    item.checkedResource = arr.join(',');
                    item.workScore = 100;
                    item.indexArr = indexArr
                  }
                })
              }
            //   debugger
              this.setWorks({contents: []});
              this.setWorks({contents:contents});
              this.$router.push({path:"publishHomeWork",query: {serviceId:this.serviceId,packageId: this.packageId,cId:contents[0].cId,isFirst:0}});
            }
        }
    }
</script>
