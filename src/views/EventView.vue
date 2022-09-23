<template>
    <div
        ref="container"
        v-if="event"
        class="backdrop-blur-lg bg-white/95 [@supports(backdrop-filter:blur(0))]:bg-white/80 border-black lg:border-l bottom-0 fixed overflow-y-auto overscroll-none right-0 top-0 w-full lg:w-[calc(3*(100%-2rem+1px)/7)] z-50"
    >
        <div
            class="border-black border-b bg-white flex font-media leading-8 sticky top-0 w-full z-10"
        >
            <div>
                <router-link
                    :class="{ hidden: !prev }"
                    class="block px-5 lg:px-10 active:bg-highlight"
                    :to="prev ? helpers.route(prev) : ''"
                >
                    &leftarrow;
                </router-link>
            </div>
            <div class="grow text-center">
                <button
                    class="block active:bg-highlight tracking-widest uppercase w-full"
                    @click="$emit('close')"
                >
                    zavrieť
                </button>
            </div>
            <div class="text-right">
                <router-link
                    :class="{ invisible: !next }"
                    class="block px-5 lg:px-10 active:bg-highlight"
                    :to="next ? helpers.route(next) : ''"
                >
                    &rightarrow;
                </router-link>
            </div>
        </div>

        <div class="grayscale mx-5 lg:mx-10 mt-10 mb-16 relative">
            <EventTypeComponent :event="event" class="text-white" />
            <h2 class="font-media text-2xl whitespace-pre-line">
                {{ helpers.formatTitle(event) }}
            </h2>
            <div class="flex font-media justify-between leading-tighter mt-3">
                <div>
                    <span>{{ helpers.formatWeekday(event) }}</span
                    ><br />
                    <span class="uppercase">{{
                        helpers.formatDate(event)
                    }}</span
                    ><br />
                    <span>{{ helpers.formatTime(event) }}</span>
                </div>
                <div class="text-right">
                    <template v-if="helpers.formatPrice(event)"
                        >vstupné<br />odporúčané<br />
                        {{ helpers.formatPrice(event) }}&euro;</template
                    >
                </div>
            </div>

            <img
                class="mb-6 mt-5 w-full"
                v-if="event.attributes.image"
                v-show="loaded"
                :src="helpers.image(event)"
            />

            <div class="break-words my-4">
                <div
                    class="whitespace-pre-wrap"
                    v-html="helpers.formatDescription(event)"
                    v-linkified:options="{
                        className: 'underline hover:no-underline',
                    }"
                ></div>
                <template v-if="event.attributes.facebook_id">
                    <br />Facebook event:<br />
                    <a
                        class="underline hover:no-underline"
                        :href="`https://www.facebook.com/events/${event.attributes.facebook_id}`"
                        >https://www.facebook.com/events/{{
                            event.attributes.facebook_id
                        }}</a
                    >
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import imagesLoaded from 'imagesloaded'
import { DateTime } from 'luxon'
import EventTypeComponent from '../components/EventTypeComponent.vue'
import helpers from '../events'

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
            helpers,
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
                    this.$router.push(helpers.route(this.prev))
                })
            } else if (e.keyCode === 39 && this.next) {
                window.setTimeout(() => {
                    this.$router.push(helpers.route(this.next))
                })
            }
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
