<template>
	<view class="box">
		<view class="submit">
			<view class="video-image" @tap="recordSubmit">
				<image src="../static/images/index/yuyin.png" v-show="!isRcord"></image>
				<image src="../static/images/index/keyboard.png" v-show="isRcord"></image>
			</view>
			<textarea class="submit-text" auto-height="true" v-show="!isRcord" @input="inputSubmit" v-model="message"
				@focus='Focus'></textarea>
			<view class="submit-record" v-show="isRcord" @touchstart='touchstart' @touchend='touchend'
				@touchmove="touchmove">按住说话</view>
			<view class="emoji-image" @tap="emojiSubmit">
				<image src="../static/images/index/xiao.png"></image>
			</view>
			<view class="more-image" @tap='moreSubmit'>
				<image src="../static/images/index/moretwo.png"></image>
			</view>
		</view>
		<view class="emoji" v-show="isEmogji">
			<view class="emoji-submit">
				<view class="send" @tap='EmojiSend'>发送</view>
				<view class="remove" @tap='EmojiBack'>退格</view>
			</view>
			<!-- :height='100' -->
			<Emoji @SendEmoji='Emoji'></Emoji>
		</view>
		<view class="more" v-show="isMore">
			<view class="more-list" @tap="sendImg('ablum')">
				<image src="../static/images/index/photo.png"></image>
				<view class="moer-list-title">图片</view>
			</view>
			<view class="more-list" @tap="sendImg('camera')">
				<image src="../static/images/index/xiangji.png"></image>
				<view class="moer-list-title">拍照</view>
			</view>
			<view class="more-list" @tap="getLocation">
				<image src="../static/images/index/dingwei.png"></image>
				<view class="moer-list-title">定位</view>
			</view>
			<view class="more-list" @tap='playSubmit'>
				<image src="../static/images/index/shipin.png"></image>
				<view class="moer-list-title">视频</view>
			</view>
			<view class="more-list" @tap='voiceSubmit'>
				<image src="../static/images/index/phone.png"></image>
				<view class="moer-list-title">语音</view>
			</view>
		</view>
		<view class="voice-button" v-show="isVoice">
			<view class="voice-length">
				<view class="voice-time" :style="{width:voiceLength/0.6+'%'}">
					{{voiceLength}}"
				</view>
				<view class="voice-delete">上滑删除录音</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Emoji from "./emoji/emoji.vue"
	// 录音
	const recorderManager = uni.getRecorderManager();
	export default {
		data() {
			return {
				isRcord: false,
				isEmogji: false,
				isMore: false,
				isVoice: false,
				message: '',
				timer: '', //计时器
				voiceLength: 0, //录音秒数
				pageY: '',
				selected: [], //选中的群成员
				Fid: this.fid, //好友id
				Fname: this.fname, //好友名称
				FimgUrl: this.fimgUrl, //好友头像
				Type: this.type, //会话类型群聊1或单聊0
				uid: '', //用户id
				token: '', //token
				groupMember: [], //群聊成员
				groupID: '', //群id
				userIDList:[],//发起群聊视频成员
			}
		},
		components: {
			Emoji
		},
		onLoad: function() {},
		created() {
			this.getStorage()
			this.getGroupuser()
		},
		props: {
			fid: { //参数名
				type: String, //参数名
				default: " " //参数默认
			},
			fname: {
				type: String,
				default: ""
			},
			fimgUrl: {
				type: String,
				default: ""
			},
			type: {
				type: String,
				default: ""
			}
		},
		methods: {
			// 视频通话
			playSubmit: function() {
				console.log(this.Type);
				if (this.Type == 0) {
					// 一对一视频通话
					uni.$TUICallKit.call({
						userID: this.Fid, // 对方用户id
						callMediaType: 2, // 语音通话(1)、视频通话(2)
					}, (res) => {
						if (res.code === 0) {
							console.log('call success');
						} else {
							console.log(res.msg);
						}
					});
				} else if (this.Type == 1) {
					this.creatGroup()
					// 群视频通话
					uni.$TUICallKit.groupCall({
						groupID: this.groupID,
						userIDList: this.userIDList,
						callMediaType: 2, // 语音通话(callMediaType = 1)、视频通话(callMediaType = 2)
					}, (res) => {
						if (res.code === 0) {
							console.log('groupCall success');
						} else {
							console.log(`groupCall failed, error message = ${res.msg}`);
						}
					});

				}
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
			// 获取群聊成员
			getGroupuser: function() {
				uni.request({
					url: this.serverUrl + '/group/getGroupMeb',
					data: {
						gid: this.Fid,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							let res = data.data.result
							for (let i = 0; i < res.length; i++) {
								res[i] = res[i].uid
								this.userIDList.push(res[i])
							}
							for (let i = 0; i < res.length; i++) {
								const user = {
									userID: res[i],
								};
								this.groupMember[i] = user;
							}
							// console.log('获取群组成员');
							// console.log(this.groupMember);
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
			// 语音通话
			voiceSubmit: function() {
				if (this.Type == 0) {
					// 一对一视频通话
					uni.$TUICallKit.call({
						userID: this.Fid, // 对方用户id
						callMediaType: 1, // 语音通话(1)、视频通话(2)
					}, (res) => {
						if (res.code === 0) {
							console.log('call success');
						} else {
							console.log(res.msg);
						}
					});
				} else if (this.Type == 1) {
					this.creatGroup()
					// 群视频通话
					uni.$TUICallKit.groupCall({
						groupID: this.groupID, //群id
						userIDList:this.userIDList,
						callMediaType: 1,
					}, (res) => {
						if (res.code === 0) {
							console.log('groupCall success');
						} else {
							console.log(`groupCall failed, error message = ${res.msg}`);
						}
					});
				}
			},
			// 创建群聊ID
			creatGroup: function() {
				uni.$TUIKit.createGroup({
					type: uni.$TIM.TYPES.GRP_MEETING,
					name: this.Fname, // 群名称
					memberList: this.groupMember// 如果填写了 memberList，则必须填写 userID
				}).then((imResponse) => {
					console.log(imResponse)
					this.groupID = imResponse.data.group.groupID; // 创建成功的群组id
				}).catch((imError) => {
					console.warn(imError); // 创建群组失败的相关信息
				});
			},
			// 获取修改项高度
			getModify: function() {
				const query = uni.createSelectorQuery().in(this)
				query.select('.modify').boundingClientRect(data => {
					this.modifyHeight = data.height
				}).exec()
			},
			// 修改项
			modify: function() {
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
			// 点击语音按钮
			recordSubmit: function() {
				this.isRcord = !this.isRcord
				this.isEmogji = false
				this.isMore = false
				setTimeout(() => {
					this.getElementStyle()
				}, 10)
			},
			// 点击表情标签
			emojiSubmit: function() {
				this.isEmogji = !this.isEmogji
				// 关闭其他项
				this.isMore = false
				setTimeout(() => {
					this.getElementStyle() //解决滞后
				}, 10)
			},
			// 点击更多
			moreSubmit: function() {
				this.isMore = !this.isMore
				// 关闭其他项
				this.isEmogji = false
				setTimeout(() => {
					this.getElementStyle() //解决滞后
				}, 10)
			},
			// 获取表情
			Emoji: function(e) {
				this.message = this.message + e
			},
			// 文字发送
			inputSubmit: function(e) {
				var chat = e.detail.value
				var pos = chat.indexOf('\n')
				if (pos != -1 && chat.length > 0) {
					this.send(this.message, 0)
				}
			},
			// 输入框聚焦
			Focus: function(e) {
				this.isEmogji = false
				this.isMore = false
				setTimeout(() => {
					this.getElementStyle()
				}, 10)
			},
			// 发送表情
			EmojiSend: function() {
				if (this.message.length > 0) {
					this.send(this.message, 0)
				}
			},
			// 发送表情退格
			EmojiBack: function() {
				if (this.message.length > 0) {
					this.message = this.message.substring(0, this.message.length - 1)
				}
			},
			// 获取模块高度
			getElementStyle: function() {
				const query = uni.createSelectorQuery().in(this)
				query.select('.box').boundingClientRect(data => {
					this.$emit('Height', data.height)
					// console.log(data.height);
				}).exec()
			},
			// 处理音频
			touchstart: function(e) {
				// 点击时Y轴的位置
				this.pageY = e.changedTouches[0].pageY
				this.isVoice = true
				let i = 1;
				this.timer = setInterval(() => {
					this.voiceLength = i;
					i++;
					if (i > 60) {
						clearInterval(this.timer)
						this.touchend(); //到达最大时长后自动提交
					}
				}, 1000)
				recorderManager.start()
			},
			touchend: function() {
				clearInterval(this.timer);
				recorderManager.stop()
				// 录音停止事件，会回调文件地址
				recorderManager.onStop((res) => {
					let data = {
						voice: res.tempFilePath,
						time: this.voiceLength
					}
					if (this.isVoice == true) {
						this.send(data, 2)
					}
					this.voiceLength = 1 //时间归位置
					this.isVoice = false
				});
			},
			// 上滑删除录音
			touchmove: function(e) {
				if (this.pageY - e.changedTouches[0].pageY) {
					// 关闭录音
					this.isVoice = false
				}
			},
			// 图片发送
			sendImg: function(e) {
				let count = 9
				if (e == 'ablum') {
					count = 9
				} else {
					count = 1
				}
				uni.chooseImage({
					count: count, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: [e], //从相册还是照相机选择
					success: (res) => { //改成箭头函数
						const filePath = res.tempFilePaths
						for (let i = 0; i < filePath.length; i++) {
							this.send(filePath[i], 1)
						}
					}
				});
			},
			// 获取地址
			getLocation: function() {
				uni.chooseLocation({
					success: (res) => {
						let data = {
							name: res.name,
							address: res.address,
							latitude: res.latitude,
							longitude: res.longitude
						}
						console.log('定位');
						console.log(data);
						// JSON转JSON字符串
						let stringData = JSON.stringify(data)
						this.send(stringData, 3) //位置信息
					}
				});
			},
			// 发送
			send: function(message, type) {
				let data = {
					message: message,
					types: type
				}
				this.$emit('InputMessage', data)
				setTimeout(() => {
					this.message = '' //清空
				}, 0)
			}
		}
	}
</script>

<style lang="scss">
	.box {
		position: fixed;
		bottom: 0;
		width: 100%;

		.submit {
			width: 100%;
			padding-bottom: 10rpx;
			display: flex;
			align-items: center;
			justify-content: space-evenly;
			background-color: $uni-bg-color;

			image {
				width: 60rpx;
				height: 60rpx;
				margin-top: 10rpx;
			}

			.submit-text {
				width: 60%;
				max-height: 160rpx;
				overflow: scroll;
				padding: 20rpx;
				margin-top: 10rpx;
				border-radius: 10rpx;
				background-color: #fff;
			}

			.submit-record {
				width: 60%;
				height: 80rpx;
				margin-top: 10rpx;
				line-height: 80rpx;
				text-align: center;
				border-radius: 10rpx;
				background-color: #fff;
			}
		}

		.emoji {
			width: 100%;
			height: 400rpx;
			background-color: #F5F5F5;

			.emoji-submit {
				display: flex;
				width: 300rpx;
				height: 120rpx;
				padding-top: 24rpx;
				position: fixed;
				bottom: 0;
				right: 0;
				color: #fff;

				.send {
					flex: 1;
					margin: 0 32rpx 0 20rpx;
					width: 120rpx;
					height: 80rpx;
					background-color: $uni-bg-color;
					font-size: 30rpx;
					text-align: center;
					line-height: 80rpx;
					border-radius: 12rpx;
				}

				.remove {
					flex: 1;
					width: 120rpx;
					height: 80rpx;
					margin-right: 24rpx;
					background-color: $uni-bg-color;
					font-size: 30rpx;
					text-align: center;
					line-height: 80rpx;
					border-radius: 12rpx;
				}
			}
		}

		.more {
			width: 100%;
			height: 400rpx;
			background-color: #F5F5F5;
			padding: 4rpx 20rpx;
			box-sizing: border-box;

			.more-list {
				width: 25%;
				text-align: center;
				float: left;
				padding-top: 20rpx;

				image {
					width: 60rpx;
					height: 60rpx;
					padding: 25rpx;
					background-color: #ffffff;
					border-radius: 24rpx;
				}

				.more-list-title {
					font-size: 24rpx;
					color: rgba(39, 40, 50, 0.5);
				}
			}
		}

		.voice-button {
			width: 100%;
			height: 300rpx;
			position: fixed;
			bottom: 150rpx;
			left: 0;
			right: 0;
			margin: auto;
			z-index: 1000;
			background-color: rgba(0, 0, 0, 0.1);
			border-radius: 20rpx;

			.voice-length {
				height: 70rpx;
				width: 500rpx;
				padding: 10rpx;
				position: absolute;
				left: 0;
				right: 0;
				top: 50rpx;
				margin: auto;
				border-radius: 42rpx;
				background-color: rgba(255, 255, 255, 0.6);

				.voice-time {
					text-align: center;
					line-height: 70rpx;
					min-width: 120rpx;
					width: 120rpx;
					border-radius: 42rpx;
					background-color: rgba(147, 112, 219, 0.5);
					left: 0;
					right: 0;
					margin: auto;
				}
			}

			.voice-delete {
				text-align: center;
				margin-top: 100rpx;
				color: #ffffff;
				font-size: 36rpx;
			}
		}
	}
</style>