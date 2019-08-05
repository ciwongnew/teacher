<template>
  <section class="selecter" @mouseleave="close">
    <span @click="showPanel" :title="selecterText">{{selecterText}}</span>
    <ul class="panel" :class="{'showPanel':showSelecter}">
        <li :class="{'isShow': !autoIsShow}" @click="selected(-1)">---全部---</li>
        <li
        v-for="(item,index) in selectData"
        @click="selected(index)">{{item.name}}</li>
    </ul>
  </section>
</template>

<script>
export default {
  props:['selectData', 'autoIsShow', 'selectObj','selecterText','checked','index'],
  data(){
    return {
      showSelecter: false
    }
  },
  watch:{

  },
  methods:{
    showPanel(){
      this.showSelecter = !this.showSelecter;
    },
    selected(index){
      /*this.selecterText = value;*/
      this.showSelecter = false;
      let data = this.selectData[index]?this.selectData[index]:  {id: 0, name: '--全部--', periodid: 0};
    console.log("data",data)
      this.$emit('selecter', 
                  {'key': this.selectObj, 
                  'value': data.id, 
                  text: data.name, 
                  periodid: data.periodid,
                  index:this.index,
                  dataIndex: index})
    },
    close(){
      this.showSelecter = false;
    }
  }
}
</script>
