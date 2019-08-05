 <template>
    <div class="notice">
        <div class="noticeHead">
            {{params.noticeTitle}}
        </div>
        <p class="title">{{params.noticeText}}</p>
        <div class="noticeBottom notice1">
            <button class="abolish" @click="abolish">{{params.button1 || "取消"}}</button>
            <button class="ensure1 button green" @click="ensure">{{params.button2 || "确定"}}</button>
            <div class="noticeClose" @click="closeNotice"></div>
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
            abolish(){
                this.$emit('isConfirm', this.isConfirm);
            },
            ensure(){
                    this.isConfirm = true;
                    this.$emit('isConfirm', this.isConfirm);
            },
            closeNotice(){
                this.$emit('isConfirm', this.isConfirm);
            }
        }
    }
</script>
