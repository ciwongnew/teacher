import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import routes from './router'
import 'element-ui/lib/theme-default/index.css';
import './assets/scss/style.scss';

import * as Filters from './filter'
import store from './store'
import { Popover,Checkbox, CheckboxGroup,Menu, Submenu, MenuItem, MenuItemGroup } from 'element-ui'
import Toast from './unit/toast.js'
import SEO from './seo'
Vue.use(Popover)
Vue.use(Toast);
Vue.use(VueRouter)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Object.keys(Filters).forEach(k => {
    Vue.filter(k, Filters[k]);
})

let router = new VueRouter({
  // mode: 'history',
	routes: routes ,
	scrollBehavior: function (to, from, savedPosition) {
	    return savedPosition || { x: 0, y: 0 }
	}
})
router.beforeEach((to, from, next) => {
	document.title = SEO[to.name];
  // if (to.fullPath.indexOf('/web') > -1) {
  //   if (to.name === 'home') {
  //     if (window.localStorage.user) {
  //       next()
  //     } else {
  //       next({path: '/web/login'})
  //     }
  //   }
  // }
  next()
})
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
