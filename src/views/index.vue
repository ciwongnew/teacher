<template>
	<div class="index mt-120">
		<h1>index</h1>
		<router-link to="/login">登录</router-link></br>
		<router-link to="/home">首页</router-link></br>
		<router-link to="/selectText">选择课文页面</router-link></br>
		<router-link to="/setHomework">选择习题册</router-link></br>
		<router-link to="/publishHomeWork">发布作业</router-link></br>
		<router-link to="/readWords">单词跟读</router-link></br>
		<router-link to="/selectListenSpeak">选择听说模考大题</router-link></br>
		<router-link to="/checkTSMK">听说模考详情页面</router-link></br>
		<router-link to="/selectOnlinePaper">在线作答预览</router-link></br>
		<router-link to="/checkOnlinePaper">在线作答详情</router-link></br>
		<router-link to="/rank">排名</router-link></br>
		<router-link to="/rankWork">单个排名</router-link></br>
		<router-link to="/watchStudc">查看单词跟读</router-link>
		<router-link to="/watchStukw">查看课文跟读</router-link>
	</div>
</template>
<script>
import rank from "../components/rank/rank.vue"
	import {mapActions} from 'vuex'
	export default{
        data(){
            return {
            };
        },
	    created () {
	       this.$nextTick(() => {

	       })
	    },
		methods:{
			...mapActions([
				'setCrumb'
			])
		}
    }
</script>
