<template lang="html">
    <div class="schoolMsg">
      <div class="menu clear">
  	  	<ul style="float: left;">
  	  		<li @click="toggle(1)" :class="{activeLi: index==1}">我发送的</li>
  				<li @click="toggle(2)" :class="{activeLi: index!=1}">
            我接收的
            <i :class="{msgPro:userInformation.isUnread}"></i>
          </li>
  	  	</ul>
        <div class="border_line">

        </div>
  	  </div>
      <div class="sendBox">
    		<sendMsg v-if="index == 1" :loadData="loadData"></sendMsg>
    		<acceptMsg  :loadData="loadData" v-else></acceptMsg>
    	</div>
    </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import acceptMsg from "./acceptMsg.vue"
import sendMsg from "./sendMsg.vue"
import fetch from './../../fetch'

export default {
  inheritAttrs: false,
  data(){
		return{
			index: 1,
      userInformation: this.getUser(),
      loadData: this.$attrs
		}
	},
	components:{
		acceptMsg,
		sendMsg
	},
  watch: {
     '$attrs'(val) {
       this.loadData = val
    }
  },
  created(){
    this.$nextTick(()=>{
    })
  },
	methods:{
    ...mapActions([
        'setUser'
    ]),
    ...mapGetters([
        'getUser'
    ]),
		toggle(param){
			this.index = param;
      if(param == 2){
        this.$set(this.userInformation,'isUnread',false)
        this.setUser(this.userInformation);
      }
		}
	}
}
</script>

<style lang="css">
</style>
