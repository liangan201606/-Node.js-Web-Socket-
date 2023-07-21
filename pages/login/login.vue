<template>
	<view class="login">
		<!-- 图片区域 -->
		<view class="login-img">
			<image src="../../static/images/index/start.png" mode=""></image>
		</view>
		<!-- 表单区域 -->
		<view class="login-forms">
			<!-- 登录表单 -->
			<form action="" class="login-register" id="login-in">
				<view class="login-title">登录</view>
				<view class="login-box">
					<image src="../../static/images/index/user.png" class="login-icon"></image>
					<input type="text" placeholder="用户名/邮箱" class="login-input" v-model="user">
				</view>
				<view class="login-box">
					<image src="../../static/images/index/pwd.png" class="login-icon"></image>
					<input :password="flag" type="text" placeholder="密码" class="login-input" v-model="password">
					<!-- 闭眼 -->
					<!-- <view class="icon iconfont icon-faxian2 look" v-if="look" @tap="changeLook"></view> -->
					<image src="../../static/images/index/eyesclose.png" class="login-icon" v-if="look" @tap="changeLook"></image>
					<!-- 睁眼 -->
					<image src="../../static/images/index/eyes.png" class="login-icon" v-else @tap="changeLook"></image>
					<!-- <view class="icon iconfont icon-faxian look" v-else @tap="changeLook"></view> -->
				</view>
				<text class="login-warning" v-if="warning">输入的用户名或密码错误</text>
				<text class="login-forgot">忘记密码?</text>
				<button class="login-button" @tap="Login">登录</button>
				<view>
					<text class="login-account">未注册账号？</text>
					<text class="login-signin" @tap="toSignUp">注册</text>
				</view>
			</form>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'Login',
		data() {
			return {
				look: true, //不可查看密码
				flag: true, //判断是否保密
				warning: false, //是否出现错误警告
				user: "", //用户名
				password: "", //密码
				token: ''
			}
		},
		mounted() {
			// uniapp中的子组件没有生命周期，只有页面才有生命周期 如果想用 就使用vue的生命周期
		},
		onLoad: function(e) {
			if (e.user) {
				this.user = e.user
				uni.showToast({
					title: '注册成功请登录',
					icon: 'none',
					duration: 2000
				})
			}else if(e.name){
				this.user = e.name
				uni.showToast({
					title: '登录过期请重新登录',
					icon: 'none',
					duration: 2000
				})
			}
		},
		methods: {
			// 跳转到注册页面
			toSignUp: function() {
				uni.navigateTo({
					url: '../sign/sign'
				});
			},
			// 查看密码
			changeLook: function() {
				if (this.look) {
					// 可查看密码
					this.flag = false;
					this.look = !this.look
				} else {
					// 不可查看密码 look==false
					this.flag = true,
						this.look = !this.look
				}
			},
			// 登录提交
			Login: function() {
				if (this.password && this.user) {
					uni.request({
						url: this.serverUrl + '/loginin/login',
						data: {
							data: this.user,
							password: this.password
						},
						method: 'POST',
						success: (data) => {
							let code = data.data.code
							if (code == 200) {
								// 登录成功
								this.warning = false
								let res = data.data.back
								// 存储用户信息
								console.log('登录成功');
								try {
									uni.setStorageSync('user', {
										'id': res.id,
										'name': res.name,
										'imgUrl': res.imgUrl,
										'token': res.token
									});
								} catch (e) {
									//TODO handle the exception
									console.log('数据存储出错');
								}
								// 跳转到首页
								// uni.switchTab({
								// 	url: '../index/index'
								// });
								uni.reLaunch({
									url: '../index/index'
								})
							} else if (code == 500) {
								uni.showToast({
									title: '服务器出错啦！',
									icon: 'none',
									duration: 1500
								})
							} else if (code == 400) {
								// 匹配失败
								this.warning = true
								this.password = '' //清空
							}
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.login {
		// 开启网格布局 并设置为1列
		display: grid;
		grid-template-columns: 100%;
		margin: 0 30rpx;

		.login-img {
			width: 500rpx;
			margin-top: 24rpx;
			justify-self: center;

			image {
				width: 500rpx;
			}
		}

		.login-forms {
			display: grid;
			height: 600rpx;
			text-align: center;

			.login-register {
				background-color: lightgrey;
				padding: 40rpx 30rpx;
				border-radius: 20rpx;

				.login-title {
					font-size: 50rpx;
					font-weight: 900;
					margin-bottom: 30rpx;
				}

				.login-box {
					background-color: #ffffff;
					padding: 30rpx 30rpx;
					margin-bottom: 30rpx;
					// 开启网格布局
					display: grid;
					grid-template-columns: 10% 70% 20%;
					border-radius: 10rpx;
					.login-icon {
						width: 50rpx;
						height: 50rpx;
						// margin-right: 20rpx;
					}

					.login-input {
						padding-top: 5rpx;
						text-align: left;
					}

					.look {
						// text-align: right;
						line-height: 50rpx;
						font-size: 50rpx;
					}
				}

				.login-warning {
					display: block;
					margin-right: auto;
					width: max-content;
					margin-bottom: 20rpx;
					color: red;
				}

				.login-forgot {
					display: block;
					margin-left: auto;
					width: max-content;
					margin-bottom: 20rpx;
					color: rgba(147, 112, 219, 1);
				}

				.login-button {
					color: #fff;
					font-weight: 600;
					margin-bottom: 30rpx;
					background-color: rgba(147, 112, 219, 1);
				}

				.login-signup,
				.login-signin {
					color: rgba(147, 112, 219, 1);
				}
			}

		}
	}
</style>