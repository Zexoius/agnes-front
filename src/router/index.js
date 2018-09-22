import Vue from 'vue'
import Router from 'vue-router'

// 启用懒加载,路由被访问时才加载对应组件
// const Login = resolve => require(['/pages/Login/login'],resolve)
const Login = () => import('/pages/Login/Login.vue')
const Index = () => import('/pages/index.vue')
const Home = () => import('/pages/Home/home.vue')
const User = () => import('/pages/User/user.vue')
const OrderList = () => import('/pages/User/List/order.vue')
const AddressList = () => import('/pages/User/List/addressList.vue')
const Information = () => import('/pages/User/List/information.vue') 
const Goods = () => import('/pages/Goods/goods.vue')
const GoodsDetail = () => import('/pages/Goods/goodsDetails')
const Cart = () => import('/pages/Cart/cart.vue')
Vue.use(Router)
export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			component: Index,
			name: 'index',
			redirect: '/home',
			children: [
				{
					path: '/home',
					component: Home
				},
				{
					path: '/goods',
					component: Goods
				},
				{
					path: '/goodsDetail',
					name: 'goodsDetail',
					component: GoodsDetail
				},
			]
		},
		
		{
			path: '/login',
			name: 'login',
			component: Login
		},
		{
			path: '/user',
			name: 'user',
			component: User,
			redirect: '/user/information',
			children: 
			[
				{
					path: 'orderList',
					name: 'orderList',
					component: OrderList
				},
				{
					path: 'addressList',
					name: 'addressList',
					component: AddressList
				},
				{
					path: 'information',
					name: 'information',
					component: Information
				},
			]
		},
		{
			path: '/cart',
			component: Cart
		},
		{
			path: '*',
			redirect: '/home'
		}
	]
})