import {WRITE_CRUMB, READ_CRUMB, CLEAN_CRUMB, CRUMB} from './../mutations-types'


const state = {
	crumb: JSON.parse(window.sessionStorage.getItem(CRUMB) || '[]')
}


const mutations = {
	[WRITE_CRUMB]: (state, title)=>{
	    let url = window.location.href;
	    let arr = [title, url];
	    let flag = true;
		state.crumb.find((item, index)=>{
			if(item && item[0] == title){
				state.crumb.splice(index+1);
				flag = false;
			}
		})
		if(flag) {
			state.crumb.push(arr)
		}
	},
	[READ_CRUMB]: (state)=> state.crumb,
	[CLEAN_CRUMB]: (state)=> state.crumb = []
}

export default {
	state,
	mutations
}