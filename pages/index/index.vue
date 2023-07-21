<!-- 聊天页面 -->
<template>
	<view>
		<Header></Header>
		<view class="reFresh" v-if='!isReFresh'>
			<image src="../../static/images/index/shuaxin.png" mode=""></image>
			<view class="ref-title">下拉刷新</view>
		</view>
		<view class="nobody" v-if='isOne'>
			<image src="../../static/images/index/noone.png" mode="aspectFill"></image>
			<view class="no-title">一个好友都没有~~</view>
			<navigator class="button" url='../search/search'>搜索好友</navigator>
		</view>
		<view class="content">
			<!-- 聊天列表 -->
			<view class="contenList" v-for="(item,index) in friends" :key="index">
				<view class="photo" @tap='toDetail(item)'>
					<image :src="item.imgUrl" class="image"></image>
				</view>
				<view class="message" @tap='toMessage(item)'>
					<view class="name">{{item.name}}</view>
					<view class="news">{{item.message}}</view>
				</view>
				<view class="time">
					<view class="datetime">{{changTime(item.lastTime)}}</view>
					<view class="num" v-if='item.tip>0'>{{item.tip}}</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		genTestUserSig
	} from '../../uilts/GenerateTestUserSig.js';
	import Header from '../../components/header.vue'
	import data from '../../commons/js/data.js'
	import time from '../../commons/js/time.js'
	import myFun from '../../commons/js/myFun'
	export default {
		data() {
			return {
				friends: [], //存放好友
				groups: [], //存放群
				Data: [], //拼接完整数据
				uid: '', //用户id
				token: '', //token
				isReFresh: false, //刷新状态
				isOne: false, //是否有好友
				name: '', //用户名称
				imgUrl: '' //用户头像
			}
		},
		// 注册组件库
		components: {
			Header,
		},
		onLoad: function(options) {
			setTimeout(function() {
				console.log('start pulldown');
			}, 1000);
			uni.startPullDownRefresh();
			this.getStorage()
			this.Friends()
			this.getGroup()
			this.join(this.uid)
			this.receiveSocketMsg()
			this.groupMsg()
			this.leaveChat()
			/***********************/
			let globalData = {
				SDKAppID: genTestUserSig('').sdkAppID,
				userID: this.uid, // 必须是字符串
				userSig: genTestUserSig(this.uid).userSig
			}
			// 登录 TIM
			let promise = uni.$TUIKit.login({
				userID: this.uid,
				userSig: genTestUserSig(this.uid).userSig,
			});
			promise.then(function(imResponse){
				console.log('登录成功');
			}).catch(function(imError){
				console.log('登录失败');
			})
			
			// 登录
			uni.$TUICallKit.login(globalData, (val) => {
				if (val.code === 0) {
					// 开启悬浮窗
					uni.$TUICallKit.enableFloatWindow(true);
					console.log('登录成功TUICallKit');
					// 设置用户昵称，头像
					uni.$TUICallKit.setSelfInfo({
						nickName: this.name,
						avatar: this.serverUrl+this.imgUrl
					}, (val) => {
						if (val.code === 0) {
							console.log('设置头像用户昵称成功');
						} else {
							console.log(val.msg);
						}
					});

				} else {
					console.log(val.msg);
				}
			});
		},
		onPullDownRefresh() {
			this.friends = []
			this.getStorage()
			this.Friends()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			// 进入聊天页面
			toMessage: function(item) {
				uni.navigateTo({
					url: '../message/message?id=' + item.id + '&name=' + item.name + '&imgUrl=' + item.imgUrl +
						'&type=' + item.type
				})
			},
			toDetail: function(item) {
				// uni.navigateTo({
				// 	url:'../user/userpage?id='+item.id
				// })
			},
			changTime: function(date) {
				return time.dateTime(date)
			},
			// 获取缓存数据
			getStorage: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id
						this.token = value.token
						this.name = value.name
						this.imgUrl = value.imgUrl
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
						state: 0, //好友关系
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						this.isReFresh = true
						let code = data.data.code
						if (code == 200) {
							let res = data.data.result
							this.isOne = false
							if (res.length == 0) {
								this.isOne = true
							} else if (res.length > 0) {
								for (let i = 0; i < res.length; i++) {
									res[i].imgUrl = this.serverUrl + res[i].imgUrl
									if (res[i].nickname) {
										res[i].name = res[i].nickname
									}
									this.friends.push(res[i])
								}
							}
							this.SortArr(this.groups)
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
			// 获取群的列表
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
							let res = data.data.result
							this.isOne = false
							if (res.length == 0) {
								this.isOne = true
							} else if (res.length > 0) {
								for (let i = 0; i < res.length; i++) {
									res[i].imgUrl = this.serverUrl + res[i].imgUrl
									this.groups.push(res[i])
									// 向后端发送信息 在后端加入群聊
									this.socket.emit('group', res[i].id)
								}
								// 获取好友内信息
								for (let i = 0; i < this.groups.length; i++) {
									this.getLastGroupMsg(this.groups, i)
								}
								// console.log(this.groups);
							}
							this.SortArr(this.friends)
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
			// 群与好友排序
			SortArr: function(e) {
				if (e.length > 0) {
					// 数据拼接
					this.friends = this.friends.concat(this.groups)
					// 排序
					this.friends = myFun.ArraySort(this.friends, 'lastTime', 0)
					console.log(this.friends);
				}
			},
			/***********************以上废弃*******************************/
			// // 获取最后一条一对一消息表
			// getLastMsg: function(arr, i) {
			// 	uni.request({
			// 		url: this.serverUrl + '/home/getLastMsg',
			// 		data: {
			// 			uid: this.uid,
			// 			fid: arr[i].id, //好友请求的接收方
			// 			token: this.token
			// 		},
			// 		method: 'POST',
			// 		success: (data) => {
			// 			let code = data.data.code
			// 			if (code == 200) {
			// 				let res = data.data.result
			// 				if (res.types == 0) {
			// 					// 文字
			// 				} else if (res.types == 1) {
			// 					// 图片
			// 					res.message = '[图片]'
			// 				} else if (res.types == 2) {
			// 					// 语音
			// 					res.message = '[语音]'
			// 				} else if (res.types == 3) {
			// 					res.message = '[位置]'
			// 				}
			// 				let e = arr[i]
			// 				e.message = res.message
			// 				arr.splice(i, 1, e)
			// 			} else if (code == 500) {
			// 				uni.showToast({
			// 					title: '服务器出错啦！',
			// 					icon: 'none',
			// 					duration: 2000
			// 				})
			// 			} else if (code == 300) {
			// 				// token失效
			// 				uni.navigateTo({
			// 					url: '../login/login?name=' + this.name
			// 				})
			// 			}
			// 		}
			// 	})
			// },
			// // 获取一对一未读消息数
			// UnReadMsg: function(arr, i) {
			// 	uni.request({
			// 		url: this.serverUrl + '/home/unReadMsg',
			// 		data: {
			// 			uid: this.uid,
			// 			fid: arr[i].id, //好友请求的接收方
			// 			token: this.token
			// 		},
			// 		method: 'POST',
			// 		success: (data) => {
			// 			let code = data.data.code
			// 			if (code == 200) {
			// 				let res = data.data.result
			// 				let e = arr[i]
			// 				e.tip = res
			// 				arr.splice(i, 1, e)
			// 			} else if (code == 500) {
			// 				uni.showToast({
			// 					title: '服务器出错啦！',
			// 					icon: 'none',
			// 					duration: 2000
			// 				})
			// 			} else if (code == 300) {
			// 				// token失效
			// 				uni.navigateTo({
			// 					url: '../login/login?name=' + this.name
			// 				})
			// 			}
			// 		}
			// 	})
			// },
			// 获取最后一条群消息
			getLastGroupMsg: function(arr, i) {
				uni.request({
					url: this.serverUrl + '/home/getLastGroupMsg',
					data: {
						gid: arr[i].id, //群id
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							let res = data.data.result
							if (res.types == 0) {
								// 文字
							} else if (res.types == 1) {
								// 图片
								res.message = '[图片]'
							} else if (res.types == 2) {
								// 语音
								res.message = '[语音]'
							} else if (res.types == 3) {
								res.message = '[位置]'
							}
							let e = arr[i]
							e.message = res.message
							arr.splice(i, 1, e)
							console.log('这是最后一条消息', res.message);
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
			// socket模块
			// 用户登录socket注册
			join: function(uid) {
				this.socket.emit('login', uid)
			},
			// socket聊天数据的接收
			receiveSocketMsg: function() {
				this.socket.on('msgs', (msg, fromId) => {
					let nmsg = ''
					if (msg.types == 0) {
						nmsg = msg.message
					} else if (msg.types == 1) {
						nmsg = '[图片]'
					} else if (msg.types == 2) {
						nmsg = '[语音]'
					} else if (msg.types == 3) {
						nmsg = '[位置]'
					}
					// 对应修改最新消息
					for (let i = 0; i < this.friends.length; i++) {
						if (this.friends[i].id == fromId) {
							let e = this.friends[i]
							e.lastTime = new Date()
							e.message = nmsg
							e.tip++
							// 删除原来数据项 
							this.friends.splice(i, 1)
							// 插入最底部
							this.friends.unshift(e)
						}
					}
				})
			},
			// 群即时聊天数据的接受
			groupMsg: function() {
				this.socket.on('groupMsg', (msg, fromId, gid, name) => {
					let nmsg = ''
					if (msg.types == 0) {
						nmsg = msg.message
					} else if (msg.types == 1) {
						nmsg = '[图片]'
					} else if (msg.types == 2) {
						nmsg = '[语音]'
					} else if (msg.types == 3) {
						nmsg = '[位置]'
					}
					// 对应修改最新消息
					for (let i = 0; i < this.friends.length; i++) {
						if (this.friends[i].id == gid) {
							let e = this.friends[i]
							e.lastTime = new Date()
							if (fromId == this.uid) {
								e.message = nmsg
							} else {
								e.message = name + ':' + nmsg
							}
							e.tip++
							// 删除原来数据项 
							this.friends.splice(i, 1)
							// 插入最底部
							this.friends.unshift(e)
						}
					}
				})
			},
			// 离开当前聊天页面触发socket
			leaveChat: function() {
				this.socket.on('leaveChat', (uid, fid) => {
					let nmsg = ''
					// 对应修改最新消息
					for (let i = 0; i < this.friends.length; i++) {
						if (this.friends[i].id == fid) {
							let e = this.friends[i]
							e.tip = 0
							// 替换原来数据项 
							this.friends.splice(i, 1, e)
						}
					}
				})
			}
		}
	}
</script>
<style lang="scss">
	.content {
		width: 100%;
		height: 100%;
		margin-top: 80rpx;
		margin-bottom: 100rpx;

		// background-color: palevioletred;
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

	.reFresh {
		text-align: center;
		padding-top: 300rpx;

		image {
			width: 40rpx;
			height: 40rpx;
		}

		.ref-title {
			font-size: 32rpx;
			color: rgba(39, 40, 50, 0.4);
			line-height: 40rpx;
		}
	}

	.nobody {
		text-align: center;
		padding-top: 200rpx;

		image {
			height: 250rpx;
			width: 150rpx;
		}

		.no-title {
			padding-top: 10rpx;
			font-size: 32rpx;
			color: rgba(39, 40, 50, 0.4);
			padding-bottom: 32rpx;
		}

		.button {
			display: inline-block;
			width: 240rpx;
			height: 80rpx;
			line-height: 80rpx;
			background-color: rgba(147, 112, 219, 0.5);
			border-radius: 40rpx;
		}
	}
</style>