<template>
	<section class="area clear">
		<div id="province">
			<selecter :selectData="provinces" :autoIsShow='false' selectObj="province" @selecter="selecter" :selecterText="province_text"></selecter>
		</div>
		<div id="city">
			<selecter :selectData="cities" :autoIsShow='false' selectObj="city" @selecter="selecter" :selecterText="city_text"></selecter>
		</div>
		<div id="district">
			<selecter :selectData="districts" :autoIsShow='false' selectObj="district" @selecter="selecter" :selecterText="district_text"></selecter>
		</div>
	</section>

</template>
<script>
	import selecter from "./../selecter/selecter.vue"
  	import $http from './../../fetch/http'
  	import {http}  from './../../config'

	export default{
		data(){
			return{
				province: '',
				city: '',
				district: '',
				provinces: [],
				cities: [],
				districts: [],
				province_text: "请选择省",
				city_text: "请选择市",
				district_text: "请选择区"
			}
		},
		components:{
            selecter
        },
		created(){
			this.$nextTick(()=>{
				this.initSeletList();
			})
		},
		methods:{
			initSeletList(){
        $http(http+'/gateway/v5/areas/', {}, 'get').then(res=>{
          if(res){
						let data = res.data;
						for(var i=0; i<data.length; i++){
							let pl = {
								id:data[i].areaCode,
								name: data[i].areaName
							}
							this.provinces.push(pl);
						}
					}
				})
			},
			selecter(obj){
				if(obj.key == 'province') {
					this.cities = [];
					this.province_text = obj.text;
          $http(http+'/gateway/v5/areas/'+obj.value+'', {code:obj.value}, 'get').then(res=>{
						if(res){
							let data = res.data;
							for(var i=0; i<data.length; i++){
								let pl = {
									id:data[i].areaCode,
									name: data[i].areaName
								}
								this.cities.push(pl);
							}
							this.city_text = '请选择市';
		                	this.district_text = '请选择区';
						}
					})
		            this.$emit('selectAreas',{'id': obj.value, 'type': obj.key});
				}else if(obj.key == 'city'){
					this.districts = [];
					this.city_text = obj.text;
          $http(http+'/gateway/v5/areas/'+obj.value+'', {code:obj.value}, 'get').then(res=>{
						if(res){
							let data = res.data;
							for(var i=0; i<data.length; i++){
								let pl = {
									id:data[i].areaCode,
									name: data[i].areaName
								}
								this.districts.push(pl);
							}

						}
					})
		            this.district_text = '请选择区';
		            this.$emit('selectAreas',{'id': obj.value, 'type': obj.key});
	            } else {
	            	this.district_text = obj.text;
	            	this.$emit('selectAreas',{'id': obj.value, 'type': obj.key});
	            }
			}

		}
	}
</script>
