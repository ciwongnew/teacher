<template>
    <div class="class">
        <div class="existClass" v-if="classList.length > 0">
            <div class="classList clearfix" >
                <div class="oneClass" v-for="(item,index) in partclassList" @click="showOneClass(item.index)" :class="{currentClass:num==item.index}" :title="item.className">
                    {{item.className}}
                </div>
                <div class="select_class" v-if="classList.length > 4">
                    <selecter
                    :selectData="selectedclassList"
                    :autoIsShow='false'
                    selectObj="selectClass"
                    @selecter="selecter"
                    selecterText="更多班级..."></selecter>
                </div>
                <div class="addClass" @click="createClass">
                    添加班级
                </div>
                <!-- {{selectedclassList}} -->
            </div>
            <div class="classHead">
                <div class="classHeadLeft">
                    <div class="className">
                        <span>{{currentClass.className}}</span>
                        <!-- <button @click="redact(currentClass)">编辑</button> -->
                        <!-- <img src="./../assets/img/editPan.png" @click="redact(currentClass)"/> -->
                        <i @click="redact(currentClass)"></i>
                    </div>

                    <!-- <div class="classTeacher">
                        {{currentClass.schoolName}}  &nbsp;|&nbsp;  老师号：{{mobile}}
                    </div> -->
                    <div class="checkService" @click="checkService">
                        班级服务使用情况
                    </div>
                </div>
                <div class="classHearRight">
                    <div class="classCount">
                        <span>{{classStudent.length}}</span>
                        班级人数
                    </div>
                    <div class="workCount">
                        <span>{{currentClass.workCount || 0}}</span>
                        已布置作业数
                    </div>
                </div>
                <div class="addStudent" @click="addStudent(currentClass)">
                    <i class="studentHead"></i>
                    <span>添加学生</span>

                </div>
                <a class="exportStuInf" @click="studentExcel" :href='url'>

                      <i class="derivation"></i>
                      <span><a class="exportExcel">导出学生信息</a></span>

                </a>
            </div>
            <div class="classStudent">
                <div class="classTools">
                    <div class="studentCount">共{{classStudent.length}}个学生</div>

                </div>
                <table cellspacing="0" v-if="classStudent.length>0">
                    <thead>
                    <tr>
                        <th>姓名</th>
                        <th>账号</th>
                        <th>状态</th>
                        <th>服务情况</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in classStudent" :key="index">
                        <td>{{item.userName}}</td>
                        <td>{{item.userId}}</td>
                        <td>{{filterPhone(item.mobile)}}</td>
                      <td class="bigshowService">
                        <span v-if="item.IsBuyArr.length == 0 && item.IsTryArr.length==0">暂无</span>
                        <div class="isBox" v-if="item.IsBuyArr.length>0 || item.IsTryArr.length>0">
                          <el-popover placement="bottom"  width="200" trigger="hover">
                            <div class="showService">
                              <p  v-for="(item1,index1) in item.IsBuyArr" :key="index1">{{item1.ServiceTypeName}}</p>
                            </div>
                            <div v-if="item.IsBuyArr.length>0" class="buy"  slot="reference"></div>
                          </el-popover>
                          <el-popover placement="bottom"  width="200" trigger="hover">
                            <div class="showService">
                              <p  v-for="(item2,index2) in item.IsTryArr" :key="index2">{{item2.ServiceTypeName}}</p>
                            </div>
                            <div v-if="item.IsTryArr.length>0" class="noBuy"   slot="reference"></div>
                          </el-popover>
                        </div>
                      </td>
                        <td>
                            <div class="checkStudent" v-if="false">
                                <button class="button green">
                                    查看详情
                                </button>
                            </div>
                            <!-- <button class="delete" @click="deleteStudent(item)">删除</button> -->
                            <span class="delete" @click="deleteStudent(item)"></span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div class="noStudent" v-if="classStudent.length==0 && showStu">
                    <table  cellspacing="0">
                        <thead>
                        <tr>
                            <th>姓名</th>
                            <th>账号</th>
                            <th>状态</th>
                            <th>服务情况</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                    </table>
                    <div class="noStudentImg">
                      <img src="./../assets/img/noStudent.png" class="noGrade">
                      <div class="m-t30">
                        <p>一、让学生通过老师号{{mobile}}加入班级</p>
                        <p>二、点击"<i class="noStudentAdd" @click="addStudent(currentClass)">添加学生</i>"手动添加学生进入班级</p>
                      </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="noClass" v-else-if="classList.length == 0">
            <div class="noClassBox">
                <img src="./../assets/img/noGrade.png" class="noGrade">
                <span>您还没有班级哦~赶紧创建一个吧</span>
                <div class="create">
                    <button class="button green" @click="createClass">去创建</button>
                </div>
            </div>
        </div>
        <notice :params="params" :isNotice="isNotice" @isConfirm="isConfirm"></notice>
    </div>
