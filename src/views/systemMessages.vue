<template>
    <div class="systemMessages">
        <div class="systemMessagesBGC" v-if="arr.length>0">
            <div class="systemMessagesBox">
                <div class="systemMessagesContent" v-for="item in arr">
                    <div class="systemMessagesBorder">
                        <div class="message" @click="messages(item)" :class="{read:item.msgStatus==1}">
                            <span v-if="item.content.imgUrl">[有图]</span>
                            <span>{{item.msgIntr}}</span>
                        </div>
                    </div>
                    <div class="TimeBox" :class="{read:item.msgStatus==1}">
                        {{item.publishDate | timeAxis}}
                    </div>
                </div>
            </div>
            <paging :PagenumId="PageIndex" :PageCount="PageCount" @mypagenum="pageNum"></paging>
            <notice :params="params" :isNotice="isNotice" @isConfirm="isConfirm"></notice>
        </div>
        <div class="noMessage" v-else-if="arr.length==0">
            <div class="noMessageBox">
                <span>放心吧，有消息我们会马上通知您的~</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>

<script>
    import {mapActions} from 'vuex'
    import fetch from './../fetch'
    import paging from "./../components/paging/paging.vue"
    import notice from "./../components/notice/notice.vue"
    export default{
        data(){
            return {
                PageIndex:1,
                PageCount: 2,
                arr:[],
                isNotice:false,
                params:{}
            };
        },
        components: {
            paging,
            notice
        },
        created(){
            this.$nextTick(() => {
                this.setCrumb('系统消息');
            })
            this.getMessages();
        },
        methods:{
            ...mapActions([
                'setCrumb'
            ]),
            messages(item){
                item.msgStatus = 1;
                fetch.setRead({msgIds:item.msgId}).then(res =>{

                })
                this.isNotice = !this.isNotice;
                this.params = {type:4, noticeText:item.content.content,noticeTitle:"查看消息",noticeSrc:item.content.imgUrl}
            },
            isConfirm(val){

            },
            setParams(){
                this.param = {
                    msgType:30,
                    page: this.PageIndex,
                    pageSize: 5
                }
            },
            //先获取到需要参数，再发请求
            getMessages(){
                this.setParams();
                this.getData();
            },
            getData(){
                fetch.getSystemMessages(this.param).then(res=>{
                    this.arr = res.data.pageList;
                    this.PageCount = Math.ceil(res.data.totalCount/this.param.pageSize);
                })
            },
            pageNum(val){
                this.PageIndex = val;
                this.getMessages();
            },
        },
    }
</script>
