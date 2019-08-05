<template lang="html">
  <div class="editInput">
    <div class="_input">
      <div class="default_title" :class="{'hidden': change}">{{defalutTitle}}</div>
      <input type="text" name="" value="" @blur="handler" v-model="title" :class="{'hidden': !change}" maxlength="60">
    </div>
    <div class="edit_btn"  @click="modify">
      <img src="../../assets/img/editPan.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  props: ['defalutTitle'],
  data() {
    return {
      title: '',
      change: false
    }
  },
  methods: {
    modify() {
      this.change = !this.change
    },
    handler() {
      this.change = false
      this.$emit("changeTitle", this.title);
    }
  }
}
</script>

<style lang="scss">
  .editInput{
    height: 30px;
    ._input{
      // width: 250px;
      display: inline-block;
      .default_title{
        font-size: 18px;
        position: relative;
        font-weight: bold;
        width: 250px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      input{
        height: 30px;
        border: 1px solid #ccc;
        position: relative;
      }
      .hidden{
        display: none;
      }
    }
    .edit_btn{
      padding-left: 20px;
      display: inline-block;
    }
  }
</style>
