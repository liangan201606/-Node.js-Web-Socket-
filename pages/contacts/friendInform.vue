<template>
	<view class="box">
		<view class="top-bar">
			<image src="../../static/images/index/goback.png" mode=""  @tap='goBack' class="image"></image>
			<view class="title">好友请求</view>
		</view>
		<view class="main">
			<view class="user" v-for="(item,index) in requester" :key='index'>
				<view class="submit">
					<view class="reject" @tap='rejectFriend(item.id)'>拒绝</view>
					<image :src="item.imgUrl" class="head"></image>
					<view class="argee" @tap='resolveFriend(item.id)'>同意</view>
				</view>
				<view class="content">
					<view class="name">{{item.name}}</view>
					<view class="date">{{changeTime(item.lastTime)}}</view>
				</view>
				<view class="notice">
					<text>留言：</text>
					{{item.message}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import datas from '../../commons/js/data.js'
	import TimeFun from '@/commons/js/time.js'
	export default{
		name:'FriendInform',
		data(){
			return{
				requester:[],
				uid:'',//用户id
				token:'',//token
				msg:''
			}
		},
		onLoad: function(e) {
			this.getStorage()
			this.getFriends()
		},
		methods:{
			// 跳转到上一页面
			goBack:function(){
				// uni.navigateBack({
				// 	delta:1
				// })
				uni.reLaunch({
					url: '../contacts/contact'
				})
			},
			// 时间处理
			changeTime:function(e){
				return TimeFun.dateTime_Two(e)
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
			getFriends:function(){
				uni.request({
					url: this.serverUrl + '/home/getFriend',
					data: {
						uid: this.uid,
						state:1,//好友请求的接收方
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						console.log(data);
						if (code == 200) {
							let res = data.data.result
							for(let i=0;i<res.length;i++){
								res[i].imgUrl = this.serverUrl + res[i].imgUrl
								this.getLastMsg(res,i)
							}
							this.requester = res
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
			// 获取最新一条的消息
			getLastMsg:function(arr,i){
				uni.request({
					url: this.serverUrl + '/home/getLastMsg',
					data: {
						uid: this.uid,
						fid:arr[i].id,//好友请求的接收方
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							let res = data.data.result
							let e = arr[i]
							e.message = res.message
							arr.splice(i,1,e)
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
			// 拒绝添加好友
			rejectFriend:function(fid){
				uni.request({
					url: this.serverUrl + '/friend/delete',
					data: {
						uid: this.uid,
						fid:fid,//好友请求的接收方
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							console.log('拒绝');
							// 清除前端
							for(let i=0;i<this.requester.length;i++){
								if(this.requester[i].id == fid){
									this.requester.splice(i,1)
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
			// 同意添加好友
			resolveFriend:function(fid){
				uni.request({
					url: this.serverUrl + '/friend/stateUpdate',
					data: {
						uid: this.uid,
						fid:fid,//好友请求的接收方
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let code = data.data.code
						if (code == 200) {
							console.log('同意');
							// 清除前端
							for(let i=0;i<this.requester.length;i++){
								if(this.requester[i].id == fid){
									this.requester.splice(i,1)
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
			}
		}
	}
</script>

<style lang='scss'>
	.box{
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
				width: 200rpx;
				height: 50rpx;
				font-size: 40rpx;
				color: #fff;
			}
		}
		.main{
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			padding-bottom: 50rpx;
			.user{
				position: relative;
				display: flex;
				flex-direction: column;
				width: 80%;
				height: 320rpx;
				border-radius: 20rpx;
				margin-top: 100rpx;
				padding:30rpx;
				box-shadow:10rpx 10rpx 10rpx 10rpx lightgray;
				.submit{
					display: flex;
					justify-content: space-between;
					.head{
						position: absolute;
						top:-75rpx;
						left: 0;
						right: 0;
						margin: auto;
						width: 150rpx;
						height: 150rpx;
						border-radius:50% ;
						box-shadow:5rpx 5rpx 5rpx 5rpx lightgray;
					}
					.reject,.argee{
						width: 150rpx;
						height: 60rpx;
						line-height: 60rpx;
						text-align: center;
						border-radius: 30rpx;
						background-color: rgba(255,99,71,0.2);
						color: orangered;
					}
					.argee{
						color: black;
						background-color: rgba(147,112,219,0.5);
					}
				}
				.content{
					display: flex;
					flex-direction: column;
					align-items: center;
					margin-top: 20rpx;
					margin-bottom: 20rpx;
					.name{
						width: 90%;
						height: 50rpx;
						text-align: center;
						font-size: 36rpx;
						font-weight: 600;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
					}
					.date{
						margin-top: 10rpx;
						font-size: 26rpx;
						color: darkgrey;
					}
				}
				.notice{
					width: 90%;
					height: 50rpx;
					padding: 10rpx;
					margin: auto;
					border-radius: 20rpx;
					background-color:rgba(123, 123, 123, 0.1) ;
					font-size:30rpx ;
					line-height: 50rpx;
					color: gray;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
				}
			}
		}
	}
</style>