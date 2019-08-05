<template>
    <div class="notices" ref="notice" v-if="isShow">
        <component :is="currentView" transition="fade" transition-mode="out-in" :params="params" @isConfirm="isConfirm"></component>
        <div class="noticeMask"></div>
    </div>
</template>

<script>
    import notice1 from './notice1.vue'   //通用弹框组件一 确定取消按钮
    import notice2 from './notice2.vue'   //通用弹框组件二 确定按钮
    import deleteNotice from './delete.vue'  //删除学生弹框组件
    import message from './message.vue'    //系统消息弹框组件
    import service from './service.vue'    //查看服务详情弹框组件
    import particulars from './particulars.vue'   //编辑班级信息弹框组件
    import addClass from './addClass.vue'   //添加或创建班级弹框组件
    import addStudent from './addStudent.vue'   //添加或创建班级弹框组件

    export default{
        data(){
            return {
                currentView:'notice1',
                isShow:false
            };
        },
        props:['params','isNotice'],
        created() {


        },
        components:{
            'notice1':notice1,
            'notice2':notice2,
            'deleteNotice':deleteNotice,
            'message':message,
            'service':service,
            'particulars':particulars,
            'addClass':addClass,
            'addStudent':addStudent
        },
        watch: {
            isNotice(val){
                this.isShow = true;
                switch(this.params.type)
                {
                    case 1:
                        this.currentView = 'notice1';
                        break;
                    case 2:
                        this.currentView = 'notice2';
                        break;
                    case 3:
                        this.currentView = 'deleteNotice';
                        break;
                    case 4:
                        this.currentView = 'message';
                        break;
                    case 5:
                        this.currentView = 'service';
                        break;
                    case 6:
                        this.currentView = 'particulars';
                        break;
                    case 7:
                        this.currentView = 'addClass';
                        break;
                    case 8:
                        this.currentView = 'addStudent';
                        break;
                    default:
                        this.currentView = 'notice1';
                }
            },
        },
        methods:{
            isConfirm(val,classObj){
                this.isShow = val;
                if(val){
                    this.isShow = !val;
                    this.$emit('isConfirm',val,this.params.identify,this.params.userId,classObj || {});
                }
            }
        }
    }
</script>
