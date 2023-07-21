<template>
	<view class="box">
		<!-- 头部 -->
		<view class="top-bar">
			<image src="../../static/images/index/goback.png" @tap='goBack' class="image"></image>
			<view class="title">{{fname}}</view>
			<image :src="fimgUrl" class="group-head" v-if='type==1' @tap='toGroupDetail'></image>
			<view class="group-head" v-if='type==0'></view>
		</view>
		<!-- 可滚动的区域 -->
		<scroll-view scroll-y="true" scroll-with-animation="false" class="message" :scroll-into-view="srcollToView"
			@scrolltoupper='nextPage'>
			<view class="message-main" :style="{paddingBottom:inputHeight+'px'}">
				<view class="loading" v-if='!isLoading'>
					<image src="../../static/images/index/jiazai.png" class="loading-image" :animation="animationData">
					</image>
				</view>
				<view class="message-item" v-for="(item,index) in Message" :key='index' :id="'msg'+item.id ">
					<view class="message-time" v-if="item.time!= '' ">{{changeTime(item.time)}}</view>
					<!-- 发送方 -->
					<view class="message-content message-send" v-if="item.fromId != uid">
						<image :src="item.imgUrl" class="image" @tap='touser(item.fromId)'></image>
						<view class="message-news" v-if="item.types == 0">
							<view class="message-text">
								{{item.message}}
							</view>
						</view>
						<view class="message-news" v-if="item.types == 1">
							<image :src="item.message" mode='widthFix' class="message-image"
								@tap='previewImg(item.message)'></image>
						</view>
						<view class="message-news" v-if="item.types == 2" :style="{width:item.message.time*4+'px'}"
							@tap='playVoice(item.message.voice)'>
							<!-- 音频 -->
							<view class="message-text voice">
								{{item.message.time}}"
								<image src="../../static/images/index/voiceleft.png" class="voice-image"></image>
							</view>
						</view>
						<view class="message-news" v-if="item.types == 3">
							<!-- 位置 -->
							<view class="message-text location" @tap='openLocation(item.message)'>
								<view class="location-name">{{item.message.name}}</view>
								<view class="location-address">{{item.message.address}}</view>
								<image src="../../static/images/index/loaction.png" mode="aspectFit" class="map"></image>
								<!-- <map :latitude="item.message.latitude" :longitude="item.message.longitude" :markers="covers(item.message)"></map> -->
							</view>
						</view>
					</view>
					<!-- 接受方 -->
					<view class="message-content message-receive" v-if="item.fromId == uid">
						<image :src="item.imgUrl" class="image"></image>
						<view class="message-news" v-if="item.types == 0">
							<view class="message-text">
								{{item.message}}
							</view>
						</view>
						<view class="message-news" v-if="item.types == 1">
							<image :src="item.message" mode='widthFix' class="message-image"
								@tap='previewImg(item.message)'></image>
						</view>
						<!-- 语音 -->
						<view class="message-news" v-if="item.types == 2" @tap='playVoice(item.message.voice)'>
							<!-- 音频 -->
							<view class="message-text voice">
								{{item.message.time}}"
								<image src="../../static/images/index/voiceright.png" class="voice-image"></image>
							</view>
						</view>
						<view class="message-news" v-if="item.types == 3">
							<!-- 位置 -->
							<view class="message-text location" @tap='openLocation(item.message)'>
								<view class="location-name">{{item.message.name}}</view>
								<view class="location-address">{{item.message.address}}</view>
								<image src="../../static/images/index/loaction.png" mode='aspectFit' class="map"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="submit"></view>
			<view class="submit"></view>
		</scroll-view>
		<!-- 底部 -->
		<Submit @InputMessage="InputMessage" @Height='Height' :fid='fid' :fname='fname' :fimgUrl='fimgUrl' :type='type'></Submit>
	</view>
</template>

