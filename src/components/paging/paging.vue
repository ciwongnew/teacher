<template>
    <div class="paging">
        <span>{{PagenumId}}/{{PageCount}}</span>
            <div class="lastone" @click="lastone">
              <img src="../../assets/img/pageL.png" alt="">
            </div>
            <div class="nextone" @click="nextone">
              <img src="../../assets/img/pageR.png" alt="">
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        props: ['PagenumId',"PageCount"],
        data(){
            return {
                mypagenum: this.PagenumId
            }
        },
        watch: {
            PagenumId(val) {
                this.PagenumId = val;
                if(val == 1){
                  this.mypagenum = val;
                }
            },
            mypagenum(val){
                this.$emit("mypagenum", val);
            }
        },
        methods: {
            lastone(){
                this.mypagenum>1?this.mypagenum--:this.mypagenum;
            },
            nextone(){
                this.mypagenum<this.PageCount?this.mypagenum++:this.mypagenum;
            }
        }

    }
</script>
