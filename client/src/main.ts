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
app.use(store)
    .use(router)
    .use(ElementPlus) // Vue 3 用法
    .mount('#app')

// 安靜處理 ResizeObserver loop 錯誤（瀏覽器層級）
const observerErrorHandler = () => {
  const noop = () => {};
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
};

observerErrorHandler();
