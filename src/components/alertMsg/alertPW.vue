<template>
	<div class="layerPW" ref="unfold">
        <div>
        	<header class="top">
	            <p>修改密码</p>
	            <span class="close" @click="close"></span>
	        </header>
	        <div class="main">
	            <p>
	                <span class="silver">旧密码:</span>
	                <input type="passWord" class="field" placeholder="请输入旧密码" v-model="oldPW" autocomplete="off">
	            </p>
	            <p>
	                <span class="silver">新密码:</span>
	                <input type="passWord" class="field" placeholder="请输入新密码" v-model="newPW" autocomplete="off">
	            </p>
	            <p>
	                <span class="silver">确认密码:</span>
	                <input type="passWord" class="field" placeholder="确认新密码" v-model="surePW" autocomplete="off">
	            </p>
	            <p>
	                <button class="button write" @click="close">取消</button>
	                <button class="button green" @click="sure">确定</button>
	            </p>

	        </div>
        </div>
		<div class="noticeMask"></div>
    </div>
</template>
<script>
	import fetch from './../../fetch'
    import {mapGetters,mapActions} from 'vuex'

	export default{
		data(){
			return{
          oldPW:'',
          newPW:'',
          surePW:''
			}
		},
		props:['layerPW','password'],
		watch:{
			layerPW(val){
				this.$refs.unfold.style.display = 'block';
			}
		},
      methods:{
          ...mapGetters([
              'getUser'
          ]),
          ...mapActions([
              'removeUser'
          ]),
          close(){
              this.$refs.unfold.style.display = 'none';
          },
          sure(){
            	if(!this.newPW || !this.oldPW || !this.surePW){
            		return false;
            	}
            	if(this.oldPW != this.password){
                    this.$toast("旧密码输入错误",'error');
                    return false;
                }
                if(this.oldPW == this.newPW){
                    this.$toast("新密码与旧密码重复",'error');
                    return false;
                }
                if(this.newPW != this.surePW){
                    this.$toast("与新密码输入不符合",'error')
                    return false;
                }

            	fetch.getPassWord({newPwd: this.surePW, oldPwd: this.password}).then(res =>{
                  if(!res){
                      return false;
                  }
									this.$toast("修改密码成功",'right');
									this.removeUser();
									// this.$router.push({path:'login'});
									window.localStorage.removeItem("user")
									window.localStorage.removeItem("basicData")
									let url = window.location.href;
									if(/\.my\./.test(url)){
											window.location.assign(window.location.origin)
									} else {
											window.location.assign("#/web/login")
									}
            	})
            	this.oldPW = '';
            	this.newPW = '';
            	this.surePW = '';
            	this.$refs.unfold.style.display = 'none';

            }
        }
	}
</script>
