<template>
    <div class="notice"  v-on:keyup.enter="ensure">
        <div class="noticeHead">
            {{params.noticeTitle}}
        </div>
        <div class="deleteNotice1" v-if="noticeType==1">
            <div class="deleteText">确定从当前班级删除 <span>{{params.userName}}</span> 么？</div>
        </div>
        <div class="deleteNotice2" v-else-if="noticeType==2">
            <div class="verification">
                <div class="verificationTitle">请输入以下验证码</div>
                <div class="verificationCode">
                    <span>{{randomArr[0]}}</span>
                    <span>{{randomArr[1]}}</span>
                    <span>{{randomArr[2]}}</span>
                    <span>{{randomArr[3]}}</span>
                </div>
                <div class="inputCode">
                    <form>
                        <input v-for="(item,index) in isInputArr" :class="{import:isInputArr[index]}" type = "text" v-model.number="textArr[index]" maxlength=1 @keyup
                                = "moveNext(index);">
                    </form>
                </div>
            </div>
        </div>
        <div class="noticeClose" @click="closeNotice"></div>
        <div class="noticeBottom">
            <button class="abolish" @click="abolish">{{params.button1 || "取消"}}</button>
            <button class="ensure1 button green" @click="ensure">{{params.button2 || "确定"}}</button>
        </div>
    </div>
</template>

<style scoped>
</style>

<script>
    export default{
        data(){
            return {
                noticeType:1,
                textArr:[],
                randomArr:[],
                isInputArr:[true,false,false,false],
                isClose:false
            };
        },
        props:['params'],
        watch:{
            noticeType(val){
                this.$nextTick(() => {
                    if(val==2){
                        this.setRandomArr();
                        document.forms[0].elements[0].focus();
                    }
                })
            }
        },
        methods:{
            abolish(){
                this.noticeType = 1;
                this.textArr = [];
                this.$emit('isConfirm', this.isConfirm);
            },
            setRandomArr(){
                this.randomArr  = [];
                for(var i = 0,len = this.isInputArr.length;i<len;i++){
                    this.randomArr.push(Math.floor(Math.random()*10))
                }
            },
            ensure(){
                switch(this.noticeType)
                {
                    case 1:
                        this.noticeType = 2;
                        break;
                    case 2:
                        let flag = true;
                        for(var i = 0,len = this.randomArr.length;i<len;i++){
                            if(this.textArr[i] != this.randomArr[i]){
                                flag = false;
                            }
                        }
                        if(this.isClose && flag){
                            this.isConfirm = true;
                            this.$emit('isConfirm', this.isConfirm);
                            this.textArr = [];
                            this.isConfirm = false;
                            this.isClose = false;
                            this.noticeType = 1;
                        }
                        break;

                }
            },
            //输入完胜验证通过跳到下一个输入框
            moveNext(index){
             
                if(this.textArr[index] != this.randomArr[index]){
                    this.$toast("验证码输入错误，请重新输入",'delete');
                    return false
                }
                if(event.keyCode == 8){

                    /*if(this.textArr[index]==''){
                        switch(index){
                            case 0:
                                break;
                            case 1:
                                if(this.textArr[index-1] != this.randomArr[index-1]){
                                    alert(1)
                                    this.$toast("验证码输入错误，请重新输入");
                                    document.forms[0].elements[index-1].focus();
                                }
                                break;
                            case 2:
                                if(this.textArr[index-1] != this.randomArr[index-1] || this.textArr[index-2] != this.randomArr[index-2]){
                                    alert(1)
                                    document.forms[0].elements[index-1].focus();
                                }
                                break;
                            case 3:
                                if(this.textArr[index-1] != this.randomArr[index-1] || this.textArr[index-2] != this.randomArr[index-2] || this.textArr[index-3] != this.randomArr[index-3]){
                                    alert(1)
                                    document.forms[0].elements[index-1].focus();
                                }
                                break;
                        }
                    }*/
                }else{
                    if(index < 3 && event.keyCode != 8){
                        document.forms[0].elements[index+1].focus();
                    }else if(index == 3){
                        /*let flag = true;
                        for(var i = 0,len = this.randomArr.length;i<len;i++){
                            if(this.textArr[i] != this.randomArr[i]){
                                flag = false;
                            }
                        }
                        if(flag==true){
                            this.isClose =  true;
                        }else{
                            this.isClose =  false;
                        }*/
                        this.isClose =  true;
                    }
                }
            },
            closeNotice(){
                this.noticeType = 1;
                this.textArr = [];
                this.$emit('isConfirm', this.isConfirm);
            }
        }
    }
</script>