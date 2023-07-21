// 测试数据
export default{
	frindes: function(){
		let friendarr = [
			{
				id: 1,
				imgurl: '../../static/images/img/two.jpg',
				tip:2,
				name: '月亮',
				email:'xiaoli163.com',
				time: new Date(),
				news: '这消息将使全世界崇拜他的人都感到高兴'
			},
			{
				id: 2,
				imgurl: '../../static/images/img/two.jpg',
				tip:5,
				name: '小狼',
				email:'xiaoli163.com',
				time: new Date(),
				news: '这消息将使全世界崇拜他的人都感到高兴'
			},
			{
				id: 3,
				imgurl: '../../static/images/img/three.jpg',
				tip:2,
				name: '芝士',
				email:'xiaoli163.com',
				time: 'Mon Dec 05 2022 10:38:15 GMT+0800 (中国标准时间)',
				news: '目前我们没有进一步的消息'
			},
			{
				id: 4,
				imgurl: '../../static/images/img/four.jpg',
				tip:12,
				name: '小樱',
				email:'xiaoli163.com',
				time: 'Sta Dec 07 2022 12:38:15 GMT+0800 (中国标准时间)',
				news: '这家报纸获得内部消息，抢在所有竞争对手之前发表了。'
			},
			{
				id: 5,
				imgurl: '../../static/images/img/head (2).jpg',
				tip:1,
				name: '两岸',
				email:'xiaoli163.com',
				time: 'Thu Dec 08 2022 16:58:15 GMT+0800 (中国标准时间)',
				news: '他因泄漏消息给新闻界而受到谴责'
			},
			{
				id: 6,
				imgurl: '../../static/images/img/head (2).jpg',
				tip:1,
				name: '两岸',
				email:'xiaoli163.com',
				time: 'Thu Dec 08 2022 16:58:15 GMT+0800 (中国标准时间)',
				news: '他因泄漏消息给新闻界而受到谴责'
			},
			{
				id: 7,
				imgurl: '../../static/images/img/head (2).jpg',
				tip:1,
				name: '两岸',
				email:'xiaoli163.com',
				time: 'Thu Dec 08 2022 16:58:15 GMT+0800 (中国标准时间)',
				news: '他因泄漏消息给新闻界而受到谴责'
			},
			{
				id: 8,
				imgurl: '../../static/images/img/four.jpg',
				tip:12,
				name: '小樱',
				email:'xiaoli163.com',
				time: 'Sta Dec 07 2022 12:38:15 GMT+0800 (中国标准时间)',
				news: '这家报纸获得内部消息，抢在所有竞争对手之前发表了。'
			},
			{
				id: 9,
				imgurl: '../../static/images/img/four.jpg',
				tip:12,
				name: '小樱',
				email:'xiaoli163.com',
				time: 'Sta Dec 07 2022 12:38:15 GMT+0800 (中国标准时间)',
				news: '这家报纸获得内部消息，抢在所有竞争对手之前发表了。'
			},
			{
				id: 10,
				imgurl: '../../static/images/img/four.jpg',
				tip:12,
				name: '小樱',
				email:'xiaoli163.com',
				time: 'Sta Dec 07 2022 12:38:15 GMT+0800 (中国标准时间)',
				news: '这家报纸获得内部消息，抢在所有竞争对手之前发表了。'
			},
			{
				id: 11,
				imgurl: '../../static/images/img/four.jpg',
				tip:12,
				name: '小樱',
				email:'xiaoli163.com',
				time: 'Sta Dec 07 2022 12:38:15 GMT+0800 (中国标准时间)',
				news: '这家报纸获得内部消息，抢在所有竞争对手之前发表了。'
			}
		];
		return friendarr;
	},
	isFriend:function(){
		let isfriend=[
			{
				userID:1,
				friendID:2
			},
			{
				userID:1,
				friendID:3
			},
			{
				userID:1,
				friendID:3
			},
			{
				userID:1,
				friendID:3
			}
		];
		return isfriend;
	},
	// 聊天消息
	message:function(){
		let Message = [
			{
				id: 'a',
				imgurl: '../../static/images/img/three.jpg',
				tip:16,
				time: new Date()-120,
				message: '这消息将使全世界崇拜他的人都感到高兴',
				types:0
			},
			{
				id: 'b',
				imgurl: '../../static/images/img/two.jpg',
				tip:15,
				time: new Date()-140,
				message: '在设置滚动',
				types:0
			},
			{
				id: 'b',
				imgurl: '../../static/images/img/two.jpg',
				tip:14,
				time: new Date()-160,
				message: 'two.jpg',
				types:1
			},
			{
				id: 'b',
				imgurl: '../../static/images/img/two.jpg',
				tip:13,
				time: new Date()-180,
				message: 'iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向',
				types:0
			},
			{
				id: 'b',
				imgurl: '../../static/images/img/two.jpg',
				tip:12,
				time: new Date()-200,
				message: {
					name:'西南石油大学工程学院',
					address:'四川省成都市新都区新都大道8号西南石油大学21栋c区333',
					latitude:'30.832413',
					longitude:'104.184586'
				},
				types:3
			},
			{
				id: 'a',
				imgurl: '../../static/images/img/two.jpg',
				tip:11,
				time: new Date()-200,
				message: {
					name:'西南石油大学工程学院',
					address:'四川省成都市新都区新都大道8号西南石油大学21栋c区333',
					latitude:'30.832413',
					longitude:'104.184586'
				},
				types:3
			},
			{
				id: 'b',
				imgurl: '../../static/images/img/two.jpg',
				tip:10,
				time: new Date()-400,
				message: {
					voice:'b',
					time:20
				},
				types:2
			},
			{
				id: 'a',
				imgurl: '../../static/images/img/three.jpg',
				tip:9,
				time: new Date()-500,
				message: {
					voice:'a',
					time:60
				},
				types:2
			},
			{
				id: 'a',
				imgurl: '../../static/images/img/three.jpg',
				tip:8,
				time: new Date()-1000,
				message: '这消息将使全世界崇拜他的人都感到高兴',
				types:0
			},
			{
				id: 'b',
				imgurl: '../../static/images/img/two.jpg',
				tip:7,
				time: new Date()-1000*16,
				message: '在设置滚动',
				types:0
			},
			{
				id: 'b',
				imgurl: '../../static/images/img/two.jpg',
				tip:6,
				time: new Date()-1000*60,
				message: 'two.jpg',
				types:1
			},
			{
				id: 'b',
				imgurl: '../../static/images/img/two.jpg',
				tip:5,
				time: new Date()-1000*120,
				message: 'iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向',
				types:0
			},
			{
				id: 'b',
				imgurl: '../../static/images/img/two.jpg',
				tip:4,
				time: new Date()-1000*180,
				message: 'iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向',
				types:0
			},
			{
				id: 'a',
				imgurl: '../../static/images/img/three.jpg',
				tip:3,
				time: new Date()-1000*240,
				message: 'iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向',
				types:0
			},
			{
				id: 'a',
				imgurl: '../../static/images/img/three.jpg',
				tip:2,
				// time: new Date()-1000*300,
				time: 'Sta Apr 29 2023 12:38:15 GMT+0800 (中国标准时间)',
				message: 'three.jpg',
				types:1
			},
			{
				id: 'a',
				imgurl: '../../static/images/img/three.jpg',
				tip:1,
				time: 'Sta Apr 29 2023 12:38:15 GMT+0800 (中国标准时间)',
				message: 'two.jpg',
				types:1
			}
		]
		return Message
	}
}