<template>
	<view class="box">
		<Header></Header>
		<view class="inform">
			<navigator url="../contacts/friendInform" class="Inform-friend">
				<view class="friend">
					新朋友
				</view>
				<view class="number">{{requesterNum}}</view>
				<image src="../../static/images/index/right.png" class="image"></image>
			</navigator>
		</view>
		<!-- tab切换面板 -->
		<view class="tab">
			<!-- 使用scroll-view实现tabs滑动切换 -->
			<scroll-view class="tab-top" scroll-x="true" :scroll-into-view="tabCurrent">
				<view class="tab-view" v-for="item in tabs" :id="'tabNum'+item.id" :key="(item.id - 1)"
					@click="swichMenu(item.id - 1)">
					<view :class="currentTab==(item.id - 1) ? 'title-act' : 'title'">
						<text class="title-text">{{item.name}}</text>
						<view class="title-bottom">
							<view class="title-bottom-color"></view>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 内容 -->
			<swiper class="swiper-box-list" :current="currentTab" @change="swiperChange" :style="{height:Height+'px'}">
				<swiper-item class="swiper-topic-list" v-for="item in swiperDateList" :key="item.id">
					<!-- 好友列表 -->
					<view class="swiper-item" v-for="(friend,index) in item.content" :key='index'>
						<image :src="friend.imgUrl" class="image"></image>
						<view class="item-content">
							<view class="name">{{friend.name}}</view>
							<view class="sign">{{friend.explain}}</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import Header from '../../components/header.vue'
	import datas from '../../commons/js/data.js'
	export default {
		data() {
			return {
				tabs: [{
						id: 1,
						name: '好友列表'
					},
					{
						id: 2,
						name: '群聊列表'
					}
				],
				currentTab: 0,
				tabCurrent: 'tabNum1',
				Friend: [],
				Group: [],
				// Tab切换内容
				swiperDateList: [{
						id: 1,
						content: []
					},
					{
						id: 2,
						content: []
					}
				],
				Height: 0,
				requesterNum: 0, //好友申请数
				uid: '', //用户id
				token: '', //token
			}
		},
		onLoad: function() {
			this.getStorage()
			this.getFriends()
			this.getGroup()
			this.Friends()
			setTimeout(function() {
				console.log('start pulldown');
			}, 1000);
			uni.startPullDownRefresh();
		},
		onPullDownRefresh() {
			console.log('refresh');
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			// 切换处理
			swichMenu(id) {
				this.currentTab = id
				this.tabCurrent = 'tabNum' + id
			},
			swiperChange(e) {
				let index = e.detail.current
				this.swichMenu(index)
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
								if (res[i].nickname != undefined) {
									res[i].name = res[i].nickname
								}
							}
							this.Friend = res
							this.swiperDateList[0].content = this.Friend
							this.Height = 60 * this.Friend.length + 350
							console.log(this.Friend);
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
			// 获取群列表
			getGroup: function() {
				uni.request({
					url: this.serverUrl + '/home/getGroups',
					data: {
						uid: this.uid,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							// console.log('群获取成功');
							let res = data.data.result
							this.isOne = false
							if (res.length == 0) {
								this.isOne = true
							} else if (res.length > 0) {
								for (let i = 0; i < res.length; i++) {
									res[i].imgUrl = this.serverUrl + res[i].imgUrl
									this.Group.push(res[i])
								}
								this.swiperDateList[1].content = this.Group
								this.Height = 60 * this.Group.length + 350
								console.log(this.Group);
							}
						} else if (code == 500) {
							uni.showToast({
								title: '群聊服务器出错啦！',
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
			// 获取好友申请数
			getFriends: function() {
				console.log(1);
				uni.request({
					url: this.serverUrl + '/home/getFriend',
					data: {
						uid: this.uid,
						state: 1, //好友请求的接收方
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							let res = data.data.result
							this.requesterNum = res.length
							console.log(res);
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
		},

		// 注册组件库
		components: {
			Header
		}
	}
</script>

<style lang='scss'>
	.box {
		height: 100vh;
		position: relative;

		.inform {
			position: fixed;
			width: 100%;
			top: 220rpx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			padding-bottom: 30rpx;
			border-bottom: 5rpx solid rgba(123, 123, 123, 0.3);

			.Inform-friend {
				display: flex;
				align-items: center;
				height: 80rpx;
				width: 90%;
				padding-top: 20rpx;
				padding-left: 20rpx;
				padding-right: 20rpx;
				margin-top: 30rpx;
				box-shadow: 5rpx 5rpx 5rpx 5rpx rgba(123, 123, 123, 0.3);

				.image {
					margin-left: auto;
					width: 40rpx;
					height: 40rpx;
				}

				.friend {
					font-size: 40rpx;
				}

				.number {
					width: 60rpx;
					height: 40rpx;
					text-align: center;
					margin-left: 30rpx;
					border-radius: 45%;
					color: #ffffff;
					background-color: rgba(255, 0, 0, 0.7);
				}
			}
		}

		.tab {
			position: fixed;
			width: 100%;
			height: 100vh;
			top: 500rpx;
			overflow: scroll;

			.tab-top {
				position: fixed;
				top: 498rpx;
				top: 400rpx;
				left: 0;
				display: flex;
				white-space: nowrap;
				width: 100%;
				background-color: #FFFFFF;
				height: 86rpx;
				line-height: 86rpx;
				margin-bottom: 30rpx;
				border-top: 1rpx solid #d8dbe6;
				border-bottom: 1rpx solid #d8dbe6;

				.tab-view {
					display: inline-block;
					white-space: nowrap;
					height: 86rpx;
					position: relative;

					.title-text {
						font-size: 30rpx;
						color: #303133;
						padding: 10rpx 40rpx;
					}

					.title-bottom {
						position: absolute;
						bottom: 0;
						width: 100%;

						.title-bottom-color {
							width: 100rpx;
							height: 4rpx;
						}
					}

					.title-act .title-bottom {
						display: flex;
						justify-content: center;
					}

					.title-act .title-bottom-color {
						background: #3d7eff;
					}
				}
			}

			.swiper-box-list {
				position: absolute;
				width: 100%;
				/* top: 100rpx; */
				flex: 1;
				z-index: -1;
				overflow: scroll;
				background-color: #FFFFFF;

				.swiper-topic-list {
					width: 100%;
				}

				.swiper-item {
					display: flex;
					align-items: center;
					height: 100rpx;
					padding-left: 20rpx;
					padding-top: 20rpx;

					.image {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
					}

					.item-content {
						margin-left: 20rpx;

						.name {
							font-size: 34rpx;
						}

						.sign {
							color: darkgrey;
							font-size: 26rpx;
							height: 30rpx;
							width: 70%;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;
						}
					}
				}
			}
		}
	}
</style>