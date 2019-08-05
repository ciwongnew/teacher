<template>
    <div class="notice" @click.stop="closeUl">
        <div class="noticeHead">
            {{params.noticeTitle}}
        </div>
        <div class="particulars">
            <div class="schoolName">
                <span>所在学校:</span><input type="text" v-model="schoolName" disabled="disabled">
            </div>
            <div class="grads">
                <span>年级:</span><input type="text" v-model="currentText" @click.stop="showUl" :class="{arrowDown:!isShowUl,arrowUp:isShowUl}">
                <input type="text" class="className" v-model="className" maxlength="10">
                <ul class="gradsUl" v-if="isShowUl">
                    <li v-for="(item,index) in gradsArr" @click.stop="checkGrad(item)">{{item.text}}</li>
                </ul>
            </div>
        </div>
        <div class="noticeBottom">
            <button class="abolish" @click="abolish">{{params.button1 || "取消"}}</button>
            <button class="ensure1 button green" @click="ensure">{{params.button2 || "确定"}}</button>
            <div class="noticeClose" @click="closeNotice"></div>
        </div>
    </div>
</template>

<style scoped>
</style>

<script>
    import {periods} from './../../data/periods'
    export default{
        data(){
            return {
                isConfirm:false,
                gradsArr:periods,
                isShowUl:false,
                schoolName:this.params.currentClass.schoolName,
                className:this.params.currentClass.className,
                currentGrad:this.params.currentClass.gradeId,
                currentText:'',
                currentPeriod:this.params.currentClass.periodId
            };
        },
        props:['params'],
        created(){
            for(var i =0,len = this.gradsArr.length;i<len;i++){
                if(this.gradsArr[i].grade == this.params.currentClass.gradeId){
                    this.currentText = this.gradsArr[i].text;
                }
            }
        },
        methods:{
            abolish(){
                this.$emit('isConfirm', this.isConfirm);
            },
            ensure(){
                if(!this.className.length) {
                  this.$toast('请输入班级名字', 'error')
                  return false
                }
                if(this.params.currentClass.className == this.className && this.currentGrad == this.params.currentClass.gradeId && this.currentPeriod == this.params.currentClass.periodId){
                    this.$emit('isConfirm', this.isConfirm);
                    return false;
                }
                this.isConfirm = true;
                this.$emit('isConfirm', this.isConfirm,{classAliasName:this.className,gradeId:this.currentGrad,periodId:this.currentPeriod,classId:this.params.currentClass.classId});
            },
            closeNotice(){
                this.$emit('isConfirm', this.isConfirm);
            },
            showUl(){
                this.isShowUl = !this.isShowUl;
            },
            checkGrad(item){
                this.isShowUl = false;
                this.currentText = item.text;
                this.currentGrad = item.grade;
                this.currentPeriod = item.period;
            },
            closeUl(){
                this.isShowUl = false;
            }
        }
    }
</script>
