import App from './App'
import store from 'store/index.js'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

Vue.filter('formatCount',function(value){
	if(value >= 10000 && value <= 100000000){
		value /=10000;
		// 保留一位小数
		return value.toFixed(1)+'万';
	}
	else if(value > 100000000){
		value /= 100000000;
		// 保留一位小数
		return value.toFixed(1)+'亿';
	}else{
		return value;
	}
})
const app = new Vue({
    ...App,
		store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif