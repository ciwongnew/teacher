<template>
  <div class="checkAll">
      <el-submenu :index="index +''">
        <template slot="title">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
          <span class="className">{{className}}</span>
          <span class="count">{{checkedStudents.length}}/{{students.length}}</span>
        </template>
        <el-checkbox-group v-model="checkedStudents" @change="handleCheckedCitiesChange" class="box">
          <el-checkbox v-for="(student, index) in students" :label="student.userId" :key="index" :title="student.userName">{{student.userName}}</el-checkbox>
        </el-checkbox-group>
      </el-submenu>
  </div>
</template>

<style scoped>
  .box{
    padding: 20px;
  }
</style>

<script>
  export default{
    data () {
      return {
        checkedStudents: this.selectObj.checkedStudents,
        students: this.selectObj.studentArr,
        classId: this.selectObj.classId,
        className: this.selectObj.className,
        isIndeterminate : false,
        checkAll : false
      }
    },
    props: ['selectObj','index'],
    methods: {
      // 点击单个班级事件
      handleCheckedCitiesChange (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.students.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.students.length
        this.$emit('selectedClass', this.checkedStudents, this.students, this.classId)
      },
      // 点击年级全选按钮事件
      handleCheckAllChange (event) {
        let arr = []
        this.selectObj.studentArr.forEach((item) => {
          arr.push(item.userId)
        })
        this.checkedStudents = event.target.checked ? arr : []
        this.isIndeterminate = false
        this.$emit('selectedClass', this.checkedStudents, this.students, this.classId)
      }
    }
  }
</script>
