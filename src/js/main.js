import { createApp } from 'vue'
import App from '@/components/App.vue'
import router from '/router'

// Import our custom CSS
import '/scss/styles.scss'
import '/assets/styles.css'

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/serviceworker.js");
}

navigator.sendBeacon("https://counter.dev/trackpage", new URLSearchParams({ id: "641a4600-2620-4e6a-8998-0663c51907bc", page: window.location.pathname, }));

createApp(App).use(router).mount('#app');