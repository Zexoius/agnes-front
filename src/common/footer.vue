<template>
	<footer>
		<div class="container-list">
			<div class="footer-nav">
				<dl>
					<dt>订单服务</dt>
					<dd>
						<ul>
							<li>
								<a @click="_show('Tisps','待开发')">购买指南</a>
							</li>
							<li>
								<a @click="_show('Tisps','待开发')">支付方式</a>
							</li>
							<li>
								<a @click="_show('Tisps','待开发')">送货政策</a>
							</li>
							<li>
								<a @click="_show('Tisps','待开发')">推荐有礼</a>
							</li>
						</ul>
					</dd>
				</dl>
				<dl>
					<dt>项目介绍</dt>
					<dd>
						<ul>
							<li>
								<a href="https://github.com/Zexoius/agnes">agnes 后端</a>
							</li>
							<li>
								<a href="https://github.com/Zexoius/agnes-front">agnes-front 前端</a>
							</li>
							<!--<li>
								<a>推荐有礼</a>
							</li>-->
						</ul>
					</dd>
				</dl>
				<dl>
					<dt>热门活动</dt>
					<dd>
						<ul>
							<li>
								<a>夏令营</a>
							</li>
							<li>
								<a>课外活动</a>
							</li>
							<li>
								<a>分期付款</a>
							</li>
						</ul>
					</dd>
				</dl>
				<dl>
					<dt>自助服务</dt>
					<dd>
						<ul>
							<li>
								<a>选购帮助</a>
							</li>
							<li>
								<a>推荐有礼</a>
							</li>
							<li>
								<a>推荐有礼</a>
							</li>
						</ul>
					</dd>
				</dl>
				<dl>
					<div class="connect-me">
						<a class="qq-number">
							<div class="icon-phone">
								<i class="el-icon-bell">
								</i>
								<span @click="_show('Tips','别点了，没人在的')">931556924</span>
							</div>
						</a>
						<a>
							<figure>
								<div>
									<span class="face">在线客服</span>
									<span class="face" @click="_show('天助不如自助','君子求诸己')">请求帮助</span>
								</div>
							</figure>
							<p class="tel-time" @click="_show('Tips','事实上，常年失联')">周一至周四 9:00 - 12:00</p>
						</a>
					</div>
				</dl>
			</div>
		</div>
		<div class="rights">
			<div class="container-list">
				<div class="footer-tail">
					<p class="copy-right">
						(c) Copyright 2018 Zexus. All Rights Reserved.
					</p>
				</div>
			</div>
		</div>
	</footer>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {
			_show(t, m) {
				this.$notify.info({
					title: t,
					message: m
				})
			},
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");
	footer {
		-webkit-font-smoothing: antialiased;
		z-index: 99;
		background-color: #fcfcfc;
		border-top: 1px solid rgba(0, 0, 0, .1);
		margin-top: 60px;
		font-weight: 300;
	}
	
	.container-list {
		max-width: 1200px;
		min-width: 300px;
		display: block;
		margin: auto;
		width: 100%;
		&:after {
			content: "";
			display: table;
		}
		&:before {
			content: "";
			display: table;
		}
	}
	
	.footer-nav {
		color: rgba(0, 0, 0, .8);
		font-size: 16px;
		padding-top: 20px;
		padding-bottom: 20px;
		&:before {
			content: " ";
			display: table
		}
		&:after {
			content: " ";
			display: table;
			clear: both;
		}
		a {
			color: #828282;
			display: block;
			height: 50px;
			line-height: 50px;
			margin: 0;
			&:hover {
				color: #101920;
			}
		}
		dl {
			color: #10181f;
			border-top: 0;
			background: #fcfcfc;
			transition: background .2s;
			width: 20%;
			float: left;
			.active {
				background: #f6f6f6;
			}
		}
		dd {
			margin: 0;
			height: auto;
			overflow: hidden;
			transition: height .3s;
			padding: 0 20px;
			font-size: 14px;
			line-height: 1.7;
		}
		dt {
			padding: 0 20px;
			font-size: 16px;
			height: 50px;
			line-height: 50px;
			position: relative;
			color: #101920;
		}
		ul {
			padding-bottom: 10px;
		}
	}
	
	.connect-me {
		margin-top: 10px;
		color: #101920;
		.qq-number {
			font-size: 20px;
			text-align: center;
			color: #101920;
		}
		.icon-phone {
			font-size: 1.5em;
			vertical-align: middle;
			display: inline-block;
			margin-top: .1em;
		}
	}
	
	.tel-time {
		text-align: center;
		color: #828282;
		line-height: 1.5;
		margin-top: -15px;
	}
	
	.footer-tail {
		border-top: 1px solid rgba(0, 0, 0, .1);
		background-color: #f9f9f9;
		padding-bottom: 30px;
		padding-top: 20px;
		.copy-right {
			padding: 0 20px;
			padding-bottom: 0;
			line-height: 30px;
			display: inline-block;
			white-space: nowrap;
			border: 0;
		}
	}
	/* footerBtn */
	
	figure {
		width: 200px;
		height: 60px;
		margin: 50px auto;
		margin-top: 9px;
		cursor: pointer;
		perspective: 500px;
		-webkit-perspective: 500px;
		display: block;
	}
	
	figure div {
		height: 100%;
		transform-style: preserve-3d;
		-webkit-transform-style: preserve-3d;
		transition: 0.25s;
		-webkit-transition: 0.25s;
	}
	
	figure:hover div {
		transform: rotateX(-90deg);
	}
	
	span.face {
		width: 100%;
		height: 100%;
		position: absolute;
		box-sizing: border-box;
		border: 5px solid #fff;
		font-family: 'Source Sans Pro', sans-serif;
		line-height: 50px;
		font-size: 17pt;
		text-align: center;
		text-transform: uppercase;
	}
	
	span.face:nth-child(1) {
		color: #fff;
		display: block;
		background: #121212;
		border-radius: 3px;
		transform: translate3d(0, 0, 30px);
		-webkit-transform: translate3d(0, 0, 30px);
	}
	
	span.face:nth-child(2) {
		color: #094b2c;
		background: #ccc;
		transform: rotateX(90deg) translate3d(0, 0, 30px);
		-webkit-transform: rotateX(90deg) translate3d(0, 0, 30px);
	}
</style>