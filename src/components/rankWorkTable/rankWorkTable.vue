<template>
  <div class="rankWorkTable grid" style="clear: both;">
    <div class="socreTableL cell">
      <table border="0" align="center">
        <thead style="cursor: pointer">
          <tr style="background-color: #fff;">
            <th :width='hWidth' @click="sort = {key: 'index', val: -sort.val}">排名&nbsp; 
              <i class="arrIcon">
                <img src="../../assets/img/arrRank.png">
              </i>
            </th>
            <th :width='hWidth' @click="sort = {key: 'userName', val: -sort.val}">姓名&nbsp; 
              <i class="arrIcon">
                <img src="../../assets/img/arrRank.png">
              </i>
            </th>
            <th :width='hWidth' @click="sort = {key: 'totalScore', val: -sort.val}">总分&nbsp; 
              <i class="arrIcon">
                <img src="../../assets/img/arrRank.png">
              </i>
            </th>
          </tr>
        </thead>
        <tbody style="background-color: #fff;">
        <!-- {{players}} -->
          <tr v-for='data in players'>
            <td class="_rank">{{data.index?data.index:'-'}}</td>
            <td class="name">{{data.userName}}</td>
            <td :class='{grayzi:data.isShow==-1}'>{{data.totalScore>=0?toMathTwo(data.totalScore):'-'}}</td>
          </tr>
          <tr v-for='data in unlist'>
            <td class="_rank" :class='{grayzi:data.isShow==-1}'>{{data.index?data.index:'-'}}</td>
            <td class="name" :class='{grayzi:data.isShow==-1}'>{{data.userName}}</td>
            <td v-if='data.isShow == 0' class="unSublime">{{data.totalScore>=0?toMathTwo(data.totalScore):'未提交'}}</td>
            <td v-else :class='{grayzi:data.isShow==-1}'>{{data.totalScore>=0?toMathTwo(data.totalScore):'-'}}</td>
          </tr>
        </tbody>
      </table>
      <table border="0" align="center" class="tableFixed" v-show="tableFixedShow">
        <thead style="cursor: pointer">
          <tr style="background-color: #fff;">
            <th :width='hWidth' @click="sort = {key: 'index', val: -sort.val}">排名&nbsp; 
              <i class="arrIcon">
                <img src="../../assets/img/arrRank.png">
              </i>
            </th>
            <th :width='hWidth' @click="sort = {key: 'userName', val: -sort.val}">姓名&nbsp; 
              <i class="arrIcon">
                <img src="../../assets/img/arrRank.png">
              </i>
            </th>
            <th :width='hWidth' @click="sort = {key: 'totalScore', val: -sort.val}">总分&nbsp; 
              <i class="arrIcon">
                <img src="../../assets/img/arrRank.png">
              </i>
            </th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="socreTableR">
      <table border="0" align="center" ref="swiperTab">
        <thead style="cursor: pointer">
          <tr style="background-color: #fff;">
            <th v-for="item in hList" :width='hWidth' v-if='item.resourceType!="eb5d05a2-d604-4879-8f9a-be5a45ae414e"&&item.resourceType!="803ef46d-e0cc-4f97-b1eb-b3ef411d058e"' :title="item.resourceName||item.name">
              {{item.name||item.resourceName}}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='data in players'>
            <td v-for="item in data.tabDatas" :class='{unSublime:item.score<0}'>
              {{item.score>=0?toMathTwo(item.score):'未提交'}}</td>
          </tr>
          <tr v-for='data in unlist'>
            <td v-if='data.isShow == 0' class="unSublime" v-for="item in data.tabDatas">未提交</td>
            <td v-else :class='{grayzi:data.isShow==-1}'>-</td>
          </tr>
        </tbody>
      </table>
      <div class="tableFixed" v-show="tableFixedShow">
         <ul style="background-color: #fff;" ref="swiperTab1">
           <li v-for="item in hList" :style="{width:hWidth}" v-if='item.resourceType!="eb5d05a2-d604-4879-8f9a-be5a45ae414e"&&item.resourceType!="803ef46d-e0cc-4f97-b1eb-b3ef411d058e"' :title="item.resourceName||item.name">{{item.name||item.resourceName}}</li>
         </ul>
      </div>
      <div v-if='arrowShow'>
        <i v-if="arrowShowL" class='arrow-l' @click='moveLeft' :style="{top: topI+'px'}">&lt;</i>
        <i v-if="arrowShowR" class='arrow-r' @click='moveRight':style="{top: topI+'px'}">&gt;</i>
      </div>
    </div>
  </div>
  </template>
