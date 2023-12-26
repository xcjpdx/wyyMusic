import App from './App';

import uviewPlus from 'uview-plus';
import { getImg } from './utils/index.js';
import { createPinia } from 'pinia';

// #ifndef VUE3
import Vue from 'vue';
import './uni.promisify.adaptor';
Vue.config.productionTip = false;
App.mpType = 'app';
const app = new Vue({
	...App,
});
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue';
export function createApp() {
	const app = createSSRApp(App);
	app.config.globalProperties.$url = getImg;
	const pinia = createPinia();
	app.use(pinia);
	app.use(uviewPlus);
	// 如此配置即可
	uni.$u.config.unit = 'rpx';

	return {
		app,
	};
}
// #endif
