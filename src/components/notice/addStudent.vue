<template>
    <div class="notice">
        <div class="noticeHead">
            {{params.noticeTitle}}
        </div>
        <div class="" style="width: 440px;margin: 30px auto 40px;border: 1px solid #e6e6e6;">
          <div class="noticeMenu">
              <div class="oldAccount fl" @click="oldStuClick" :class="{active:!isNewStudent}">
                <span class="line"></span>
                已有账号
              </div>
              <div class="newAccount fl" @click="newStuClick" :class="{active:isNewStudent}">
                <span class="line"></span>
                新建账号
              </div>
          </div>
          <div class="searchStuBox" v-if="!isNewStudent">
              <div class="noticeSearchStu">
                  <div class="searchBox">
                      <input type="text" class="field" placeholder="请输入学生的账号/手机号" v-on:input="search" v-model="userId">
                      <span class="searchStudent"></span>
                  </div>
              </div>
              <div class="searchResult" v-if="newStudentInf">
                  <p>可能添加的学生:</p>
                  <div class="studentInf">
                      <img :src="newStudentInf.avatar" :alt="newStudentInf.realName" class="studentImg" v-if="newStudentInf.avatar">
                      <img src="./../../assets/img/photo.png" :alt="newStudentInf.realName" class="studentImg" v-else-if="!newStudentInf.avatar">
                      <span class="studentName">{{newStudentInf.userName}}</span>
                      <img :src="newStudentInf.src" alt="性别" class="sex" v-if="false">
                      <span class="studentAccount">{{newStudentInf.userId}}</span>
                      <div class="clickAddStu" @click="addStudent(newStudentInf.userId,newStudentInf.realName)">添加</div>
                  </div>
              </div>
              <div class="noUsers" v-if="!newStudentInf&&isSearch">
                  <p>未找到符合条件的学生!</p>
              </div>
          </div>
          <div class="createdStudentBox" v-else-if="isNewStudent">
              <textarea name="student" id="" cols="30" rows="10" placeholder="请输入学生姓名，每行一个(可以直接复制粘贴Excle中的数据)" v-model.trim="studentNames"></textarea>

          </div>

        </div>
        <div class="passwordBox" v-if="isNewStudent">
            <span class="fl">为新建账号设置初始密码:</span>
            <div class="randomPwd fl" @click="setRandomPwd">
                <i class="checkKuang">
                    <u v-if="isChecked"></u>
                </i>
                <span>随机密码</span>
            </div>
            <div class="initialPwd fl" @click="setinitialPwd">
                <i class="checkKuang">
                    <u v-if="!isChecked"></u>
                </i>
                <span>统一密码</span>
            </div>
        </div>
        <div class="noticeClose" @click="closeNotice"></div>
        <div class="noticeBottom" v-if="isNewStudent">
            <button class="abolish" @click="abolish">{{params.button1 || "取消"}}</button>
            <button class="ensure1 button green" @click="ensure">{{params.button2 || "确定"}}</button>
        </div>
    </div>
</template>

