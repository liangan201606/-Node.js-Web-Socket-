<!-- 头部页面 -->
<template>
	<view class="content">s
		<view class="top-bar">
			<navigator :url="'../user/userpage?id='+uid">
				<image :src="imgUrl" mode="" class="top-bar-left"></image>
			</navigator>
			<view class="top-bar-center">
				<p class="nickname">{{name}}</p>
				<p class="status">在线</p>
			</view>
			<view class="top-bar-right" @tap='toGroup'>
				<image src="../static/images/index/add.png" class="image-right"></image>
			</view>
		</view>
		<view class="search" @tap='toSearch'>
			<view class="selfStyle ">
				<image src="../static/images/index/search.png" class="image-search"></image>
				<view class="title-search"> 搜索</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'Header',
		data() {
			return {
				uid: '', //用户id
				imgUrl: '', //用户头像
				token: '', //token
				name: '' //用户名称
			}
		},
		mounted() {},
		created() {
			this.getStorage()
		},
		methods: {
			// 跳转到搜索页面
			toSearch: function() {
				uni.navigateTo({
					url: '../search/search'
				});
			},
			// 跳转到建群页面
			toGroup: function() {
				uni.navigateTo({
					url: '../group/group'
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
						this.$forceUpdate()
					} else {
						// 如果没有用户缓存跳转登录页面
						uni.navigateTo({
							url:'../login/login'
						})
					}
				} catch (e) {}
			}
		}
	}
</script>

<style lang="scss">
	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		// padding-top: 60rpx;
	}

	.top-bar {
		/* 固定头部位置 */
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
		height: 120rpx;
		width: 100%;
		background-color: $uni-bg-color;
		padding-left: $uni-spacing-row-sm ;
		padding-right: $uni-spacing-row-sm ;

		// padding-top: 50rpx;
		.top-bar-left {
			margin-top: 10rpx;
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
			border-radius: 10rpx;
			border-radius: 20%;
		}

		.top-bar-center {
			margin-top: 10rpx;

			.nickname {
				font-size: 30rpx;
				color: $uni-text-color-inverse;
				font-weight: 900rpx;
			}

			.status {
				padding-top: 5rpx;
				padding-left: 20rpx;
				font-size: 12rpx;
				color: $uni-text-color-inverse;
			}
		}

		.top-bar-right {
			margin-left: auto;
			margin-right: 20rpx;
			margin-top: 20rpx;

			.image-right {
				width: 60rpx;
				height: 60rpx;
			}
		}
	}

	.search {
		/* 固定头部位置 */
		position: fixed;
		// top:150rpx;
		top: 120rpx;
		left: 0;
		height: 80rpx;
		// height: var(--status-bar-height);
		width: 100%;
		padding-top: 10rpx;
		background-color: #ffffff;
		border: 1rpx solid #ffffff;

		.selfStyle {
			display: flex;
			height: 50rpx;
			margin-left: 10rpx;
			margin-right: 10rpx;
			padding-top: 10rpx;
			padding-left: 40%;
			background-color: $uni-bg-color-grey;
			border: 1rpx solid $uni-bg-color-grey;
			border-radius: 30rpx;

			.title-search {
				margin-left: 10rpx;
			}

			.image-search {
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
</style>