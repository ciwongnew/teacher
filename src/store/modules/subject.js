import {WRITE_SUBJECT, CLEAN_SUBJECT, SUBJECT} from './../mutations-types'


const state = {
	subject: JSON.parse(window.sessionStorage.getItem(SUBJECT) || '[]')
}


const mutations = {
	[WRITE_SUBJECT]: (state, obj)=>{
	    state.subject = obj
	},
	[CLEAN_SUBJECT]: (state)=>{
		state.subject = [];
	}
}

export default {
	state,
	mutations
}