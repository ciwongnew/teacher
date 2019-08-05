<template>
    <div class="notice">
        <div class="noticeHead">
            提示
        </div>
        <p class="title">{{params.noticeText}}</p>
        <div class="noticeBottom">
            <button class="ensure2 button green" @click="ensure">确定</button>
        </div>
    </div>
</template>

<style scoped>
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
            ensure(){
                this.isConfirm = true;
                this.$emit('isConfirm', this.isConfirm);
                this.isConfirm = false;
            }
        }
    }
</script>