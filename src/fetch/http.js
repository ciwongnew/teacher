import {stringParam} from './../filter'
import {clientId, brandId} from './../config'
let Vue = require('vue');
let qs = require('qs');
import Axios from 'axios'
export default function(url, data, method,customerQuery,isFormData) {
	// Vue.http.options.emulateJSON = true;

	const _this = this;
	let query = {
		clientId: clientId,
		brandId: brandId
	}
	let Authorization  = window.localStorage.user? JSON.parse(window.localStorage.user).userId : data.userId;
	if(!data){
		data = {};
	}
	if('post' == method) {
		data.clientId = clientId;
		data.brandId = brandId;
	}
	if(data.userId && data.clientId) {
		query = {}
	}

	if(!customerQuery) {
		Axios.defaults.headers.common['Authorization'] = 'Basic '+window.btoa( Authorization +':');
		Axios.defaults.withCredentials = true;
	}

	// Axios.defaults.headers.common['Authorization'] = 'Basic '+window.btoa( Authorization +':');
	// Axios.defaults.withCredentials = true;
    return Axios[method](url+'?'+stringParam(query), method=='get'?{params: data}: isFormData?qs.stringify(data): data).then(
		res => {
		  	let data = res.data;
			if(data.errcode == 10008 || data.errcode == 10009 || data.errcode == 17 || data.errcode == 18 || data.errcode == 26|| data.errcode == 27|| data.errcode == 15|| data.errcode == 401) {
				// Vue.prototype.$toast('您的账号在另一地点登录，您已被迫下线','error')
				window.localStorage.removeItem("user")
				// let url = window.location.href;
				// window.localStorage.removeItem('basicData')
				// window.location.assign(window.location.origin)
				return false;
			}
	    if(data.errcode) {
					if (data.msg.indexOf('没有找到相应的教学顾问相关信息') < 0) {
					  Vue.prototype.$toast(data.msg, 'error')
					}
		      return false;
      }
		return data;
	}).catch(
		err => err
	)
}
