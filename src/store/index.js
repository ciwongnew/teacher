import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import plugins from './plugins'
import getters from './getters'
import crumb from './modules/crumb'
import works from './modules/works'
import user from './modules/user'
import subject from './modules/subject'
import toast from './modules/toast'
import catalog from './modules/catalog'

Vue.use(Vuex)

export default new Vuex.Store({
    actions,
    getters,
    modules: {
    	crumb,
    	works,
    	user,
    	subject,
    	toast,
        catalog
    },
    plugins
})

