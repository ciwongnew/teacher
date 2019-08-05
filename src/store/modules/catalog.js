import {WRITE_CATALOG, CLEAN_CATALOG, CATALOG} from './../mutations-types'


const state = {
	[CATALOG]: JSON.parse(window.sessionStorage.getItem(CATALOG) || '[]')
}


const mutations = {
	[WRITE_CATALOG]: (state, obj)=>{
	    state[CATALOG] = obj
	},
	[CLEAN_CATALOG]: (state)=>{
		state[CATALOG] = [];
	}
}

export default {
	state,
	mutations
}