import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
// 引入socket模块
import io from './components/socket/uni-socket.io.js'
Vue.prototype.socket = io('http://192.168.84.33:8082', {
	query: {},
	transports: ['websocket', 'polling'],
	timeout: 5000,
})
// 服务器地址
// 1400813211
// 7cfb3ecf410574441d2becb61b7497c117c2a068234f4d9e7104bfa688187e37
// 22:21:25.459   - Network: http://10.26.35.218:8080/
Vue.prototype.serverUrl = 'http://192.168.84.33:3000'
// Vue.prototype.serverUrl = 'http://192.168.101.111:3000'
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif