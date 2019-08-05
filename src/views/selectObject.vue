<template>
<div class="selectObject">
  <div class="selectHead">选择班级</div>
  <div class="selectContent">
    <div class="leftBox fl">
      <div class="classbox" :class="{selected:item.selected,frist:index === 0}" v-for="(item,index) in allClass" :key="index" :index="index" @click="classClick(index)">
        <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll" @change="handleCheckAllChange(index)">{{item.className}}</el-checkbox>
        <span class="checkCount fr">{{item.checkedStudents.length}}/{{item.studentArr.length}}</span>
      </div>
    </div>
    <div class="rightBox fr">
      <div class="checkBox" v-for="(item,index1) in allClass" v-if="item.selected" :key="index1">
        <div class="input fl" v-for="(student,index2) in item.studentArr">
          <label :for="index2" class="label">
            <span class="inputBox fl" :class="{isChecked:student.isChecked}">
              <span class="checkBox"></span>
              <input type="checkbox" :id="index2" :value="student" v-model="item.checkedStudents" @change="singerChange(index1,index2)">
              </span>
            <span class="studentName fl">
             {{student.userName}}
            </span>
          </label>
        </div>
      </div>
    </div>
  </div>
  <div class="nextOne">
    <button class="button" :class="{disabled : !isChecked}" @click="nextOne">下一步</button>
  </div>
</div>
</template>

<style scoped>
</style>

<script>
  import Vue from 'vue'
  import checkAll from './../components/checkAll/checkAll.vue'
  import fetch from './../fetch'
  import {mapGetters, mapActions} from 'vuex'
  import {brandId} from  './../config'
  export default {
    data() {
      return {
        allClass:[],  // 拼接好之后的班级和班级学生数组
        classArr:[],
        getIndex:0,
        classList : [],  // 布置作业班级集合  以班级为单位,
        userList : [],   // 布置作业的接受者集合 以个人为单位,
        isReady : false,
        isChecked : false
      };
    },
    components: {
      checkAll
    },
    created(){
			this.setWorks({ contents: [] })
      this.setCatalog([])
      this.removeCrumb();
      let params = {
        userRole: 2,
        exists: 1
      }
      fetch.grads(params).then(res=>{
        this.classArr = res.data
        this.getClassStudent(this.classArr)
      })
    },
    methods:{
      ...mapGetters([
        'getWorks'
      ]),
      ...mapActions([
        'setWorks',
        'removeCrumb',
        'setCatalog'
      ]),
      classClick(index){
        this.allClass.forEach((item,index) => {
          item.selected = false
        })
        this.allClass[index].selected = true
      },
      singerChange(index,index2){

        this.isChecked = false
        let oneClass = this.allClass[index]
        let student = oneClass.studentArr[index2]
        student.isChecked = !student.isChecked
        var checkedLen = oneClass.checkedStudents.length
        var noCheckLen = oneClass.studentArr.length
        if(checkedLen === noCheckLen){
          //全选
          oneClass.checkAll = true
          oneClass.isIndeterminate = false
        }else if(checkedLen > 0){
          oneClass.checkAll = false
          oneClass.isIndeterminate = true
        }else{
          oneClass.checkAll = false
          oneClass.isIndeterminate = false
        }
        this.allClass.forEach((item) => {
          if (item.checkedStudents.length > 0) {
            this.isChecked = true
          }
        })
      },
      getClassStudent : function (classArr){

        if (this.getIndex > classArr.length - 1) {
          this.isReady = true
          return false
        }
        // 递归,多个请求一起,不能保证请求返回的顺序,依次递归请求,保证顺序
        var currentClassId = classArr[this.getIndex].classId
        fetch.getClassStudent({classId: currentClassId,userRole: 1,pageSize:100}).then(res =>{
          var obj = {
            className : classArr[this.getIndex].className, // 班级名称
            classId : classArr[this.getIndex].classId,   // 班级ID
            studentArr : res.data.pageList,   // 学生数组
            checkedStudents : [],  // 已选择的学生标记
            selected: this.getIndex ? false:true,  //选中标识
            checkAll: false,   // 全选标识
            isIndeterminate: false  //  部分选中标识
          }
          obj.studentArr.forEach((item,index) => {
            item.isChecked = false
          })
          this.allClass.push(obj)
          this.getIndex++
          this.getClassStudent(classArr)
        })
      },
      // 选择回传的事件
      nextOne(){
        if (!this.isChecked) {
          return false
        }
        this.userList = []
        this.classList = []
        var allCheckClassArr = []
        var classIdArr = []
        var classIdstr = ''
        // 最后点的时候去确认allClass里的选择列表 拼成对应的参数
        // 不管是布置个人还是班级 都需要向班级集合里添加
        this.allClass.forEach((item) => {
          var studentCount = item.studentArr.length
          var selectStudentLength = item.checkedStudents.length

          var classId = item.classId
          var className = item.className
          if (item.checkedStudents.length > 0) {
          var obj = {
            classId : classId,
            className : className,
            studentCount: studentCount,
            selectStudentLength: selectStudentLength
          }
            classIdArr.push(classId)
            this.classList.push(obj)  // 向班级集合里添加布置对象
            if (item.checkedStudents.length !== item.studentArr.length) {  // 选择班级里的部分学生布置
              item.checkedStudents.forEach((studentId) => {
                item.studentArr.forEach((student) => {
                  if (studentId.userId === student.userId) {
                    var obj = {
                      userId : studentId.userId,
                      userName : student.userName,
                      classId : classId
                    }
                    this.userList.push(obj)
                  }
                })
              })
            } else {
              allCheckClassArr.push(obj)
            }
          }
        })
        if (!this.classList.length) {
          this.$toast('您还没有选择布置对象哦~','error')
          return false
        }
        classIdstr = classIdArr.join(',')
        fetch.getClassService({classids:classIdstr,sId:0,uId:brandId}).then(res => {
          if (!res) {
            return false
          }
          if (classIdArr.length > 1) {
            // 多个班级的话没有服务就停留在本界面
            if (res.data.length) {
              window.sessionStorage.setItem('service',JSON.stringify(res.data))
              this.$router.push({path:"setHomework",query: {bookType : 1,classIdstr:classIdstr}});
            } else {
              this.$toast('所选班级使用的书籍不相同，您可以单个班级布置。','error')
              return false
            }
          }else {
            //一个班级的话没有服务进入下一个页面提示
            window.sessionStorage.setItem('service',JSON.stringify(res.data))
            this.$router.push({path:"setHomework",query: {bookType : 1,classIdstr:classIdstr}});
          }
        })
        // this.setWorks({userList:this.userList,classList:this.classList,allCheckClassArr : allCheckClassArr})
        this.setWorks({classList:this.classList,allCheckClassArr : allCheckClassArr})
      },
      handleCheckAllChange(index) {

        this.isChecked = false
        let oneClass = this.allClass[index]
        oneClass.studentArr.forEach((item,index) => {
          item.isChecked = oneClass.checkAll
        })
        oneClass.checkedStudents = oneClass.checkAll ? oneClass.studentArr : [];
        oneClass.isIndeterminate = false
        this.allClass.forEach((item) => {
          if (item.checkedStudents.length > 0) {
            this.isChecked = true
          }
        })
      },
    }
  }
</script>