<script type="text/javascript">
   export default{
        props:[
        'list','unlist','hList'
        ], 
        data(){
         return {
          sort: {
            key: 'index',
            val: 1
          },
          tableFixedShow:false,
          tableIndex:0,
          topI:"240",
          arrowShow:true,
          arrowShowL:false,
          arrowShowR:true,
          hWidth: 840/((this.hList.length<4?this.hList.length:3) + 3)+"px"
        };
      }, 
      watch:{
        hList(){
          this.hWidth = 840/((this.hList.length<4?this.hList.length:3) + 3)+"px"
        }
      },
      created(){
        this.$nextTick(() => {
         // let screenHeight= window.screen.height;   //document.body.offsetHeight;
         // document.getElementsByClassName('view')[0].style.height=screenHeight+"px";
         let viewDom=document.getElementsByClassName("view")[0];
         viewDom.addEventListener("scroll",this.scroll);         
             if(this.hList.length<=3){
              this.arrowShow=false;
            }
          })
         let studentLength = this.list.length+this.unlist.length;
         if(studentLength<5){
          this.topI = Math.floor(studentLength/2) * 60;
         }
      },
      computed:{
       players(){
        let arr=[]
        arr=this.list
        this.sortTable(arr);
        return arr
      }
    },
    methods:{
      scroll(e){
          let Dom=document.getElementsByClassName('view')[0].scrollTop;
          this.topI=(240>=Dom?240:Dom);
          if(Dom>500){
            this.tableFixedShow=true;
          }else{
            this.tableFixedShow=false;
          }
      },
      moveLeft(){
         let tableArrLen=this.hList.length-1;
         if(this.tableIndex!=0){
          this.tableIndex-=1
          this.$refs.swiperTab.style.marginLeft = -140*(this.tableIndex<tableArrLen?this.tableIndex:0)+"px";
          this.$refs.swiperTab1.style.marginLeft = -140*(this.tableIndex<tableArrLen?this.tableIndex:0)+"px";
          this.arrowShowR=true;
          if(this.tableIndex==0){
            this.arrowShowL=false;
          }
         }
      },
      moveRight(){
         let tableArrLen=this.hList.length-1;
         if(this.tableIndex<tableArrLen-2){
          this.tableIndex+=1
          this.$refs.swiperTab.style.marginLeft = -140*(this.tableIndex==-1?0:this.tableIndex)+"px";
          this.$refs.swiperTab1.style.marginLeft = -140*(this.tableIndex==-1?0:this.tableIndex)+"px";
          this.arrowShowL=true;
          if(this.tableIndex==tableArrLen-2){
            this.arrowShowR=false;
          }    
         }   
      },
      sortTable (arr) {
        let _this = this;
        arr.sort((a, b) => {
          if('userName'==_this.sort.key){
            if (a[_this.sort.key].localeCompare(b[_this.sort.key])>=0) {
              return _this.sort.val
            } else {
              return -_this.sort.val
            }
          } else {
            if (a[_this.sort.key] >= b[_this.sort.key] || !a[_this.sort.key]) {
              return _this.sort.val
            } else {
              return -_this.sort.val
            }
          }
        })
      },
      toMathTwo(num){
              let str=str=parseFloat(parseFloat(num).toFixed(2));
              return str
          },
  }
 }
</script>