export default{
	// 时间格式函数
	dateTime(d){
		// 消息接收的时间
		var date = new Date(d);
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hour = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		var days = date.getDay();
		var week;
		// 现在的时间
		var ndate = new Date();
		var nyear = ndate.getFullYear();
		var nmonth = ndate.getMonth() + 1;
		var nday = ndate.getDate();
		var nhour = ndate.getHours();
		var nminutes = ndate.getMinutes();
		var nseconds = ndate.getSeconds();
		// 如果没有超过24小时
		if(year === nyear && month === nmonth && nday === day ){
			hour = (hour<10)? '0'+ hour : hour;
			minutes = (minutes<10)? '0'+ minutes : minutes;
			return hour+':'+ minutes
		}
		// 昨天
		if(year === nyear && month === nmonth && nday === day+1){
			hour = (hour<10)? '0'+ hour : hour;
			minutes = (minutes<10)? '0'+ minutes : minutes;
			return '昨天'+hour+':'+ minutes
		}
		// 前天
		if(year === nyear && month === nmonth && nday === day+2){
			hour = (hour<10)? '0'+ hour : hour;
			minutes = (minutes<10)? '0'+ minutes : minutes;
			return '前天'+hour+':'+ minutes
		}
		else{
			month = (month<10)? '0'+ month : month;
			day = (day<10)? '0'+ day : day;
			return year+'/'+month+'/'+day
		}
	},
	// 细节时间处理
	dateTime_Two(e){
		var date = new Date(e);
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hour = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		// 处理时间
		if(month<10){
			// 月
			month = '0'+month
		}
		if(hour<10){
			// 小时
			hour = '0'+hour
		}
		if(day<10){
			// 天
			day = '0'+day
		}
		if(minutes<10){
			// 分
			minutes = '0'+minutes
		}
		if(seconds<10){
			// 秒
			seconds = '0'+seconds
		}
		return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
	},
	// 细节时间处理
	dateTime_Three(e){
		var date = new Date(e);
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		if(month<10){
			month = '0'+month
		}
		if(day<10){
			day = '0'+day
		}
		return year + '-' + month + '-' + day 
	},
	// 文件夹使用时间
	dateTime_Thour(e){
		var date = new Date(e);
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		if(month<10){
			month = '0'+month
		}
		if(day<10){
			day = '0'+day
		}
		return year  + month  + day 
	},
	//聊天时间处理
	dateTime_Msg:function(d){
		// 消息接收的时间
		var date = new Date(d);
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hour = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		var days = date.getDay();
		var week;
		// 现在的时间
		var ndate = new Date();
		var nyear = ndate.getFullYear();
		var nmonth = ndate.getMonth() + 1;
		var nday = ndate.getDate();
		var nhour = ndate.getHours();
		var nminutes = ndate.getMinutes();
		var nseconds = ndate.getSeconds();
		// 如果没有超过24小时
		if(year === nyear && month === nmonth && nday === day ){
			hour = (hour<10)? '0'+ hour : hour;
			minutes = (minutes<10)? '0'+ minutes : minutes;
			return hour+':'+ minutes
		}
		// 昨天
		if(year === nyear && month === nmonth && nday === day+1){
			hour = (hour<10)? '0'+ hour : hour;
			minutes = (minutes<10)? '0'+ minutes : minutes;
			return '昨天 '+hour+':'+ minutes
		}
		// 今年
		if(year === nyear){
			month = (month<10)? '0'+ month : month;
			day = (day<10)? '0'+ day : day;
			hour = (hour<10)? '0'+ hour : hour;
			minutes = (minutes<10)? '0'+ minutes : minutes;
			return month + '月' + day + '日 '+hour+':'+minutes
		}
		else{
			month = (month<10)? '0'+ month : month;
			day = (day<10)? '0'+ day : day;
			hour = (hour<10)? '0'+ hour : hour;
			minutes = (minutes<10)? '0'+ minutes : minutes;
			return year+'年'+month + '月' + day + '日'+hour+':'+minutes
		}
	},
	// 间隔时间差
	spaceTime:function(old,now){
		// now 聊天消息对应的时间
		// old 上一条消息的时间
		old = new Date(old)
		now  = new Date(now)
		// 获取时间戳
		var oldTime = old.getTime()
		var nowTime = now.getTime()
		if(nowTime>(oldTime+1000*60*3)){
			return now
		}else{
			return ''
		}
	},
}