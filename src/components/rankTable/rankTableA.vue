<template>
<div class="rankSingleA">
   <table class="socreTable" border="0" align="center">
      <thead style="cursor: pointer;">
        <tr style="background-color: #fff;">
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
          <td @click="sort = {key: 'actualScore', val: -sort.val}">分数&nbsp; 
            <i class="arrIcon">
              <img src="../../assets/img/arrRank.png">
            </i>
          </td>
             <!--  <td>所在小组&nbsp;
           </td> -->
           <td @click="sort = {key: 'submitDate', val: -sort.val}">提交时间&nbsp; 
            <i class="arrIcon">
              <img src="../../assets/img/arrRank.png">
            </i>
          </td>
          <td>操作&nbsp;</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for='(data,ind) of players'>
          <td class="_rank">{{data.index?data.index:'-'}}</td>
          <td class="name">{{data.userName}}</td>
          <td>{{data.actualScore>=0?data.actualScore:"-"}}</td>
          <!-- <td>{{data.belongTo}}</td> -->
          <td>{{data.submitDate | formatDate('M月dd日 hh:mm')}}</td>
          <td>        
            <button class="button btn-size":class='{green:btnState==false&&data.isShow==1,gray:btnState==true||data.isShow!=1}' @click='watchStu(ind)'>查看作业</button>      
          </td>
        </tr>
        <tr v-for='(data,ind) of unlist'>
          <td class="_rank" :class='{grayzi:data.isShow==-1}'>{{data.index?data.index:'-'}}</td>
          <td class="name" :class='{grayzi:data.isShow==-1}'>{{data.userName}}</td>
          <td :class='{grayzi:data.isShow==-1}'>-</td>
          <!-- <td>{{data.belongTo}}</td> -->
          <td v-if='data.isShow!=-1' class="unSublime">未提交</td>
          <td v-else :class='{grayzi:data.isShow==-1}'>-</td>
          <td>        
            <button class="button btn-size":class='{green:btnState==false&&data.isShow==1,gray:btnState==true||data.isShow!=1}'>查看作业</button>      
          </td>
        </tr>
      </tbody>
   </table>
   <table class="socreTable tableFixed" border="0" align="center" v-if="tableFixedShow">
     <thead style="cursor: pointer;">
      <tr style="background-color: #fff;">
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
        <td @click="sort = {key: 'actualScore', val: -sort.val}">分数&nbsp; 
          <i class="arrIcon">
            <img src="../../assets/img/arrRank.png">
          </i>
        </td>
             <!--  <td>所在小组&nbsp;
           </td> -->
           <td @click="sort = {key: 'submitDate', val: -sort.val}">提交时间&nbsp; 
            <i class="arrIcon">
              <img src="../../assets/img/arrRank.png">
            </i>
          </td>
          <td>操作&nbsp;</td>
        </tr>
      </thead>
   </table>
</div>
</template>
<script type="text/javascript">
 export default{
  props:[
  'list','unlist','btnState'
  ],
  data(){
   return {
    sort: {
      key: 'index',
      val: 1
    },
    tableFixedShow:false,
  };
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
  watchStu(ind){
        if(this.list[ind].moduleId==15){
          this.$router.push({path:'checkTSMK', query: {record:JSON.stringify(this.list[ind])}});
         }else if(this.list[ind].moduleId==124){
          this.$router.push({path:'checkOnlinePaper', query: {record:JSON.stringify(this.list[ind])}});
         }else if(this.list[ind].moduleId==10&&this.list[ind].resourceType=="a7527f97-14e6-44ef-bf73-3039033f128e"){
          this.$router.push({path:'watchStudc', query: {doWorkId: this.list[ind].doWorkId,versionId:this.list[ind].versionId,userId:this.list[ind].userId,index:this.list[ind].index,actualScore:this.list[ind].actualScore}});  
         }else{
          this.$router.push({path:'watchStukw', query: {doWorkId: this.list[ind].doWorkId,versionId:this.list[ind].versionId,userId:this.list[ind].userId,index:this.list[ind].index,actualScore:this.list[ind].actualScore}});  
         }
       }
 }
}
</script>