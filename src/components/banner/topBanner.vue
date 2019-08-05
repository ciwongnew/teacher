<template>
    <div class="topBanner">
        <div class="topContent">
            <div class="topIcon">
                <div style="cursor: pointer;" @click="clickLogo">
                  <!-- <img :src="userLogo" alt="" height="50"> -->
                  <img src="./../../assets/img/logo5.png" alt="">
                </div>
                <span class="loginBox" v-if="loginState == 0">
                        登录
                </span>
                <span class="loginBox" v-else-if="loginState == 1">
                        找回密码
                </span>
                <span class="loginBox" v-else-if="loginState == 3">
                        注册新账号
                </span>
            </div>
            <div class="serviceTel" v-if="loginState == 0">
                客服电话：400-800-5500
            </div>
            <ul class="ulBanner" v-if="loginState == 2">
                <li>
                    <router-link @click.native="goHome" to="/web/" :class="{active:isActive[0]}">作业</router-link>
                </li>
                <li>
                    <router-link to="/web/class" :class="{active:isActive[1]}">班级</router-link>
                </li>
                <li>
                    <!-- <router-link to="/web/schoolMsg" @click.native="modify">校讯通</router-link> -->
                    <router-link to="/web/schoolMsg" :class="{active:isActive[2]}">校讯通</router-link>
                    <i :class="{msgPro:userInformation.isUnread}"></i>
                </li>
                <li>
                    <!-- <router-link to="/web/schoolMsg" @click.native="modify">校讯通</router-link> -->
                    <router-link to="/web/managePaper" :class="{active:isActive[3]}">试卷管理</router-link>
                </li>
            </ul>
            <div class="topRight" v-if="loginState == 2">
                <div class="teacher">
                    <div class="teacherBox">
                        <img src="./../../assets/img/personal.png" alt="" class="teacherIcon">
                        <span>{{userInformation.realName}}<i></i></span>
                        <div class="teacherInformation box-shadow2">
                            <div class="informationTop">
                                <img class="teacherIcon" :src="userInformation.avatar" alt="" v-if="userInformation.avatar">
                                <div class="teacherAccount">
                                    <h4>{{userInformation.realName}}</h4>
                                    <span>账号：<b>{{userInformation.userId}}</b></span>
                                </div>
                            </div>
                            <ul class="informationBottom">
                                <li>
                                    <router-link :to="{name: 'personMsg', params:{userId: userInformation.userId}}">
                                        个人资料修改 <b>></b></router-link>
                                </li>

                                <li>
                                    <div class="logout" @click="logout">退出登录<b>></b></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!-- <router-link :to="{path:'systemMessages'}" class="message" :class="{unread:isUnread}"
                                 @click.native="modify"></router-link> -->
                </div>
            </div>
            <cousultant :loginState="loginState" :cousultants="cousultants" v-if="isShowClt"></cousultant>
            <div class="forgetPwd" v-if="loginState == 1">
                <span>客服电话：400-800-5500</span>
                <a href="/">登录</a>
                <span>注册</span>
            </div>
            <div class="registerState" v-else-if="loginState == 3">
                <span>已有账号？</span>
                <a href="/" class="re_login">立即登录</a>
            </div>
        </div>
        <notice :params="params" :isNotice="isNotice" @isConfirm="isConfirm"></notice>
    </div>
</template>

<script>
import fetch from "./../../fetch";
import { mapGetters, mapActions } from "vuex";
import cousultant from "./consultant.vue";
import notice from "./../notice/notice.vue";
import { logo, schoolId } from "./../../config";

