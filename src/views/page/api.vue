<template>
	<div class="view" style="padding: 10px 30px;">
        <router-view></router-view>
	</div>
</template>

<script>
    export default{
        data(){
            return{
                isShowMenu:false,
                isShowTop:false,
                pageHeight: {'heigth':'600px'}
            }
        },
        created(){
             this.$nextTick(() => {
              window.addEventListener('load', this.windowOnLoad);
           })
        },
        watch:{
            '$route':function (newValue,oldValue) {
                // this.isShowMenu = newValue.path !='/' && newValue.path != '/home' && newValue.path != '/class' && newValue.name != 'personMsg'?true:false;
                // this.isShowTop = newValue.path =='/ranks'?false:true;
            }
        },
        methods:{
            // //监听页面刷新事件
            // windowOnLoad(){
            //     this.isShowMenu = this.$route.path !='/' && this.$route.path !='/home' && this.$route.path !='/class' && this.$route.name !='personMsg'?true:false;
            //     this.isShowTop = this.$route.path =='/ranks'?false:true;
            // },
            // setPageHeight(){
            //     this.isShowMenu = this.$route.path !='/' && this.$route.path !='/home' && this.$route.path !='/class' && this.$route.path !='/ForgotPwd'?true:false;
            // },
            // setHeight(){
            //     let pageHeight = 0;
            //     let screenHeight= document.body.offsetHeight
            //     if(this.isShowMenu) {
            //         pageHeight = screenHeight - 120;
            //     } else {
            //         pageHeight = screenHeight - 60;
            //     }
            //     this.pageHeight = {heigth: pageHeight+'px'};
            // }
        }
    }
</script>