<script>
	import datas from '../../commons/js/data.js'
	import TimeFun from '@/commons/js/time.js'
	import Submit from '@/components/submit.vue'
	export default {
		name: 'Message',
		components: {
			Submit
		},
		data() {
			return {
				Message: [], //存放聊天消息
				imgMsg: [], //存放图片信息
				oldTime: 0,
				voiceTime:0,//聊天时间
				srcollToView: '',
				inputHeight: '50', //表情弹出框的高度
				animationData: {}, //控制动画
				nowPage: 0, //页码
				PageSize: 10, //一页的条数
				loading: '', //定时器
				isLoading: true, //是否显示加载
				type: '', //控制群显示 0 为好友 1为群
				fid: '', //好友id
				fname: '', //好友名称
				fimgUrl: '', //好友头像
				uid: '', //用户id
				uname: '', //用户名称
				uimgUrl: '', //用户头像
				token: '', //token
			};
		},
		onLoad: function(e) {
			this.fid = e.id
			this.fname = e.name
			this.fimgUrl = e.imgUrl
			this.type = e.type
			this.getStorage()
			this.getMessage()
			this.getGroupMsg()
			this.receiveSocketMsg()
			this.GroupSocketMsg()
			
		},
		methods: {
			// 跳转到上一页面
			goBack: function() {
				// 告知离开当前聊天页面
				this.socket.emit('leaveChat', this.uid, this.fid)
				uni.navigateBack({
					delta: 1
				})
			},
			toGroupDetail: function() {
				uni.navigateTo({
					url: '../groupDatail/groupDatail?gid=' + this.fid + '&gimg=' + this.fimgUrl
				})
			},
			touser: function(id) {
				uni.navigateTo({
					url: '../user/userpage?id=' + id
				})
			},
			// 获取缓存数据
			getStorage: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id
						this.uname = value.name
						this.uimgUrl = this.serverUrl + value.imgUrl
						this.token = value.token
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
				return TimeFun.dateTime_Msg(e)
			},
			// 滚动顶部加载下一页
			nextPage: function() {
				console.log(this.nowPage);
				if (this.nowPage > 0) {
					this.isLoading = false
					var animation = uni.createAnimation({
						duration: 1000,
						timingFunction: 'step-start',
					})
					this.animation = animation
					let i = 1
					this.loading = setInterval(function() {
						animation.rotate(i * 30).step()
						this.animationData = animation.export()
						i++
						// 获取聊天数据
						if (i>40) {
							console.log('触发');
							this.getMessage()
							this.getGroupMsg()
						}
					}.bind(this), 100)
				}
			},
			// 获取聊天数据
			getMessage: function() {
				if (this.type == 0) {
					uni.request({
						url: this.serverUrl + '/chat/getMsg',
						data: {
							uid: this.uid,
							fid: this.fid,
							nowPage: this.nowPage,
							pageSize: this.PageSize,
							token: this.token
						},
						method: 'POST',
						success: (data) => {
							let code = data.data.code
							if (code == 200) {
								let message = data.data.result
								// 判断nowPage
								if (message.length == 10) {
									this.nowPage++
								}else{
									this.nowPage = -1
									console.log('触发结束'+this.nowPage);
								}
								message.reverse() //数组翻转
								let oldTime = message[0].time
								message[0].imgUrl = this.serverUrl + message[0].imgUrl
								let imgarr = []
								if (message.length > 0) {
									for (var i = 1; i < message.length; i++) {
										message[i].imgUrl = this.serverUrl + message[i].imgUrl
										// 时间间隔
										if (i < message.length - 1) {
											// 不对最后一条消息的时间做处理
											let time = TimeFun.spaceTime(oldTime, message[i].time)
											if (time) {
												oldTime = time
											}
											message[i].time = time
										}
										// 获取最大时间
										if (this.nowPage == 0) {
											if (message[i].time > this.oldTime) {
												this.oldTime = message[i].time
											}

										}
										if (message[i].types == 1) {
											//补充图片地址
											message[i].message = this.serverUrl + message[i]
												.message
											// 将图片消息放入数组
											imgarr.push(message[i].message)
										}
										// 字符串还原
										if (message[i].types == 3) {
											//位置还原
											message[i].message = JSON.parse(message[i].message)
										}
										if (message[i].types == 2) {
											// 音频还原
											message[i].message = JSON.parse(message[i].message)
										}
									}
									this.Message = message.concat(this.Message)
									this.imgMsg = imgarr.concat(this.imgMsg)
									// console.log(message);
									// 定位到最后一条
									this.$nextTick(function() {
										this.srcollToView = 'msg' + this.Message[message.length -
											1].id
									})
									clearInterval(this.loading)
									this.isLoading = true //关闭loading
								}
							}
							if (code == 500) {
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
			// 获取群聊天数据
			getGroupMsg: function() {
				if (this.type == 1) {
					uni.request({
						url: this.serverUrl + '/group/getGroupMsg',
						data: {
							gid: this.fid,
							nowPage: this.nowPage,
							pageSize: this.PageSize,
							token: this.token
						},
						method: 'POST',
						success: (data) => {
							let code = data.data.code
							// console.log(code);
							if (code == 200) {
								let message = data.data.result
								message.reverse() //数组翻转
								let oldTime = message[0].time
								message[0].imgUrl = this.serverUrl + message[0].imgUrl
								let imgarr = []
								if (message.length > 0) {
									for (var i = 1; i < message.length; i++) {
										message[i].imgUrl = this.serverUrl + message[i].imgUrl
										// 时间间隔
										if (i < message.length - 1) {
											// 不对最后一条消息的时间做处理
											let time = TimeFun.spaceTime(oldTime, message[i].time)
											if (time) {
												oldTime = time
											}
											message[i].time = time
										}
										// 获取最大时间
										if (this.nowPage == 0) {
											if (message[i].time > this.oldTime) {
												this.oldTime = message[i].time
											}

										}
										if (message[i].types == 1) {
											//补充图片地址
											message[i].message = this.serverUrl + message[i]
												.message
											// 将图片消息放入数组
											imgarr.push(message[i].message)
										}
										// 字符串还原
										if (message[i].types == 3) {
											//位置还原
											message[i].message = JSON.parse(message[i].message)
										}
										if (message[i].types == 2) {
											// 语音还原
											message[i].message = JSON.parse(message[i].message)
										}
									}
									this.Message = message.concat(this.Message)
									this.imgMsg = imgarr.concat(this.imgMsg)
									// 判断nowPage
									if (message.length == 10) {
										this.nowPage++
									} else {
										// 数据获取完毕
										this.nowPage = -1
									}
									// 定位到最后一条
									this.$nextTick(function() {
										this.srcollToView = 'msg' + this.Message[message.length -
											1].id
									})
									clearInterval(this.loading)
									this.isLoading = true //关闭loading
								}
							}
							if (code == 500) {
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
			// 预览图片
			previewImg: function(e) {
				console.log(e);
				uni.previewImage({
					current: e, //从那张图片开始
					urls: this.imgMsg,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) +
								'张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				})
			},
			// 音频播放
			playVoice: function(e) {
				const innerAudioContext = uni.createInnerAudioContext();
				// innerAudioContext.autoplay = true;
				innerAudioContext.src = e
				innerAudioContext.play();
			},
			covers: function(e) {
				let map = [{
					latitude: e.latitude,
					longitude: e.longitude,
					iconPath: '../../static/images/index/定位(2).png'
				}]
				return (map)
			},
			openLocation: function(e) {
				uni.openLocation({
					name: e.name,
					latitude: e.latitude,
					longitude: e.longitude,
					address: e.address, //返回可以用于uni.openLocation的经纬度
					success: function() {
						console.log('success');

					}
				});
			},
			// 接受输入框的内容
			receiveMsg: function(e, id, imgUrl, tip) {
				// 数据提交给后端
				if (e.types == 0 || e.types == 3) {
					this.sendSocket(e)
				} else if (e.types == 1) {
					this.imgMsg.push(e.message)
					// 创建当前日期文件
					let url = TimeFun.dateTime_Thour(new Date())
					const uploadTask = uni.uploadFile({
						url: this.serverUrl + '/files/upload',
						filePath: e.message,
						name: 'file',
						formData: {
							url: url,
							// 唯一命名 时间戳+id+第几张图片
							name: new Date().getTime() + this.uid,
						},
						success: (uploadFileRes) => {
							let data = {
								message: uploadFileRes.data,
								types: 1
							}
							this.sendSocket(data)
						}
					})
				}
				if (e.types == 2) {
					// 音频
					// 创建当前日期文件
					let url = TimeFun.dateTime_Thour(new Date())
					const uploadTask = uni.uploadFile({
						url: this.serverUrl + '/files/upload',
						filePath: e.message.voice,
						name: 'file',
						formData: {
							url: url,
							// 唯一命名 时间戳+id+第几张图片Math.cell(Math.random()*10)
							name: new Date().getTime() + this.uid,
						},
						success: (uploadFileRes) => {
							let data = {
								message :{
									voice: uploadFileRes.data,
									time:e.message.time
								},
								types: e.types
							}
							let message = JSON.stringify(data.message)
							let data2 = {message,types:2}
							this.sendSocket(data2)
						}
					})
				}
				// tip =0表示自己发出。tip=1
				let len = this.Message.length
				//聊天消息的时间
				let nowTime = new Date()
				// 时间间隔
				let time = TimeFun.spaceTime(this.oldTime, nowTime)
				if (time) {
					this.oldTime = time
				}
				nowTime = time
				// JSON 字符串还原
				if (e.types == 3) {
					e.message = JSON.parse(e.message)
					console.log('还原地图'+e.message);
				}
				let data = {
					fromId: id, //发送者id
					imgUrl: imgUrl,
					time: nowTime,
					message: e.message,
					types: e.types,
					id: len,
				}
				// 渲染页面
				this.Message.push(data)
				console.log(this.Message);
				// 定位到最后一条
				this.$nextTick(function() {
					this.srcollToView = 'msg' + len
				})
			},
			// 聊天数据发送给后端
			sendSocket: function(e) {
				if (this.type == 0) {
					// 1对1
					this.socket.emit('msg', e, this.uid, this.fid)
				} else {
					// 群消息
					this.socket.emit('groupMsg', e, this.uid, this.fid, this.uname, this.uimgUrl)
				}
			},
			
			// socket聊天数据的接收
			receiveSocketMsg: function() {
				this.socket.on('msgs', (msg, fromId, tip) => {
					if (fromId == this.fid && tip == 0) {
						//聊天消息的时间
						let len = this.Message.length
						let nowTime = new Date()
						// 时间间隔
						let time = TimeFun.spaceTime(this.oldTime, nowTime)
						if (time) {
							this.oldTime = time
						}
						nowTime = time
						if (msg.types == 1) {
							msg.message = this.serverUrl + msg.message
						}
						if(msg.types == 2){
							// msg.message = JSON.parse(msg.message)
							msg.message.voice = this.serverUrl + msg.message.voice
						}
						let data = {
							fromId: fromId, //发送者id
							imgUrl: this.fimgUrl,
							time: nowTime,
							message: msg.message,
							types: msg.types,
							id: len,
						}
						this.Message.push(data)
						if (msg.types == 1) {
							this.imgMsg.push(msg.message)
						}
						// 定位到最后一条
						this.$nextTick(function() {
							this.srcollToView = 'msg' + len
						})
					}
				})
			},
			GroupSocketMsg: function() {
				this.socket.on('groupMsg', (msg, fromId, gid, name, imgUrl, tip) => {
					if (gid == this.fid && tip == 0) {
						//聊天消息的时间
						let len = this.Message.length
						let nowTime = new Date()
						// 时间间隔
						let time = TimeFun.spaceTime(this.oldTime, nowTime)
						if (time) {
							this.oldTime = time
						}
						nowTime = time
						if (msg.types == 1 ) {
							msg.message = this.serverUrl + msg.message
						}
						if(msg.types == 2){
							// msg.message = JSON.parse(msg.message)
							msg.message.voice = this.serverUrl + msg.message.voice
						}
						let data = {
							fromId: gid, //发送者id
							imgUrl: imgUrl,
							time: nowTime,
							message: msg.message,
							types: msg.types,
							id: len,
						}
						this.Message.push(data)
						console.log(this.Message);
						if (msg.types == 1) {
							this.imgMsg.push(msg.message)
						}
						// 定位到最后一条
						this.$nextTick(function() {
							this.srcollToView = 'msg' + len
						})
					}
				})
			},
			// 接收输入框的内容
			InputMessage: function(e) {
				this.receiveMsg(e, this.uid, this.uimgUrl, 0)
			},
			// 输入框高度
			Height: function(e) {
				this.inputHeight = e
				this.goButtom()
			},
			// 滚动到底部
			goButtom: function() {
				this.srcollToView = '',
					this.$nextTick(function() {
						let len = this.Message.length - 1
						this.srcollToView = 'msg' + this.Message[len].id
					})
			}
		}
	}
</script>

<style lang="scss">
	.box {
		width: 100%;

		.top-bar {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 1002;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: $uni-bg-color;
			width: 100%;
			height: 100rpx;

			// padding-top: 50rpx;
			.image {
				margin-left: 20rpx;
				width: 60rpx;
				height: 60rpx;
			}

			.title {
				font-size: 40rpx;
				color: #fff;
			}

			.group-head {
				margin-right: 20rpx;
				width: 80rpx;
				height: 80rpx;
				border-radius: 20rpx;
			}
		}

		.message {
			width: 100%;
			height: 100vh;
			padding-top: 100rpx;
			background-color: rgba(123, 123, 123, 0.1);

			.submit {
				height: 100rpx;
				width: 100%;
			}

			.loading {
				text-align: center;

				.loading-image {
					width: 60rpx;
					height: 60rpx
				}
			}

			.displaynone {
				display: none;
			}

			.message-main {
				padding-left: 20rpx;
				padding-right: 20rpx;
				padding-top: 30rpx;
				display: flex;
				flex-direction: column;

				.message-item {
					display: flex;
					flex-direction: column;
					padding-top: 20rpx;

					.message-time {
						margin: auto;
						font-size: 24rpx;
						line-height: 34rpx;
						color: darkgray;
					}

					.message-content {
						display: flex;
						width: 100%;
						margin-top: 20rpx;

						.image {
							width: 80rpx;
							height: 80rpx;
							border: 1rpx solid gainsboro;
						}

						.message-text {
							max-width: 400rpx;
							color: black;
							padding: 14rpx 24rpx;
							line-height: 44rpx;
							margin-top: 10rpx;
						}

						.voice {
							// margin-right: 50rpx;
							min-width: 80rpx;
							max-width: 400rpx;
						}

						.voice-image {
							width: 28rpx;
							height: 36rpx;
						}

						.message-image {
							max-width: 400rpx;
							margin-top: 10rpx;
						}

						.location {
							background-color: #ffffff;
							width: 400rpx;
							height: 280rpx;

							.location-name {
								font-size: 36rpx;
								line-height: 44rpx;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 1;
								overflow: hidden;
							}

							.location-address {
								font-size: 26rpx;
								color: darkgrey;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 1;
								overflow: hidden;
							}

							.map {
								width: 400rpx;
								height: 190rpx;
								// background-color: olive;
							}
						}
					}

					.message-send {
						flex-direction: row;

						.message-text {
							margin-left: 16rpx;
							background-color: white;
							border-radius: 0rpx 20rpx 20rpx 20rpx;
						}

						.voice {
							text-align: right;
						}

						.voice-image {
							float: left;
							padding-top: 4rpx;
						}

						.message-image {
							margin-left: 16rpx;
							border-radius: 0rpx 20rpx 20rpx 20rpx;
						}
					}

					.message-receive {
						flex-direction: row-reverse;

						.message-text {
							margin-right: 16rpx;
							background-color: rgba(147, 112, 219, 0.5);
							border-radius: 20rpx 0rpx 20rpx 20rpx;
						}

						.voice {
							text-align: left;
						}

						.voice-image {
							float: right;
							padding-top: 4rpx;
						}

						.location {
							// text-align: left;
						}

						.message-image {
							margin-right: 16rpx;
							border-radius: 20rpx 0rpx 20rpx 20rpx;
						}
					}
				}
			}
		}
	}
</style>