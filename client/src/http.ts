import axios from "axios";
// import { Message, Loading } from "element-ui"; // Vue 2 
import { ElMessage, ElLoading } from "element-plus";
import router from "./router";
// let loading; // Vue 2
let loading: ReturnType<typeof ElLoading.service>;
function startLoading() {
    loading = ElLoading.service({
        lock: true,
        text: "載入中",
        background: 'rgba(0, 0, 0, 0.7)',
    });
}

function endLoading() {
    setTimeout(() => {
        loading.close();
    }); // 延遲 300ms，避免畫面太快看不到動畫
}

// 攔截請求
axios.interceptors.request.use(
    config => {
        // 載入動畫
        startLoading();
        if(localStorage.eleToken) {
            // 設置統一的請求 header
            config.headers.Authorization = localStorage.eleToken;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    }
);

// 攔截回應
axios.interceptors.response.use(
    response => {
        // 結束載入動畫
        endLoading();
        return response;
    }, error => {
        // 錯誤提醒
        endLoading();
        // if (router.currentRoute.value.path !== "/login") {
        //      ElMessage.error(error.response.data);
        // }

        // 取得錯誤狀態碼
        const { status } = error.response;
        if(status == 401) {
            if (router.currentRoute.value.path !== "/login") {
                ElMessage.error("請重新登入");
            }
            
            // 清除token
            localStorage.removeItem("eleToken");
            // 跳轉道登入頁面
            router.push("/login");
        }

        return Promise.reject(error);
    }
);

export default axios;
