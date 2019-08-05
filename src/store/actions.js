import {WRITE_CRUMB, CLEAN_CRUMB,
		WRITE_WORKS, CLEAN_WORKS,
		WRITE_USER, CLEAN_USER,
		WRITE_SUBJECT, CLEAN_SUBJECT,
		WRITE_TOAST, CLEAN_TOAST,
		WRITE_CATALOG, CLEAN_CATALOG
	} from './mutations-types'


export default {
	setCrumb: Write(WRITE_CRUMB),
	removeCrumb: Write(CLEAN_CRUMB),
	setWorks: Write(WRITE_WORKS),
	removeWorks: Write(CLEAN_WORKS),
	setUser: Write(WRITE_USER),
	removeUser: Write(CLEAN_USER),
	setSuject: Write(WRITE_SUBJECT),
	removeSubject: Write(CLEAN_SUBJECT),
	setToast: Write(WRITE_TOAST),
	cleanToast: Write(CLEAN_TOAST),
	setCatalog: Write(WRITE_CATALOG),
	cleanCatalog: Write(CLEAN_CATALOG)
}

function Write (type) {
  return ({ commit }, ...args) => commit(type, ...args)
}
function Ready (type) {
  return ({ dispatch }, ...args) => {
  	let res = dispatch(type, ...args)
  	return res;
  }
}