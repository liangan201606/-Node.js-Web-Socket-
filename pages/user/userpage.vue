<template>
	<view class="content">
		<!-- <image src="../../static/images/index/background.jpeg" mode="" class="background"></image> -->
		<image :src="user.imgUrl" mode="aspectFill" class="background"></image>
		<view class="top-bar">
			<image src="../../static/images/index/goback.png" mode="" @tap='goBack' class="image"></image>
			<view class="more" @tap='toUserDetail' v-if='relation==0 || relation==1'>
				<image src="../../static/images/index/more.png" class="more-image"></image>
			</view>
		</view>
		<view class="main">
			<view class="user">
				<image :src="user.imgUrl" mode="" class="imgUrl"></image>
				<view class="detail">
					<view class="name">{{nickname}}</view>
					<view class="nickname">昵称:{{user.name}}</view>
				</view>
			</view>
			<view class="other">
				<view class="sex">
					<image :src="sexImg" mode="" class="imageSex"></image>
					{{sex}}
				</view>
				<view class="birth">{{user.birth}}</view>
				<!-- <view class="location">技术部门</view> -->
			</view>
			<view class="sign">
				<image src="../../static/images/index/pen.png" mode="" class="imageSign"></image>
				{{user.explain}}
			</view>
			<view class="bottom">
				<view class="apply" v-if='relation==1' @tap='toMesaage()'>发消息</view>
				<view class="send" @tap='addFriend' v-if='relation==2'>加好友</view>
			</view>
			<!-- 弹出层 -->
			<image :src="user.imgUrl" mode="" class="imgUrlAdd" :style="{bottom:-addHeight-100+'px'}"
				:animation="animationData2"></image>
			<view class="addFriend" :style="{height:addHeight+'px',bottom:-addHeight-100+'px'}"
				:animation="animationData">
				<view class="name">
					{{user.name}}
				</view>
				<textarea maxlength="120" class="addMsg" v-model="msg" />
			</view>
			<view class="addButton" :animation="animationData1">
				<view class="remove" @tap='addFriendAnimat'>取消</view>
				<view class="send" @tap='addSubmit'>发送</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		reactive
	} from "vue"
	import TimeFun from '@/commons/js/time.js'
	export default {
		name: 'UserPage',
		data() {
			return {
				addHeight: '', //add板块的高度
				animationData: {}, //动画
				animationData1: {},
				animationData2: {},
				isAdd: false, //是否发送
				id: '', //要加的好友id
				uid: '', //用户id
				token: '', //token
				name: '', //用户名称
				imgUrl:'',//用户头像
				nickname: '', //好友昵称
				msg: '', //添加好友消息
				user: {}, //用户信息
				relation: '', //用户关系 0表示自己 1表示好友 2表示陌生人
				sexImg: '', //性别图片
				sex:'',
			}
		},
		onReady: function() {
			this.getElementStyle()
		},
		onLoad: function(e) {
			this.id = e.id
			this.getStorage()
			this.getUser()
			this.MatchFriend()
		},
		mounted() {},
		methods: {
			// 跳转到上一页面
			goBack: function() {
				// uni.navigateBack({
				// 	delta: 1
				// })
				uni.reLaunch({
					url: '../index/index'
				})
			},
			// 跳转到聊天页面
			toMesaage:function(){
				uni.navigateTo({
					url: '../message/message?id=' + this.user._id + '&name=' + this.nickname + '&imgUrl=' + this.user
						.imgUrl +
						'&type=' + 0
				})
			},
			// 获取缓存数据
			getStorage: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id
						this.name = value.name
						this.imgUrl = value.imgUrl
						this.token = value.token
					} else {
						// 如果没有用户缓存跳转登录页面
						uni.navigateTo({
							url: '../login/login'
						})
					}
				} catch (e) {}
			},
			// 获取用户信息
			getUser: function() {
				uni.request({
					url: this.serverUrl + '/user/detail',
					data: {
						id: this.id,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							let res = data.data.result
							res.imgUrl = this.serverUrl + data.data.result.imgUrl
							this.ChooseSex(res.sex)
							// 处理签名
							if (res.explain == undefined) {
								res.explain = '这个人懒，什么都没有留下~'
							}
							// 处理生日
							if (res.birth == undefined) {
								res.birth = '0000-00-00'
							} else {
								let birth = TimeFun.dateTime_Three(res.birth)
								res.birth = birth
							}
							// 处理nickname
							if (this.nickname.length == 0) {
								this.nickname = res.name
							}
							this.user = res
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
			// 性别照片判断
			ChooseSex: function(e) {
				if (e == 'female') {
					// 女性
					this.sexImg = '../../static/images/index/grils.png'
					this.sex = '女性'
				} else if (e == 'male') {
					// 男性
					this.sexImg = '../../static/images/index/male.png'
					this.sex = '男性'
				} else {
					// 中性
					this.sexImg = '../../static/images/index/male.png'
					this.sex = '未知'
				}
			},
			//判断是否是好友
			MatchFriend: function() {
				if (this.uid == this.id) {
					this.relation = 0
					// console.log('自己');
				} else {
					uni.request({
						url: this.serverUrl + '/search/matchFriend',
						data: {
							uid: this.uid,
							fid: this.id,
							token: this.token
						},
						method: 'POST',
						success: (data) => {
							let code = data.data.code
							if (code == 200) {
								// 是好友
								this.relation = 1
								this.getNickname()
							} else if (code == 400) {
								// 不是好友
								this.relation = 2
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
			},
			// 获取好友昵称
			getNickname: function() {
				if (this.relation == 1) {
					uni.request({
						url: this.serverUrl + '/user/nicknameGet',
						data: {
							uid: this.uid,
							fid: this.id,
							token: this.token
						},
						method: 'POST',
						success: (data) => {
							let code = data.data.code
							if (code == 200) {
								let res = data.data.result
								if (res.nickname != undefined) {
									// 如果存在
									this.nickname = res.nickname
								}
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
			},
			// 获取元素的高度
			getElementStyle: function() {
				const query = uni.createSelectorQuery().in(this)
				query.select('.background').boundingClientRect(data => {
					this.addHeight = data.height * 0.7
				}).exec()
			},
			// 添加好友动画
			addFriendAnimat: function() {
				this.isAdd = !this.isAdd
				var animation = uni.createAnimation({
					duration: 3000,
					timingFunction: 'ease',
				})
				var animation1 = uni.createAnimation({
					duration: 5000,
					timingFunction: 'ease',
				})
				var animation2 = uni.createAnimation({
					duration: 4000,
					timingFunction: 'ease',
				})
				if (this.isAdd) {
					// 确定发送
					animation.bottom(0).step()
					animation1.bottom(20).step()
					animation2.bottom(this.addHeight - 75).step()
				} else {
					// 取消发送
					animation.bottom(-this.addHeight - 100).step()
					animation1.bottom(-100).step()
					animation2.bottom(-this.addHeight + 75).step()
				}
				this.animationData = animation.export()
				this.animationData1 = animation1.export()
				this.animationData2 = animation2.export()
			},
			// 添加好友
			addFriend: function() {
				this.msg = this.name + '请求添加好友~'
				this.addFriendAnimat()
			},
			// 确认添加好友按钮
			addSubmit: function() {
				if (this.msg.length > 0) {
					this.addFriendAnimat()
					uni.request({
						url: this.serverUrl + '/friend/request',
						data: {
							uid: this.uid,
							fid: this.id,
							msg: this.msg,
							token: this.token
						},
						method: 'POST',
						success: (data) => {
							let code = data.data.code
							if (code == 200) {
								console.log('申请成功');

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
			},
			// 跳转到详情页面
			toUserDetail: function() {
				uni.navigateTo({
					url: '../user/userdetail?id=' + this.id
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		height: 100%;

		.background {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			left: 0;
			z-index: -1;
		}

		.top-bar {
			display: flex;
			width: 100%;

			.image {
				margin-top: 20rpx;
				margin-left: 20rpx;
				width: 60rpx;
				height: 60rpx;
			}

			.more {
				margin-left: auto;
				margin-top: 20rpx;
				margin-right: 20rpx;

				.more-image {
					width: 80rpx;
					height: 80rpx;
					// background-color:paleturquoise;
				}
			}
		}

		.main {
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 50%;
			border-radius: 40rpx 40rpx 0 0;
			background-color: rgba(255, 255, 255, 0.5);

			.user {
				padding-top: 20rpx;
				padding-left: 30rpx;
				display: flex;
				align-items: center;

				.imgUrl {
					width: 150rpx;
					height: 150rpx;
					border-radius: 50%;
				}

				.detail {
					margin-left: 20rpx;

					.name {
						font-size: 36rpx;
						font-weight: 600;
					}

					.nickname {
						margin-top: 10rpx;
						color: darkgray;
					}
				}
			}

			.other {
				display: flex;
				margin-top: 30rpx;
				padding-left: 20rpx;

				.sex {
					display: flex;

					.imageSex {
						width: 50rpx;
						height: 50rpx;
						margin-right: 10rpx;
					}
				}

				.birth {
					margin-left: 30rpx;
				}

				.location {
					margin-left: 30rpx;
				}
			}

			.sign {
				margin-top: 40rpx;
				margin-left: 20rpx;
				margin-right: 20rpx;
				padding-top: 10rpx;
				border: 1rpx solid rgba(147, 112, 219, 0.6);
				height: 30%;
				font-size: 34rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 4;

				.imageSign {
					float: left;
					width: 50rpx;
					height: 50rpx;
					margin-right: 20rpx;
				}
			}

			.bottom {
				position: absolute;
				bottom: 30rpx;
				right: 0;
				left: 0;
				height: 70rpx;
				width: 80%;
				margin: auto;
				text-align: center;
				line-height: 70rpx;

				.apply {
					border-radius: 30rpx;
					background-color: rgba(87, 153, 255, 0.6);
				}

				.send {
					border-radius: 30rpx;
					background-color: rgba(147, 112, 219, 0.6);
				}
			}

			.imgUrlAdd {
				position: fixed;
				right: 0;
				left: 0;
				// top: -100rpx;
				margin: auto;
				width: 300rpx;
				height: 300rpx;
				border-radius: 40rpx;
				z-index: 1;
			}

			.addFriend {
				position: fixed;
				// bottom: 0;
				width: 100%;
				// height: 70%;
				background-color: rgba(255, 255, 255, 1);
				border-radius: 40rpx 40rpx 0 0;
				text-align: center;

				// .imgUrl{
				// 	position: absolute;
				// 	right: 0;
				// 	left: 0;
				// 	top:-100rpx;
				// 	margin: auto;
				// 	width: 300rpx;
				// 	height: 300rpx;
				// 	border-radius:40rpx;
				// }
				.name {
					padding-top: 220rpx;
					font-size: 46rpx;
					line-height: 70rpx;
				}

				.addMsg {
					display: inline-block;
					width: 80%;
					margin-top: 20rpx;
					padding: 10rpx;
					font-size: 32rpx;
					line-height: 40rpx;
					border-radius: 20rpx;
					border: 1rpx solid rgba(147, 112, 219, 0.6);
				}
			}

			.addButton {
				display: flex;
				justify-content: space-between;
				position: fixed;
				bottom: -100rpx;
				right: 0;
				left: 0;
				height: 80rpx;
				width: 80%;
				margin: auto;
				// padding-bottom: 20rpx;
				text-align: center;
				line-height: 80rpx;

				.remove {
					width: 30%;
					border-radius: 20rpx;
					background-color: rgba(87, 153, 255, 0.6);
				}

				.send {
					width: 50%;
					border-radius: 20rpx;
					background-color: rgba(147, 112, 219, 0.6);
				}
			}
		}
	}
</style>