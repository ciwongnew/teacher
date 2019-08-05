<template>
    <table class="socreTable" border="0" align="center">
      <thead style="cursor: pointer">
        <tr>
          <td @click="sort = {key: 'index', val: -sort.val}">排名&nbsp; 
            <i class="arrIcon">
              <img src="../../assets/img/arrRank.png">
            </i>
          </td>
          <td @click="sort = {key: 'userName', val: -sort.val}">姓名&nbsp; 
            <i class="arrIcon">
              <img src="../../assets/img/arrRank.png">
            </i>
          </td>
          <td v-for="item in hList" :title="item.resourceName||item.name">
            {{item.name||item.resourceName}}
          </td>
          <td @click="sort = {key: 'actualScore', val: -sort.val}">总分&nbsp; 
            <i class="arrIcon">
              <img src="../../assets/img/arrRank.png">
            </i>
          </td>
        </tr>
      </thead>
      <tbody>
      <!-- {{item.score>0?item.score:'-'}} -->
        <tr v-for='data in players'>
          <td class="_rank" :class='{grayzi:data.isShow==-1}'>{{data.index?data.index:'-'}}</td>
          <td class="name" :class='{grayzi:data.isShow==-1}'>{{data.userName}}</td>
          <td v-for="item in data.tabDatas" :class='{unSublime:item.score<0}'>
            {{item.score>=0?toMathTwo(item.score):'未提交'}}</td>
          <!-- <td>{{data.isShow==0}}</td> -->
          <td>{{data.totalScore>=0?toMathTwo(data.totalScore):'-'}}</td>
        </tr>
        <tr v-for='data in unlist'>
          <td class="_rank" :class='{grayzi:data.isShow==-1}'>{{data.index?data.index:'-'}}</td>
          <td class="name" :class='{grayzi:data.isShow==-1}'>{{data.userName}}</td>
          <td v-for="item in data.tabDatas" v-if='data.isShow == 0' class="unSublime" >未提交</td>
          <td v-else :class='{grayzi:data.isShow==-1}'>-</td>
          <td v-if='data.isShow == 0' class="unSublime">未提交</td>
          <td v-else :class='{grayzi:data.isShow==-1}'>-</td>
        </tr>
      </tbody>
    </table>
  </template>
<script type="text/javascript">
// import watchStu from "../watchStukw/watchStukw.vue"
   export default{
        data(){
         return {
          sort: {
            key: 'index',
            val: 1
          },
        };
      }, 
      props:[
      'list','unlist','hList'
      ], 
      computed:{
       players(){
        let arr=[]
        arr=this.list
        this.sortTable(arr);
        return arr
      }
    },
    methods:{
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