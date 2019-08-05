<template>
	<div class="alertBigImg">
	<div class="imgMask" @click='imgFun'></div>
		<img :src="imgSrc" class="img_Pos">
	</div>
</template>
<script>
	export default {
		props: [
     "imgSrc"
	  ],
	  data(){
      return {
      	imgFlag:true
      }
	  },
	  methods:{
      imgFun(){
      	this.imgFlag=false;
      	this.$emit("imgBigShow",this.imgFlag);
      }
	  }
	}
</script>