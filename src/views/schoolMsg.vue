<template>
	<div class="schoolMsg">
		<div class="" id="msg">
			<p style="text-align: left; padding-bottom: 20px;">发送通知</p>
			<div class="choice">
				<select name="" class="selGrad" @change="changeParams($event)">
					<option value="选择年级">选择年级</option>
					<option value="所有年级">所有年级</option>
					<option value="初一">初一</option>
					<option value="初二">初二</option>
					<option value="初三">初三</option>
					<option value="高一">高一</option>
					<option value="高二">高二</option>
					<option value="高三">高三</option>
				</select>
				<select name="" class="selClass" @change="changeParams($event)">
					<option value="选择班级">选择班级</option>
					<option value="所有班级">所有班级</option>
					<option value="一班">一班</option>
					<option value="二班">二班</option>
					<option value="三班">三班</option>
					<option value="四班">四班</option>
					<option value="五班">五班</option>
				</select>
				<select name="" class="selRole" @change="changeParams($event)">
					<option value="选择发放对象">选择发放对象</option>
					<option value="老师">老师</option>
					<option value="学生">学生</option>
					<option value="家长">家长</option>
				</select>
				<!-- <div id="province">
					<selecter :selectData="gradData" :autoIsShow='false' selectObj="selGrad" @selecter="selecter" :selecterText="grads_text"></selecter>
				</div>
				<div id="city">
					<selecter :selectData="classesData" :autoIsShow='false' selectObj="selClass" @selecter="selecter" :selecterText="classes_text"></selecter>
				</div>
				<div id="district">
					<selecter :selectData="roleData" :autoIsShow='false' selectObj="selRole" @selecter="selecter" :selecterText="role_text"></selecter>
				</div> -->
			</div>
			<div class="result">
				<p>年级:<span class="grad">{{p_grad}}</span></p>
				<p>班级:<span class="class">{{p_classes}}</span></p>
				<p>角色:<span class="role">{{p_role}}</span></p>
			</div>
			<textarea name="" id="message" cols="30" rows="10" v-model="textMsg"></textarea>
			<div class="submitP">
			<button class="submit btn" id="submit" @click="send">发送</button>
			</div>
			<div class="history">
				<p style="text-align: left;">历史记录</p>
				<div class="result">
					<p>发送给:<span class="hisgrad">{{grad_txt}}</span>
							  <span class="hisclass">{{class_txt}}</span>
							  <span class="hisrole">{{role_txt}}</span>
					</p>
					<p class="textMsg">{{sendMsg}}</p>

				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import {mapActions,mapGetters} from 'vuex'
    import fetch from './../fetch'
    import selecter from "./../components/selecter/selecter.vue"

    export default{
    	data(){
            return {
           		grad_txt:'',
                class_txt:'',
                role_txt:'',
                p_grad:'',
                p_classes:'',
                p_role:'',
                textMsg:'',
                sendMsg:''
            };
        },
        components:{
            selecter
        },
        created(){
            this.$nextTick(() => {

                this.setCrumb('校讯通');

            })

        },
        methods:{
        	...mapActions([
                'removeCrumb',
                'setCrumb',
                'setUser'
            ]),
            ...mapGetters([
                'getUser'
            ]),
            changeParams(e){

				if(e.target.className=='selGrad'){
					this.p_grad = e.target.value;
				}else if(e.target.className=='selClass'){
					this.p_classes = e.target.value;
				}else{
					this.p_role = e.target.value;
				}
				this.textMsg = '';
				this.grad_txt = '';
                this.class_txt = '';
                this.role_txt = '';
                this.sendMsg = '';
			},

            send(){
            	let userInfo = this.getUser();
            	let accessToken = userInfo.accessToken;
            	let userId = userInfo.userId;
            	let clientId = 100134;
            	let brandId = 543878981;
            	console.log("userInfo",userInfo)

            	var param = {
		            'accessToken':accessToken,
		            'userId':userId,
		            'clientId': clientId,
		            'eventName':'pushMessage',
		            "eventArgs": {
		                "brandId": brandId,
		                "brandName": "习网学校",
		                "receiverIdList": [
		                    {
		                        "receiverId": 98517,
		                        "receiverName": "刘梦虎"
		                    },
		                    {
		                        "receiverId": 98521,
		                        "receiverName": "郭海滨"
		                    },
		                    {
		                        "receiverId": 98687,
		                        "receiverName": "周绪滨"
		                    },
		                    {
		                        "receiverId": 98581,
		                        "receiverName": "习网VIP"
		                    },
		                    {
		                        "receiverId": 98582,
		                        "receiverName": "学生体验账号"
		                    },
		                    {
		                        "receiverId": 98583,
		                        "receiverName": "学生体验账号2"
		                    },
		                    {
		                        "receiverId": 98584,
		                        "receiverName": "谭志超"
		                    },
		                    {
		                        "receiverId": 98585,
		                        "receiverName": "冯亮"
		                    },
		                    {
		                        "receiverId": 98503,
		                        "receiverName": "杨雄"
		                    },

		                    {
		                        "receiverId": 98522,
		                        "receiverName": "张路"
		                    },
		                    {
		                        "receiverId": 98523,
		                        "receiverName": "岳小云"
		                    }

		                ],
		                "messageContent": {
		                    "content": this.textMsg,
		                    "imgUrl": ""
		                }
		            }
		        }

		        fetch.getSchoolMsg(param).then(res =>{
                    if(res.ret || res.errcode){
                        console.log("err",res.msg);
                        debugger
                        return false;
                    }
                    console.log("res",res);
                    this.grad_txt = this.p_grad;
                    this.class_txt = this.p_classes;
                    this.role_txt = this.p_role;
                    this.sendMsg = this.textMsg;
                })
            }
        }
    }

</script>
