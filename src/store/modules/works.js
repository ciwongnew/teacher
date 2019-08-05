import {WRITE_WORKS, READ_WORKS, MODIDY_WORKS, CLEAN_WORKS, WORKS} from './../mutations-types'


const state = {
	works: JSON.parse(window.sessionStorage.getItem(WORKS) || '{}')
}


const mutations = {
	[WRITE_WORKS]: (state, obj)=>{
	    Object.assign(state.works, obj)
	},
	[CLEAN_WORKS]: (state)=>{
		state.works = {};
	}
}

export default {
	state,
	mutations
}
