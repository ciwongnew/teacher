<template>
  <div class="rankWorkTable grid" style="clear: both;">
    <div class="rankWorkApi">
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
              <th v-for="item in hList" :width='hWidth' v-if='item.resourceType!="eb5d05a2-d604-4879-8f9a-be5a45ae414e"&&item.resourceType!="803ef46d-e0cc-4f97-b1eb-b3ef411d058e"' :title="item.resourceName||item.name">
                {{item.name||item.resourceName}}
              </th>
            </tr>
          </thead>
          <tbody>
          <!-- {{players}} -->
            <tr v-for='data in players'>
              <td class="_rank">{{data.index?data.index:'-'}}</td>
              <td class="name">{{data.userName}}</td>
              <td :class='{grayzi:data.isShow==-1}'>{{data.totalScore>=0?toMathTwo(data.totalScore):'-'}}</td>
              <td v-for="item in data.tabDatas" :class='{unSublime:item.score<0}'>
                {{item.score>=0?toMathTwo(item.score):'未提交'}}</td>
            </tr>
            <tr v-for='data in unlist'>
              <td class="_rank" :class='{grayzi:data.isShow==-1}'>{{data.index?data.index:'-'}}</td>
              <td class="name" :class='{grayzi:data.isShow==-1}'>{{data.userName}}</td>
              <td v-if='data.isShow == 0' class="unSublime">{{data.totalScore>=0?toMathTwo(data.totalScore):'未提交'}}</td>
              <td v-else :class='{grayzi:data.isShow==-1}'>{{data.totalScore>=0?toMathTwo(data.totalScore):'-'}}</td>
              <td v-if='data.isShow == 0' class="unSublime" v-for="item in data.tabDatas">未提交</td>
              <td v-else :class='{grayzi:data.isShow==-1}'>-</td>
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
              <th v-for="item in hList" :style="{width:hWidth}" v-if='item.resourceType!="eb5d05a2-d604-4879-8f9a-be5a45ae414e"&&item.resourceType!="803ef46d-e0cc-4f97-b1eb-b3ef411d058e"' :title="item.resourceName||item.name">{{item.name||item.resourceName}}
              </th>
            </tr>
          </thead>
        </table>
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
          hWidth: 960/((this.hList.length<4?this.hList.length:3) + 3)+"px"
        };
      }, 
      watch:{
        hList(){
          this.hWidth = 960/((this.hList.length<4?this.hList.length:3) + 3)+"px"
        }
      },
      created(){
        this.$nextTick(() => {
           window.addEventListener("scroll",this.scroll);               
          })
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
          let Dom=document.body.scrollTop;
          if(Dom>400){
            this.tableFixedShow=true;
          }else{
            this.tableFixedShow=false;
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