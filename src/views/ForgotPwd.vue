<template>
    <div class="fotgotPwd">
      <div class="top">
        <div>
            <span class="sort avbg">1</span>
            <p class="active">确认账号</p>
        </div>

        <div class="lines avlines"></div>

        <div>
          <span class="sort" :class="{avbg: step == 2  || step == 3}">2</span>
          <p class="">安全验证</p>
        </div>

        <div class="lines" :class="{avlines: step == 3}"></div>

        <div>
          <span class="sort" :class="{avbg: step == 3 }">3</span>
          <p class="">重置密码</p>
        </div>
      </div>
      <div class="step" v-if="step == 1">
        <div>
          <label for="">手机号码 :</label>
          <input type="text" placeholder="请输入手机号码" maxlength="11" class="input_filed" v-model="mobile" @input="avbtn(1)">
          <span class="delete" v-if="mobile.length > 0" @click="del(1)"></span>
        </div>
        <button type="button" class="button next" @click="nextStep" :class="{avbg: av_step == 1}">下一步</button>
      </div>
      <div class="step" v-else-if="step == 2">
        <p>我们已向您的手机{{mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}发送了一条6位数的验证码，请打开手机查收</p>
        <div>
          <label for="">验证 :</label>
          <input type="text" placeholder="请输入验证码" maxlength="6" class="verify" v-model="code" @input="avbtn(2)">
          <span class="delete" v-if="code.length > 0" @click="del(1)" style="right: 430px;"></span>
          <button type="button" class="button submit" :class="{avbg: wait == 0}"
          @click="resend">重新发送<span v-if="wait != 0">{{wait}}s</span></button>
        </div>
        <button type="button" class="button next" :class="{avbg: av_step == 2}" @click="nextStep">下一步</button>
      </div>
      <div class="step" v-else-if="step == 3">
        <div class="password">
          <p>
            <label for="">密码 :</label>
            <input type="password" placeholder="请输入验证码" class="input_filed" v-model="password" @blur="confirm">
            <span class="delete" v-if="password.length > 0" @click="del(1)" style="right: 100px;"></span>
          </p>
          <p>
            <label for="">确认密码 :</label>
            <input type="password" placeholder="请输入验证码" class="input_filed" @blur="confirmPwd" v-model="confirmPassword">
            <span class="delete" v-if="confirmPassword.length > 0" @click="del(2)" style="right: 100px;"></span>
          </p>
        </div>
        <button type="button" class="button next" style="margin-left: 30px; margin-top: 0px;" @click="sendPwd">完成</button>
      </div>
    </div>
</template>

<style scoped>
</style>

<script>
import fetch from './../fetch'
import {clientId, brandId} from './../config'

    export default{
        data(){
            return {
              step:1,
              mobile: '',
              av_step:'',
              code:'',
              password:'',
              confirmPassword:'',
              wait: 60,
              flag:false,
              timer:''
            };
        },
        created(){
          this.$nextTick(()=>{

          })
        },
        methods:{
          del(param){
            if(param == 1){
              this.mobile = '';
              this.code = '';
              this.password = '';
            }else{
              this.confirmPassword = '';
            }
            this.av_step = '';
          },
          resend(){
            if(this.wait != 0){
              return false;
            }
            this.wait = 60;
            this.sendCode();
          },
          countTime(){
            var timer = setInterval(()=>{
              if(this.wait==0){
                  clearInterval(timer);
              }else{
                  this.wait--;
              }
            },1000)
          },
          avbtn(param){
            if(param == 1){
              if(this.mobile.length < 11) return false;

              var reg = /^1[3|4|5|7|8][0-9]{9}$/;
              let flag = reg.test(this.mobile);
              if(!flag){
                this.$toast("请输入正确格式的手机号","error");
                return false;
              }
              this.av_step = 1;
            }else if(param == 2){
              this.av_step = 2;
            }
          },
          sendCode(){
              fetch.getsendVerifyCode({mobile:this.mobile,template_id:3,business_id:brandId}).then(res =>{
                if(!res){
                  this.$toast(res.msg,"error");
                  this.step = 1;
                  return false;
                }
                this.step = 2;
                this.countTime();
              })



          },
          nextStep(){
            if(this.av_step == 1){
              this.sendCode();
            }else if(this.av_step == 2){
              this.verifyCode();
            }
          },
          verifyCode(){
            if(this.code.length < 6)  return false;
            fetch.getcheckVerifyCode({verify_code:this.code,business_id:brandId,mobile:this.mobile}).then(res =>{
              if(!res){
                  this.$toast("验证码输入错误",'right');
                  return false;
              }
              this.step = 3;
          })
        },
        confirm(){
          if(this.password.length < 6){
            this.$toast("请输入6-20个字符的密码","error");
            return false;
          }
        },
        confirmPwd(){
          if(this.password != this.confirmPassword) {
            this.$toast("密码前后输入不一致","error")
            return false;
          }
          this.flag = true;
        },
        sendPwd(){
          if(this.flag){
            let param = {
              business_id: brandId,
              mobile: this.mobile,
              verify_code: this.code,
              password: this.password,
              confirmPassword: this.confirmPassword
            }
            fetch.modifyPwd(param).then(res=>{
              if(!res) return false;
              this.$toast(res.msg,"right");
              window.location.assign(window.location.origin)
            })
          }
        }
      }
    }
</script>
