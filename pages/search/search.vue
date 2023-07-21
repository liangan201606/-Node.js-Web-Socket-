<template>
	<view class="content">
		<view class="top-bar">
			<view class="search">
				<image src="../../static/images/index/search.png" class="search-image"></image>
				<input type="text" placeholder="搜索" class="search-input" @input='search'>
			</view>
			<view class="remove">
				<span @tap='goBack'>取消</span>
			</view>
		</view>
		<view class="main">
			<view class="search-user">
				<view class="title">
					用户
				</view>
				<view class="list" v-for="(item,index) in userArr" :key='item.id'>
					<navigator :url="'../user/userpage?id='+item._id" class="image">
						<image :src="item.imgUrl" mode="" class="image"></image>
					</navigator>
					<view class="detail">
						<view class="name" v-html="item.name"></view>
						<view class="email" v-html="item.email"></view>
					</view>
					<view class="right">
						<view class="send" v-if='item.tip==0' @tap='toMessage(item,0)'>
							发送消息
						</view>
						<view class="apply" v-if='item.tip==1' @tap="addFrined(item._id)">
							申请好友
						</view>
					</view>
				</view>
			</view>
			<view class="search-group">
				<view class="title">群组</view>
				<view class="list"  v-for="(item,index) in groupArr" :key='item.id'>
					<image :src="item.imgUrl" mode="" class="image"></image>
					<view class="detail">
						<view class="name" v-html="item.name"></view>
					</view>
					<view class="right">
						<view class="send" v-if='item.tip==0' @tap='toMessage(item,1)'>
							发送消息
						</view>
						<view class="apply" v-if='item.tip==1' @tap='addGroup(item)'>
							申请加群
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="modify" :style="{bottom:-modifyHeight+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap='modify()'>取消</view>
				<view class="title">添加好友</view>
				<view class="define" @tap='addSubmit'>确定</view>
			</view>
			<view class="modify-main">
				<textarea class="modify-content" v-model="msg" />
			</view>
		</view>
	</view>
</template>

