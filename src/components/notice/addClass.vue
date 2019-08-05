<template>
    <div class="notice"  @click.stop="closeUl">
        <div class="noticeHead">
            {{title}}
        </div>
        <div class="addClassStep1" v-if="step==1">
            <div class="addClass">
                <div class="schoolName">
                    <span>所在学校:</span>
                    <input type="text" v-model="schoolName"  class="checkSchool" @click="modify" placeholder="选择学校" />
                    <!-- <span class="checkSchool" @click="modify" :placeholder="params.currentClass.schoolName"> -->

                </div>
                <div class="grads" v-for="(item,index) in addClassList">
                    <span v-if="index==0">创建班级:</span><span class="zhanwei" v-if="index!=0"></span><input type="text" v-model="item.currentText" @click.stop="showUl(index)" :class="{arrowDown:!item.isShowUl,arrowUp:item.isShowUl}" placeholder="选择年级">
                    <input type="text" class="className" v-model="item.className" placeholder="输入班级名称" maxlength="10">
                    <div class="deleteAdd" v-if="addClassList.length>1 && index!=0" @click="deleteAdd(index)"></div>
                    <ul class="gradsUl" v-if="item.isShowUl">
                        <li v-for="item in gradsArr" @click.stop="checkGrad(item,index)">{{item.text}}</li>
                    </ul>
                </div>
                <div class="oneMoreClass" v-if="false">
                    <button class="button green" @click="oneMoreClass">再建一个</button>
                </div>
            </div>
        </div>
        <div class="addClassStep2" v-else-if="step==2">
            <div class="content">
                <div class="main">
                    <div class="selectArea">
                        <checkArea @selectAreas="selectAreas"></checkArea>
                    </div>
                    <div class="p">
                        <input type="text" class="field" placeholder="搜索学校名称" v-model="keyWords" @keyup.enter="search">
                        <span @click="search"></span>
                    </div>

                    <div class="prompt" v-show="schoolList.length != 0">
                        <p>您可能想添加:</p>
                        <ul class="clear clearfix">
                            <li v-for="item in schoolList" :title="item.schoolName" @click="checkSchool(item)">{{item.schoolName}}</li>
                        </ul>
                    </div>
                    <p v-show="schoolList.length == 0">未找到相关学校，若需创建学校，请联系客服(400-800-5500)</p>
                </div>
            </div>
            <paging :PagenumId="PageIndex" :PageCount="PageCount" @mypagenum="pageNum" v-show="schoolList.length != 0"></paging>
        </div>
        <div class="addFinish" v-else-if="step==3">
            <div class="addFinishContent">
                <div class="finishIcon"></div>
                <p class="finishTitle">创建班级成功!</p>
                <p class="finishClassName" v-for="item in addClassList">
                    <span class="class">班级名称:</span>&nbsp;<span class="classNmae">{{item.className}}</span>
                </p>
                <p class="teacherPhone">请告诉学生输入您的手机号 <span>{{params.mobile}}</span> 加入班级</p>
            </div>
        </div>
        <div class="noticeClose" @click="closeNotice"></div>
        <div class="noticeBottom" v-if="step!=2">
            <button class="abolish" @click="abolish">{{abolishText}}</button>
            <button class="ensure1 button green" @click="ensure">{{ensureText}}</button>
        </div>
    </div>
</template>

<style scoped>

</style>

