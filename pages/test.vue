<template>
	<view>
		<view class="test" @tap='upload'>
			上传图片
		</view>
		<image :src="item" v-for="(item,index) in img" :key="index"></image>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				id:'liangan_',
				img:[]
			}
		},
		methods:{
			upload:function(){
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album','camera'], //从相册,拍照选择
					maxDuration: 30,
					camera: 'back',
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						console.log(this.id);
						console.log(new Date().getTime());
						for(let i=0; i<tempFilePaths.length; i++){
							console.log(i);
							const uploadTask = uni.uploadFile({
								url: this.serverUrl+'files/upload',
								filePath: tempFilePaths[i],
								name: 'file',
				 				formData: {
									url:'user',
									// 唯一命名 时间戳+id+第几张图片
									name: new Date().getTime()+this.id + i,
								},
								success: (uploadFileRes) => {
									let path = this.serverUrl + uploadFileRes.data
									this.img.push(path)
									console.log(uploadFileRes.data);
								}
							});				
							uploadTask.onProgressUpdate((res) => {
								console.log('上传进度' + res.progress);
								console.log('已经上传的数据长度' + res.totalBytesSent);
								console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
							});
						}
					}
				});

			}
		}
	}
</script>

<style lang="scss">
	.test{
		padding-top: 40rpx;
		text-align:center;
	}
</style>