<script>
	import datas from '../../commons/js/data.js'
	import searchVue from './search.vue';
	import myFun from '../../commons/js/myFun.js'
	export default {
		name: 'Search',
		data() {
			return {
				userArr: [], //检索到的用户数组
				groupArr: [], //检索到的群数组
				uid: '', //用户id
				imgUrl: '', //用户头像
				token: '', //token
				name: '', //用户名称
				animationData: {}, //动画
				isModfiy: false, //是否修改
				modifyHeight: '', //页面高度
				msg: '', //添加好友的信息
				fid: '', //好友id
			}
		},
		mounted() {

		},
		onLoad() {
			this.getStorage()
		},
		onReady: function() {
			this.getElementStyle()
		},
		methods: {
			toMessage: function(item,type) {
				// console.log(item);
				uni.navigateTo({
					url: '../message/message?id=' + item._id + '&name=' + item.uname + '&imgUrl=' + item
						.imgUrl +
						'&type=' + type
				})
			},
			// 获取缓存数据
			getStorage: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id
						this.imgUrl = this.serverUrl + value.imgUrl
						this.name = value.name
						this.token = value.token
					} else {
						// 如果没有用户缓存跳转登录页面
						uni.navigateTo({
							url: '../login/login'
						})
					}
				} catch (e) {}
			},
			// 防抖获取关键词
			search: myFun.debounce(function(e) {
				// 获取到触发词时先清空数组
				this.userArr = [];
				// 搜索词获取
				let searchVal = e.detail.value;
				// console.log(searchVal);
				if (searchVal.length > 0) {
					// 触发搜索函数
					this.searchUser(searchVal)
					this.searchGroup(searchVal)
				}
			}, 500),
			// 关键词匹配好友
			searchUser: function(e) {
				uni.request({
					url: this.serverUrl + '/search/searchUser',
					data: {
						data: e,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							let arr = data.data.result
							// console.log(arr);
							// 关键字组装
							let exp = eval("/" + e + "/g")
							for (let i = 0; i < arr.length; i++) {
								// 判断规则
								if (arr[i].name.search(e) != -1 || arr[i].email.search(e) != -1) {
									arr[i].imgUrl = this.serverUrl + arr[i].imgUrl
									arr[i].uname = arr[i].name
									//匹配关键字高亮
									arr[i].name = arr[i].name.replace(exp,
										"<span style='color:rgba(87,153,255,1)'>" + e +
										"</span>")
									arr[i].email = arr[i].email.replace(exp,
										"<span style='color:rgba(87,153,255,1)'>" + e +
										"</span>")
									this.userArr.push(arr[i])
									this.isFriend(arr[i])
								}
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
			},
			// 判断搜索到的结果是否为好友
			isFriend: function(e) {
				let tip = 0 //默认是好友
				if (e._id == this.uid) {
					tip = 2
					e.tip = tip
				} else {
					uni.request({
						url: this.serverUrl + '/search/matchFriend',
						data: {
							uid: this.uid,
							fid: e._id,
							token: this.token,
						},
						method: 'POST',
						success: (data) => {
							let code = data.data.code
							if (code == 200) {
								// 是好友
								tip = 0
								e.tip = tip
								// this.$forceUpdate()
							} else if (code == 400) {
								// 不是好友
								tip = 1
								e.tip = tip
								this.$forceUpdate()
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
						},
					})
					// 加入搜索结果数组中
					e.tip = tip
				}
			},
			// 匹配关键词群组
			searchGroup: function(e) {
				uni.request({
					url: this.serverUrl + '/search/searchGroup',
					data: {
						data: e,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							let arr = data.data.result
							// console.log(arr);
							// 关键字组装
							let exp = eval("/" + e + "/g")
							for (let i = 0; i < arr.length; i++) {
								// 判断规则
								if (arr[i].name.search(e) != -1 || arr[i].email.search(e) != -1) {
									arr[i].imgUrl = this.serverUrl + arr[i].imgUrl
									arr[i].uname = arr[i].name
									//匹配关键字高亮
									arr[i].name = arr[i].name.replace(exp,
										"<span style='color:rgba(87,153,255,1)'>" + e +
										"</span>")
									this.groupArr.push(arr[i])
									this.isGroup(arr[i])
								}
							}
							console.log(this.groupArr);
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
			// 判断搜索到群的是否为已经加入
			isGroup: function(e) {
				let tip = 0 //默认是成员
				uni.request({
					url: this.serverUrl + '/search/matchGroup',
					data: {
						uid: this.uid,
						gid: e._id,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							// 是好友
							tip = 0
							e.tip = tip
						} else if (code == 400) {
							// 不是好友
							tip = 1
							e.tip = tip
							this.$forceUpdate()
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
					},
				})
				// 加入搜索结果数组中
				e.tip = tip
			},
			// 获取元素的高度
			getElementStyle: function() {
				const query = uni.createSelectorQuery().in(this)
				query.select('.modify').boundingClientRect(data => {
					this.modifyHeight = data.height
				}).exec()
			},
			// 控制弹出层
			modify: function() {
				this.isModfiy = !this.isModfiy
				// console.log(this.fid);
				var animation = uni.createAnimation({
					duration: 1000,
					timingFunction: 'ease',
				})
				if (this.isModfiy) {
					// 确定弹出
					animation.bottom(0).step()
				} else {
					// 取消弹出
					animation.bottom(-this.modifyHeight).step()
				}
				this.animationData = animation.export()
			},
			// 添加好友
			addFrined: function(e) {
				this.fid = e
				this.msg = this.name + '请求添加好友~'
				this.modify()
			},
			// 确认按钮
			addSubmit: function() {
				if (this.msg.length > 0) {
					this.modify()
					uni.request({
						url: this.serverUrl + '/friend/request',
						data: {
							uid: this.uid,
							fid: this.fid,
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
			// 加入群聊
			addGroup:function(item){
				let user = [this.uid]
				uni.request({
					url: this.serverUrl + '/group/insertGroup',
					data: {
						gid: item._id,
						user: user,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							uni.navigateTo({
								url: '../message/message?id=' + item._id + '&name=' + item.uname + '&imgUrl=' + item
									.imgUrl +
									'&type=' + 1
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
			},
			// 跳转到上一页面
			goBack: function() {
				// uni.navigateBack({
				// 	delta: 1
				// })
				uni.reLaunch({
					url: '.index/index'
				})
			}
		}
	}
</script>
<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.top-bar {
		display: flex;
		position: fixed;
		align-items: center;
		top: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		z-index: 100;
		background-color: #ffffff;
		border-bottom: 1rpx solid lightgrey;

		.search {
			display: flex;
			height: 50rpx;
			width: 80%;
			margin-left: 10rpx;
			margin-right: 10rpx;
			padding-left: 20rpx;
			padding-top: 10rpx;
			background-color: $uni-bg-color-grey;
			border: 1rpx solid $uni-bg-color-grey;
			border-radius: 30rpx;

			.search-image {
				width: 40rpx;
				height: 40rpx;
			}

			.search-input {
				flex: 1;
				margin-left: 20rpx;
			}
		}

		.remove {
			flex: 1;
			padding-top: 10rpx;
			font-size: 35rpx;
			color: rgba(87, 153, 255, 1);
		}
	}

	.main {
		padding-top: 150rpx;
		padding-left: 20rpx;

		.search-group,
		.search-user {
			// background-color:paleturquoise;
			margin-bottom: 50rpx;

			// border-bottom:1rpx solid lightgrey;
			.title {
				font-weight: 900;
				font-size: 40rpx;
				margin-bottom: 20rpx;
				// background-color:paleturquoise;
			}

			.list {
				display: flex;
				align-items: center;
				// background-color:pink;
				// justify-content: space-between;
				padding-top: 20rpx;
				padding-bottom: 20rpx;

				.image {
					width: 80rpx;
					height: 80rpx;
					margin-right: 20rpx;
					border: 1px solid gainsboro;
					border-radius: 10rpx;
				}

				.detail {
					margin-left: 10rpx;

					// background-color: lavenderblush;
					.email {
						font-size: 20rpx;
						font-weight: 600;
						color: grey;
					}
				}

				.right {
					width: 150rpx;
					height: 50rpx;
					margin-left: auto;
					margin-right: 20rpx;
					text-align: center;

					.apply {
						padding-top: 10rpx;
						padding-bottom: 10rpx;
						color: rgba(87, 153, 255, 1);
						border-radius: 10rpx;
						background-color: whitesmoke;
					}

					.send {
						padding-top: 10rpx;
						padding-bottom: 10rpx;
						border-radius: 10rpx;
						background-color: rgba(147, 112, 219, 0.6);
					}
				}

				.displaynone {
					display: none;
				}
			}
		}
	}

	.modify {
		position: fixed;
		z-index: 1002;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #ffffff;

		.modify-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: $uni-bg-color;
			height: 100rpx;
			padding-top: 20rpx;
			padding-left: 20rpx;
			padding-right: 20rpx;
			color: #fff;

			.title {
				font-size: 40rpx;
			}

			.define,
			.close {
				font-size: 34rpx;
			}
		}

		.modify-main {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-top: 50rpx;

			.modify-content {
				width: 85%;
				height: 400rpx;
				padding: 20rpx;
				border-radius: 30rpx;
				background-color: rgba(123, 123, 123, 0.1);
			}
		}
	}
</style>