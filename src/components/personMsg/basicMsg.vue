<template>
	<div class="toogle_content">
        <form class="basic-grey">
            <label>
                <span class="leftSpan">账号 :</span>
                <span class="rightSpan">{{userInformation.userId}}</span>
            </label>
            <label>
                <span class="leftSpan">密码 :</span>
                <span class="rightSpan" style="color: #333;">
									<input type="text" name="" value="******" readonly="readonly">
									<i @click="altPassWord">修改密码</i>
								</span>
            </label>
            <label>
                <span class="leftSpan">姓名 :</span>
                <span class="rightSpan">{{userInformation.realName}}</span>
            </label>
            <label>
                <span class="leftSpan" style="padding-left: 10px;">性别 :</span>
                <div class="">
									<p class="radio">
											<span>男</span>
											<span class="sex" :class="{'checkSex': check}" @click="modify"></span>
											<!-- <span :class="{'checkSex':check}"></span> -->
									</p>
									<p class="radio">
											<span>女</span>
										 <span class="sex" :class="{'checkSex': !check}" @click="modify"></span>
											<!-- <span :class="{'checkSex':!check}"></span> -->
									</p>
                </div>
            </label>
            <label>
                <span class="leftSpan">手机号码 :</span>
                <span class="rightSpan" style="color: #333333;">{{mobile}}</span>
                <span class="bule_alert" @click="altMobile">更换手机号</span>
            </label>
        </form>
        <div>
            <alertMobile :layerMB="layerMB" :oldMobile="mobile" @sureMobile="sureMobile"></alertMobile>
        </div>
        <div>
            <alertPW :layerPW="layerPW" :password="userInformation.password"></alertPW>
        </div>

    </div>
</template>
<script>
    import {mapActions,mapGetters} from 'vuex'
    import fetch from './../../fetch'
    import alertMobile from "./../alertMsg/alertMobile.vue"
    import alertPW from "./../alertMsg/alertPW.vue"
    import {nowDate, formatDate, aroundDate, timeStamp} from './../../filter'

	export default{
		data(){
			return{
        layerMB:false,
        layerPW:false,
        mobile:'',
        check: ''
			}
		},
		props:['userInformation','birthday','userId'],
		components:{
            alertMobile,
            alertPW
		},
    watch:{
       userInformation(val){
           this.check = this.userInformation.sex;

        }
    },
    created(){
        this.$nextTick(()=>{
            this.mobile = this.getUser().mobile

        })
    },

   methods:{
      ...mapGetters([
          'getUser'
      ]),
      altPassWord(){

          this.layerPW = !this.layerPW;
      },

      altMobile(){
          this.layerMB = !this.layerMB;
      },
      sureMobile(res){
          this.mobile = this.getUser().mobile
      },
      modify(){
          this.check = !this.check;

          if(!this.check){
              fetch.modifySex({sex: 0}).then(res =>{
                  if(!res){
                     return false;
                  }
									this.$toast("修改成功",'right')
              })
          }else{
          fetch.modifySex({sex: 1}).then(res =>{
              if(!res){
                  return false;
              }
							this.$toast("修改成功",'right')
          })
        }
      }

    }
	}
</script>
