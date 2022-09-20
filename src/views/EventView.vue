<template>
    <div
        ref="container"
        v-if="event"
        class="backdrop-blur-lg bg-white/95 [@supports(backdrop-filter:blur(0))]:bg-white/70 border-black lg:border-l bottom-0 fixed overflow-y-auto overscroll-none right-0 top-0 w-full lg:w-[calc(3*(100%-2rem+1px)/7)] z-50"
    >
        <div
            class="border-black border-b bg-white font-media grid grid-cols-3 leading-8 lg:px-5 sticky top-0 w-full z-10"
        >
            <div>
                <router-link
                    v-if="prev"
                    class="block px-5 active:text-highlight"
                    :to="{ name: 'event', params: { date: prev.toISODate() } }"
                >
                    &leftarrow;
                </router-link>
            </div>
            <div class="">
                <button
                    class="block text-center active:text-highlight tracking-widest uppercase w-full"
                    @click="$emit('close')"
                >
                    zavrieť
                </button>
            </div>
            <div class="text-right">
                <router-link
                    v-if="next"
                    class="block px-5 active:text-highlight"
                    :to="{ name: 'event', params: { date: next.toISODate() } }"
                >
                    &rightarrow;
                </router-link>
            </div>
        </div>

        <div class="mx-5 lg:mx-10 mt-10 mb-16 relative">
            <EventTypeComponent :event="event" class="text-white" />
            <h2 class="font-media text-2xl whitespace-pre-line">
                {{ formatTitle(event) }}
            </h2>
            <div class="flex font-media justify-between leading-tighter mt-3">
                <div>
                    <span>{{ event._datetime.toFormat('EEEE') }}</span
                    ><br />
                    <span class="uppercase"
                        >{{ event._datetime.toFormat('d') }}
                        {{ event._datetime.toFormat('LLL') }}
                        {{ event._datetime.toFormat('yyyy') }}</span
                    ><br />
                    <span>{{ formatTime(event._datetime) }}</span>
                </div>
                <div class="text-right">
                    <template v-if="event.attributes.price"
                        >vstupné<br />odporúčané<br />
                        {{
                            formatPrice(event.attributes.price)
                        }}&euro;</template
                    >
                </div>
            </div>

            <img
                class="grayscale mb-6 mt-5 w-full"
                v-if="event.attributes.image"
                v-show="loaded"
                :src="event.attributes.image"
            />

            <div
                class="font-gates my-4 whitespace-pre-wrap"
                v-html="formatDescription(event)"
                v-linkified:options="{
                    className: 'break-words underline hover:no-underline',
                }"
            ></div>
        </div>
    </div>
</template>

<script>
import imagesLoaded from 'imagesloaded'
import { DateTime } from 'luxon'
import EventTypeComponent from '../components/EventTypeComponent.vue'

export default {
    components: { EventTypeComponent },
    props: {
        event: Object,
        prev: Object,
        next: Object,
    },
    data() {
        return {
            loaded: true,
        }
    },
    emits: ['close', 'open'],
    mounted() {
        const date = DateTime.fromISO(this.$route.params.date)
        this.$emit('open', date)

        window.addEventListener('keydown', this.keydown)
    },
    unmounted() {
        window.removeEventListener('keydown', this.keydown)
    },
    methods: {
        keydown(e) {
            if (e.keyCode === 27) {
                this.$emit('close')
            } else if (e.keyCode === 37 && this.prev) {
                window.setTimeout(() => {
                    this.$router.push({
                        name: 'event',
                        params: { date: this.prev.toISODate() },
                    })
                })
            } else if (e.keyCode === 39 && this.next) {
                window.setTimeout(() => {
                    this.$router.push({
                        name: 'event',
                        params: { date: this.next.toISODate() },
                    })
                })
            }
        },
        formatTime(datetime) {
            return datetime.toLocaleString(DateTime.TIME_SIMPLE)
        },
        formatPrice(price) {
            return price.toFixed(2).replace('.', ',')
        },
        formatTitle(event) {
            return event.attributes.title
                ? event.attributes.title
                : event.attributes.facebook_title
        },
        formatDescription(event) {
            return event.attributes.description
                ? event.attributes.description
                : event.attributes.facebook_description
        },
    },
    watch: {
        $route(to) {
            this.loaded = false
            if (to.params.date) {
                const date = DateTime.fromISO(to.params.date)
                this.$emit('open', date)
                if (this.$refs.container) {
                    this.$refs.container.scrollTop = 0
                }

                const loader = imagesLoaded(this.$refs.container)
                loader.on('done', () => {
                    this.loaded = true
                })
            }
        },
    },
}
</script>
