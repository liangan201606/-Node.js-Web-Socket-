<template>
	<view class="content">
		<Header></Header>
		<image src="../../static/images/index/背景图.jpeg" mode="" class="background"></image>
		<!-- <view class="top-bar">
			<image src="../../static/images/index/返回箭头 详情页 (1).png" mode=""  @tap='goBack' class="image"></image>
			<image src="../../static/images/index/更多.png" mode="" class="more"></image>
		</view> -->
		<view class="main">
			<view class="user">
				<image src="../../static/images/index/默认头像.jpeg" mode="" class="imgUrl"></image>
				<view class="detail">
					<view class="name">
						两岸是个小仙女
					</view>
					<view class="nickname">
						昵称：安安
					</view>
				</view>
			</view>
			<view class="other">
				<view class="sex">
					<image src="../../static/images/index/性别女 .png" mode="" class="imageSex"></image>
					<!-- <image src="../../static/images/index/性别男.png" mode="" class="imageSex"></image> -->
					女
				</view> 
				<view class="birth">
					1月1日
				</view>
				<view class="location">
					技术部门
				</view>
			</view>
			<view class="sign">
				<image src="../../static/images/index/笔.png" mode="" class="imageSign"></image>
				O(∩_∩)O哈哈~
			</view>
		</view>
	</view>
</template>

<script>
	import Header from '../../components/header.vue'
	export default {
			 // 注册组件库
			 components: {
				 Header
			 },
			 methods: {
				 // 跳转到主页面
				 goBack:function(){
				 	uni.navigateBack({
				 		delta:1
				 	})
				 },
			 }
	}
</script>

<style lang='scss'>
	.content{
		height: 100%;
		.background{
			width: 100%;
			height: 100%;
			position: fixed;
			top:0;
			left:0;
			z-index: -1;
		}
		.top-bar{
			display: flex;
			width: 100%;
			.image{
				margin-top: 20rpx;
				margin-left: 20rpx;
				width: 60rpx;
				height: 60rpx;
			}
			.more{
				margin-left: auto;
				margin-top: 20rpx;
				margin-right: 20rpx;
				width: 80rpx;
				height: 80rpx;
			}
		}
		.main{
			position: fixed;
			bottom: 5%;
			width: 100%;
			height: 50%;
			border-radius:40rpx 40rpx 0 0 ;
			background-color:rgba(255, 255, 255,0.5);
			.user{
				padding-top: 20rpx;
				padding-left: 30rpx;
				display: flex;
				align-items: center;
				.imgUrl{
					width: 150rpx;
					height: 150rpx;
					border-radius: 50%;
				}
				.detail{
					margin-left: 20rpx;
					.name{
						font-size: 36rpx;
						font-weight: 600;
					}
					.nickname{
						margin-top: 10rpx;
						color:darkgray;					
					}
				}
			}
			.other{
				display: flex;
				margin-top: 30rpx;
				padding-left: 20rpx;
				.sex{
					display: flex;
					.imageSex{
						width: 50rpx;
						height: 50rpx;
						margin-right: 10rpx;
					}
				}
				.birth{
					margin-left: 30rpx;
				}
				.location{
					margin-left: 30rpx;
				}
			}
			.sign{
				margin-top: 40rpx;
				margin-left: 20rpx;
				margin-right: 20rpx;
				padding-top: 10rpx;
				border: 1rpx solid rgba(147,112,219,0.6);
				height:30%;
				font-size: 34rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 4;
				.imageSign{
					float: left;
					width: 50rpx;
					height: 50rpx;
					margin-right: 20rpx;
				}
			}
		}
	}
</style>