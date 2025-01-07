import { createApp } from 'vue'
import App from './App.vue'
import Vue3ColorPicker from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css'
const app = createApp(App)
app.use(Vue3ColorPicker)
app.mount('#app')
