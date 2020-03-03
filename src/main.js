import Vue from "vue";
//引入到vue下面
//ElementUI组件库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router";
import store from './store'

//使用ElementUI
Vue.use(ElementUI);

import './permission';
Vue.config.productionTip = false;

new Vue({
    store, //注册vuex
    router,
    render: h => h(App)
}).$mount("#app");