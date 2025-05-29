import { createApp } from 'vue';
import App from './App.vue';
import axios from './http';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './router';
import store from './store';

// Vue.config.productionTip = false; // Vue 2 用法
// Vue.prototyoe.$axios = axios; // Vue 2 用法
const app = createApp(App);
app.config.globalProperties.$axios = axios;
// Vue.use(ElementUI); // Vue 2 用法
createApp(App)
    .use(store)
    .use(router)
    .use(ElementPlus) // Vue 3 用法
    .mount('#app')
