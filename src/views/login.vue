<template>
    <div class="loginBox">
        <div class="login" v-on:keyup.enter="keyLogin" v-if="browser">
            <div class="loginBG" style="background-image: url('./img/login.png');">
                <div class="loginContent">
                    <form action="">
                        <div class="loginBox">
                            <h4>登录账号</h4>
                            <input type="text" placeholder="请输入账号" class="loginInput" v-model.number="userName" >
                            <input type="password" placeholder="请输入密码" class="pwdInput" v-model.number="paddWord">
                            <input type="button" value="登录" class="button loginBtn" @click="login"
                                   v-on:keyup.enter="keyLogin">
                            <div class="loginTools">
                                <div :class="{checkbox:true,checked:isChecked}" @click="checking">
                                    <input type="checkbox">
                                </div>
                                自动登录
                                <div class="ForgotPwd">
                                    <router-link to="ForgotPwd" style="color:#3C85F3;">
                                        找回密码
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div class="log_register">
                        <p @click="register">注册新账号</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="botton">
            Copyright © 2008-2017 Ciwong.Inc.All Right Reserved 深圳习习网络科技有限公司 版权所有 粤ICP备09007483号-1
        </div>
    </div>
</template>

<script>
    import fetch from "./../fetch"
    import {mapGetters,mapActions} from 'vuex'

    export default{
        data(){
            return {
                isChecked: false,
                userName: "492976026", //70018520,492976026
                paddWord: "123456",
                isFocus: false,
                browser: true
            };
        },
        created(){
            this.$nextTick(()=>{
              //   window.localStorage.removeItem('user')
              // if(window.localStorage.userName && window.localStorage.userName != "underfined"){
              //     this.userName = JSON.parse(window.localStorage.getItem("userName")).Name;
              // }
              // if(window.localStorage.Checked && window.localStorage.Checked != "underfined"){
              //     this.isChecked = JSON.parse(window.localStorage.getItem("Checked")).isChecked;
              //     if(!this.isChecked){
              //         return false;
              //     }
              //     this.autoLogin()
              // }
            })

        },
        methods: {
          ...mapGetters([
              'getUser'
          ]),
            ...mapActions([
                'setUser',
                'setToast',
                'removeUser'
            ]),
            login(){
                if (this.userName.length == 0 || this.paddWord.length == 0) {
                    this.$toast('请输入账户或密码','error')
                    return;
                }
                fetch.login({username : this.userName, password: this.paddWord.toString()}).then(res => {
                    if(!res){
                        this.$toast('账号或密码错误哦~','error')
                        return false;
                    }
                     let obj ={"userId":this.userName,"clientId":100143,"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcwMDE4NTIwLCJjbGllbnRJZCI6IjEwMDE0MyIsIm1vYmlsZSI6IjEzMDExMTExMTExIiwicmVhbE5hbWUiOiLmoJflrZDogIHluIjkuIAiLCJuaWNrTmFtZSI6Iuagl-WtkOiAgeW4iOS4gCIsImF2YXRhciI6IiIsImlhdCI6MTUwNjU5NDgzNH0.sudUdXHibosWTBWECRNtLQWRBbBUpdDHQHSTxIl05mw","mobile":"13011111111","realName":"栗子老师一","nickName":"栗子老师一","avatar":"","brandId":524726977,"schoolId":0,"brandName":"测试用","logo":"http://rimg3.ciwong.net/6v68/tools/images/155014/4a399d2a0ea8c1d3baff62fb21fb96898d7e4359.png","host":"http://eapi.my.jiaofucloud.cn","qudao":"http://qudao.jiaofuyun.site","username":"70018520","password":"123456","isUnread":false}
                    if (res.data.accessToken) {
                         this.setUser(obj);
                         window.localStorage.setItem("userName",JSON.stringify({"Name":this.userName}));
                         window.localStorage.setItem("passWord",JSON.stringify({"paddWord":this.paddWord}))
                         window.sessionStorage.setItem('pageIndex',1);
                         this.$router.push({path:"/web/"});
                         console.log(this.$router);
                    }
                }, (err) => {
                    console.log(err);
                })
            },
            checking(){
                this.isChecked = !this.isChecked;
                if(this.isChecked){
                    window.localStorage.setItem("Checked",JSON.stringify({"isChecked":this.isChecked}));
                }

            },
            autoLogin(){
                if(window.localStorage.userName && window.localStorage.userName != "underfined"){
                    this.userName = JSON.parse(window.localStorage.getItem("userName")).Name;
                }
                if(window.localStorage.passWord && window.localStorage.passWord != "underfined"){
                    this.paddWord = JSON.parse(window.localStorage.getItem("passWord")).paddWord;
                }
                this.login();
            },
            //键盘事件
            keyLogin(){
                this.login();
            },
            register(){
              this.$router.push({path:"register"})
            }
        }
    }
</script>
