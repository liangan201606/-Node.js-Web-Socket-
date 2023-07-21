<script>
	// 计算userSig
	import TIM from 'tim-wx-sdk';// 自行 npm install tim-wx-sdk 进行安装（安装TIM 是为了之后发起群聊语音/视频）
	import {
		genTestUserSig
	} from './uilts/GenerateTestUserSig.js';
	// import TIMUploadPlugin from 'tim-upload-plugin';
	// 原生插件引入提供如下接口：1V1音视频，群聊音视频。
	const TUICallKit = uni.requireNativePlugin('TencentCloud-TUICallKit');
	// 监听通话的状态，例如：异常、通话开始、结束等。
	const TUICallingEvent = uni.requireNativePlugin('globalEvent');
	// 目前仅提供如下接口：结束通话，设置用户视频画面的渲染模式
	const TUICallEngine = uni.requireNativePlugin('TencentCloud-TUICallKit-TUICallEngine');
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 将原生插件挂载到 uni 上
			uni.$TUICallKit = TUICallKit;
			uni.$TUICallingEvent = TUICallingEvent;
			uni.$TUICallEngine = TUICallEngine;

			// 群聊：语音/视频，需要用到TIM
			uni.$TUIKit = TIM.create({
				SDKAppID: genTestUserSig('').sdkAppID
			});
			uni.$TIM = TIM;
			// IM监听
			uni.$TUIKit.on(TIM.EVENT.ERROR, function(event) {
				console.log(event, '收到 SDK 发生错误通知')
			});
			uni.$TUIKit.on(TIM.EVENT.SDK_NOT_READY, function(event) {
				console.log(event, '收到 SDK 进入 not ready 状态通知')
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 全局引入icon图标 */
	@import '/static/iconfont.css'
	// .uni-tabbar {
	// 		.uni-tabbar__item:nth-last-child(3) {
	// 			.uni-tabbar__bd {
	// 			/*.uni-tabbar__icon 去掉原图标大小，强制为自适应宽高*/
	// 				.uni-tabbar__icon {
	// 					width: auto !important;
	// 					height: auto !important;
	// 				}
	// 				/*图标大小 !important 强制覆盖*/
	// 				img {
	// 					height: 70rpx !important;
	// 					width: 70rpx !important;
	// 				}
	// 			}
	// 		}
	// 	}
</style>