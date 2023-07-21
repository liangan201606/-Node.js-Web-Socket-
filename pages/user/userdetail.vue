<template>
	<view class="box">
		<view class="top-bar">
			<image src="../../static/images/index/goback.png" mode="" @tap='goBack' class="image"></image>
			<view class="title">详情</view>
		</view>
		<view class="main">
			<view class="user-head">
				<view class="title">头像</view>
				<view class="head" v-if="user._id==uid">
					<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
					<image :src="cropFilePath" @tap="upload" class="head-image"></image>
				</view>
				<view class="more" v-if="user._id==uid">
					<image src="../../static/images/index/right.png" class="head-more"></image>
				</view>
				<view class="head" v-if="user._id!=uid">
					<image :src="user.imgUrl" @tap="upload" class="head-image"></image>
				</view>
			</view>
			<view class="user" @tap="modify('explain','签名',user.explain,false)" v-if="user._id==uid">
				<view class="title">签名</view>
				<view class="content">{{user.explain}}</view>
				<view class="more">
					<image src="../../static/images/index/right.png" class="head-more"></image>
				</view>
			</view>
			<view class="user" v-if="user._id!=uid">
				<view class="title">签名</view>
				<view class="content">{{user.explain}}</view>
				<view class="more">
					<image src="../../static/images/index/right.png" class="head-more"></image>
				</view>
			</view>
			<view class="user">
				<view class="title">注册</view>
				<view class="content">{{changeTime(user.time)}}</view>
			</view>
		</view>
		<view class="other">
			<view class="user" @tap="modify('name','昵称',user.name,false)" v-if="user._id==uid">
				<view class="title">昵称</view>
				<view class="content">{{user.name}}</view>
				<view class="more">
					<image src="../../static/images/index/right.png" class="head-more"></image>
				</view>
			</view>
			<view class="user" v-if="user._id!=uid" @tap="modify('nickname','昵称',nickname,false)">
				<view class="title">昵称</view>
				<view class="content">{{nickname}}</view>
				<view class="more">
					<image src="../../static/images/index/right.png" class="head-more"></image>
				</view>
			</view>
			<view class="user">
				<view class="title">性别</view>
				<view class="content">
					<picker @change="bindPickerChange" :value="index" :range="array" >
						<view class="uni-input" v-if='user._id == uid'>{{array[index]}}</view>
						<view class="uni-input" v-if='user._id != uid'>{{array[index]}}</view>
					</picker>
				</view>
				<view class="more">
					<!-- <image src="../../static/images/index/右箭头.png" class="head-more" v-if='user._id == uid'></image> -->
				</view>
			</view>
			<view class="user">
				<view class="title">生日</view>
				<view class="content">
					<picker mode="date" :value="user.birth" :start="startDate" :end="endDate" @change="bindDateChange"
						v-if='user._id == uid'>
						<view class="uni-input">{{user.birth}}</view>
					</picker>
					<view class="uni-input" v-if='user._id != uid'>{{user.birth}}</view>
				</view>
				<view class="more" v-if='user._id == uid'>
					<image src="../../static/images/index/right.png" class="head-more"></image>
				</view>
			</view>
			<view class="user" @tap="modify('phone','电话',user.phone,true)" v-if='user._id == uid'>
				<view class="title">电话</view>
				<view class="content">{{user.phone}}</view>
				<view class="more">
					<image src="../../static/images/index/right.png" class="head-more"></image>
				</view>
			</view>
			<view class="user" v-if='user._id != uid'>
				<view class="title">电话</view>
				<view class="content">{{user.phone}}</view>
				<view class="more">
					<!-- <image src="../../static/images/index/右箭头.png" class="head-more"></image> -->
				</view>
			</view>
			<view class="user" @tap="modify('email','邮箱',user.email,true)" v-if='user._id == uid'>
				<view class="title">邮箱</view>
				<view class="content">{{user.email}}</view>
				<view class="more">
					<image src="../../static/images/index/right.png" class="head-more"></image>
				</view>
			</view>
			<view class="user" v-if='user._id != uid'>
				<view class="title">邮箱</view>
				<view class="content">{{user.email}}</view>
				<view class="more">
					<!-- <image src="../../static/images/index/右箭头.png" class="head-more"></image> -->
				</view>
			</view>
			<view class="user-password" v-if='user._id == uid' @tap="modify('password','密码',pwd ,true)">
				<view class="title">密码</view>
				<view class="content">******</view>
				<view class="more">
					<image src="../../static/images/index/right.png" class="head-more"></image>
				</view>
			</view>
			<view class="user-password" v-if='user._id != uid'>
				<view class="title">密码</view>
				<view class="content">******</view>
				<view class="more">
					<!-- <image src="../../static/images/index/右箭头.png" class="head-more"></image> -->
				</view>
			</view>
		</view>
		<view class="button" v-if='user._id == uid' @tap='quit'>退出应用</view>
		<view class="button" v-if='user._id != uid' @tap='deleteFriend'>删除好友</view>
		<view class="modify" :style="{bottom:-modifyHeight+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap='modify()'>取消</view>
				<view class="title">{{title}}</view>
				<view class="define" @tap='modifySubmit'>确定</view>
			</view>
			<view class="modify-main">
				<input placeholder="请输入原密码" class="modify-password" v-if='isPwd' v-model='pwd'>
				<textarea v-model="data" class="modify-content" />
			</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	import TimeFun from '@/commons/js/time.js'
	export default {
		name: 'Header',
		components: {
			ImageCropper,
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				array: ['男', '女', '未知'],
				index: 3,
				tempFilePath: "", // 图片裁剪
				cropFilePath: "../../static/images/index/默认头像.jpeg",
				image: '', //更新后的图片
				title: '', //修改的标题
				data: '修改的内容', // 修改后内容
				oldData: '', //需要修改的内容
				pwd: undefined, //原始密码
				type: '', //修改的内型
				animationData: {}, //动画
				isPwd: false, //是否有密码
				isModfiy: false, //是否修改
				modifyHeight: '', //页面高度
				id: '', //好友id
				uid: '', //用户id
				token: '', //token
				name: '', //用户名称
				nickname: '', //好友昵称
				user: {}, //用户数据
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onReady: function() {
			this.getElementStyle()
		},
		onLoad: function(e) {
			this.id = e.id
			this.getStorage()
			this.getUser()
			this.getNickname()
		},
		mounted() {},
		methods: {
			goBack: function() {
				// uni.navigateBack({
				// 	delta: 1
				// })
				let pages = getCurrentPages(); // 当前页面
				let beforePage = pages[pages.length - 2]; // 上一页
				uni.navigateBack({
					delta: 1,
				    success: function() {
				        // beforePage.onLoad(); // 执行上一页的onLoad方法
						beforePage.$vm.getUser()//执行上一页的方法
				    }
				});

			},
			// 获取缓存数据
			getStorage: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id
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
							// 处理签名
							if (res.explain == undefined) {
								res.explain = '这个人懒，什么都没有留下~'
							}
							// 处理nickname
							if (this.nickname.length == 0) {
								this.nickname = res.name
							}
							// 处理生日
							if (res.birth == undefined) {
								res.birth = '0000-00-00'
							} else {
								let birth = TimeFun.dateTime_Three(res.birth)
								res.birth = birth
							}
							// 处理电话
							if (res.phone == undefined) {
								res.phone = '0000'
							}
							this.ChooseSex(res.sex)
							this.user = res
							this.cropFilePath = this.user.imgUrl
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
			// 获取好友昵称
			getNickname: function() {
				if (this.id != this.uid) {
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
								console.log(res.nickname);
								if (res.nickname != undefined) {
									// 如果存在
									this.nickname = res.nickname
								}
								console.log(res.nickname);
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
			// 性别判断
			ChooseSex: function(e) {
				if (e == 'female') {
					// 女性
					this.index = 1
				} else if (e == 'male') {
					// 男性
					this.index = 0
				} else {
					// 男性
					this.index = 2
				}
			},
			// 时间处理
			changeTime: function(e) {
				return TimeFun.dateTime_Two(e)
			},
			// 性别选择器
			bindPickerChange: function(e) {
				let oldIndex = this.index
				this.index = e.detail.value
				if (this.index != oldIndex) {
					let sex = 'asexual'
					if (this.index == 0) {
						sex = 'male'
					} else if (this.index == 1) {
						sex = 'female'
					}
					this.upDate(sex, 'sex', undefined)
				}
			},
			// 生日选择器
			bindDateChange: function(e) {
				let oldData = this.data
				this.data = e.detail.value
				if (this.data != oldData) {
					this.upDate(this.data, 'birth', undefined)
					this.user.birth = this.data
				}

			},
			// 获取日期
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 0;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
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
						url: 'user',
						name: this.uid,
						token: this.token
					}, //传递参数
					success: (uploadFileRes) => {
						var backstr = uploadFileRes.data;
						console.log(backstr);
						// 修改本地存储用户信息
						try {
							uni.setStorageSync('user', {
								'id': this.uid,
								'name': this.name,
								'imgUrl': backstr,
								'token': this.token
							});
						} catch (e) {
							console.log('数据存储出错');
						}
						//数据库更新操作
						this.upDate(backstr, 'imgUrl', undefined)
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
			// 获取元素的高度
			getElementStyle: function() {
				const query = uni.createSelectorQuery().in(this)
				query.select('.modify').boundingClientRect(data => {
					this.modifyHeight = data.height
				}).exec()
			},
			// 修改项
			modify: function(type, title, data, isPwd) {
				this.oldData = data //需要修改的内容
				this.type = type //修改类型
				this.data = data //修改的内容
				this.title = title //修改的标题
				this.isPwd = isPwd //是否需要密码
				this.isModfiy = !this.isModfiy
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
			// 弹出框确定按钮
			modifySubmit: function() {
				// 提交修改
				if (this.data != this.oldData && this.data.length > 0) {
					if (this.type == 'nickname') {
						this.upDateFriendName(this.data)
						this.nickname = this.data
					} else if (this.type == 'email') {
						// console.log(this.pwd);
						// 判断修改后的邮箱格式是否正确
						let reg =
							/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
						if (reg.test(this.data)) {
							// 邮箱格式正确
							this.upDate(this.data, this.type, this.pwd)
							//前端替换
							this.user[this.type] = this.data
							this.pwd = undefined //清空
						} else {
							// 邮箱不符合
							uni.showToast({
								title: '修改失败,邮箱格式错误',
								icon: 'none',
								duration: 2000
							})
						}
					} else if (this.type == 'password') {
						let reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

						if (reg.test(this.data)) {
							this.upDate(this.data, this.type, this.pwd)
							this.pwd = undefined //清空
						} else {
							// 密码格式不符合
							uni.showToast({
								title: '请出入8为密码至少包含一个字母和一个数字',
								icon: 'none',
								duration: 2000
							})
						}
					} else {
						// console.log(this.pwd);
						this.upDate(this.data, this.type, this.pwd)
						//前端替换
						this.user[this.type] = this.data
						this.pwd = undefined //清空
					}
				}
				this.modify()
			},
			// 用户数据修改
			upDate: function(e, type, pwd) {
				uni.request({
					url: this.serverUrl + '/user/update',
					data: {
						id: this.uid,
						data: e,
						type: type,
						password: pwd,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							// console.log('修改成功');
							// 跳转登录页面
							if (type == 'password') {
								// 清除缓存
								uni.removeStorage({
									key: 'user',
									success: function(res) {
										console.log('success');
									}
								})
								uni.navigateTo({
									url: '../login/login?name=' + this.name
								})
							}
							uni.showToast({
								title: '修改成功',
								icon: 'none',
								duration: 2000
							})
						} else if (code == 400) {
							console.log('修改失败');
							uni.showToast({
								title: '修改失败,原始密码错误',
								icon: 'none',
								duration: 2000
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
			// 退出登录
			quit: function() {
				uni.removeStorage({
					key: 'user',
					success: function(res) {
						console.log('success');
					}
				})
				uni.navigateTo({
					url: '../login/login?name=' + this.name
				})
			},
			// 删除好友
			deleteFriend: function() {
				uni.showModal({
					title: '提示',
					content: '确认删除好友吗?',
					success: (res) => {
						uni.request({
							url: this.serverUrl + '/friend/delete',
							data: {
								uid: this.uid,
								fid: this.id,
								token: this.token
							},
							method: 'POST',
							success: (data) => {
								let code = data.data.code
								if (code == 200) {
									console.log('好友删除成功');
									uni.reLaunch({
										url: '../index/index'
									})
								} else if (code == 400) {
									console.log('好友删除失败');
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
			// 修改好友昵称
			upDateFriendName: function(data) {
				if (this.data.length > 0 && this.data != this.oldData) {
					uni.request({
						url: this.serverUrl + '/user/nicknameUpdate',
						data: {
							uid: this.uid,
							fid: this.id,
							nickname: data,
							token: this.token
						},
						method: 'POST',
						success: (data) => {
							let code = data.data.code
							if (code == 200) {
								console.log('昵称修改成功');
							} else if (code == 400) {
								console.log('昵称修改失败');
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
	.box {
		height: 100%;

		// background-color: palegreen;
		.top-bar {
			background-color: $uni-bg-color;
			width: 100%;
			height: 80rpx;
			padding-top: 20rpx;
			padding-left: 20rpx;

			.image {
				float: left;
				width: 60rpx;
				height: 60rpx;
			}

			.title {
				margin: auto;
				width: 100rpx;
				height: 50rpx;
				font-size: 40rpx;
				color: #fff;
			}
		}

		.main,
		.other {
			width: 100%;
			border-bottom: 1rpx solid gainsboro;

			.user-head {
				margin-top: 30rpx;
			}

			.user-password {
				border-top: 1rpx solid gainsboro;
			}

			.user,
			.user-head,
			.user-password {
				display: flex;
				align-items: center;
				width: 100%;
				height: 100rpx;
				padding-top: 20rpx;
				padding-left: 30rpx;

				.title {
					font-size: 40rpx;
					line-height: 100rpx;
					height: 100rpx;
				}

				.head {
					margin-left: 30rpx;

					.head-image {
						width: 100rpx;
						height: 100rpx;
						border-radius: 20rpx;
					}
				}

				.more {
					margin-left: auto;

					.head-more {
						width: 50rpx;
						height: 50rpx;
						margin-right: 30rpx;
					}
				}

				.content {
					width: 65%;
					line-height: 100rpx;
					height: 100rpx;
					margin-left: 30rpx;
					color: darkgrey;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
				}
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

			.modify-password {
				width: 85%;
				height: 60rpx;
				padding: 10rpx;
				margin-bottom: 50rpx;
				border-radius: 30rpx;
				background-color: rgba(123, 123, 123, 0.1);
			}
		}
	}
</style>