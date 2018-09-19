<template>
	<div class="header-box">
		<div>
			<header class="w">
				<div class="w-box">
					<div class="nav-logo">
						<h1>
							<router-link to="/" title="设计原型">Smartisan</router-link>
						</h1>
					</div>
					<div class="right-box">
						<div class="nav-list">
							<!--<router-link to="/product">全部商品</router-link>-->
							<a @click="_standBy">全部商品</a>
						</div>
						<div class="nav-aside" ref="aside" :class="{fixed: (st && showNav)}">
							<div class="user pr">
								<router-link to="/user">个人中心</router-link>
								<!--用户信息显示-->
								<div class="nav-user-wrapper pa" v-if="login">
									<div class="nav-user-list">
										<ul>
											<!--头像-->
											<li class="nav-user-avatar">
												<div>
													<span class="avatar" :style="{backgroundImage:'url('+userInfo.info.avator+')'}">
													</span>
												</div>
												<p class="name">{{userInfo.info.username}}</p>
											</li>
											<li v-for="(item, i) in navList" :key="i">
												<router-link :to="item.link">{{item.text}}</router-link>
											</li>
											<li>
												<a href="javascript:;" @click="_loginOut">退出</a>
											</li>
										</ul>
									</div>
								</div>
							</div>
							<div class="shop pr" @mouseover="cartShowState(true)" @mouseout="cartShowState(false)" ref="positionMsg">
								<router-link to="/cart"></router-link>
								<span class="cart-num">
									<i class="num" ref="num" :class="{no:totalNum <= 0,move_in_cart:receiveInCart}">{{totalNum}}</i>
								</span>

								<!--购物车显示块-->
								<div class="nav-user-wrapper pa active" v-show="showCart">
									<div class="nav-user-list">
										<div class="full" v-show="totalNum">
											<!--购物列表-->
											<div class="nav-cart-items">
												<ul>
													<li class="clearfix" v-for="(item,i) in cartList" :key="i">
														<div class="cart-item">
															<div class="cart-item-inner">
																<router-link :to="'productDetails?productId='+item.goodsId">
																	<div class="item-thumb">
																		<img :src="item.productImg">
																	</div>
																	<div class="item-desc">
																		<div class="cart-cell">
																			<h4>
																				<router-link :to="'productDetails?productId='+item.goodsId" v-text="item.goodsName"></router-link>
																			</h4>
																			<h6>
																				<span class="price-icon">¥</span>
																				<span class="price-num">{{item.salePrice}}</span>
																				<span class="item-num">x {{item.goodsNum}}</span>
																			</h6>
																		</div>
																	</div>
																</router-link>
																<div class="del-btn del" @click="delproduct(item.goodsId)">删除</div>
															</div>
														</div>
													</li>
												</ul>
											</div>
											<!--总件数-->
											<div class="nav-cart-total">
												<p>共
													<strong>{{totalNum}}</strong> 件商品</p>
												<h5>合计：
													<span class="price-icon">¥</span>
													<span class="price-num">{{totalPrice}}</span>
												</h5>
												<h6>
													<el-button type="primary" style="height: 40px;width: 100%;margin: 0;color: #fff;font-size: 14px;line-height: 15px"
													     @click="toCart">去购物车</el-button>
												</h6>
											</div>
										</div>
										<div v-show="!totalNum" style="height: 313px;text-align: center" class="cart-con">
											<p>心里空荡荡的</p>
										</div>
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>
			</header>

			<!--底部导航-->
			<slot name="nav">
				<div class="section-row">
					<div class="sections">
						<div class="section-container">
							<div class="subnav">
								<div :class="{'is-sticky':st}">
									<div class="subnav-container">
										<ul>
											<li>
												<a href="javascript:0" @click="_standBy"><i class="i-phone"></i>
													<span class="icon-label">手机</span>
												</a>
											</li>
											<li>
												<a href="javascript:0" @click="_standBy"><i class="i-audio"></i>
													<span class="icon-label">耳机</span>
												</a>
											</li>
											<li>
												<a href="javascript:0" @click="_standBy"><i class="i-cases"></i>
													<span class="icon-label">壳/膜</span>
												</a>
											</li>
											<li>
												<a href="javascript:0" @click="_standBy"><i class="i-cables"></i>
													<span class="icon-label">适配器/数据线</span>
												</a>
											</li>
											<li>
												<a href="javascript:0" @click="_standBy"><i class="i-bundles"></i>
													<span class="icon-label">套装</span>
												</a>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</slot>

		</div>
	</div>
