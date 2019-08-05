import {WRITE_USER, CLEAN_USER, USER} from './../mutations-types'


const state = {
	user: JSON.parse(window.localStorage.getItem(USER) || '{}')
}

const mutations = {
	[WRITE_USER]: (state, obj)=>{
	    state.user = obj
	},
	[CLEAN_USER]: (state)=>{
		state.user = [];
	}
}

export default {
	state,
	mutations
}