</template>

<style scoped>

</style>

<script>
import notice from "./../components/notice/notice.vue";
import selecter from "./../components/selecter/selecter.vue";
import fetch from "./../fetch";
import { mapGetters, mapActions } from "vuex";
import { clientId, brandId, http } from "./../config";
import EditInput from "./../components/editInput/editInput";

export default {
  data() {
    return {
      showStu: false,
      showClass: false,
      isNotice: false,
      params: {},
      arr: [],
      teacherId: "",
      isShow: false,
      isNotice: false,
      classStudent: [], //当前班级下的所有学生列表
      classList: [], //老师下的所有班级
      currentClass: {}, //当前选中的班级对象
      num: 0, //当前选中的班级下标
      mobile: "", //老师的手机号码
      userIds: "", //获取班级所有服务需要的userIds字符串 多个
      currentSchool: "",
      url: "",
      clickFlag: false,
      partclassList: [],
      selectedclassList: [],
      is_select: false,
      is_addClass: false,
      is_alertName: false
    };
  },
  components: {
    notice,
    selecter,
    EditInput
  },
  created() {
    // alert('我进class了')
    this.$nextTick(() => {
      this.getClassData(0);
    });
  },
  methods: {
    ...mapGetters(["getUser"]),
    //获取班级信息
    getClassData(index) {
      const user = this.getUser();
      this.mobile = user.mobile;
      //获取班级，并过滤不是老师身份的
      fetch
        .getDetailedInf({ uin: user.userId })
        .then(res => {
          if (!res) {
            return false;
          }
          let classRes = "";
          this.teacherId = res.data.userId;
          for (var i = res.data.classes.length - 1, len = 0; i >= len; i--) {
            if (res.data.classes[i].userRole != 2) {
              res.data.classes.splice(i, 1);
            }
          }
          if (!res.data.classes.length) {
            return false;
          }
          const classId = res.data.classes[index].classId;
          return { classRes: res, classId: classId };
        })
        .then(res1 => {
          if (!res1) {
            return false;
          }
          let classData = res1;
          fetch
            .getHomeworkStatistics({ classIds: classData.classId })
            .then(res => {
              if (!res) {
                return false;
              }
              if (res.data.length > 0) {
                classData.classRes.data.classes[index].workCount =
                  res.data[0].workCount;
              }
              this.classList = classData.classRes.data.classes;
              
              if (!this.is_select) {

                this.partclassList = [];
                this.selectedclassList = [];
                this.classList.forEach((item, index) => {
                  item.name = item.className;
                  item.index = index;
                  if (index < 4) {
                    this.partclassList.push(item);
                  } else {
                    this.selectedclassList.push(item);
                  }
                });
              }

              if (this.is_addClass) {
                this.classList.forEach((item, index) => {
                  item.name = item.className;
                  item.index = index;
                });

                if (this.classList.length < 5) {
                  this.partclassList = this.classList;
                } else {
                  let arr1 = this.classList.slice(-1);
                  let arr2 = this.partclassList.pop();
                  this.selectedclassList.push(arr2);
                  this.partclassList = arr1.concat(this.partclassList);
                }
                this.is_addClass = false;
              }
              
              
              this.showClass = true;
              this.currentClass = classData.classRes.data.classes[index];
              
              if (this.is_alertName) {
                let alertIndex = -1
                alertIndex = this.partclassList.findIndex(item=> {
                  return  item.classId == this.currentClass.classId
                })
                this.partclassList[alertIndex].className = this.currentClass.className
                this.is_alertName = false
              }
              this.currentSchool = this.currentClass.schoolName;
            });
          //获取班级成员信息
          fetch
            .getClassStudent({ classId: classData.classId, pageSize: 100 })
            .then(res => {
              if (!res) {
                return false;
              }
        
              if (res) {
                let userArr = [];
                for (var i = 0; i < res.data.pageList.length; i++) {
                  const item = res.data.pageList[i];
                  if (item.userRole === 2) {
                    res.data.pageList.splice(i, 1);
                    i = -1;
                    continue;
                  }
                  userArr[i] = res.data.pageList[i].userId;
                  this.userIds = userArr.join(",");
                }
                let studentArr = res.data.pageList;
                if (res.data.pageList.length == 0) {
                  this.arr = [];
                  this.classStudent = studentArr;
                  this.showStu = true;
                  this.clickFlag = false;
                  return false;
                }
                return studentArr;
              }
            })
            .then(res2 => {
              //获取班级所有服务
              if (!res2) {
                return false;
              }
              if (res2) {
                fetch.getAllservice({ uIds: this.userIds }).then(res => {
                  if(!res || !res.data.length) {
                    return false
                  }
                  this.arr = [];
                  for (var i = 0, len = res.data.length; i < len; i++) {
                    const item = res.data[i];
                    for (var j = 0, len2 = item.service.length; j < len2; j++) {
                      if (item.service[j].ExpiredStatus != "已过期") {
                        this.arr.push(item.service[j]);
                      }
                    }
                  }
                  //遍历所有服务查看该学生是否有服务
                  for (var i = 0, len = res2.length; i < len; i++) {
                    const item1 = res2[i];
                    item1.IsBuyArr = [];
                    item1.IsTryArr = [];
                    for (var j = 0, len2 = this.arr.length; j < len2; j++) {
                      const item2 = this.arr[j];
                      if (item1.userName == item2.UseName) {
                        if (item2.IsBuy) {
                          item1.IsBuyArr.push(item2);
                        } else {
                          item1.IsTryArr.push(item2);
                        }
                      }
                    }
                  }
                  this.clickFlag = false;
                  this.classStudent = res2;
                });
              }
            });
        });
    },
    deleteStudent(item) {
      this.isNotice = !this.isNotice;
      this.params = {
        type: 3,
        noticeTitle: "删除确认",
        identify: "delete",
        userId: item.userId,
        userName: item.userName
      };
    },
    deleteStudent(item) {
      this.isNotice = !this.isNotice;
      this.params = {
        type: 3,
        noticeTitle: "删除学生",
        identify: "delete",
        userId: item.userId,
        userName: item.userName
      };
    },
    isConfirm(val, identify, userId, classObj, schoolId) {
      if (val) {
        switch (identify) {
          case "checkClass":
          case "checkService":
            break;
          case "delete":
            fetch
              .deleteStudent({
                classId: this.currentClass.classId,
                userId: userId
              })
              .then(res => {
                if (!res) {
                  return false;
                }
                if (res) {
                  this.getClassData(this.num);
                  this.$toast("删除成功", "right");
                }
              });
            break;
          case "redact":
            fetch.modifyClassInformation(classObj).then(res => {
              if (!res) {
                return false;
              }
              if (res) {
                this.is_alertName = true
                this.getClassData(this.num);
                this.$toast("修改成功", "right");
              }
            });
            break;
          case "addClass":
            this.num = this.classList.length;
            this.is_select = true;
            this.is_addClass = true;
            this.getClassData(this.num);
            break;
          case "addStudent":
            this.getClassData(this.num);
            break;
        }
      }
    },
    checkService() {
      this.isNotice = !this.isNotice;
      document.body.style.overflow = "hidden";
      this.params = {
        type: 5,
        noticeTitle: "查看服务详情",
        serviceArr: this.classStudent,
        identify: "checkService",
        classId: this.currentClass.classId
      };
    },
    redact(currentClass) {
      this.isNotice = !this.isNotice;
      this.params = {
        type: 6,
        noticeTitle: "编辑班级信息",
        identify: "redact",
        currentClass: currentClass
      };
    },
    showOneClass(index) {
      if (this.clickFlag) {
        return false;
      }
      this.num = index;
      this.clickFlag = true;
      this.getClassData(index);
    },
    createClass() {
      this.isNotice = !this.isNotice;
      this.params = {
        type: 7,
        noticeTitle: "添加班级",
        identify: "addClass",
        mobile: this.mobile,
        currentClass: this.currentClass
      };
    },
    addStudent(currentClass) {
      this.isNotice = !this.isNotice;
      this.params = {
        type: 8,
        noticeTitle: "添加学生",
        identify: "addStudent",
        currentClass: currentClass,
        classStudent: this.classStudent,
        teacherId: this.teacherId
      };
    },
    studentExcel() {
      if (this.classStudent.length === 0) {
        this.$toast("班级内还没有学生哦~请先添加学生", "error");
        return false;
      }
      let classId = this.currentClass.classId;
      //                let http = 'http://testpc.teacher.jiaofucloud.cn/'
      let url =
        http +
        "/gateway/v1/student/exportStudentByExcel?classId=" +
        classId +
        "&brandId=" +
        brandId +
        "&clientId=" +
        clientId;
      this.url = url;
    },
    filterPhone(num) {
      let phone = num;
      if (phone) {
        // return (phone = phone.substr(0, 3) + "****" + phone.substr(7));
        return "已激活";
      } else {
        return "未激活";
      }
    },
    selecter(obj) {
      this.is_select = true;
      // debugger
      let selIndex = obj.dataIndex;

      let replaceArr1 = this.selectedclassList.splice(selIndex, 1);
      let replaceArr2 = this.partclassList.splice(-1, 1);

      this.selectedclassList = this.selectedclassList.concat(replaceArr2);
      this.partclassList = replaceArr1.concat(this.partclassList);

      this.classList = [];
      this.classList = this.partclassList.concat(this.selectedclassList);

      this.num = this.partclassList[0].index;
      this.clickFlag = true;

      this.getClassData(this.partclassList[0].index);
    }
  }
};
</script>