<script>
import fetch from "./../../fetch";
export default {
  data() {
    return {
      isConfirm: false,
      isNewStudent: false,
      isChecked: false,
      userId: "",
      newStudentInf: "",
      studentNames: "",
      studentsArr: [],
      isRandomPwd: 0,
      initialPwd: 123456,
      isSearch: false
    };
  },
  props: ["params"],
  created() {
    console.log(this.params);
  },
  methods: {
    abolish() {
      this.$emit("isConfirm", this.isConfirm);
    },
    ensure() {
      let that = this;
      if (this.studentNames == "") {
        this.$toast("请输入学生的姓名~", "error");
        return false;
      }
      let userArr = this.studentNames.split(/\s/);
      for (var i = userArr.length - 1, len = 0; i > len; i--) {
        debugger;
        let item = userArr[i];
        if (item == "") {
          userArr.splice(i, 1);
        }
      }
      const initialLength = userArr.length;
      let classStudent = this.params.classStudent;
      let repetitiveName = [];
      if (classStudent.length > 0) {
        classStudent.forEach(function(item1) {
          userArr.forEach(function(item2, index) {
            if (item1.userName == item2) {
              repetitiveName.push(item1.userName);
              userArr.splice(index, 1);
            }
          });
        });
      }
      userArr.forEach(function(item) {
        that.studentsArr.push({ name: item });
      });
      let repetitiveStr = repetitiveName[0];
      if (that.studentsArr.length == 0) {
        if (initialLength == 0) {
          this.$toast("请输入学生的姓名~", "error");
          return false;
        } else {
          this.$toast("班级已有" + repetitiveStr + "等人,请勿重复添加!", "error");
          return false;
        }
      }
      let param = {
        brandId: this.params.currentClass.brandId,
        schoolId: this.params.currentClass.schoolId,
        classId: this.params.currentClass.classId,
        isRandomPwd: this.isRandomPwd,
        userList: this.studentsArr,
        initialPwd: this.initialPwd
      };
      fetch.createStudent(param).then(res => {
        if (!res) {
          return false;
        }
        if (res) {
          let toastStr = "";
          if (res.data.length == initialLength) {
            toastStr = "已成功添加" + res.data.length + "个学生";
          } else {
            toastStr =
              "已成功添加" +
              res.data.length +
              "个学生,班级已有" +
              repetitiveStr +
              "等人,请勿重复添加";
          }
          this.$toast(toastStr, "right");
          this.isConfirm = true;
          this.$emit("isConfirm", this.isConfirm);
        }
      });
    },
    closeNotice() {
      // this.isConfirm = false;
      this.$emit("isConfirm", this.isConfirm);
    },
    oldStuClick() {
      this.isNewStudent = false;
    },
    newStuClick() {
      this.isNewStudent = true;
    },
    setRandomPwd() {
      this.isChecked = true;
      this.isRandomPwd = 1;
      this.initialPwd = 0;
    },
    setinitialPwd() {
      this.isChecked = false;
      this.isRandomPwd = 0;
      this.initialPwd = 123456;
    },
    addStudent(uin, name) {
      let flag = true;
      if (uin == this.params.teacherId) {
        this.$toast("您不可以添加自己进入班级哦~", "error");
        return false;
      }
      let classStudent = this.params.classStudent;
      if (classStudent.length > 0) {
        classStudent.forEach(function(item1) {
          if (uin == item1) {
            flag = false;
          }
        });
      }
      if (!flag) {
        this.$toast("班级已有" + name + ",请勿重复添加!", "error");
      }
      let classId = this.params.currentClass.classId;
      let param = {
        userId: uin,
        role: 1,
        classId: classId
      };
      fetch.addOneStudent(param).then(res => {
        if (!res) {
          this.$toast("班级已存在该学生~", "error");
          return false;
        }
        if (res) {
          this.isConfirm = true;
          this.$toast("添加学生成功", "right");
          this.$emit("isConfirm", this.isConfirm);
        }
      });
    },
    search(e) {
      if (this.userId.length == 0) {
        this.isSearch = false;
      }
      if (
        this.userId.length != 5 &&
        this.userId.length != 8 &&
        this.userId.length != 9 &&
        this.userId.length != 11
      ) {
        this.newStudentInf = undefined;
        return false;
      }
      let params = {};
      if (this.userId.length == 5) {
        params.uin = this.userId;
      } else if (this.userId.length == 9 || this.userId.length == 8) {
        params.uin = this.userId;
      } else if (this.userId.length == 11) {
        params.mobile = this.userId;
      }
      this.isSearch = true;
      fetch.searchStudent(params).then(res => {
        if (!res) {
          return false;
        }
        if (res.data.length > 0) {
          this.newStudentInf = res.data[0];
          if (this.newStudentInf.sex == 0) {
            this.newStudentInf.src = "./img/girl.png";
          } else if (this.newStudentInf.sex == 1) {
            this.newStudentInf.src = "./img/boy.png";
          } else {
            this.newStudentInf.src = false;
          }
        }
      });
    }
  }
};
</script>
