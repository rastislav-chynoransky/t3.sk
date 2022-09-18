<template>
    <div class="font-media text-black">
        <div
            @click="home"
            class="active:bg-highlight bg-white box-content border-black border-b border-r cursor-pointer fixed h-8 leading-8 left-0 select-none text-base text-center text-black top-0 w-8 z-30"
        >
            T3
        </div>

        <div
            class="border-black border-b lg:border-x top-0 grid grid-cols-calendar leading-8 ml-8 sticky text-center text-base w-fit lg:w-auto z-20 uppercase"
        >
            <div
                class="backdrop-blur-sm bg-white/50 border-transparent border-l h-8"
                v-for="weekday in weekdays"
                :key="weekday"
            >
                {{ weekday.substring(0, 2) }}
            </div>
        </div>

        <div
            class="backdrop-blur-sm box-content fixed bg-white/50 border-black border-r bottom-0 left-0 top-8 w-8 z-20"
        ></div>

        <div class="flex w-fit lg:w-full">
            <div class="sticky left-0 z-20 w-8 shrink-0">
                <div
                    class="text-base leading-8 uppercase z-20"
                    :style="`height: max(8rem * ${month.length}, (100vw - 2rem - var(--border-width))/7 * ${month.length});`"
                    v-for="(month, i) in months"
                    :key="`month_${i}`"
                >
                    <div v-sticky="{ topSpacing: 32 }">
                        <div
                            class="py-4 whitespace-nowrap [writing-mode:vertical-lr]"
                        >
                            {{ month.label }}
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="border-white border-l grid grid-cols-calendar relative text-lg lg:text-lg xl:text-2xl w-fit lg:w-full z-10"
            >
                <PathComponent :dates="dates" :since="since" :till="till" />

                <div
                    class="aspect-square leading-tighter relative"
                    v-for="(events, key) in calendar"
                    :key="key"
                >
                    <div class="relative -top-8" :ref="key"></div>
                    <div class="h-full border-b border-r border-highlight">
                        <router-link
                            class="block group h-full"
                            :to="{ name: 'event', params: { date: key } }"
                            v-if="events.length"
                        >
                            <div
                                :class="[key == selected ? 'bg-highlight' : '']"
                                class="absolute flex h-full justify-center rounded-[50%] transition-[border-radius] group-hover:bg-highlight w-full z-20"
                            >
                                <div
                                    :class="[
                                        isToday(key)
                                            ? 'text-red'
                                            : key == selected
                                            ? 'text-white'
                                            : 'text-highlight group-hover:text-white',
                                    ]"
                                    class="font-t3 self-center text-[clamp(5rem,8.5vw,8.5vw)]"
                                >
                                    {{ events[0]._datetime.day }}
                                </div>
                            </div>

                            <div
                                class="flex flex-col h-full justify-end overflow-hidden p-2 relative z-30"
                            >
                                <!-- <div
                                    v-if="events?.[0].attributes.type"
                                    class="font-gates text-xxs md:text-xs tracking-normal leading-snug mb-0.5 uppercase [font-variation-settings:'wght'_600]"
                                >
                                    <span
                                        class="bg-black pb-[.075em] pt-[.25em] px-[.5em] tracking-normal rounded-full text-white"
                                        >{{ events?.[0].attributes.type }}</span
                                    >
                                </div> -->
                                <EventTypeComponent
                                    :event="events?.[0]"
                                    class="text-white"
                                />
                                <div class="whitespace-pre-line tracking-wide">
                                    {{ formatTitle(events?.[0]) }}
                                </div>
                            </div>
                        </router-link>
                        <div class="h-full" v-else-if="isToday(key)">
                            <div
                                class="absolute flex h-full justify-center w-full"
                            >
                                <div
                                    class="font-t3 self-center text-[clamp(5rem,9vw,9vw)] text-red"
                                >
                                    {{ now.day }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <router-link
        :to="{ name: 'info' }"
        class="fixed bottom-0 font-media mx-2 my-2 px-2 right-0 text-4xl lg:text-5xl uppercase z-40 active:text-highlight"
        >Info</router-link
    >

    <RouterView
        :event="calendar[selected]?.[0]"
        :prev="prev"
        :next="next"
        :now="now"
        @close="close"
        @open="open"
        @navigate="navigate"
    />
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import { DateTime, Info } from 'luxon'
import EventTypeComponent from './components/EventTypeComponent.vue'
import PathComponent from './components/PathComponent.vue'

export default {
    components: { EventTypeComponent, PathComponent },
    data() {
        return {
            now: DateTime.now(),
            date: null,
            dates: [],
            events: [],
            calendar: {},
            selected: null,
            since: null,
            till: null,
            weekdays: Info.weekdays(),
        }
    },
    mounted() {
        if (history.scrollRestoration) {
            history.scrollRestoration = 'manual'
        }

        this.date = this.now
        // todo fix double loading on detail
        this.navigate(this.date).then(() => {
            this.scrollTo(this.date)
        })
    },
    computed: {
        next() {
            return this.dates.find(date => {
                return date.startOf('day') > this.date
            })
        },
        prev() {
            return this.dates.findLast(date => {
                return date.startOf('day') < this.date
            })
        },
        months() {
            const months = []

            if (!this.since || !this.till) {
                return months
            }

            for (
                let i = this.since.endOf('week').startOf('month');
                i <= this.till.startOf('week').endOf('month');
                i = i.plus({ months: 1 })
            ) {
                const length = Math.floor(
                    i.plus({ months: 1 }).endOf('week').diff(i, 'weeks').weeks
                )
                months.push({
                    length,
                    label: i.toFormat('LLLL yyyy'),
                })
            }
            return months
        },
    },
    methods: {
        isToday(date) {
            return date === this.now.toISODate()
        },
        home() {
            this.$router.push({
                name: 'home',
            })

            const key = this.now.toISODate()
            const el = this.$refs[key]?.[0]
            if (el) {
                this.scrollTo(this.now, 'smooth')
            } else {
                this.navigate(this.now).then(() => {
                    this.$nextTick(() => {
                        this.scrollTo(this.now)
                    })
                })
            }
        },
        scrollTo(date, behavior = 'auto') {
            this.$refs[date.toISODate()]?.[0]?.scrollIntoView({ behavior })
        },
        navigate(date) {
            this.date = date
            const since = date
                // .minus({ months: 62 })
                .startOf('month')
                .startOf('week')
            const till = date.plus({ months: 2 }).endOf('month').endOf('week')

            if (this.since > since || this.till < till) {
                this.calendar = {}
                for (let i = since; i <= till; i = i.plus({ days: 1 })) {
                    this.calendar[i.toISODate()] = []
                }
            }

            this.since = since
            this.till = till

            const query = qs.stringify({
                populate: '*',
                sort: ['start'],
                filters: {
                    start: {
                        $gte: this.since.toISODate(),
                        $lte: this.till.toISODate(),
                    },
                },
            })

            const url = `${import.meta.env.VITE_API_URL}/events?${query}`

            return axios.get(url).then(({ data }) => {
                this.events = []
                this.dates = []
                this.events.push(...data.data)
                for (const event of this.events) {
                    const datetime = DateTime.fromISO(event.attributes.start)
                    event._datetime = datetime
                    this.dates.push(datetime)
                    const key = datetime.toISODate()
                    if (key in this.calendar) {
                        this.calendar[key].push(event)
                    }
                }
            })
        },
        open(date) {
            this.date = date
            this.selected = date.toISODate()
            this.scrollTo(date, 'smooth')
        },
        close() {
            this.date = null
            this.selected = null
            this.$router.push({
                name: 'home',
            })
        },
        formatTitle(event) {
            return event.attributes.title
                ? event.attributes.title
                : event.attributes.facebook_title
        },
    },
}
</script>
