export default {
	debounce(fn, t) {
		let delay = t || 500
		let timer;
		return function() {
			let args = arguments
			if (timer) {
				clearTimeout(timer)
			}
			timer = setTimeout(() => {
				timer=null
				fn.apply(this, args)
			}, delay)
		}
	},
	//拼接数据
	ArraySort:function(arr,obj,tip){
		var s;
		if(tip == 0 ){
			// 降序排序
			for(let i=1 ;i<arr.length;i++){
				for(let j=i;j>0;j--){
					if(arr[j][obj]>arr[j-1][obj]){
						s=arr[j]
						arr[j] = arr[j-1]
						arr[j-1] = s
					}
				}
			}
			return arr
		}else if(tip == 1){
			// 升序排列
			for(let i=1 ;i<arr.length;i++){
				for(let j=i;j>0;j--){
					if(arr[j][obj]<arr[j-1][obj]){
						s=arr[j]
						arr[j] = arr[j-1]
						arr[j-1] = s
					}
				}
			}
			return arr
		}
	}
}