<script>
import {
  elementaryPeriods,
  juniorPeriods,
  periods
} from "./../../data/periods";
import checkArea from "./../checkArea/checkArea.vue";
import fetch from "./../../fetch";
import paging from "./../../components/paging/paging.vue";
import { brandId, schoolId } from "./../../config";
export default {
  data() {
    return {
      isConfirm: false,
      gradsArr: elementaryPeriods,
      addClassList: [
        {
          isShowUl: false,
          currentText: "",
          currentGrad: "",
          currentPeriod: "",
          className: ""
        }
      ],
      step: 1,
      areaCode: "",
      keyWords: "",
      schoolList: [],
      title: this.params.noticeTitle,
      param: "",
      schoolId: this.params.currentClass.schoolId || "",
      schoolName: this.params.currentClass.schoolName || "",
      abolishText: "取消",
      ensureText: "确定",
      PageIndex: 0,
      PageCount: 1,
      clickFlag: true
    };
  },
  props: ["params"],
  components: {
    checkArea,
    paging
  },
  watch: {
    step(val) {
      if (val == 2) {
        // this.getData();
      }
    }
  },
  created() {
    if (this.params.currentClass.schoolName.indexOf("小学") > -1) {
      this.gradsArr = elementaryPeriods;
    } else if (this.params.currentClass.schoolName.indexOf("中学") > -1) {
      this.gradsArr = juniorPeriods;
    } else if (this.params.currentClass.schoolName.indexOf("初中") > -1) {
      this.gradsArr = juniorPeriods;
    } else {
      this.gradsArr = periods;
    }
  },
  methods: {
    abolish() {
      if (this.step == 3) {
        this.addClassList = [
          {
            isShowUl: false,
            currentText: "",
            currentGrad: "",
            currentPeriod: "",
            className: ""
          }
        ];
        this.abolishText = "取消";
        this.ensureText = "确定";
        this.schoolName = "";
        this.title = "创建班级";
        this.step = 1;
      } else {
        this.$emit("isConfirm", this.isConfirm);
      }
    },
    ensure() {
      if (!this.clickFlag) {
        return false;
      }
      if (this.step == 1) {
        this.clickFlag = false;
        if (this.addClassList[0].currentText == "") {
          this.$toast("请选择年级", "error");
          return;
        } else if (this.addClassList[0].className == "") {
          this.$toast("请输入班级名字", "error");
          return;
        }
        for (var i = 0, len = this.addClassList.length; i < len; i++) {
          const item = this.addClassList[i];
          const addClassObj = {
            uId: brandId,
            className: item.className,
            period: item.currentPeriod,
            grade: item.currentGrad,
            schoolId: this.schoolId
          };
          fetch.createClass(addClassObj).then(res => {
            if (!res) {
              return false;
            }
            if (res) {
              this.step = 3;
              this.abolishText = "继续添加";
              this.ensureText = "查看我的班级";
              this.clickFlag = true;
              console.log(res);
            }
          });
        }
      } else if (this.step == 3) {
        this.isConfirm = true;
        this.$emit("isConfirm", this.isConfirm);
      }
    },
    closeNotice() {
      // this.isConfirm = false;
      this.$emit("isConfirm", this.isConfirm);
    },
    oneMoreClass() {
      this.addClassList.push({
        isShowUl: false,
        currentText: "",
        currentGrad: "",
        currentPeriod: ""
      });
    },
    showUl(index) {
      this.addClassList[index].isShowUl = !this.addClassList[index].isShowUl;
    },
    closeUl() {
      for (var i = 0, len = this.addClassList.length; i < len; i++) {
        this.addClassList[i].isShowUl = false;
      }
    },
    checkGrad(item, index) {
      this.addClassList[index].isShowUl = false;
      this.addClassList[index].currentText = item.text;
      this.addClassList[index].currentGrad = item.grade;
      this.addClassList[index].currentPeriod = item.period;
    },
    modify() {
      if (schoolId > 0) {
        return false;
      }
      this.step = 2;
      this.title = "选择学校";
    },
    //选择学校系列方法
    setParams() {
      this.param = {
        page: this.PageIndex,
        pagesize: 10
      };
      if (this.keyWords || this.areaCode) {
        this.param.areaCode = this.areaCode;
        this.param.wd = this.keyWords;
      }
    },
    selectAreas(obj) {
      if (obj.type != "province") {
        this.PageIndex = 1;

        let id = obj.id;
        this.areaCode = id;
        this.getData();
      }
    },
    getData() {
      this.setParams();
      fetch.getSchool(this.param).then(res => {
        if (!res) {
          return false;
        }
        this.schoolList = res.data;
        this.PageCount = Math.ceil(res.total / this.param.pagesize);
      });
    },
    search() {
      this.PageIndex = 1;
      if (!this.keyWords.trim()) {
        this.getData();
      }
      this.getData();
    },
    checkSchool(item) {
      switch (item.period) {
        case 2:
          this.gradsArr = elementaryPeriods;
          break;
        case 4:
          this.gradsArr = periods;
          break;
        case 12:
          this.gradsArr = juniorPeriods;
          break;
        default:
          this.gradsArr = periods;
      }
      this.schoolName = item.schoolName;
      this.title = "创建班级";
      this.schoolId = item.schoolId;
      this.step = 1;
    },
    deleteAdd(index) {
      this.addClassList.splice(index, 1);
    },
    pageNum(num) {
      this.PageIndex = num;
      this.getData();
    }
  }
};
</script>
