<template>
	<view class="box">
		<view class="top-bar">
			<image src="../../static/images/index/goback.png" mode="" @tap='goBack' class="image"></image>
			<view class="more">
				<image src="../../static/images/index/more.png" class="more-image"></image>
			</view>
		</view>
		<view class="top-bar bgBar" :animation="animationData">
			<image src="../../static/images/index/left.png" mode="" @tap='goBack' class="image"></image>
			<view class="more">
				<image src="../../static/images/index/moreone.png" class="more-image"></image>
			</view>
		</view>
		<view class="bg">
			<image :src="gimg" mode=" aspectFill" class="bg-img"></image>
			<!-- <image src="../../static/images/index/默认头像.jpeg" mode=" aspectFill" class="bg-img"></image> -->
		</view>
		<view class="main">
			<view class="main-inner">
				<view class="inf">
					<view class="name">{{gname}}</view>
					<view class="time">{{changeTime(time)}}</view>
					<view class="notice">{{notice}}</view>
				</view>
				<view class="member">
					<view class="top">
						<view class="title">群成员</view>
						<view class="more">
							管理群成员
						</view>
						<image src="../../static/images/index/right.png" mode="aspectFit" class="more-img"></image>
					</view>
					<view class="member-ls">
						<view class="member-li" v-for="(item,index) in groupMember" :key="index">
							<view class="imgs">
								<image src="../../static/images/index/delete.png" mode="aspectFit" class="delete"
									v-if='UserID == uid && UserID!=item.uid' @tap='deleteGroupMeb(item.uid)'></image>
								<image :src="item.imgUrl" mode="aspectFit" class="user-img"></image>
								<view class="name">{{item.name}}</view>
							</view>
						</view>
						<view class="member-li">
							<view class="imgs add" @tap="modify(undefined,'新成员',undefined,true)">
								<image src="../../static/images/index/add.png" mode="aspectFit" class="user-img">
								</image>
								<view class="name">邀请</view>
							</view>
						</view>
					</view>
					<view class="clear"></view>
				</view>
				<view class="mitem">
					<view class="row" @tap="modify('name','群名称',gname,false)" v-if='UserID==uid'>
						<view class="title">群名称</view>
						<view class="content">{{gname}}</view>
						<view class="more">
							<image src="../../static/images/index/right.png" class="head-more"></image>
						</view>
					</view>
					<view class="row" v-if='UserID!=uid'>
						<view class="title">群名称</view>
						<view class="content">{{gname}}</view>
						<view class="more">
							<!-- <image src="../../static/images/index/右箭头.png" class="head-more"></image> -->
						</view>
					</view>
					<view class="row">
						<view class="title">群头像</view>
						<view class="head" v-if='UserID == uid'>
							<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
							<image :src="cropFilePath" @tap="upload" class="head-image"></image>
						</view>
						<view class="more" v-if='UserID == uid'>
							<image src="../../static/images/index/right.png" class="head-more"></image>
						</view>
						<view class="head" v-if='UserID != uid'>
							<image :src="gimg" class="head-image"></image>
						</view>
					</view>
					<view class="row" @tap="modify('notice','群公告',notice,false)" v-if='UserID == uid'>
						<view class="title">群公告</view>
						<view class="content">{{notice}}</view>
						<view class="more">
							<image src="../../static/images/index/right.png" class="head-more"></image>
						</view>
					</view>
					<view class="row" v-if='UserID!=uid'>
						<view class="title">群公告</view>
						<view class="content">{{notice}}</view>
						<view class="more">
							<!-- <image src="../../static/images/index/右箭头.png" class="head-more"></image> -->
						</view>
					</view>
					<view class="row" @tap="modify('nickname','群内名',nickname,false)">
						<view class="title">群内名</view>
						<view class="content">{{nickname}}</view>
						<view class="more">
							<image src="../../static/images/index/right.png" class="head-more"></image>
						</view>
					</view>
					<view class="row">
						<view class="title">群消息免打扰</view>
						<view class="content"></view>
						<view class="more">
							<switch :checked="autoplay" @change="changeSwiper" color='rgba(147, 112, 219, 0.6)'
								class="swiper" />
						</view>
					</view>
				</view>
				<view class="button" v-if='UserID != uid' @tap='leaveGroup'>退出该群</view>
				<view class="button" v-if='UserID==uid' @tap='deleteGroup'>删除群聊</view>
			</view>
		</view>
		<view class="modify" :style="{bottom:-modifyHeight+'px'}" :animation="animationData2">
			<view class="modify-header">
				<view class="close" @tap='modify()'>取消</view>
				<view class="title">{{modifyTitle}}</view>
				<view class="define" @tap='modifySubmit' v-if='!isAdd'>确定</view>
				<view class="define" v-if='isAdd'></view>
			</view>
			<view class="modify-main" v-if='!isAdd'>
				<textarea v-model="data" class="modify-content" />
			</view>
			<view class="friends" v-if='isAdd'>
				<view class="user" v-for="(item,index) in newMember" :key='index' @tap='selectFriend(index)'>
					<view class="selected" :class="{isSelected:item.selected}">
						<image src="../../static/images/index/slected.png" class="selected-img" v-show="item.selected">
						</image>
					</view>
					<image :src="item.imgUrl" class="user-img"></image>
					<view class="name">{{item.name}}</view>
				</view>
				<view class="bottom-bar" @tap="addMember">
					<view class="bottom-btn">创建({{selectedNum}})</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import datas from '../../commons/js/data.js'
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	import TimeFun from '@/commons/js/time.js'
	export default {
		data() {
			return {
				UserID: '', //群主id
				uid: '', //用户id
				uname: '', //用户名称
				token: '', //token
				gid: '', //群id
				gimg: '', //群头像
				gname: '', //群名
				time: '', //注册时间
				notice: '', //简介
				nickname: '', //群内昵称
				groupMember: [], //群成员
				newMember: [], //获取新成员
				newUser: [], //选中的成员
				autoplay: false, //控制滑块显示
				top: 0, //模块到顶部的距离
				modifyHeight: '', //页面高度
				animationData: {}, //动画
				animationData2: {}, //动画
				tempFilePath: "", // 图片裁剪
				cropFilePath: "../../static/images/index/默认头像.jpeg",
				image: '',
				isAdd: false, //控制是否添加新成员
				title: '', //修改dataArr中的各个属性
				data: '修改的内容', // 修改内容
				isModfiy: false, //是否修改
				oldData: '', //复制旧的修改项
				modifyTitle: '', //修改标题
				selectedNum: 0, //选中的数量
			}
		},
		components: {
			ImageCropper,
		},
		onLoad: function(e) {
			this.getStorage()
			this.gid = e.gid
			this.gimg = e.gimg
			this.getGroupMeb()
			this.getGroupDetail()
			this.getNickname()
			this.getFriends()
		},
		// 页面渲染后
		onReady: function() {
			this.getElementStyle()
			this.getModify()
		},
		methods: {
			// 跳转到上一页面
			goBack: function() {
				// uni.switchTab({
				// 	url: '../index/index'
				// })
				uni.reLaunch({
					url: '../index/index'
				})
			},
			// 滑块监听
			changeSwiper(e) {
				this.autoplay = !this.autoplay

			},
			// 获取高度
			getElementStyle: function() {
				const query = uni.createSelectorQuery().in(this)
				query.select('.main-inner').boundingClientRect(data => {
					this.top = data.top
				}).exec()
			},
			// 顶部切换动画
			addAnimation: function() {
				var animation = uni.createAnimation({
					duration: 800,
					timingFunction: 'linear',
				})
				this.animation = animation
				if (this.top < 50) {
					// console.log(1);
					animation.opacity(1).step()
				} else {
					animation.opacity(0).step()
				}
				this.animationData = animation.export()
			},
			// 监听页面滚动
			onPageScroll: function() {
				this.getElementStyle()
				this.addAnimation()
			},
			// 动态的选择好友
			selectFriend: function(e) {
				if (this.newMember[e].selected) {
					this.newMember[e].selected = false
					this.selectedNum--
				} else {
					this.newMember[e].selected = true
					this.selectedNum++
				}
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
						name: this.gid,//图片名称
						token: this.token
					}, //传递参数
					success: (uploadFileRes) => {
						var backstr = uploadFileRes.data;
						//自定义操作
						this.gimg = backstr
						// this.$forceUpdate() //强制刷新页面
						var pages = getCurrentPages(); //获取所有页面的数组对象
						var currPage = pages[pages.length - 1]; //当前页面
						uni.reLaunch({
							url: currPage.$page.fullPath
						})
						this.update(this.gimg, 'imgUrl')
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
			// 获取缓存数据
			getStorage: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id
						this.uname = value.name
						this.token = value.token
						console.log(this.uname);
					} else {
						// 如果没有用户缓存跳转登录页面
						uni.navigateTo({
							url: '../login/login'
						})
					}
				} catch (e) {}
			},
			// 时间处理
			changeTime: function(e) {
				return TimeFun.dateTime_Three(e)
			},
			// 获取群详情
			getGroupDetail: function() {
				uni.request({
					url: this.serverUrl + '/group/getGroupDetail',
					data: {
						gid: this.gid,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							let res = data.data.result
							res.imgUrl = this.serverUrl + res.imgUrl
							this.cropFilePath = res.imgUrl
							this.gname = res.name
							this.time = res.time
							this.UserID = res.userID
							if (res.notice == undefined) {
								res.notice = '还没有群简介~~'
							}
							this.notice = res.notice
							this.gimg = res.imgUrl
							// console.log(this.UserID);
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
			// 获取群内昵称
			getNickname: function() {
				uni.request({
					url: this.serverUrl + '/group/getGroupNickname',
					data: {
						uid: this.uid,
						gid: this.gid,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							let res = data.data.result
							// console.log(res.name);
							if (res.name == undefined) {
								this.nickname = this.uname
							} else {
								this.nickname = res.name
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
			// 修改群内昵称
			changeNickname: function(data) {
				if (this.data.length > 0 && this.data != this.oldData) {
					uni.request({
						url: this.serverUrl + '/group/nicknameChange',
						data: {
							uid: this.uid,
							gid: this.gid,
							nickname: data,
							token: this.token
						},
						method: 'POST',
						success: (data) => {
							let code = data.data.code
							if (code == 200) {
								let res = data.data.result
								console.log('修改昵称');
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
				}
			},
			// 获取群成员的列表
			getGroupMeb: function() {
				uni.request({
					url: this.serverUrl + '/group/getGroupMeb',
					data: {
						gid: this.gid,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							let res = data.data.result
							for (let i = 0; i < res.length; i++) {
								res[i].imgUrl = this.serverUrl + res[i].imgUrl
								this.groupMember.push(res[i])
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
			// 获取修改项高度
			getModify: function() {
				const query = uni.createSelectorQuery().in(this)
				query.select('.modify').boundingClientRect(data => {
					this.modifyHeight = data.height
				}).exec()
			},
			// 修改项
			modify: function(title, modifyTitle, data, isAdd) {
				this.oldData = data //需要修改的内容
				this.data = data //修改后的内容
				this.title = title //dataArr中需要修改的属性
				this.modifyTitle = modifyTitle //弹出层的标题
				this.isModfiy = !this.isModfiy
				this.isAdd = isAdd
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
				this.animationData2 = animation.export()
			},
			// 弹出框确定
			modifySubmit: function() {
				// 提交修改项
				if (this.data.length > 0 && this.data != this.oldData) {
					if (this.title == 'name') {
						this.gname = this.data
						this.update(this.gname, 'name')
					} else if (this.title == 'notice') {
						this.notice = this.data
						this.update(this.notice, 'notice')
					} else {
						this.nickname = this.data
						this.changeNickname(this.nickname)
					}
				}
				// 关闭弹出层
				this.modify()
			},
			update: function(e, type) {
				uni.request({
					url: this.serverUrl + '/group/updateGroup',
					data: {
						uid: this.uid,
						gid: this.gid,
						type: type,
						data: e,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							let res = data.data.result
							console.log('成功');
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
								this.getNewMember(res[i])
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
			// 获取新的群成员
			getNewMember: function(e) {
				let tip = 0 //表示是群成员
				uni.request({
					url: this.serverUrl + '/search/matchGroup',
					data: {
						uid: e.id,
						gid: this.gid,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							tip = 0
							e.tip = tip
						} else if (code == 400) {
							tip = 1
							e.tip = tip
							// console.log(e)
							this.newMember.push(e)
							// console.log(this.newMember);
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
			// 添加好友
			addMember: function() {
				if (this.selectedNum) {
					for (let i = 0; i < this.newMember.length; i++) {
						if (this.newMember[i].selected) {
							this.newUser.push(this.newMember[i].id)
						}
					}
					uni.request({
						url: this.serverUrl + '/group/insertGroup',
						data: {
							gid: this.gid,
							user: this.newUser,
							token: this.token
						},
						method: 'POST',
						success: (data) => {
							let code = data.data.code
							if (code == 200) {
								// 强制刷新页面
								var pages = getCurrentPages(); //获取所有页面的数组对象
								var currPage = pages[pages.length - 1]; //当前页面
								uni.navigateTo({
									url: currPage.$page.fullPath
								})
								console.log('添加新成员成功');
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
				// 关闭弹出层
				this.modify()
			},
			// 删除群组的好友
			deleteGroupMeb: function(e) {
				if (this.UserID !== e) {
					uni.showModal({
						title: '提示',
						content: '确认删除吗?',
						success: (res) => {
							uni.request({
								url: this.serverUrl + '/group/deleteGroup',
								data: {
									gid: this.gid,
									uid: e,
									token: this.token
								},
								method: 'POST',
								success: (data) => {
									let code = data.data.code
									if (code == 200) {
										var pages = getCurrentPages(); //获取所有页面的数组对象
										var currPage = pages[pages.length - 1]; //当前页面
										console.log(currPage.$page.fullPath);
										uni.navigateTo({
											url: currPage.$page.fullPath
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
					})
				}
			},
			// 退出群聊
			leaveGroup: function() {
				uni.showModal({
					title: '提示',
					content: '确认退出群聊吗?',
					success: (res) => {
						uni.request({
							url: this.serverUrl + '/group/deleteGroup',
							data: {
								gid: this.gid,
								uid: this.uid,
								token: this.token
							},
							method: 'POST',
							success: (data) => {
								let code = data.data.code
								if (code == 200) {
									// uni.switchTab({
									// 	url: '../index/index'
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
				})
			},
			// 删除群聊
			deleteGroup: function() {
				uni.showModal({
					title: '提示',
					content: '确认删除群聊吗?',
					success: (res) => {
						uni.request({
							url: this.serverUrl + '/group/deleteGroups',
							data: {
								gid: this.gid,
								token: this.token
							},
							method: 'POST',
							success: (data) => {
								let code = data.data.code
								if (code == 200) {
									// 删除成功后跳转
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
				})
			}

		}
	}
</script>

<style lang="scss">
	.top-bar {
		display: flex;
		width: 100%;
		position: fixed;

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
			}
		}
	}

	.bgBar {
		opacity: 0;
		background-color: #ffffff;
	}

	.clear {
		clear: both;
	}

	.bg {
		width: 100%;
		height: 100%;
		background-color: #ffffff;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;

		.bg-img {
			width: 100%;
			height: 750rpx;
		}
	}

	.main {
		padding-top: 260rpx;

		.main-inner {
			width: 100%;
			min-height: 400rpx;
			background-color: #ffffff;
			border-radius: 40rpx 40rpx 0 0;
		}

		.inf {
			padding: 20rpx;
			box-sizing: border-box;
			border-bottom: 1rpx solid #eee;

			.name {
				float: left;
				font-size: 48rpx;
				font-weight: 600;
				color: #272832;
				line-height: 66rpx;
			}

			.time {
				float: right;
				font-size: 28rpx;
				color: rgba(39, 40, 50, 0.5);
				line-height: 66rpx;
			}

			.notice {
				padding-top: 20rpx;
				font-size: 28rpx;
				color: #272832;
				line-height: 40rpx;
				clear: both;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
		}

		.member {
			border-bottom: 1rpx solid #eee;

			// border-bottom: 20rpx;
			.top {
				padding: 20rpx;
				box-sizing: border-box;
				height: 100rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: flex-end;
			}

			.title {
				flex: 1;
				font-size: 36rpx;
				font-weight: 600;
				color: #272832;
			}

			.more {
				float: right;
				padding-right: 20rpx;
				font-size: 32rpx;
				font-weight: 400;
				color: rgba(39, 40, 50, 0.6);
			}

			.more-img {
				width: 26rpx;
				height: 28rpx;
			}
		}

		.member-ls {
			width: 100%;
			padding: 20rpx 16rpx;
			box-sizing: border-box;
			// background-color: pink;
		}

		.member-li {
			padding-bottom: 50rpx;
			width: 20%;
			float: left;
			text-align: center;

			.imgs {
				position: relative;
				width: 80rpx;
				height: 80rpx;
				border-radius: 20rpx;
			}

			.user-img {
				width: 84rpx;
				height: 84rpx;
				border-radius: 20rpx;
			}

			.delete {
				width: 30rpx;
				height: 30rpx;
				position: absolute;
				top: -10rpx;
				right: -10rpx;
				z-index: 10;
			}

			.name {
				padding: 0 8rpx;
				// margin-top: 40rpx;
				font-size: 28rpx;
				color: #272832;
				line-height: 40rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}

			.add {
				background-color: rgba(147, 112, 219, 0.6);
			}
		}

		.mitem {
			display: flex;
			flex-direction: column;
			padding-top: 22rpx;
			width: 100%;
			border-bottom: 1rpx solid #eee;

			.row {
				display: flex;
				flex-direction: row;
				padding-top: 10rpx;
			}

			.title {
				flex: none;
				font-size: 36rpx;
				line-height: 100rpx;
				height: 100rpx;
				padding-left: 20rpx;
			}

			.more {
				margin-left: auto;
				padding-top: 30rpx;

				.head-more {
					width: 40rpx;
					height: 40rpx;
					margin-right: 30rpx;
				}

				.swiper {
					margin-right: 30rpx;
				}
			}

			.head {
				margin-left: 30rpx;

				.head-image {
					width: 100rpx;
					height: 100rpx;
					border-radius: 20rpx;
				}
			}

			.content {
				width: 65%;
				line-height: 100rpx;
				height: 100rpx;
				margin-left: 30rpx;
				font-size: 28rpx;
				color: darkgrey;
				overflow: hidden;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
			}
		}

		.button {
			margin-top: 30rpx;
			text-align: center;
			font-size: 40rpx;
			color: orangered;
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

		.friends {
			padding-left: 30rpx;

			// padding-top: 400rpx;
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
	}
</style>