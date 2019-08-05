<template lang="html">
  <div class="register">
    <form class="" action="index.html" method="post">
      <div class="" v-if="step == 1">
        <div class="headMsg">
          <img src="../assets/img/cellphone.png" alt="">
          <p style="vertical-align: sub;">验证手机号</p>
        </div>
        <p>
          <label for="tel">手机号码 :</label>
           <!-- onkeyup="value=value.replace(/[^\d]/g,'') " -->
          <input type="text" :class="{error_bor: !isRegTel}" placeholder="请输入手机号码" maxlength="11" v-model="regTel" @input="checkInput(1)">

        </p>
        <span v-show="flag_num" class="error_msg">
          <img src="./../assets/img/error_msg.png" alt="">
          <span>仅支持数字的输入</span>
        </span>
        <p>
          <label for="verify">手机验证码 :</label>
           <!-- onkeyup="value=value.replace(/[^\d]/g,'') " -->
          <input type="text" id="verify" maxlength="6" placeholder="请输入验证码" :class="{error_bor: !isVerify}" v-model="verifyNum">
          <button type="button" class="button gray verify" :class="{btn_resend: regTel.length == 11 && !waitCode, seconds: waitCode}">
            <span style="display: block;width: 100%;" v-if="check_tel && !waitCode" :class="{col_fff: regTel.length == 11}"  @click="verifyTel">获取验证码</span>
            <span v-if="waitCode">{{wait}}s后重试</span>
            <span  v-if="!check_tel && !waitCode"  @click="resend">重新发送</span>
          </button>
        </p>
        <p style="text-align: center; margin-left: -40px;">
          <button type="button" class="button gray btn_register" :class="{btn_resend: verifyNum.length >= 6}" @click="checkNum">下一步</button>
        </p>
      </div>

      <div class="" v-else-if="step == 2">
        <div class="headMsg">
          <img src="../assets/img/register_data.png" alt="">
          <p>完善资料</p>
        </div>
        <p>
          <label for="name">真实姓名 :</label>
          <!-- onkeyup="value=value.replace(/[^\u4E00-\u9FA5]/g,'')" -->
          <input type="text" :class="{error_bor: flag_name}" placeholder="请输入真实姓名" v-model="username"  maxlength="10" @input="checkInput(2)">
        </p>
        <span v-show="flag_name" class="error_msg">
          <img src="./../assets/img/error_msg.png" alt="">
          <span>仅支持2-10个汉字输入</span>
        </span>

        <p>
          <label for="passWord">密码 :</label>
           <!-- onkeyup="value=value.replace(/[\W]/g,'') " -->
          <input type="passWord" class="" placeholder="请输入密码" v-model="password" maxlength="16" @input="checkInput(3)">
        </p>
        <span v-show="flag_password" class="error_msg">
          <img src="./../assets/img/error_msg.png" alt="">
          <span>仅支持字母和数字的组合</span>
        </span>

        <p>
          <label for="passWord">确认密码 :</label>
          <!-- onkeyup="value=value.replace(/[\W]/g,'') " -->
          <input type="password" class="" placeholder="请再次输入密码" v-model="confirmPassword"  maxlength="16">
        </p>
        <p style="text-align: center; margin-left: -40px;">
          <button type="button" class="button gray btn_register" :class="{btn_resend: confirmPassword.length >= 6 && password.length >= 6}" @click="register">注册</button>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import fetch from './../fetch'
import {clientId, brandId} from './../config'

export default {
  data(){
    return{
      step: 1,
      check_tel:true,
      regTel:'',
      wait:60,
      timer: '',
      waitCode: false,
      isRegTel: true,
      isVerify: true,
      verifyNum: '',
      username: '',
      password: '',
      confirmPassword: '',
      flag_num: false,
      flag_name: false,
      flag_password: false
    }
  },
  methods:{
     ...mapGetters([
          'getUser'
      ]),
      ...mapActions([
          'setUser'
      ]),
     verifyTel(){
        if(this.regTel.length < 11) return false;

        let reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
        let flag = reg.test(this.regTel); //true
        if(flag){
          this.sendCode()
        }else{
          this.isRegTel = false;
          this.$toast("请输入正确的手机号",'error');
        }
      },
      resend(){
        if(this.wait != 0){
          return false;
        }
        this.wait = 60;
        this.sendCode();
      },
      sendCode(){
          this.countTime();
          fetch.getsendVerifyCode({mobile:this.regTel,template_id:2,business_id:brandId}).then(res =>{
            if(!res){
             this.isVerify = false;
              this.$toast(res.msg,"error");
              return false;
            }
            // this.check_tel = false;
            this.waitCode = true;
            this.$toast('发送成功',"right");
          })
      },
      countTime(){
        this.check_tel = false;
        var timer = setInterval(()=>{
          if(this.wait==0){
            this.waitCode = false;

            clearInterval(timer);
          }else{
              this.wait--;
          }
        },1000)
      },
      checkNum(){
        if(this.verifyNum.length < 6)  return false;
        fetch.getcheckVerifyCode({verify_code:this.verifyNum,business_id:brandId,mobile:this.regTel}).then(res =>{
          if(!res){
              this.$toast(res.msg,'error');
              return false;
          }
          this.step = 2;
        })
      },
      register(){
        if(this.username.length<2 || this.password.length<6 || this.confirmPassword.length<6) {
          return false;
        }
        if(this.password != this.confirmPassword) {
          this.$toast("密码前后输入不一致","error")
          return false;
        }
        if(this.flag_num || this.flag_name || this.flag_password) {
          return false;
        }
        let params = {
          business_id:brandId,
          mobile: this.regTel,
          verify_code: this.verifyNum,
          username: this.username,
          sex: 0,
          password: this.password,
          confirmPassword: this.confirmPassword
        }
        var initdata =  window.localStorage.user? JSON.parse(window.localStorage.user) : {};
        // window.location.href  = window.location.origin + '?stade=2';
        var that = this
         fetch.signup(params).then(res=>{
           if(!res){
             this.$toast(res.msg, 'error')
             return false;
           }
           var mobile = res.data.mobile;
           this.$toast("注册成功！", 'right')
           console.log(mobile)
           fetch.login({username: mobile, password: this.password}).then(res =>{
            if (res) {
              var userData = Object.assign(res.data, initdata)
              window.localStorage.setItem('user', JSON.stringify(userData))
              this.setUser(userData)
              that.$router.push({path:"/web/class"});
            }
          })
       })
      },
      checkInput(type){
        if(type == 1){
          //手机号
          let reg = /[^\d]/g;
          let flag_num = reg.test(this.regTel )
          if(flag_num) {
            this.flag_num = true;
          } else {
            this.flag_num = false;
          }
        }else if(type == 2){
          //姓名
          let reg =/[^\u4E00-\u9FA5]/g;
          let flag_name = reg.test(this.username )
            console.log('flag_name', flag_name)
          if(flag_name || (this.username.length < 2 && this.username.length > 0)) {
            this.flag_name = true;
          } else {
            this.flag_name = false;
          }
        }else{
          //密码
          let reg =/[\W]/g;
          let flag_password = reg.test(this.password )
          console.log('flag_password', flag_password)
          if(flag_password) {
            this.flag_password = true;
          }else {
            this.flag_password = false;
          }
        }
      }
    }
  }

</script>

<style lang="sass">
</style>
