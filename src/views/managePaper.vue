<template lang="html">
  <div class="managePaper">
      <div class="header clear">
				<form  class="search" @submit.prevent="search($event)">
					<input type="text" placeholder="搜索试卷名称" class="field" v-model="keyword">
					<span :class="{'clearBtn': keyword.trim().length>0}" @click="clearInput($event)"></span>
					<button type="button" class="button green" @click="search($event)">搜索</button>
				</form>
        <button type="button" class="create" @click="link(0)">创建试卷</button>
			</div>
    <table cellspacing="0">
      <thead>
        <tr>
          <th>序号</th>
          <th>试卷名称</th>
          <th>创建时间</th>
          <th>常用操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in papers">
          <td>{{index+1}}</td>
          <td>{{item.examinationTitle}}</td>
          <td>{{item.createDate | formatDate('y年M月dd日')}}</td>
          <td>
            <span class="handle" @click="link(1,item)">预览</span>
            <span class="handle" @click="link(2,item)">修改</span>
            <span class="handle" @click="deletePaper(item, index)">删除</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="loading_books" v-if="loading">
      <div class="load_line"></div>
      <p>正在加载中...</p>
    </div>
    <div v-if="papers.length==0 && !isSearch" class="noCatalog clear">
      <img src="./../assets/img/noGrade.png" alt=""/>
      <p>暂时还没有试卷哦</p>
    </div>
    <div v-if="papers.length==0 && pageIndex==1 && isSearch" class="noResult clear">
      <img src="./../assets/img/null.png" alt=""/>
      <p>搜索无结果</p>
    </div>
    <!-- <paging :PagenumId="pageIndex" :PageCount="pageCount" @mypagenum="pageNum" v-show="papers.length!=0"></paging> -->
    <notice :params="noticParams" :isNotice="isNotice" @isConfirm="isConfirm"></notice>
  </div>
</template>

<script>
import {nowDate, formatDate, aroundDate, timeStamp} from './../filter'
import paging from "./../components/paging/paging.vue"
import notice from "./../components/notice/notice.vue"
import { clientId, brandId } from './../config'
import fetch from './../fetch'
import { mapGetters, mapActions } from 'vuex'

export default {
  data(){
    return{
      papers:[],
      createUrl: '',
      params:{},
      pageIndex: 1,
      pageCount: 2,
      keyword: '',
      isNotice:false,
      noticParams:{},
      indexId:Number,
      isSearch: false,
      loading: false
    }
  },
  components:{
    paging,
    notice
  },
  created(){
    this.delIndex = -1
    this.$nextTick(()=>{
      this.getPapers();
    })
  },
  watch: {
		'$route': 'getPapers',
    '$attrs'(val) {
        if(val.loadMore && val.currentName) {
          console.log('home is ok loadData')
          this.loading = true
          this.pull_work()
        }
   }
	},
  methods:{
    ...mapGetters([
      'getUser'
    ]),
    search(e){
      this.isSearch = true;
      if(!this.keyword.trim()){
        this.getPapers();
      }
      this.pageIndex = 1;
      this.getPapers();
    },
    setParams(){
      let userInfo = this.getUser()
      this.params = {
        userID: userInfo.userId,
        periodId: 0,
        SubjectID: 0,
        keyWord: this.keyword.trim(),
        pageIndex: this.pageIndex,
        pageSize: 12
      }
    },
    getPapers(){
      this.setParams();
      fetch.getPaper(this.params).then(res=>{
        if(!res){
          this.papers=[];
          return false;
        }
        // this.papers = res.data.result;
        this.papers = this.papers.concat(res.data.result)
        this.pageCount = Math.ceil(res.data.total_count/this.params.pageSize);
        this.loading = false
      })
    },
    clearInput(e) {
        this.keyword = '';
    },
    pageNum(pageIndex){
      this.pageIndex = pageIndex;
      this.getPapers();
    },
    link(type,item){
      let userInfo = this.getUser();
      let auth = encodeURIComponent(btoa(userInfo.userId) + ':' + btoa(userInfo.password))
      let returnUrl = encodeURIComponent(window.location.href)

      this.createUrl = 'http://tools.booksauthor.ciwong.com/taskresult/EditExamForTeach?router=managePaper&auth='
      // this.createUrl = 'http://test.booksauthor.ciwong.com/taskresult/EditExamForTeach?auth='
      this.createUrl+=auth+'&clientId='+clientId+'&brandId='+brandId+'&returnUrl='+returnUrl
      if(type == 0){
        this.createUrl+='&id='
        window.location.href = this.createUrl;
      }else if(type == 1){
        let query = {
  				versionId: item.examinationID,
  				brandId: brandId,
          clientId: clientId,
          userId: userInfo.userId
  			}
        this.$router.push({ path: 'selectOnlinePaper', query })
      }else if(type == 2){
        let id = item.examinationID;
        this.createUrl+='&id='+id;
        window.location.href = this.createUrl;
      }

    },
    deletePaper(item, index){
      this.delIndex = index
      this.indexId = item.examinationID;
      this.isNotice = !this.isNotice;
      this.noticParams = {type:1, noticeText:"确定删除此份试卷!",noticeTitle:"确认删除",button1:"返回",button2:"删除"}
    },
    isConfirm(){
      let ExaminationID = {'ExaminationID': this.indexId};
      fetch.delPaper(ExaminationID).then(res=>{
        if(!res){
          return false;
        }
        // this.getPapers()
        this.papers.splice(this.delIndex, 1)
      })
    },
    pull_work(){
        this.pageIndex++;
        this.getPapers();
    }
  }
}
</script>