</template>
<script>
	import YButton from '/components/YButton'
	import {
		mapMutations,
		mapState
	} from 'vuex'
	import {
		getCartList,
		cartDel
	} from '/api/goods'
	import {
		userLogout
	} from '/api/index'
	import {
		setStore,
		getStore,
		removeStore
	} from '@/store/storage'

	export default {
		props: {
			showNav: {
				default: true,
				type: Boolean
			}
		},
		data() {
			return {
				user: {},
				// 列表
				navList: [{
					text: '我的订单',
					link: '/user/orderList'
				}, {
					text: '账号资料',
					link: '/user/information'
				}, {
					text: '收货地址',
					link: '/user/addressList'
				}],
				st: false,
				// 头部购物车显示
				cartShow: false,
				timerCartShow: null // 定时隐藏购物车
			}
		},
		computed: {
			...mapState([
				'cartList', 'login', 'receiveInCart', 'showCart', 'userInfo'
			]),
			// 计算价格
			totalPrice() {
				let totalPrice = 0
				this.cartList.length && this.cartList.forEach(item => {
					totalPrice += (item.goodsNum * item.salePrice)
				})
				return totalPrice
			},
			// 计算数量
			totalNum() {
				let totalNum = 0
				this.cartList.length && this.cartList.forEach(item => {
					totalNum += (item.goodsNum)
				})
				return totalNum
			}
		},
		methods: {
			...mapMutations(['ADD_CART', 'INIT_BUYCART', 'ADD_ANIMATION', 'SHOW_CART', 'REDUCE_CART', 'RECORD_USERINFO',
				'EDIT_CART'
			]),
			_standBy(){
				this.$notify.info({
					title: "Tips",
					message: "待开发"
				})
			},
			// 购物车显示
			cartShowState(state) {
				this.SHOW_CART({
					showCart: state
				})
			},
			// 登陆时获取一次购物车商品
			_getCartList() {
				getCartList({
					userId: getStore('userId')
				}).then(res => {
					if(res.code === 1) {
						setStore('buyCart', res.cartList)
					}
					// 重新初始化一次本地数据
				}).then(this.INIT_BUYCART)
			},
			// 删除商品
			delproduct(goodsId) {
				if(this.login) { // 登陆了
					cartDel({
						userId: getStore("userId"),
						goodsId
					}).then(res => {
						this.EDIT_CART({
							goodsId
						})
					})
				} else {
					this.EDIT_CART({
						goodsId
					})
				}
			},
			toCart() {
				this.$router.push({
					path: '/cart'
				})
			},
			// 控制顶部
			navFixed() {
				if(this.$route.path === '/goods' ||
					this.$route.path === '/home' ||
					this.$route.path === '/goodsDetail') {
					// 计算是否吸顶
					if(this.showNav) {
						let st = document.documentElement.scrollTop || document.body.scrollTop
						st >= 100 ? this.st = true : this.st = false
					}
					// 计算小圆当前位置
					let num = this.$refs.num
					const {
						left,
						top
					} = num.getBoundingClientRect()
					this.ADD_ANIMATION({
						cartPositionL: left,
						cartPositionT: top
					})
				}
			},
			// 退出登陆
			_loginOut() {
				loginOut().then(res => {
					removeStore('buyCart')
					window.location.href = '/'
				})
			}
		},
		mounted() {
			if(this.login) {
				this._getCartList()
			} else {
				this.INIT_BUYCART()
			}
			setTimeout(() => {
				this.navFixed()
			}, 300)
			window.addEventListener('scroll', this.navFixed)
			window.addEventListener('resize', this.navFixed)
		},
		destroyed() {
			window.removeEventListener('scroll', this.navFixed)
			window.removeEventListener('resize', this.navFixed)
		},
		components: {
			YButton
		}
	}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
	@import "../assets/style/theme";
	@import "../assets/style/mixin";
	.move_in_cart {
		animation: mymove .5s ease-in-out;
	}
	
	@keyframes mymove {
		0% {
			transform: scale(1)
		}
		25% {
			transform: scale(.8)
		}
		50% {
			transform: scale(1.2)
		}
		75% {
			transform: scale(.9)
		}
		100% {
			transform: scale(1)
		}
	}
	
	.section-row {
		display: flex;
		width: 100%;
		box-sizing: border-box;
		position: relative;
	}
	
	.sections {
		width: 100%;
		display: flex;
	}
	
	.section-container {
		position: relative;
		height: 100%;
		width: 100%;
	}
	
	.subnav {
		background: #f1f1f1;
		height: 150px;
		overflow: hidden;
		.subnav-container {
			text-align: center;
			background: #f1f1f1;
			padding: 40px 0 25px;
			width: 100%;
			height: 95px;
			-moz-transition: height 0.5s, padding 0.5s;
			-o-transition: height 0.5s, padding 0.5s;
			-webkit-transition: height 0.5s, padding 0.5s;
			transition: height 0.5s, padding 0.5s;
			li {
				display: inline-block;
				font-size: 14px;
				width: 105px;
				-moz-transition: all 0.4s;
				-o-transition: all 0.4s;
				-webkit-transition: all 0.4s;
				transition: all 0.4s;
				a {
					display: block;
					color: #333;
					.active {
						color: #eb0028;
						i:before {
							opacity: 1;
						}
					}
					&:hover {
						color: #eb0028;
						i:before {
							opacity: 1;
						}
					}
				}
				span {
					display: block;
					-moz-transition: all 0.3s 0.1s;
					-o-transition: all 0.3s 0.1s;
					-webkit-transition: all 0.3s;
					-webkit-transition-delay: 0.1s;
					transition: all 0.3s 0.1s;
				}
				i {
					background: #ccc;
					border-radius: 50%;
					position: relative;
					margin-bottom: 25px;
					-moz-transition: all 0.4s;
					-o-transition: all 0.4s;
					-webkit-transition: all 0.4s;
					transition: all 0.4s;
				}
				.i-phone {
					display: inline-block;
					background-repeat: no-repeat;
					background-image: url(../assets/img/categoryicons-s4160ec4a61.png);
					background-position: 0 -451px;
					height: 41px;
					width: 41px;
					&:before {
						content: '';
						display: block;
						position: absolute;
						left: 0;
						top: 0;
						opacity: 0;
						border-radius: 50%;
						display: inline-block;
						background-repeat: no-repeat;
						background-image: url(../assets/img/categoryicons-s4160ec4a61.png);
						background-position: 0 -410px;
						height: 41px;
						width: 41px;
						-moz-transition: opacity 0.3s;
						-o-transition: opacity 0.3s;
						-webkit-transition: opacity 0.3s;
						transition: opacity 0.3s;
					}
				}
				.i-audio {
					display: inline-block;
					background-repeat: no-repeat;
					background-image: url(../assets/img/categoryicons-s4160ec4a61.png);
					background-position: 0 -41px;
					height: 41px;
					width: 41px;
					&::before {
						content: '';
						display: block;
						position: absolute;
						left: 0;
						top: 0;
						opacity: 0;
						border-radius: 50%;
						display: inline-block;
						background-repeat: no-repeat;
						background-image: url(../assets/img/categoryicons-s4160ec4a61.png);
						background-position: 0 0;
						height: 41px;
						width: 41px;
						-moz-transition: opacity 0.3s;
						-o-transition: opacity 0.3s;
						-webkit-transition: opacity 0.3s;
						transition: opacity 0.3s;
					}
				}
				.i-cases {
					display: inline-block;
					background-repeat: no-repeat;
					background-image: url(../assets/img/categoryicons-s4160ec4a61.png);
					background-position: 0 -287px;
					height: 41px;
					width: 41px;
					&:before {
						content: '';
						display: block;
						position: absolute;
						left: 0;
						top: 0;
						opacity: 0;
						border-radius: 50%;
						display: inline-block;
						background-repeat: no-repeat;
						background-image: url(../assets/img/categoryicons-s4160ec4a61.png);
						background-position: 0 -246px;
						height: 41px;
						width: 41px;
						-moz-transition: opacity 0.3s;
						-o-transition: opacity 0.3s;
						-webkit-transition: opacity 0.3s;
						transition: opacity 0.3s;
					}
				}
				.i-cables {
					display: inline-block;
					background-repeat: no-repeat;
					background-image: url(../assets/img/categoryicons-s4160ec4a61.png);
					background-position: 0 -205px;
					height: 41px;
					width: 41px;
					&:before {
						content: '';
						display: block;
						position: absolute;
						left: 0;
						top: 0;
						opacity: 0;
						border-radius: 50%;
						display: inline-block;
						background-repeat: no-repeat;
						background-image: url(../assets/img/categoryicons-s4160ec4a61.png);
						background-position: 0 -164px;
						height: 41px;
						width: 41px;
						-moz-transition: opacity 0.3s;
						-o-transition: opacity 0.3s;
						-webkit-transition: opacity 0.3s;
						transition: opacity 0.3s;
					}
				}
				.i-bundles {
					display: inline-block;
					background-repeat: no-repeat;
					background-image: url(../assets/img/categoryicons-s4160ec4a61.png);
					background-position: 0 -123px;
					height: 41px;
					width: 41px;
					&:before {
						content: '';
						display: block;
						position: absolute;
						left: 0;
						top: 0;
						opacity: 0;
						border-radius: 50%;
						display: inline-block;
						background-repeat: no-repeat;
						background-image: url(../assets/img/categoryicons-s4160ec4a61.png);
						background-position: 0 -82px;
						height: 41px;
						width: 41px;
						-moz-transition: opacity 0.3s;
						-o-transition: opacity 0.3s;
						-webkit-transition: opacity 0.3s;
						transition: opacity 0.3s;
					}
				}
			}
		}
		.is-sticky {
			.subnav-container {
				position: fixed;
				top: 0;
				left: 0;
				padding: 0;
				z-index: 13;
				height: 60px;
				overflow: hidden;
				box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.2);
				li {
					i {
						-moz-transform: scale(0);
						-ms-transform: scale(0);
						-webkit-transform: scale(0);
						transform: scale(0);
					}
					span {
						-moz-transform: translate3d(0, -45px, 0);
						-ms-transform: translate3d(0, -45px, 0);
						-webkit-transform: translate3d(0, -45px, 0);
						transform: translate3d(0, -45px, 0);
					}
				}
			}
		}
	}
	/* OLD */
	
	.header-box {
		background: $head-bgc;
		background-image: -webkit-linear-gradient(#000, #121212);
		background-image: linear-gradient(#000, #121212);
		width: 100%;
	}
	
	header {
		height: 100px;
		z-index: 15;
		position: relative;
	}
	
	.w-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100%;
		position: relative;
		h1 {
			height: 100%;
			display: flex;
			align-items: center;
			>a {
				background: url(../../build/logo.png) no-repeat 50%;
				background-size: cover;
				display: block;
				@include wh(50px, 50px);
				text-indent: -9999px;
				background-position: 0 0;
			}
		}
		.nav-list {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 22px;
			a {
				color: #c8c8c8;
				display: block;
				font-size: 14px;
				padding: 0 25px;
				&:hover {
					color: #fff;
				}
			}
		}
		.nav-aside {
			position: relative;
			&:before {
				background: #333;
				background: hsla(0, 0%, 100%, .2);
				content: " ";
				@include wh(1px, 13px);
				overflow: hidden;
				position: absolute;
				top: 4px;
				left: 0;
			}
			&.fixed {
				width: 262px;
				position: fixed;
				left: 50%;
				margin-left: 451px;
				margin-top: 0;
				z-index: 50;
				top: -40px;
				transform: translate3d(0, 59px, 0);
				transition: transform .3s cubic-bezier(.165, .84, .44, 1);
				.user {
					&:hover {
						a:before {
							background-position: -215px 0;
						}
					}
				}
				.shop {
					&:hover {
						a:before {
							background-position: -210px -22px;
						}
					}
				}
			}
		}
		.right-box {
			display: flex;
		}
		.nav-aside {
			display: flex;
		} // 用户
		.user {
			margin-left: 41px;
			width: 36px;
			&:hover {
				a:before {
					background-position: -5px 0;
				}
				.nav-user-wrapper {
					top: 18px;
					visibility: visible;
					opacity: 1;
					-webkit-transition: opacity .15s ease-out;
					transition: opacity .15s ease-out;
				}
			}
			>a {
				position: relative;
				@include wh(36px, 20px);
				display: block;
				text-indent: -9999px;
				&:before {
					content: " ";
					position: absolute;
					left: 8px;
					top: 0;
					@include wh(20px);
					background: url(../assets/img/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png) -155px 0;
					background-size: 240px 107px;
					transition: none;
				}
			}
			li+li {
				text-align: center;
				position: relative;
				border-top: 1px solid #f5f5f5;
				line-height: 44px;
				height: 44px;
				color: #616161;
				font-size: 12px;
				&:hover {
					background: #fafafa;
				}
				a {
					display: block;
					color: #616161;
				}
			}
			.nav-user-avatar {
				>div {
					position: relative;
					margin: 0 auto 8px;
					@include wh(46px);
					text-align: center;
					&:before {
						content: "";
						position: absolute;
						left: 0;
						right: 0;
						top: 0;
						bottom: 0;
						border-radius: 50%;
						box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06);
					}
					.avatar {
						border-radius: 50%;
						display: block;
						@include wh(100%);
						background-repeat: no-repeat;
						background-size: contain;
					}
				}
				.name {
					margin-bottom: 16px;
					font-size: 12px;
					line-height: 1.5;
					text-align: center;
					color: #757575;
				}
			}
			.nav-user-wrapper {
				width: 168px;
				transform: translate(-50%);
				left: 50%;
			}
			.nav-user-list {
				width: 168px;
				&:before {
					left: 50%;
				}
			}
		}
		.shop {
			position: relative;
			float: left;
			margin-left: 21px;
			width: 61px;
			z-index: 20;
			&:hover {
				a:before {
					content: " ";
					background-position: 0 -22px;
				}
			}
			.nav-user-wrapper.active {
				top: 18px;
				visibility: visible;
				opacity: 1;
				-webkit-transition: opacity .15s ease-out;
				transition: opacity .15s ease-out;
			}
			>a {
				position: absolute;
				left: 0;
				top: 0;
				bottom: 0;
				display: block;
				right: 0;
				z-index: 32;
				&:before {
					display: block;
					@include wh(30px, 100%);
					content: " ";
					background: url(../assets/img/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png) 0 -22px;
					background-size: 240px 107px;
					background-position: -150px -22px;
				}
			}
			.cart-num {
				position: relative;
				display: block;
				margin-left: 31px;
				margin-top: -1px;
				min-width: 30px;
				text-indent: 0;
				z-index: 20;
				line-height: 20px;
				>i {
					background: #eb746b;
					background-image: -webkit-linear-gradient(#eb746b, #e25147);
					background-image: linear-gradient(#eb746b, #e25147);
					box-shadow: inset 0 0 1px hsla(0, 0%, 100%, .15), 0 1px 2px hsla(0, 0%, 100%, .15);
					text-align: center;
					font-style: normal;
					display: inline-block;
					@include wh(20px);
					line-height: 20px;
					border-radius: 10px;
					color: #fff;
					font-size: 12px;
					&.no {
						background: #969696;
						background-image: -webkit-linear-gradient(#A4A4A4, #909090);
						background-image: linear-gradient(#A4A4A4, #909090);
						box-shadow: inset 0 0 1px #838383, 0 1px 2px #838383;
					}
				}
			}
			.nav-user-wrapper {
				right: 0;
				width: 360px;
				.nav-user-list {
					&:before {
						right: 34px;
					}
				}
			}
			.nav-user-list {
				padding: 0;
				width: 100%;
				.full {
					border-radius: 8px;
					overflow: hidden;
				}
				.nav-cart-items {
					max-height: 363px;
					overflow-x: hidden;
					overflow-y: auto;
				}
				.cart-item {
					height: 120px;
					width: 100%;
					overflow: hidden;
					border-top: 1px solid #f0f0f0;
					&:hover {
						background: #fcfcfc;
						.del {
							display: block;
						}
					}
				}
				li:first-child .cart-item:first-child {
					border-top: none;
					border-radius: 8px 8px 0 0;
					overflow: hidden;
				}
				.cart-item-inner {
					padding: 20px;
					position: relative;
				}
				.item-thumb {
					position: relative;
					float: left;
					width: 80px;
					height: 80px;
					border-radius: 3px;
					&:before {
						content: "";
						position: absolute;
						left: 0;
						right: 0;
						top: 0;
						bottom: 0;
						z-index: 16;
						border: 0 solid transparent;
						box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06);
						border-radius: 3px;
					}
					img {
						display: block;
						@include wh(80px, 80px);
						border-radius: 3px;
						overflow: hidden;
					}
				}
				.item-desc {
					margin-left: 98px;
					display: table;
					@include wh(205px, 80px);
					h4 {
						color: #000;
						width: 185px;
						overflow: hidden;
						word-break: keep-all;
						white-space: nowrap;
						text-overflow: ellipsis;
						font-size: 14px;
						line-height: 16px;
						margin-bottom: 10px;
					}
					.attrs span {
						position: relative;
						display: inline-block;
						margin-right: 20px;
						font-size: 14px;
						line-height: 14px;
						color: #999;
					}
					.attrs span:last-child {
						margin-right: 0;
					}
					h6 {
						color: #cacaca;
						font-size: 12px;
						line-height: 14px;
						margin-top: 20px;
						span {
							display: inline-block;
							font-weight: 700;
							color: #cacaca;
						}
						.price-icon,
						.price-num {
							color: #d44d44;
						}
						.price-num {
							margin-left: 5px;
							font-size: 14px;
						}
						.item-num {
							margin-left: 10px;
						}
					}
				}
				.cart-cell {
					display: table-cell;
					vertical-align: middle;
				}
				.del-btn{
					display: block;
					cursor: pointer;
					width: 20px;
					height: 20px;
					background: url(../assets/img/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png) -50px -60px no-repeat;
					background-size: 240px 107px;
					&:hover{
						background-position: -75px -60px;
					}
				}
				.del {
					display: none;
					overflow: hidden;
					position: absolute;
					right: 20px;
					top: 50%;
					transform: translateY(-50%);
				}
			}
			.nav-cart-total {
				box-sizing: content-box;
				position: relative;
				padding: 20px;
				height: 40px;
				background: #fafafa;
				border-top: 1px solid #f0f0f0;
				border-radius: 0 0 8px 8px;
				box-shadow: inset 0 -1px 0 hsla(0, 0%, 100%, .5), 0 -3px 8px rgba(0, 0, 0, .04);
				background: -webkit-linear-gradient(#fafafa, #f5f5f5);
				background: linear-gradient(#fafafa, #f5f5f5);
				p {
					margin-bottom: 4px;
					line-height: 16px;
					font-size: 12px;
					color: #c1c1c1;
				}
				h5 {
					line-height: 20px;
					font-size: 14px;
					color: #6f6f6f;
					span {
						font-size: 18px;
						color: #de4037;
						display: inline-block;
						font-weight: 700;
					}
					span:first-child {
						font-size: 12px;
						margin-right: 5px;
					}
				}
				h6 {
					position: absolute;
					right: 20px;
					top: 20px;
					width: 108px;
				}
			}
		}
	}
	
	@media (max-height: 780px) {
		.nav-cart-items {
			max-height: 423px !important;
		}
	}
	
	@media (max-height: 900px) {
		.nav-cart-items {
			max-height: 544px !important;
		}
	}
	
	@media (max-height: 1080px) {
		.nav-cart-items {
			max-height: 620px !important;
		}
	} // 用户信息弹出
	.nav-user-wrapper {
		position: absolute;
		z-index: 30;
		padding-top: 18px;
		opacity: 0;
		visibility: hidden;
		top: -3000px;
		.nav-user-list {
			position: relative;
			padding-top: 20px;
			background: #fff;
			border: 1px solid #d6d6d6;
			border-color: rgba(0, 0, 0, .08);
			border-radius: 8px;
			box-shadow: 0 20px 40px rgba(0, 0, 0, .15);
			z-index: 15;
			&:before {
				position: absolute;
				content: "";
				background: url(../assets/img/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png) no-repeat -49px -43px;
				background-size: 240px 107px;
				@include wh(20px, 8px);
				top: -8px;
				margin-left: -10px;
			}
		}
	}
	
	.nav-sub {
		position: relative;
		height: 90px;
		background: #f7f7f7;
		box-shadow: 0 2px 4px rgba(0, 0, 0, .04);
		z-index: 1;
		/* where is new */
		/*height: 150px;*/
		overflow: hidden;
		&.fixed {
			position: fixed;
			z-index: 5;
			height: 60px;
			top: 0;
			left: 0;
			right: 0;
			border-bottom: 1px solid #dadada;
			background-image: -webkit-linear-gradient(#fff, #f1f1f1);
			background-image: linear-gradient(#fff, #f1f1f1);
			/* where is new  */
			padding: 0;
			overflow: hidden;
			box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.2);
		}
		.nav-sub-wrapper {
			padding: 31px 0;
			height: 90px;
			position: relative;
			&.fixed {
				padding: 0;
				height: 100%;
				display: flex;
				align-items: center;
				/* where is new */
				i {
					transform: scale(0);
				}
			}
			&:after {
				content: "";
				position: absolute;
				top: 89px;
				left: 50%;
				margin-left: -610px;
				width: 1220px;
				background: #000;
				height: 1px;
				display: none;
				opacity: 0;
				-webkit-transition: opacity .3s ease-in;
				transition: opacity .3s ease-in;
			}
		}
		.w {
			display: flex;
			justify-content: space-between;
		}
		.nav-list {
			line-height: 28px;
			display: flex;
			align-items: center;
			height: 100%;
			/* where is new */
			text-align: center;
			background: #F1F1F1;
			width: 100%;
			transition: height .5s padding .5s;
			li:first-child {
				padding-left: 0;
				a {
					padding-left: 10px;
				}
			}
			li {
				position: relative;
				float: left;
				padding-left: 2px;
				/* where is new */
				display: inline-block;
				font-size: 14px;
				width: 105px;
				transition: all .4s;
				a {
					display: block;
					padding: 0 20px;
					color: #666;
					/* where is new */
					i {
						background: #CCCCCC;
						border-radius: 50%;
						position: relative;
						margin-bottom: 25px;
						transition: all .4s;
						display: inline-block;
						background-repeat: no-repeat;
						/*background-position: 0 -451px;*/
						height: 41px;
						width: 41px;
						&:before {
							content: "";
							display: block;
							position: absolute;
							left: 0;
							top: 0;
							opacity: 0;
							border-radius: 50%;
							display: inline-block;
							background-repeat: no-repeat;
							background-image: url(../assets/img/categoryicons-s4160ec4a61.png);
							/*background-position: 0 -410px;*/
							height: 41px;
							width: 41px;
							transition: opacity .3s;
						}
						.phone {
							background-position: 0 -410px;
						}
						.audio {
							background-position: 0 0;
						}
						span {
							transform: translate3d(0, -45px, 0);
							transition: all .3s .1s;
						}
					}
				}
			}
			li:before {
				content: ' ';
				position: absolute;
				left: 0;
				top: 13px;
				width: 2px;
				height: 2px;
				background: #bdbdbd;
			}
		}
	}
	
	@media (min-width: 1px) {
		.nav-sub .nav-sub-wrapper:after {
			display: block;
		}
	}
	
	.cart-con {
		/*display: flex;*/
		text-align: center;
		position: relative;
		p {
			padding-top: 185px;
			color: #333333;
			font-size: 16px;
		}
	}
	
	.cart-con:before {
		position: absolute;
		content: ' ';
		left: 50%;
		transform: translate(-50%, -70%);
		top: 50%;
		width: 76px;
		height: 62px;
		background: url(../assets/img/cart-empty-new.png) no-repeat;
		background-size: cover;
	}
</style>