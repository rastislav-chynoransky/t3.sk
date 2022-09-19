import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { Settings } from 'luxon'
import sticky from './sticky'
import linkify from 'vue-linkify'
import * as Sentry from '@sentry/vue'

const app = createApp(App)

if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
        app,
        dsn: import.meta.env.VITE_SENTRY_DSN,
    })
}

const locale = 'sk'
Settings.defaultLocale = locale

app.use(router)

app.directive('sticky', sticky)
app.directive('linkified', linkify)

app.mount('#app')
