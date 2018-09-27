// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store/'
import VueCookie from 'vue-cookie'
import infiniteScroll from 'vue-infinite-scroll'
import VueLazyload from 'vue-lazyload'
import { userInfo } from './api/index'
import { getStore } from './store/storage.js'
//关闭生产提示
Vue.config.productionTip = false

Vue.use(ElementUi)
Vue.use(VueCookie)
//无限滚动加载页面
Vue.use(infiniteScroll)
//懒加载loading图片
Vue.use(VueLazyload, {
	loading: '/static/images/loading2.gif'
})

const whiteList = ['/home', '/goods', '/login','/register','/goodsDetails']
router.beforeEach(function(to, from, next) {
	let params = {
		params: {
			token: getStore('token')
		}
	}
	userInfo(params).then(res => {
		// 没登录
		if(res.code !== 1) {
//			console.log("res.user.id = " + res.user.id)
//			console.log("res.user.username = " + res.user.username)
			if(whiteList.indexOf(to.path) !== -1) {
				next()
			} else {
				next('/login')
			}
		} else {
			store.commit('RECORD_USERINFO', {
				info: res.user
			})
			if(to.path === '/login') {
				next({
					path: '/'
				})
			}
			next()
		}
	})
})

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
})