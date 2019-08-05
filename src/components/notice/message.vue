<template>
    <div class="notice messageNotice">
        <div class="noticeHead">
            {{params.noticeTitle}}
        </div>
        <div>
          <div class="messagePadding" style="height: 350px; overflow-y: auto;">
              <pre>{{params.noticeText}}</pre>
              <img :src="params.noticeSrc" alt="">
          </div>
          <div class="footerNotice">
            <span v-if="params.sendType != 1" style="display: inline-block; width: 60px;vertical-align: top;">发送人:
            </span>
            <span v-else style="display: inline-block; width: 80px;vertical-align: top;">发送班级：
            </span>
            <span style="display: inline-block;width: 300px;">{{params.sender}}</span>
            <span style="float: right">{{params.time}}</span>
          </div>
        </div>
        <div class="noticeClose" @click="closeNotice"></div>
    </div>
</template>

<style scoped>
.messageNotice{
  width: 600px;
}
.footerNotice{
    line-height: 20px;
    border-top: 1px solid #d9d9d9;
    color: #A6A6A6;
    padding: 18px 30px;
}
</style>

<script>
    export default{
        data(){
            return {
                isConfirm:false
            };
        },
        props:['params'],
        methods:{
            closeNotice(){
                this.$emit('isConfirm', this.isConfirm);
            }
        }
    }
</script>
