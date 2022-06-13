import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import './index.css'
import { Settings } from 'luxon'

const app = createApp(App);

const locale = 'sk'
Settings.defaultLocale = locale

app.use(router);

app.mount("#app");
