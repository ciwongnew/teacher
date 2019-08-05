<template>
        <div>
            <readWords @submitSentence="submitSentence" :checked="selecteSentencedArr"></readWords>
        </div>
</template>
<script>
    import readWords from "./../components/readWords/readWords.vue"
    import {mapGetters, mapActions} from 'vuex'
    import {formatDataToMinutes} from './../filter'

    export default{
        data(){
            return{
                selecteSentencedArr:[] ,    //
                worksData: [],
                index: 0,
                parentVersionId:"",
                versionId:'',
                resourceName:"",
                serviceId:"",
                packageId:"",
                versionId:"",
                cId:""
            }
        },
        components:{
            readWords
        },
        created () {
            this.$nextTick(() => {
                this.getHomeWork();
            })

        },
        methods:{
            ...mapGetters([
                'getWorks',
                'getSubject',
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
                this.parentVersionId = params.parentVersionId;
                this.cId = params.cId;
                this.resourceName = params.resourceName;
                this.timesId = params.timesId
//                 this.worksData = this.getWorks().contents;
//                 //遍历
//                 //get (item, index)
//                 this.worksData.forEach((item,index)=> {
//                     if(item.parentVersionId==this.parentVersionId && item.versionId==this.versionId){
//                         this.index = index;
// //                        this.selecteSentencedArr = item.checkedResource.split(',');
//                     }
//                 })
            },
            submitSentence(arr,count,num){
                let _this = this;
                let contents = this.getWorks().contents;

                if(contents && count){
                    contents.map((item, index) => {
                        if (item.versionId == _this.versionId && item.parentVersionId == _this.parentVersionId) {
                            item.count = count;
                            item.refLong = formatDataToMinutes(count * 10 * this.timesId);
                            item.checkedResource = arr.join(',');
                            item.workScore = 100;
                        }
                    })
                }
              if (count === 0) {
                contents.map((item, index) => {
                  if (item.versionId == _this.versionId && item.parentVersionId == _this.parentVersionId) {
                    item.count = num;
                    item.refLong = formatDataToMinutes(num * 10 * this.timesId);
                    item.checkedResource = arr.join(',');
                    item.workScore = 100;
                  }
                })
              }
                //传回选择段落数目
                // let contents = this.getSubject();
                // contents.map((item) =>{
                //     if(item.moduleInfo.moduleId != 30){
                //         item.resourceList.map((content) =>{
                //             if(content.versionId == _this.versionId && content.parentVersionId == _this.parentVersionId) {
                //                 content.count = count;
                //                 content.readTimes = count * 5;
                //             }
                //         })
                //     }
                // })
                // this.setSuject(contents);
                // this.worksData[this.index].checkedResource = arr.join(',');
                // this.worksData[this.index].workScore = 100;
                this.setWorks({contents: []});
                this.setWorks({contents: contents});
                this.$router.push({path:"publishHomeWork",query: {serviceId:this.serviceId,packageId: this.packageId,cId:contents[0].cId,isFirst:0}});
            }
        }
    }
</script>
