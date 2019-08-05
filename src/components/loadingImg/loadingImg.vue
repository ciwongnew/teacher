<template>
	<div>
	    <div  class="loadMask"></div>
		<img  class="loading" :src="loadingImg">
	</div>
</template>
<script>
  export default{
  	data(){
  		return {
  			 loadingImg: './img/loading.gif'
  		}
  	}
  }
</script>