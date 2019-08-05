<template>
    <p class="checkboxLabel">
        <!-- <input type="checkbox" class="checkbox" :id="id" :value="id" v-model="questionId"/> -->
        <i class="noChooseRom" :class="{'chooseRom': setQuestionId}">
        </i>
        <span :for="id" style="color: #333;">{{title}}</span>
    </p>
</template>
<style>

</style>
<script>
    export default{
        props: ['id', 'title','setQuestionId'],
        data(){
            return {
                questionId:[]
            }
        },
        watch:{
            setQuestionId(val){
              this.$emit('selectedClass', {id: this.id, 'checked': val?1:0})
            }
        }
    }
</script>
