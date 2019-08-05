<template>
    <div class="rankWorkP">
        <rankWorkWeb v-if="rankWeb"></rankWorkWeb>
        <rankWorkApi v-else></rankWorkApi>
    </div>
</template>
<style type="text/css">

</style>
<script>
    import rankWorkWeb from "../components/rankWork/rankWorkWeb.vue"
    import rankWorkApi from "../components/rankWork/rankWorkApi.vue"
    export default{
        data(){
            return {
                pageHeight:"600px",
                rankWeb:true
            };
        },
        components: {
            rankWorkWeb,
            rankWorkApi
        },
        created(){
             this.$nextTick(() => {
              this.OnLoad();
           })
        },
        methods:{
            OnLoad(){
                  if(!this.$route.path.indexOf("/api")){
                    this.rankWeb=false;
                 } else{
                    this.rankWeb=true;
                 }
            }
        }
    }
</script>