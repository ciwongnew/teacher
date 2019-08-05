<template>
	<div>
		<topBanner v-if="isShowTop"></topBanner>
		<menus v-if="isShowMenu"></menus>
        <div class="view" :style='{height: pageHeight + "px"}'  ref="viewWrapper">
            <div style="margin:auto;" :class='{w960:rwidth,w100:Lwidth}'>
							<router-view :loadMore="loadMore" :currentName="currentName"></router-view>
						</div>
        </div>
	</div>
</template>
<style>
    .view{
      width: 100%;
      overflow-y: scroll;
      padding-bottom: 50px;
			background-color: #f2f2f2;
    }
		::-webkit-scrollbar{
			width: 6px;
		}
		::-webkit-scrollbar-thumb {
		  background-color: rgba(0, 0, 0, 0.2);
	  }
    .w960{
      width: 960px;
			background-color: #fff;
      border-radius: 4px;
    }
    .w100{
      width:100%;
    }
</style>
<script>
    import topBanner from "./../../components/banner/topBanner.vue"
    import menus from "./../../components/menu/menus.vue"
    export default{
        data(){
            return{
                isShowMenu:false,
                isShowTop:true,
                rwidth:true,
                Lwidth:false,
                pageHeight: 816,
								loadMore: false,
								currentName: ''
            }
        },
        components:{
            topBanner,
            menus
        },
        created(){
          const that = this
          this.$nextTick(() => {
            window.addEventListener('load', this.windowOnLoad);
            this.setHeight()
						let _this = this


						this.$refs.viewWrapper.addEventListener('scroll',function() {

							let scrollTop = that.$refs.viewWrapper.scrollTop
							let clientHeight = that.$refs.viewWrapper.clientHeight
							let scrollHeight = that.$refs.viewWrapper.scrollHeight
							if(scrollTop + clientHeight === scrollHeight) {
								that.loadMore = true
								that.currentName = that.$el.baseURI
							}else{
								that.loadMore = false
								that.currentName = ''

							}
						})

          })

        },
        mounted(){
          const that = this
          window.onresize = () => {
            that.setHeight()
          }

        },
        watch:{
            '$route':function (newValue,oldValue) {
                if( newValue.path.indexOf('/web') > -1){
                    this.rwidth=true;
                    this.Lwidth=false;
                }else{
                    this.rwidth=false;
                    this.Lwidth=true;
                }
                this.isShowTop = newValue.path =='/ranks'?false:true;
								switch (newValue.name) {
									case 'login':
										this.isShowMenu = false
										break;
									case 'home':
										this.isShowMenu = false
										break;
									case 'class':
										this.isShowMenu = false
										break;
									case 'setHomework':
										this.isShowMenu = false
										break;
									case 'personMsg':
										this.isShowMenu = false
										break;
									case 'rankWork':
										this.isShowMenu = false
										break;
									case 'schoolMsg':
										this.isShowMenu = false
										break;
									case 'managePaper':
										this.isShowMenu = false
										break;
									case 'ForgotPwd':
										this.isShowMenu = false
										break;
                  case 'selectObject':
										this.isShowMenu = false
										break;
									case 'register':
										this.isShowMenu = false
										break;
									default:this.isShowMenu = true
								}
                this.setHeight()
            },
            pageHeight (val) {
              // this.pageHeight = val
            }
        },
        methods:{
            // //监听页面刷新事件
            windowOnLoad(){
							let path = this.$route.path;
							let name = this.$route.name;
                  if(path.indexOf('/web') > -1){
                    this.rwidth=true;
                    this.Lwidth=false;
                 } else{
                    this.rwidth=false;
                    this.Lwidth=true;
                 }
								 this.isShowMenu = name !='register' && name !='login' && name != 'home' && name != 'class' && name != 'setHomework' && name != 'personMsg' && name != 'rankWork' && name != 'schoolMsg' && name != 'managePaper' && name !='ForgotPwd' && name !='selectObject'?true:false;
                // this.setHeight();
            },
            setHeight(){
              let pageHeight = 0;
              let screenHeight= window.innerHeight
              if(this.isShowMenu){
                pageHeight = screenHeight - 110;
              }else{
                pageHeight = screenHeight - 80;
              }
              this.pageHeight = pageHeight
            }
        }
    }
</script>
