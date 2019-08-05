<template lang="html">
  <div class="setHomework" ref="setHomework" v-bind="$attrs">
    <div class="title">
      <!-- <div class="go_back" @click="goBack">
        <img src="./../assets/img/go_back.png" alt="">
        <router-link to="/web/setPaper">去试卷</router-link>
      </div> -->
      <div class="select_book">
        <h2>选择书籍</h2>
      </div>
      <span @click="toPaper" style="color: #00ba8f;">去选择试卷</span>
    </div>
    <setBooks :loadData="loadData"></setBooks>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import setBooks from "./../components/setWork/setBooks.vue"
// import setPaper from "./../components/setWork/setPaper.vue"

export default{
  inheritAttrs: false,
	data(){
		return{
			index: 1,
      loadData: this.$attrs
		}
	},
	components:{
		setBooks
		// setPaper
	},
  created(){
      this.$nextTick(() => {
          this.setCrumb('选择作业用书');
          let params = this.$route.query;
          this.index = params.bookType;

      })
  },
  watch: {
     '$attrs'(val) {
       this.loadData = val
    }
  },
	methods:{
    ...mapActions([
        'setCrumb'
    ]),
		toggle(param){
      if(param == 1){
        this.$router.push({path:'setHomework', query:{bookType: 1}})
        this.setCrumb('试卷');
        this.setCrumb('选择作业用书');
      }else{
        this.$router.push({path:'setHomework', query:{bookType: 2}})
        this.setCrumb('选择作业用书');
        this.setCrumb('试卷');
      }
      let params = this.$route.query;
      this.index = params.bookType;
		},
    goBack() {
      window.history.back()
    },
    toPaper() {
      this.$router.push({path:'setPaper', query:{bookType: 1}})
    }
	}
}
</script>
