<template>
	<!-- <div class="setBooks_box" v-if="showPage"> -->
	<div class="setBooks_box">
		<div class="setBooks" style="padding: 40px;">
			<div class="header clear">
				<form  class="search" @submit.prevent="search($event)">
					<input type="text" placeholder="搜索试卷名称" class="field" v-model="keyword">
					<span :class="{'clearBtn': keyword.trim().length>0}" @click="clearInput($event)"></span>
					<button type="button" class="button green" @click="search($event)">搜索</button>
				</form>
				<!-- <router-link :to="{path: 'managePaper', query:{paper: papers, workType: 2}}">
						<button type="button" class="manage">管理试卷</button>
				</router-link> -->
			</div>

			<article class="book_list clear">
				<ul class="clear">
					<li v-for="item in papers">
						<book :booksData="item" :type="2"></book>
					</li>
				</ul>
			</article>
			<div class="loading_books" v-if="loading">
				<div class="load_line"></div>
				<p>正在加载中...</p>
			</div>
			<div v-if="papers.length==0 && !isSearch" class="noCatalog clear">
				<img src="./../../assets/img/noGrade.png" alt=""/>
				<p>暂时还没有试卷哦</p>
			</div>
			<div v-if="papers.length==0 && pageIndex==1 && isSearch" class="noResult clear">
				<img src="./../../assets/img/null.png" alt=""/>
				<p>搜索无结果</p>
			</div>
			<!-- <paging :PagenumId="pageIndex" :PageCount="pageCount" @mypagenum="pageNum" v-show="papers.length!=0"></paging> -->

		</div>
	</div>
</template>
<script>
import book from "./../book/book.vue";
import paging from "./../paging/paging.vue";
import fetch from "./../../fetch";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    book,
    paging
  },
  data() {
    return {
      showPage: false,
      keyword: "",
      papers: [],
      params: {},
      pageIndex: 1,
      pageCount: 2,
      tagRes: false,
      isSearch: false
    };
  },
  created() {
    this.loading = false;
    this.$nextTick(() => {
      this.getPapers();
      this.setCrumb("试卷");
    });
  },
  watch: {
    $route: ["getPapers"],
    $attrs(val) {
      if (val.loadMore && val.currentName) {
        this.loading = true;
        this.pull_work();
      }
    }
  },
  methods: {
    ...mapActions(["setCrumb"]),
    ...mapGetters(["getUser"]),
    search(e) {
      this.isSearch = true;
      if (!this.keyword.trim()) {
        this.getPapers();
      }
      this.pageIndex = 1;
      this.getPapers();
    },
    setParams() {
      let userInfo = this.getUser();
      this.params = {
        userID: userInfo.userId,
        periodId: 0,
        SubjectID: 0,
        keyWord: this.keyword.trim(),
        pageIndex: this.pageIndex,
        pageSize: 12
      };
    },
    clearInput(e) {
      this.keyword = "";
    },
    getPapers() {
      this.setParams();
      fetch.getPaper(this.params).then(res => {
        if (!res) {
          this.papers = [];
          return false;
        }
        if (!res.data.result) {
          return false;
        }
        if (this.pageIndex == res.data.page_index) {
          this.papers = this.papers.concat(res.data.result);
          this.pageCount = Math.ceil(
            res.data.total_count / this.params.pageSize
          );
        }
        this.showPage = true;
        this.loading = false;
      });
    },
    pageNum(pageIndex) {
      this.pageIndex = pageIndex;
      this.getPapers();
    },
    pull_work() {
      this.pageIndex++;
      this.getPapers();
    }
  }
};
</script>
