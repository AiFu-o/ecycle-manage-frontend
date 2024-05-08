import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import API from "./libs/api";
import CookieUtils from "./libs/cookie/cookie";
import type axios from './libs/api'

const app = createApp(App)

declare module 'vue' {
    interface ComponentCustomProperties {
        $API: typeof axios,
        $CookieUtils: typeof CookieUtils
    }
}

app.config.globalProperties.$API = API;
app.config.globalProperties.$CookieUtils = CookieUtils;

app.use(createPinia())
app.use(router)

app.mount('#app')
