import { createRouter, createWebHistory } from 'vue-router'
import EventView from '../views/EventView.vue'
import HomeView from '../views/HomeView.vue'
import InfoView from '../views/InfoView.vue'
import SupportView from '../views/SupportView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/info',
            name: 'info',
            component: InfoView,
        },
        {
            path: '/:date/:slug?',
            name: 'event',
            component: EventView,
        },
        {
            path: '/2-percenta',
            name: '2-percenta',
            component: SupportView,
        }
    ],
})

export default router
