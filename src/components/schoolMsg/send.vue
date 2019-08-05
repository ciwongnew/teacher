<template lang="html">
  <div class="send">
    <div class="clearfix" style="margin-bottom: 30px;">
      <span class="step">发送对象:</span>
        <div class="sel_class">
          <span v-for="(item,index) in checkedClass"> {{item.className}}; </span>
        </div>
        <div class="origin_select" :class="{arrowUp:showSelect}" @click.stop="selectClass">
        班级
          <ul class="selectBox" v-show="showSelect">
            <li v-for="(item,index) in grads" class="input">
              <label :for="index" class="label">
                <span class="inputBox fl" :class="{isChecked: item.isChecked}">
                  <span class="checkBox"></span>
                  <input type="checkbox" :id="index" :value="item" v-model="checkedClass" @change="checkedClassFun(index)">
                  </span>
                <span class="studentName fl">
                  {{item.className}}
                </span>
              </label>
            </li>
          </ul>
        </div>
    </div>
    <div class="">
      <span class="step">通知内容：</span>
      <textarea style="border: 1px solid #dadada; padding: 10px;" v-model="msg" maxlength="500"></textarea>
    </div>
    <div class="" style="text-align: center; margin: 30px 0 20px;">
      <button type="button" class="button write btn" @click="back">取消</button>
      <button type="button" class="button green btn" @click="sendMsg">确定</button>
    </div>
  </div>
</template>

<script>
import classcom from './../checkboxLabel/checkboxLabel.vue'
import fetch from './../../fetch'
import {clientId, brandId} from './../../config'
import {mapGetters, mapActions} from 'vuex'
import notice from "./../../components/notice/notice.vue"
import OriginSelect from './../../components/originSelect/originSelect'


export default {
  data(){
    return{
      grads: [],
      selectedClass: [],
      msg:'',
      isNotice:false,
      classNames: '',
      showSelect: false,
      checkedClass:[]
    }
  },
  components:{
    classcom,
    notice,
    OriginSelect
  },
  created(){
    this.$nextTick(()=>{
      this.initData();
      this.getClass();
      document.body.addEventListener("click",() =>{
        this.showSelect = false
      })
    })
  },
  methods:{
    initData(){

    },
    ...mapGetters([
      'getUser'
    ]),
    selectClass(){
      this.showSelect = !this.showSelect
    },
    checkedClassFun(index){
      this.grads[index].isChecked = !this.grads[index].isChecked
    },
    selLi(item){

      let selRom = this.$refs.selRom;
      item.setQuestionId = !item.setQuestionId;
    },
    getClass(){
      let params = {
        userRole: 2,
        exists: 1
      }
      fetch.grads(params).then(res=>{
        if (!res || !res.data) {
          return
        }
        for(var i=0;i<res.data.length;i++){
          res.data[i].setQuestionId = false;
          res.data[i].name = res.data[i].className
          res.data[i].isChecked = false
        }
        this.grads = res.data;

      })
    },
    sendMsg(){
      let that = this
      if(!this.checkedClass.length){
          this.$toast("您还未选择班级对象哦！",'error')
          return false;
      }
      if(!this.msg) {
        this.$toast("消息不能为空",'error')
        return;
      }
      this.checkedClass.forEach((item,index) => {
        that.selectedClass.push({
          classId: item.classId,
          className: item.className
        })
        this.classNames += item.className +','
      })
      let userInfo = this.getUser();
      let gradsList = [];
      let params = {
        eventName: "pushClassMessage",
        eventArgs: {
          brandId: brandId,
          senderId: userInfo.userId,
          brandName: userInfo.realName,
          attach: '',
          userType:1,
          receiverIdList:this.selectedClass,
          classNames: this.classNames.substring(0, this.classNames.length-1),
          messageContent:{
            content: this.msg,
            imgUrl:''
          }
        }
      }
      fetch.setClassMsg(params).then(res=>{
        if (!res) {
            return false;
          }
        if(res){
          this.$toast('发送成功!','right')
//          this.getClass();
          setTimeout(function(){
            that.msg = '';
            that.checkedClass = []
            that.selectedClass = []
            that.classNames = ''
            that.$emit("backMsg")
          },2500)
          this.grads.forEach((item,index) =>{
            item.isChecked = false
          })
        }
      })
    },
    sortarr (arr) {
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = 0; j < arr.length - 1 - i; j++) {
          if (arr[j].gradeId > arr[j + 1].gradeId) {
            var temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j + 1] = temp
          }
        }
      }
      return arr
    },
    isConfirm(){
      this.getClass();
      this.$emit("backMsg")
    },
    back(){
      this.getClass()
      this.$emit("backMsg")
    }
  }

}
</script>

<style lang="css">
</style>
