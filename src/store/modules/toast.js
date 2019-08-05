import {WRITE_TOAST, CLEAN_TOAST, TOAST} from './../mutations-types'


const state = {
	toast: JSON.parse(window.sessionStorage.getItem(TOAST) || '{}')
}


const mutations = {
	[WRITE_TOAST]: (state, obj)=>{
	    state.toast = obj
	},
	[CLEAN_TOAST]: (state)=>{
		state.toast = {};
	}
}

export default {
	state,
	mutations
}