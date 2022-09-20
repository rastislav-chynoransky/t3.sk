import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Settings } from 'luxon'
import linkify from 'vue-linkify'
import * as Sentry from '@sentry/vue'
import './index.css'
import 'semantic-ui-sticky/sticky.js'
import 'semantic-ui-sticky/sticky.css'

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

app.directive('linkified', linkify)

app.mount('#app')
