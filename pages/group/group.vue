<template>
	<view class="box">
		<view class="top-bar">
			<!-- <image src="../../static/images/index/返回箭头 详情页 (1).png" mode=""  @tap='goBack' class="image"></image> -->
			<view @tap='goBack' class="image">取消</view>
			<view class="title">创建群聊</view>
		</view>
		<view class="main">
			<view class="top">
				<!-- 群头像 -->
				<view class="group-image">
					<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
					<image :src="cropFilePath" @tap="upload" class="head-image"></image>
				</view>
				<!-- 群名字 -->
				<view class="group-name">
					<input type="text" placeholder="请输入群的名字" class="group-name-input" v-model="name">
					<view class="title">用户</view>
				</view>
			</view>
			<!-- 选择用户 -->
			<view class="friends">
				<!-- <view class="title">用户</view> -->
				<view class="user" v-for="(item,index) in Friends" :key='index' @tap='selectFriend(index)'>
					<view class="selected" :class="{isSelected:item.selected}">
						<image src="../../static/images/index/slected.png" class="selected-img" v-show="item.selected">
						</image>
					</view>
					<image :src="item.imgUrl" class="user-img"></image>
					<view class="name">{{item.name}}</view>
				</view>
			</view>
		</view>
		<!-- 创建按钮 -->
		<view class="bottom-bar">
			<view class="bottom-btn" @tap='createGroup'>创建({{selectedNum}})</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	export default {
		data() {
			return {
				uid: '', //用户id
				token: '', //token
				tempFilePath: "", // 图片裁剪
				cropFilePath: "../../static/images/index/background.jpeg",
				image: '', //修改后的图片
				GimgUrl: '/group/group.png', //群头像
				name: '', //群名称
				user: [], //选中的朋友
				Friends: [], //好友数组
				selectedNum: 0, //选中的数量
			}
		},
		components: {
			ImageCropper,
		},
		onLoad: function() {
			this.getStorage()
			this.getFriends()
			this.GetselecetNum()
		},
		methods: {
			// 跳转到上一页面
			goBack: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 获取缓存数据
			getStorage: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id
						this.token = value.token
					} else {
						// 如果没有用户缓存跳转登录页面
						uni.navigateTo({
							url: '../login/login'
						})
					}
				} catch (e) {}
			},
			// 头像裁剪
			upload() {
				// chooseIamge自带的选择图片的api
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ["album"], //从相册选择
					success: (res) => {
						this.tempFilePath = res.tempFilePaths.shift();
					},
				});
			},
			confirm(e) {
				this.tempFilePath = "";
				this.cropFilePath = e.detail.tempFilePath;
				this.image = e.detail.tempFilePath
				// 上传服务器
				uni.uploadFile({
					url: this.serverUrl + '/files/upload',
					filePath: this.cropFilePath,
					name: "file",
					fileType: this.image,
					formData: {
						url: 'group',
						name: this.uid,//文件名
						token: this.token
					}, //传递参数
					success: (uploadFileRes) => {
						var backstr = uploadFileRes.data;
						this.GimgUrl = backstr
					},
					fail(e) {
						console.log("this is errormes " + e.message);
					},
				});
			},
			cancel() {
				console.log("canceled");
				this.tempFilePath = "";
			},
			// 获取好友列表
			getFriends: function() {
				uni.request({
					url: this.serverUrl + '/home/getFriend',
					data: {
						uid: this.uid,
						state: 0, //好友
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							let res = data.data.result
							for (let i = 0; i < res.length; i++) {
								res[i].imgUrl = this.serverUrl + res[i].imgUrl
								res[i].selected = false
							}
							this.Friends = res
						} else if (code == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							})
						} else if (code == 300) {
							// token失效
							uni.navigateTo({
								url: '../login/login?name=' + this.name
							})
						}
					}
				})
			},
			// 获取选择的用户数量
			GetselecetNum: function() {
				for (let i = 0; i < this.Friends.length; i++) {
					if (this.Friends[i].selected) {
						this.selectedNum++
					}
				}
			},
			// 动态的选择好友
			selectFriend: function(e) {
				if (this.Friends[e].selected) {
					this.Friends[e].selected = false
					this.selectedNum--
				} else {
					this.Friends[e].selected = true
					this.selectedNum++
				}
			},
			// 点击创建群聊
			createGroup: function() {
				// 符合条件提交
				if (this.selectedNum && this.name.length) {
					this.user.push(this.uid)
					for (let i = 0; i < this.Friends.length; i++) {
						if (this.Friends[i].selected) {
							this.user.push(this.Friends[i].id)
						}
					}
					console.log(this.user);
					uni.request({
						url: this.serverUrl + '/group/buildGroup',
						data: {
							uid: this.uid,
							groupname: this.name,
							imgUrl: this.GimgUrl,
							user: this.user,
							token: this.token
						},
						method: 'POST',
						success: (data) => {
							let code = data.data.code
							if (code == 200) {
								console.log('创建成功');
								// 创建成功跳转
								// uni.switchTab({
								// 	url: '../index/index',
								// })
								uni.reLaunch({
									url: '../index/index'
								})
							} else if (code == 500) {
								uni.showToast({
									title: '服务器出错啦！',
									icon: 'none',
									duration: 2000
								})
							} else if (code == 300) {
								// token失效
								uni.navigateTo({
									url: '../login/login?name=' + this.name
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
	.top-bar {
		background-color: $uni-bg-color;
		width: 100%;
		height: 80rpx;
		padding-top: 20rpx;
		padding-left: 20rpx;
		position: fixed;
		z-index: 100;

		.image {
			float: left;
			width: 120rpx;
			height: 120rpx;
			line-height: 60rpx;
			color: #fff;
		}

		.title {
			margin: auto;
			width: 200rpx;
			height: 50rpx;
			font-size: 40rpx;
			color: #fff;
		}
	}

	.main {
		width: 100%;
		padding-top: 100rpx;
		padding-bottom: 200rpx;
		background-color: #fff;
		display: flex;
		flex-direction: column;

		.top {
			position: fixed;
			padding-top: 40rpx;
			background: #fff;
			width: 100%;
			z-index: 100;
		}

		.group-image {
			margin: 0 auto;
			width: 150rpx;
			height: 150rpx;
			background: rgba(147, 112, 219, 0.5);
			box-shadow: 0rpx 18rpx 20rpx 0rpx rgba(39, 40, 50, 0.1);
			border-radius: 20rpx;

			.head-image {
				width: 150rpx;
				height: 150rpx;
				border-radius: 20rpx;
			}
		}

		.group-name {
			padding: 20rpx;
		}

		.group-name-input {
			margin: 0 auto;
			width: 600rpx;
			height: 80rpx;
			background-color: rgba(147, 112, 219, 0.3);
			border-radius: 40rpx;
			text-align: center;
		}

		.title {
			padding-top: 40rpx;
			font-size: 44rpx;
			font-weight: 600;
			line-height: 60rpxf;
		}

		.friends {
			padding-left: 30rpx;
			padding-top: 400rpx;

			.user {
				display: flex;
				flex-direction: row;
				align-items: center;
				height: 120rpx;

				.selected {
					flex: none;
					margin-right: 30rpx;
					width: 50rpx;
					height: 50rpx;
					background-color: rgba(147, 112, 219, 0.3);
					border-radius: 24rpx;
					position: relative;

					.selected-img {
						width: 30rpx;
						height: 30rpx;
						position: absolute;
						left: 10rpx;
						top: 10rpx;
					}
				}

				.isSelected {
					background-color: rgba(147, 112, 219, 0.6);
				}

				.user-img {
					width: 80rpx;
					height: 80rpx;
					border-radius: 20rpx;
					border: 1rpx solid rgba(147, 112, 219, 0.3);
				}

				.name {
					width: 70%;
					padding-left: 32rpx;
					font-size: 36rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}
			}
		}
	}

	.bottom-bar {
		width: 100%;
		height: 120rpx;
		position: fixed;
		bottom: 0;
		padding-top: 20rpx;
		background-color: #fff;
		box-shadow: 0rpx 18rpx 20rpx 0rpx rgba(39, 40, 50, 0.1);

		.bottom-btn {
			width: 70%;
			height: 80rpx;
			margin: auto;
			background-color: rgba(147, 112, 219, 0.5);
			border-radius: 20rpx;
			text-align: center;
			line-height: 80rpx;
			font-size: 40rpx;
			color: #fff;
		}
	}
</style>