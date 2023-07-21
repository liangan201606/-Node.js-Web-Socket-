<template>
	<view class="login">
		<!-- 图片区域 -->
		<view class="login-img">
			<image src="../../static/images/index/start.png" mode=""></image>
		</view>
		<!-- 表单区域 -->
		<view class="login-forms">
			<!-- 注册表单 -->
			<form action="" class="login-create" id="login-up">
				<view class="login-title">注册</view>
				<view class="login-box">
					<!-- <view class="icon iconfont icon-yonghu1 login-icon"></view> -->
					<image src="../../static/images/index/user.png" class="login-icon"></image>
					<input type="text" placeholder="用户名" class="login-input" @blur="MatchUser">
					<view class="employ" v-if="isUser">用户名被占用</view>
				</view>
				<view class="login-box">
					<!-- <view class="icon iconfont icon-mima login-icon"></view> -->
					<image src="../../static/images/index/pwd.png" class="login-icon"></image>
					<input type="safe-password" placeholder="邮箱" class="login-input" @blur="Email">
					<view class="employ" v-if="isEmail">邮箱已被占用</view>
					<view class="invalid" v-if="invalid">邮箱无效</view>
				</view>
				<view class="login-box">
					<!-- <view class="icon iconfont icon-mima login-icon"></view> -->
					<image src="../../static/images/index/pwd.png" class="login-icon"></image>
					<input :password="flag" type="text" placeholder="密码" class="login-input" @input="Password">
					<!-- <view class="icon iconfont icon-faxian2 look" v-if="look" @tap="changeLook"></view>
					<view class="icon iconfont icon-faxian look" v-else @tap="changeLook"></view> -->
					<image src="../../static/images/index/eyesclose.png" class="login-icon" v-if="look" @tap="changeLook"></image>
					<!-- 睁眼 -->
					<image src="../../static/images/index/eyes.png" class="login-icon" v-else @tap="changeLook"></image>
				</view>
				<view v-if="isPwd" class="login-warning">请输入至少8位密码包含一个字母一个数字</view>
				<button :class="[{button:isSign},{button2:!isSign}]" @tap="Sign" >注册</button>
				<view>
					<text class="login-account">已注册账号？</text>
					<text class="login-signin" @tap="toLoginIn">登录</text>
				</view>
			</form>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'Sign',
		data() {
			return {
				isUser: false, //用户名是否重复
				isEmail: false, //邮箱是否重复
				isPwd: false, //密码是否符合规则
				look: true, //不可查看密码
				invalid: false, //邮箱是否符合
				flag: true, //判断是否保密
				email: "", //邮箱输入的值
				user: "", //用户名
				password: "", //密码
				isSign: false //是否可以注册
			}
		},
		mounted() {
			// uniapp中的子组件没有生命周期，只有页面才有生命周期 如果想用 就使用vue的生命周期
		},
		computed: {
			// 判断是否可以注册
			IS_Sign: function() {
				let that = this
				// 判断条件 用户不存在  邮箱不存在 密码大于7
				if (!that.isEmail && that.password.length>7 && !that.isUser) {
					// 都填写了内容
					that.isSign = true
				} else {
					that.isSign = false
				}
				return that.isSign
			}
		},
		methods: {
			toLoginIn: function() {
				uni.navigateTo({
					url: '../login/login'
				});
			},
			// 查看密码
			changeLook: function() {
				if (this.look) {
					// 可查看密码
					this.flag = false;
					this.look = !this.look
				} else {
					this.flag = true,
						this.look = !this.look
				}
			},
			// 判断是否为邮箱格式
			Email: function(e) {
				let reg =
					/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
				this.email = e.detail.value
				if (this.email.length > 0) {
					if (reg.test(this.email)) {
						// 邮箱格式正确
						this.invalid = false
						this.MatchEmail()
					} else {
						// 邮箱不符合
						this.invalid = true
						console.log(this.serverUrl);
					}
				}else{
					this.invalid = false
				}
			},
			// 匹配邮箱
			MatchEmail: function() {

				uni.request({
					url: this.serverUrl+'/signup/repeat',
					data: {
						data: this.email,
						// data:'1927552416@qq.com',
						type: 'email'
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							let res = data.data.result
							if (res > 0) {
								// 表示邮箱已经存在
								this.isEmail = true
							} else {
								// 表示邮箱不存在
								this.isEmail = false
							}
							this.IS_Sign
						} else if (code == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 1500
							})
						}
					}
				})
			},
			// 判断密码是否按正确格式输入
			Password: function(e) {
				// 8位密码 至少包含函一个字母一个数字
				let reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
				this.password = e.detail.value
				if (reg.test(this.password)) {
					this.isPwd = false

				} else {
					// 密码格式不符合
					this.isPwd = true
				}
				this.IS_Sign
			},
			// 获取用户名
			MatchUser: function(e) {
				this.user = e.detail.value
				if (this.user.length > 0) {
					uni.request({
						url: this.serverUrl + '/signup/repeat',
						data: {
							data: this.user,
							type: 'name'
						},
						method: 'POST',
						success: (data) => {
							let code = data.data.code
							if (code == 200) {
								let res = data.data.result
								if (res > 0) {
									// 表示用户已经存在
									this.isUser = true
								} else {
									// 表示用户不存在
									this.isUser = false
								}
								this.IS_Sign
							} else if (code == 500) {
								uni.showToast({
									title: '服务器出错啦！',
									icon: 'none',
									duration: 1500
								})
							}
						}
					})
				}else{
					this.isUser = false
				}
			},
			// 提交表单数据
			Sign: function() {
				if(this.IS_Sign){
					uni.request({
						url: this.serverUrl + '/signup/sign',
						data: {
							name: this.user,
							password: this.password,
							email:this.email
						},
						method: 'POST',
						success: (data) => {
							let code = data.data.code
							if (code == 200) {
								// 注册成功跳转登录页面
								console.log('注册成功');
								uni.navigateTo({
									url:'../login/login?user='+this.user
								})
							} else if (code == 500) {
								uni.showToast({
									title: '服务器出错啦！',
									icon: 'none',
									duration: 1500
								})
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

			.login-create {
				// backdrop-filter: blur(50rpx);
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
					padding: 30rpx 0rpx 20rpx 30rpx;
					margin-bottom: 30rpx;
					// 开启网格布局
					display: grid;
					grid-template-columns: 10% 60% 30%;
					border-radius: 10rpx;

					.login-icon {
						width: 50rpx;
						height: 50rpx;
					}

					.login-input {
						padding-top: 5rpx;
						text-align: left;
						// border: 1rpx solid red;
					}

					.employ,
					.invalid {
						// text-align: right;
						// border: 1rpx solid red;
						line-height: 50rpx;
						font-size: 25rpx;
						color: red;
					}

					.look {
						// text-align: right;
						line-height: 50rpx;
						font-size: 50rpx;
					}
				}

				.login-warning {
					text-align: left;
					font-size: 30rpx;
					color: red;
					margin-bottom: 10rpx;
				}

				.button {
					color: #fff;
					font-weight: 600;
					margin-bottom: 30rpx;
					background-color: rgba(147, 112, 219, 1);
				}

				.button2 {
					color: #fff;
					font-weight: 600;
					margin-bottom: 30rpx;
					background-color: darkgrey;
				}

				.login-signup,
				.login-signin {
					color: rgba(147, 112, 219, 1);
				}
			}

		}
	}
</style>