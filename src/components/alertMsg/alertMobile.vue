<template>
	<div class="layerMB" ref="unfold">
        <div>
        	<header class="top">
	            <p>更换手机号</p>
	            <span class="close" @click="close"></span>
	        </header>
	        <div class="main">
	            <p>更换新手机号后,原手机号{{oldMobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}将不能再作为登录使用！</p>
	            <p>
	                <span class="silver">新手机号:</span>
	                <input type="text" class="field" placeholder="请输入新的手机号" v-model="newNum" maxlength="11">
	            </p>
	            <p>
	                <span class="silver">验证码:</span>
	                <input type="text" class="field" placeholder="请输入验证码" v-model="securityNum">
	                <button class="button green" @click="send">
										<span v-if="!waitCode">获取验证码</span>
										<span v-else>{{wait}}s后重新获取</span>
									</button>
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
import { mapActions, mapGetters } from "vuex";
import fetch from "./../../fetch";
import { clientId, brandId } from "./../../config";

export default {
  data() {
    return {
      newNum: "",
      securityNum: "",
      flag: "",
      wait: 60,
      waitCode: false
    };
  },
  props: ["layerMB", "oldMobile"],
  watch: {
    layerMB(val) {
      this.$refs.unfold.style.display = "block";
    }
  },
  methods: {
    ...mapActions(["removeCrumb", "setCrumb", "setUser"]),
    ...mapGetters(["getUser"]),
    close() {
      this.$refs.unfold.style.display = "none";
      this.newNum = "";
      this.securityNum = "";
      this.waitCode = false;
      this.wait = 60;
    },
    send() {
      if (!this.newNum) {
        this.$toast("未输入手机号", "error");
        return false;
      } else {
        var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则

        var flag = reg.test(this.newNum); //true
      }
      if (flag) {
        fetch
          .getsendVerifyCode({
            mobile: this.newNum,
            template_id: 1,
            business_id: brandId
          })
          .then(res => {
            if (!res) {
              return false;
            }
            this.waitCode = true;
            this.$toast("已发送验证码成功", "right");
						this.countTime();
          });

      } else {
        this.$toast("格式不正确", "error");
        return false;
      }
    },
    countTime() {
      var timer = setInterval(() => {
        if (this.wait == 0) {
          this.waitCode = false;
          clearInterval(timer);
        } else {
          this.wait--;
        }
      }, 1000);
    },
    sure() {
      if (!this.securityNum || !this.newNum) {
        return false;
      }
      fetch
        .getcheckVerifyCode({
          verify_code: this.securityNum,
          business_id: brandId,
          mobile: this.newNum
        })
        .then(res => {
          if (!res) {
            return false;
          }
          this.modifyMB();
        });
    },
    modifyMB() {
      fetch
        .getMobile({
          verify_code: this.securityNum,
          business_id: brandId,
          mobile: this.newNum
        })
        .then(res => {
          if (!res) {
            return false;
          }
          let userInfo = this.getUser();
          userInfo.mobile = this.newNum;
          this.setUser(userInfo);

          this.$toast("手机号修改成功", "right");
          this.$emit("sureMobile", this.newNum);
          this.$refs.unfold.style.display = "none";
          this.newNum = "";
          this.securityNum = "";
        });
    }
  }
};
</script>
