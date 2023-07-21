<template>
	<view class="content">
		<!-- 聊天列表 -->
		<view class="contenList" v-for="(item,index) in friends" :key="index">
			<navigator url="'../user/userpage?id='+itme.id" class="photo">
				<image :src="item.imgUrl" class="image"></image>
			</navigator>
			<navigator class="message" url="'../message/message?id='+item.id">
				<view class="name">{{item.name}}</view>
				<view class="news">{{item.message}}</view>
			</navigator>
			<view class="time">
				<view class="datetime">{{changTime(item.time)}}</view>
				<view class="num">{{item.tip}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import data from '../../../commons/js/data.js'
	import time from '../../../commons/js/time.js'
	export default {
		name: 'Content',
		data() {
			return {
				friends: [],
				uid: '', //用户id
				token: '', //token
			}
		},
		mounted() {
			this.getStorage()
			this.Friends()
		},
		onLoad: function() {
			this.getStorage()
			this.Friends()
		},
		methods: {
			changTime: function(date) {
				return time.dateTime(date)
			},
			getFrinds: function() {
				this.friends = data.frindes()
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
			// 获取好友列表
			Friends: function() {
				uni.request({
					url: this.serverUrl + '/home/getFriend',
					data: {
						uid: this.uid,
						state: 0,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							let res = data.data.result
							for (let i = 0; i < res.length; i++) {
								res[i].imgUrl = this.serverUrl + res[i].imgUrl
							}
							this.frindes = res
							console.log(this.frindes);
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
		}
	}
</script>

<style lang="scss">
	.content {
		width: 100%;
		height: 100vh;
		margin-top: 250rpx;
		padding-bottom: 20rpx;

		.contenList {
			display: flex;
			height: 100rpx;
			width: 100%;
			padding-top: 10rpx;
			padding-left: $uni-spacing-row-sm ;
			padding-right: $uni-spacing-row-sm ;

			.photo {
				width: 80rpx;

				.image {
					z-index: -1;
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}
			}

			.message {
				margin-left: 10rpx;
				width: 60%;

				.news {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					color: darkgrey;
					font-size: 14rpx;
				}
			}

			.time {
				margin-left: auto;
				margin-right: 20rpx;
				width: 150rpx;
				text-align: right;
				color: darkgrey;
				font-size: 14rpx;

				.num {
					float: right;
					width: 70rpx;
					height: 40rpx;
					color: #ffffff;
					margin-top: 10rpx;
					margin-left: 40rpx;
					font-size: 14rpx;
					text-align: center;
					line-height: 40rpx;
					background-color: orangered;
					border-radius: 45%;
				}
			}
		}
	}
</style>