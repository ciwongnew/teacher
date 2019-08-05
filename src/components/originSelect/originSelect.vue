<template lang="html">
  <div class="originSelect">
    <select class="" name="" @change="changeEvent" v-if="dataType === 'number'">
      <!-- <option v-show="defValue" selected>{{defValue}}</option> -->
      <option 
            :value="index" 
            v-for="(item, index) in data" 
            :selected="item == defValue">{{item}}</option>
    </select>
    <select class="" name="" @change="changeEvent" v-else-if="selectObj == 'service' || selectObj == 'grads'">
      <option v-if="defValue" selected>{{defValue}}</option>
      <option :value="index" v-for="(item, index) in data" 
              >{{item.name}}</option>
    </select>
    <select class="" name="" @change="changeEvent" v-else>
      <!-- <option v-if="defValue" selected>{{defValue}}</option> -->
      <option :value="index" v-for="(item, index) in data" 
              :selected="item.name == defValue">{{item.name}}</option>
    </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataType: ''
    }
  },
  created() {
    this.$nextTick(()=>{
      this.dataType = typeof(this.data)
    })
  },
  props:['data', 'defValue', 'selectObj'],
  methods: {
    changeEvent(e) {
      // debugger
      
      let index = parseInt(e.target.value)
     
      if(this.dataType === 'number') {
        this.$emit('selecter', {'key': this.selectObj, 'value': index+1})
      }else {

        this.$emit('selecter', {'key': this.selectObj, 'value': !isNaN(index) ? this.data[index].name: e.target.value, 'index': index})
        
      }

    }
  }
}
</script>

<style lang="scss">
  .originSelect{
    display: inline-block;
    select{
      -webkit-appearance: none;
       -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      width: 100px;
      height: 40px;
      line-height: 40px;
      border: 1px solid #e6e6e6;
      text-align: center;
      background: url("../../assets/img/arrow-down.png") no-repeat;
      background-position: right 10px center;
      padding-left: 10px;
      color: #666;
      option{
        height: 40px;
        line-height: 40px;
      }
    }
  }
</style>
