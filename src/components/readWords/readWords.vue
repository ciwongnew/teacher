<template>
    <div class="words clear">
        <div>
            <h4 class="selectWords-title">{{resourceName}}</h4>
            <div class="tools" v-if="selectFlag">
                <div class="checkKuang fl"
                :class="{checked:isAllChecked,chooseSome:selectTextArr.length !=0 && selectTextArr.length < followreadText.length}"
                @click="allCheck" ></div>
                <span>全选</span>
            </div>
            <div class="main clear">
                <div class="wordsContent"
                      v-for="(item,index) in followreadText"
                      :class="{'active':item.isChecked}"
                      @click.stop="checkFun(item,index)">
                    <div class="singleChoice"
                         v-if="index%4 == 0&&selectFlag"
                         @click.stop="singleChoice(index,'1')"
                         :class="{checked:singleChoiceArr[Math.ceil(index/4)] === 2,chooseSome:singleChoiceArr[Math.ceil(index/4)] === 1}"></div>
                    <p class="title" :title="item.content">{{item.content}}</p>
                    <!-- <div class="choose" v-if="selectFlag">
                       <button class="button choice" :class="{checked:item.isChecked}"
                                    @click="checkFun(item,index)">
                            <span>{{item.buttonText}}</span>
                        </button>
                    </div> -->
                </div>
            </div>
        </div>

        <div class="bottomMenu clearfix">
            <div class="bottomMenuBox clearfix">
                <div class="fl" style="padding-left: 20px;" v-if="selectTextArr.length != 0">共选
                  <span style="padding: 0 5px;">{{selectTextArr.length || 0}}</span>
                  个单词, 预计<span style="padding: 0 5px;">{{doworkTime | formatDataToMinute}}</span>分钟</div>
                <div class="fr">
                    <!-- <button class="button cancel fl" @click="back" v-if="selectFlag">取消</button> -->
                    <span class="cancel fl" @click="back" v-if="selectFlag">取消</span>
                    <button class="button confirm" @click="backSentenceArr">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import fetch from './../../fetch'
    import {mapGetters, mapActions} from 'vuex'
    import  {formatDataToMinute} from './../../filter'

    export default {

        data() {
            return {
                parentVersionId: '',
                resourceName: '',
                isChecked: true,
                selectTextArr: [],    //versionId集合
                followreadText: [],
                versionId: "",
                packageId:'',
                cId:'',
                serviceId:'',
                singleChoiceArr:[],   // 0未选 1选择部分 2全部选择
                isAllChecked:true,
                checkedResource: '',
                doworkTime: 0,
                selectFlag: 1
            }
        },
        created () {
          this.getText();
          this.$nextTick(() => {
            this.setCrumb('选择单词');
          })
        },
        methods: {
            ...mapActions([
                'setCrumb'
            ]),
            ...mapGetters([
                'getWorks'
            ]),
            getText(){
                let that = this;
                let query = this.$route.query;
                this.parentVersionId = query.parentVersionId;
                this.versionId = query.versionId;
                this.resourceName = query.resourceName;
                this.packageId = query.packageId;
                this.serviceId = query.serviceId;
                this.cId = query.cId;
                this.checkedResource = query.checkedResource;

                //预览
                if(!query.selectFlag){
                  this.selectFlag = 0
                }
                let wordData = {
                    parentVersionId: query.parentVersionId,
                    versionId: this.versionId,
                    moduleId: 10,
                    checkedResource: this.checkedResource,
                    resourceType: query.resourceType
                }
                fetch.filterListen(wordData).then(res => {
                    if (!res) {
                        return
                    }
                  //获取到数据之后，根据用户已选择的数据初始化，并初始化选择框
                  if(!res) {
                    return;
                  }
                  this.followreadText = res.data;

                  for(var i = 0,len = Math.ceil((this.followreadText.length)/4);i<len;i++){

                      this.singleChoiceArr.push(2);
                      this.singleChoice(i,'2');
                  }


                  this.initData();
                  let arr = this.singleChoiceArr;
                  var fourFlag = 0
                  var fourArr = []
                  var endNum = this.followreadText.length % 4
                  console.log(this.followreadText);
                  for(var j = 0,len = this.followreadText.length;j<len;j++){
                      let item = this.followreadText[j];
                      fourFlag++
                      if(item.isChecked){
                        //为真的时候添加进去
                        fourArr.push(item.isChecked)
                      }
                      if(fourFlag === 4 || (j === len - 1 && fourFlag === endNum)){
                        fourFlag = 0
                        if(fourArr.length === 0){
                          arr[Math.ceil((j+1)/4)-1] = 0;
                        }else if(fourArr.length === 4 || fourArr.length === endNum){
                          arr[Math.ceil((j+1)/4)-1] = 2;
                        }else{
                          arr[Math.ceil((j+1)/4)-1] = 1;
                        }
                        fourArr= []
                      }
                  
                    }
                    this.singleChoiceArr = arr;
                    this.singleChoiceArr.forEach(function(item,index){
                        if(item === 0 || item === 1){
                            that.isAllChecked = false;
                        }
                    })
                })
            },
            initData(){
                const contents = this.getWorks().contents;
                for(var i = 0,len = contents.length;i<len;i++){
                    if(contents[i].moduleId == this.$route.query.moduleId && this.parentVersionId == contents[i].parentVersionId && contents[i].versionId == this.versionId){
                        this.checkedResource = contents[i].checkedResource;
                    }
                }
                this.selectTextArr = [];
                for (var i = 0, len = this.followreadText.length; i < len; i++) {
                    var item = this.followreadText[i];
                    const versionId = item.versionId
                    item.buttonText = "选择单词";
                    item.isChecked = false;
                    if(this.checkedResource.length == 0 || this.checkedResource.indexOf(versionId)>-1){
                        this.selectTextArr.push(versionId);
                        item.isChecked = true;
                        item.buttonText = "取消选择";
                    }
                }
                this.doworkTime = this.selectTextArr.length * 10 || this.followreadText.length * 10   // 等于0的时候就是全选
            },
            //单选事件
            checkFun(item, index){
              if(this.selectFlag === 0) return
                let flag = true;
                let singleFlag = 0;
                let num = Math.ceil((index+1)/4)-1;
                item.isChecked = !item.isChecked;
                let startNum = 4*num;
                let maxLength = '';
                if(index+3>this.followreadText.length-1){
                    maxLength = this.followreadText.length-1;
                }else{
                    maxLength = startNum+3;
                }
                for(var i = startNum,len = maxLength;i<=len;i++){
                    let item = this.followreadText[i];
                    if(!item.isChecked){
                        singleFlag++
                    }
                }
                if(singleFlag === (maxLength - startNum + 1)){
                  this.singleChoiceArr[num] = 0
                }else if(singleFlag === 0){
                  this.singleChoiceArr[num] = 2
                }else{
                  this.singleChoiceArr[num] = 1
                }
                this.singleChoiceArr.forEach(function(item1){
                    if(item1 === 0 || item1 === 1){
                        flag = false;
                    }
                })
                this.isAllChecked = flag?true:false;
                this.followreadText[index] = item;
                this.selectTextArr = [];
                for (var i = 0, len = this.followreadText.length; i < len; i++) {
                    var item = this.followreadText[i];
                    if(item.isChecked){
                        item.buttonText = "取消选择"
                        this.selectTextArr.push(item.versionId);
                    }else if(!item.isChecked){
                        item.buttonText = "选择单词";
                    }
                }
              this.doworkTime = this.selectTextArr.length * 10 || this.followreadText.length * 10   // 等于0的时候就是全选
            },
            back(){
                if(this.selectFlag){
                   this.$router.push({path:"publishHomeWork",query: {serviceId:this.serviceId,packageId: this.packageId,cId:this.cId,isFirst: 0}});
                } else {
                   this.$router.back(-1);
                }

            },
            backSentenceArr(){
                if(this.selectFlag){
                    this.selectTextArr = [];
                    for (var i = 0, len = this.followreadText.length; i < len; i++) {
                        var item = this.followreadText[i];
                        if(item.isChecked) {
                            this.selectTextArr.push(item.versionId)
                        } else {
                            this.isChecked = false;
                        }
                    }

                    let count = this.selectTextArr.length;
                    if(this.isChecked){
                        this.selectTextArr = [];
                    }
                    this.$emit('submitSentence', this.selectTextArr,count,this.followreadText.length)
                } else {
                     this.$router.back(-1);
                }
            },
            //三选事件
            singleChoice(index,type){
                if(type == '1'){
                    //对应的index,3的倍数传进来的
                    index = index;
                    let arr = this.singleChoiceArr;
                    let flag = true;
                    arr[index / 4] = arr[index / 4] === 2 ? 0 : 2
                    this.singleChoiceArr = arr;
                    this.singleChoiceArr.forEach(function(item){
                        if(item === 0 || item === 1){
                            flag = false;
                        }
                    })
                    this.isAllChecked = flag?true:false;
                }else if(type == '2'){
                    index = index*4;
                }
                let maxLength = '';
                if(index+3>this.followreadText.length-1){
                    maxLength = this.followreadText.length-1;
                }else{
                    maxLength = index+3;
                }
                for(var j = index,len1 = maxLength;j<=len1;j++){
                    let obj = this.followreadText[j];
                    obj.isChecked = this.singleChoiceArr[index / 4] === 2 ? true : false;
                    obj.singleChecked = this.singleChoiceArr[index / 4] === 2 ? true : false;
                    this.followreadText[j] = obj;
                    this.selectTextArr = [];
                    for (var i = 0, len = this.followreadText.length; i < len; i++) {
                        var item = this.followreadText[i];
                        if(item.isChecked){
                            item.buttonText = "取消选择"
                            this.selectTextArr.push(item.versionId);
                        }else if(!item.isChecked){
                            item.buttonText = "选择单词";
                        }
                    }
                }
                this.doworkTime = this.selectTextArr.length * 10 || this.followreadText.length * 10
            },
            //全选事件
            allCheck(){
                let that = this;
                this.isAllChecked = !this.isAllChecked;
                this.singleChoiceArr.forEach(function(item,index){
                    that.singleChoiceArr[index] = that.isAllChecked ? 2 : 0;
                    that.singleChoice(index,'2');
                })
            }
        }
    }

</script>
