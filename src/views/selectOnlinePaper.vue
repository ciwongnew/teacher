<template>
	<div>
	  <!-- <loadingImg v-if="webloading"></loadingImg> -->
		<exampaper :page="page" :exampaperData="exampaperData" :moduleId="moduleId" :thirdParty="thirdParty" :doworkTimes="doworkTime"></exampaper>
	</div>
</template>

<script>
    import fetch from "../fetch"	// 接口
	import exampaper from '../components/question/exampaper.vue'	// 所有题型组件
	// import loadingImg from '../components/loadingImg/loadingImg.vue' //loading
	import {mapGetters, mapActions} from 'vuex'

	export default {
		components:{
			exampaper
		},
		data () {
			return {
				page:'selectOnlinePaper',						// 当前页面
				versionId:'',// 试卷ID 	4613335007164703262
				accessToken:'',
				clientId:'',
				brandId:'',
				webloading:true,
				exampaperData:{},				// 试卷信息
        moduleId:124,
        thirdParty:true,
        doworkTime:''
			}
		},
	    created () {
	       	this.$nextTick(() => {
	       		this.getData();
	       		this.setCrumb('在线作答预览');
	       	})
	    },
	    watch:{
	    	'$route': 'getData'
	    },
		methods:{
    	...mapActions([
    		'setCrumb',
    		'setUser'
    	]),
    	...mapGetters([
    	    'getUser'
    	]),
    	getData(){
    		let $this = this
    		this.webloading=true;
	    	let params = this.$route.query;
        let user = this.getUser()
				if (params.env && params.env == 'production') {
          user.host = 'http://eapi.my.ciwong.com'
          // console.log(user)
				} else if (params.env && params.env == 'test' ){
           user.host = 'http://eapi.my.jiaofucloud.cn'
				}
				// console.log(user, 'jia yong sai')
        this.setUser(user)
        this.doworkTime = params.readTime
	    	if(params.userId){
	    		this.thirdParty = false
	    	}
				fetch.getOnlineExamination({versionId:params.versionId}).then(res =>{
					if(!res){
						return false;
					}
					this.exampaperData = res.data;
          // setTimeout(()=>{
          // 	$this.webloading=false;
          // }, 1000)
				},err =>{
					console.log(err);
				})
    	}
		}
	}
</script>
