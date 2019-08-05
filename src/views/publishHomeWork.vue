<template>
	<div class="publishHomeWork">
		<publishHomeWork></publishHomeWork>
	</div>
</template>

<script>
	import publishHomeWork from './../components/publishHomeWork/publishHomeWork.vue'
	import {mapActions} from 'vuex'

	export default {
		data () {
			return {}
		},
		components:{
			publishHomeWork
		},
		created () {
	       this.$nextTick(() => {
	       		this.setCrumb('发布作业');
	       })
	    },
		methods:{
			...mapActions([
				'setCrumb'
			]),
			submitWork(){
				//this.setWorks(内容);
				//let data = this.getWorks()
				
			}
		}
	}
</script>
