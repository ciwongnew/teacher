 <template>
    <div class="chooseText">
        <div class="Text">
            <div class="selectText">
                <div class="selectText-title">
                    <h4>{{resourceName}}</h4>
                </div>
                <div class="textContent" v-for="(item,index) in followreadText">
                    <p>{{item.text}}</p>
                    <div class="choose" v-if="selectFlag">
                        <button class="button choice" :class="{checked:item.isChecked}"
                                @click="checkFun(item,index)">
                            <span>{{item.buttonText}}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottomMenu clearfix">
            <div class="bottomMenuBox">
              <div class="fl" style="padding-left: 20px;" v-if="selectTextArr.length != 0">共选
                <span style="padding: 0 5px;">{{selectTextArr.length || 0}}</span>
                个段落, 预计<span style="padding: 0 5px;">{{doworkTime | formatDataToMinute}}</span>分钟</div>
                <div class="fr">
                    <span class="cancel fl" @click="back" v-if="selectFlag">取消</span>
                    <button class="button confirm" @click="backSentenceArr">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex'
    import fetch from './../../fetch'
    import  {formatDataToMinute} from './../../filter'

    export default{
        props:['checked',"resourceName"],
        data(){
            return {
                followreadText:[],
                isChecked: true,
                selectTextArr:[],
                versionid:"",
                packageId:'',
                cId:'',
                serviceId:'',
                checkedResource:'',
                doworkTime: 0,
                moduleId:10,
                selectFlag: 1,
                indexArr:[]
            }
        },
        created () {
            this.getText();
        },
        methods: {
            ...mapGetters([
                'getWorks'
            ]),
            //获取课文跟读段落内容
            getText(){
              let router = this.$route.query;
              this.versionid = router.versionId;
              this.packageId = router.packageId;
              this.serviceId = router.serviceId;
              this.cId = router.cId;
              this.checkedResource = router.checkedResource;
              if(!router.selectFlag){
                this.selectFlag = 0
              }
              let textData = {
                parentVersionId: router.parentVersionId,
                versionId: this.versionid,
                moduleId: router.moduleId,
                checkedResource: this.checkedResource
              }

              fetch.filterListen(textData).then(res => {
                if(!res) {
                    return
                }
                this.followreadText = res.data;
                this.initData();
              })
            },
            //初始化页面数据，添加字段
            initData(){
                // debugger
                const contents = this.getWorks().contents;
                for(var i = 0,len = contents.length;i<len;i++){
                    if(contents[i].moduleId == this.$route.query.moduleId && this.versionid == contents[i].versionId){
                        this.checkedResource = contents[i].checkedResource;
                        this.indexArr = contents[i].indexArr;
                    }
                }
                let allCount = 0;
                let count = 0;
                for (var i = 0, len = this.followreadText.length; i < len; i++) {
                    allCount+=this.followreadText[i].sentences.length
                    var item = this.followreadText[i];
                    const versionId = item.sentences[0].versionId;
                    item.text = item.content
                    item.isChecked = false;
                    item.buttonText = "选择段落";
                    if(this.selectFlag){
                      if(this.checkedResource.length === 0 || this.indexArr.indexOf(i)>-1){
                        count+=item.sentences.length
                        this.selectTextArr.push(versionId);
                        item.isChecked = true;
                        item.buttonText = "取消选择";
                      }
                    }else {
                      this.selectTextArr.push(versionId);
                     
                    }

                }
                this.doworkTime = this.selectTextArr.length > 0 ? allCount * 15 : count * 15       
            },
            back(){
                if(this.selectFlag){
                  this.$router.push({path:"publishHomeWork",query: {serviceId:this.serviceId,packageId: this.packageId,cId:this.cId,isFirst:0}});
                } else {
                  this.$router.back(-1);
                }
            },
            //选择按钮事件
            checkFun(item, index){
                if(this.selectFlag === 0) return
                item.isChecked = !item.isChecked;
                this.followreadText[index] = item;
                this.selectTextArr = [];
                let count = 0;
                let allCount = 0;
                for (var i = 0, len = this.followreadText.length; i < len; i++) {
                    var item = this.followreadText[i];
                    allCount+=item.sentences.length
                    if(item.isChecked){
                        item.buttonText = "取消选择"
                        count+=item.sentences.length
                        this.selectTextArr.push(item.sentences[0].versionId);
                    }else if(!item.isChecked){
                        item.buttonText = "选择段落";
                    }
                }
                this.doworkTime = count * 15 || allCount * 15   // 等于0的时候就是全选
            },
            //点击回传选择段落数组
            backSentenceArr(){
                if(this.selectFlag){
                 
                  this.selectTextArr = [];
                  this.indexArr = [];
                  let count = 0;
                  let allCount = 0;
                  for (var i = 0, len = this.followreadText.length; i < len; i++) {
                      var item = this.followreadText[i];
                      if(item.isChecked) {
                          //句子跟读中会有多个小句子
                           count++
                           allCount+=item.sentences.length
                          this.indexArr.push(i)
                          for(var j = 0,len1=item.sentences.length;j<len1;j++){
                              this.selectTextArr.push(item.sentences[j].versionId)
                          }
                      }else{
                          this.isChecked = false;
                      }
                  }
                  if(this.isChecked){
                      this.selectTextArr = [];
                  }
                  this.$emit('submitSentence', this.selectTextArr,count,allCount,this.followreadText.length,this.indexArr)
                } else {
                  this.$router.back(-1);
                }

            },
        }
    }
</script>