export default {
  data() {
    return {
      userInformation: this.getUser(),
      loginState: 0, //0:未登录 1:未登录并在忘记密码页面 2:已登录 3: 注册页面
      sids: "", //老师所属学校ID
      cousultants: "", //教育顾问详细信息
      avatar: "",
      isNotice: false,
      tabAbtive: true,
      params: {},
      userLogo: "",
      isShowClt: false,
      initLogo: "./static/img/photo.png",
      isActive: [true, false, false, false]
    };
  },
  components: {
    cousultant,
    notice
  },
  created() {
    window.addEventListener("load", this.windowOnLoad);
    if (schoolId === 0) {
      this.isShowClt = true;
    }
    if (
      window.location.href.indexOf("/web/") > -1 &&
      window.location.href.indexOf("ForgotPwd") === -1 &&
      window.location.href.indexOf("register") === -1
    ) {
      this.isLogin();
    }
    this.$nextTick(() => {
      this.userInf();
      this.userLogo = logo ? logo : "";
    });
  },
  watch: {
    $route: function(newValue, oldValue) {
      this.userLogo = logo;
      if (newValue.name != "login") {
        this.userInf();
        this.getNoMsg();
        if (newValue.name == "ForgotPwd") {
          this.loginState = 1;
        }
        if (newValue.name == "register") {
          this.loginState = 3;
        }
      } else {
        this.loginState = 0;
      }
      let arr = [false, false, false];
      switch (newValue.name) {
        case "class":
          arr[1] = true;
          this.isActive = arr;
          break;
        case "schoolMsg":
          arr[2] = true;
          this.isActive = arr;
          break;
        case "managePaper":
          arr[3] = true;
          this.isActive = arr;
          break;
        default:
          arr[0] = true;
          this.isActive = arr;
          break;
      }
    }
  },
  methods: {
    ...mapGetters(["getUser"]),
    ...mapActions(["setUser", "removeUser"]),
    clickLogo() {
      if (this.loginState === 1 || this.loginState === 3) {
        window.location.assign(window.location.origin); //根据登录状态跳转
      } else {
        this.$router.push({ path: "/web/" });
      }
    },
    isLogin() {
      fetch
        .getDetailedInf({ uin: this.userInformation.userId })
        .then(res => {
          if (!res) {
            return false;
          }
          const sidsArr = [];
          for (var i = 0, len = res.data.classes.length; i < len; i++) {
            const item = res.data.classes[i];
            sidsArr.push(item.schoolId);
            this.sids = sidsArr.join(",");
          }
          //获取教育顾问信息接口
          if (res.data.classes.length === 0) {
            this.$router.push({ path: "class" });
            return false;
          }
          return true;
        })
        .then(res => {
          if (res) {
            fetch.getConsultant({ sIds: this.sids }).then(res => {
              if (!res) {
                return false;
              }
              for (var i = 0, len = res.data.length; i < len; i++) {
                const item = res.data[i];
                if (item.userId == null) {
                  this.cousultants = item;
                }
              }
            });
          }
        });
    },
    getNoMsg() {
      //获取用户消息
      fetch.unreadMessage({ msgType: 30 }).then(res => {
        if (!res) {
          return;
        }
        let userInfo = this.getUser();
        if (res.data > 0) {
          this.$set(this.userInformation, "isUnread", true);
          this.setUser(this.userInformation);
        } else {
          this.$set(this.userInformation, "isUnread", false);
          this.setUser(this.userInformation);
        }
      });
    },
    //跳转去首页事件
    goHome() {
      //              this.$router.push({path: "/"})
    },
    //            toHome(){
    //                if(this.loginState<2){
    //                    this.$router.push({path: "login"})
    //                }else if(this.loginState==2){
    //                    this.$router.push({path: "/"});
    ////                    document.getElementsByClassName('view')[0].scrollTop = 0;
    //                }
    //            },
    modify() {
      this.isUnread = false;
    },
    logout() {
      this.isNotice = !this.isNotice;
      this.params = { type: 1, noticeText: "确认退出账号登录!", noticeTitle: "确认退出" };
    },
    isConfirm(val) {
      if (val) {
        window.localStorage.setItem(
          "Checked",
          JSON.stringify({ isChecked: false })
        );
        this.userInformation = {};
        this.loginState = 2;
        this.removeUser();
        window.localStorage.removeItem("user");
        window.localStorage.removeItem("basicData");
        let url = window.location.href;
        if (/\.my\./.test(url)) {
          window.location.assign(window.location.origin);
        } else {
          window.location.assign("#/web/login");
        }
        if (this.userInformation.accessToken) {
          this.loginState = 0;
        } else {
          this.loginState = 2;
        }
      }
    },
    windowOnLoad() {
      this.userLogo = logo;
      if (this.$route.name != "login") {
        this.userInf();
        if (this.$route.name == "ForgotPwd") {
          this.loginState = 1;
        }
        if (this.$route.name == "register") {
          this.loginState = 3;
        }
      } else {
        this.loginState = 0;
      }
      let arr = [false, false, false];
      switch (this.$route.name) {
        case "class":
          arr[1] = true;
          this.isActive = arr;
          break;
        case "schoolMsg":
          arr[2] = true;
          this.isActive = arr;
          break;
        case "managePaper":
          arr[3] = true;
          this.isActive = arr;
          break;
        default:
          arr[0] = true;
          this.isActive = arr;
          break;
      }
    },
    userInf() {
      this.userInformation = this.getUser();
      this.userInformation.avatar =
        this.userInformation.avatar || this.initLogo;
      if (this.userInformation.accessToken) {
        this.loginState = 2;
      } else {
        this.loginState = 0;
      }
    },
    getData() {
      fetch.getSystemMessages(this.param).then(res => {
        if (!res) {
          return;
        }
        this.arr = res.data.pageList;
      });
    }
  }
};
</script>
