<template>
	<!-- :style="{height:height+'px'}" -->
	<view class="emoji">
		<view v-for="(line,i) in emoji" :key='i' class="emoji-line">
			<view class="emoji-line-item" v-for="(item,index) in line" :key="index" @tap="clickEmoji(item)">
				{{item}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// height:{
				// 	type:Number,
				// 	default:200
				// },
				emoji:[
					['😀','😁','😂','🤣','😃','😄','😅','😆'],
					['😉','😊','😋','😎','😍','😘','😗','😙'],
					['😚','🤗','🤔','😐','😑','😶','🙄','😏'],
					['😣','😥','😮','🤐','😯','😪','😫','😴'],
					['😌','😛','😜','😝','🤤','😒','😓','😔'],
					['😕','🙃','🤑','😲','🙁','😖','😞','😟'],
					['😤','😢','😭','😦','😧','😨','😩','😬'],
					['😰','😱','😳','😵','😡','😠','😷','🤒'],
					['🤢','🤕','🤧','😇','🤠','🤡','🤥','🤓'],
					['😈','👺','💀','👻','👽','💩','👂🏻','👀'],
					['👅','👄','💋','👓','🕶','👗','👙','💄'],
					['👃🏻','👣','👫','👬','👭','🌂','👑','🎓'],
					['🙈','🙉','🙊','💥','👶🏻','👦🏻','👧🏻','👨🏻'],
					['👩🏻','👴🏻','👵🏻','👨🏻‍⚕️','👩🏻‍⚕️','👨🏻‍🎓','👨🏻‍🏫','👩🏻‍🏫'],
					['👨🏻‍⚖️','👩🏼‍⚖️','👨🏻‍🔧','👩‍🔧','👨🏻‍🏭','👩🏼‍🏭','👨🏻‍💼','👩🏻‍💼'],
					['💘','💔','💓','💪','👈','👉','☝','👆'],
					['🖕','👇','✌','🤘','🖐','👌','👍','👎'],
					['✊','👊','🤛','🤜','👋','✍','👏','👐'],
					['🤝','💅','🙏','🐮','🐷','🐴','🐶','🚣']
				]
			};
		},
		methods:{
			clickEmoji:function(e){
				this.$emit('SendEmoji',e)
			}
		}
	}
</script>

<style lang="less">
	.emoji{
		width: 100%;
		// height: 100rpx;
		padding: 16rpx 10rpx 120rpx 10rpx;
		box-sizing: border-box;
		overflow: hidden;
		overflow-y: auto;
		// background-color: antiquewhite;
		.emoji-line{
			display: flex;
			// height: 100rpx;
			// background-color: antiquewhite;
			.emoji-line-item{
				flex:1;
				text-align: center;
				font-size: 40rpx;
				line-height: 70rpx;
			}
		}
	}
</style>
