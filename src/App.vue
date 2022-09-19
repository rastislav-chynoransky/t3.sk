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
                class="backdrop-blur-sm bg-white/90 [@supports(backdrop-filter:blur(0))]:bg-white/50 border-transparent border-l h-8"
                v-for="weekday in weekdays"
                :key="weekday"
            >
                {{ weekday.substring(0, 2) }}
            </div>
        </div>

        <div
            class="backdrop-blur-sm box-content fixed bg-white/90 [@supports(backdrop-filter:blur(0))]:bg-white/50 border-black border-r bottom-0 left-0 top-8 w-8 z-20"
        ></div>

        <div class="flex w-fit lg:w-full">
            <div class="sticky left-0 z-20 w-8 shrink-0">
                <div
                    class="text-base leading-8 uppercase z-20"
                    :style="`height: max(var(--sm-col-width) * ${month.length}, (100vw - 2rem - var(--border-width))/7 * ${month.length});`"
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
                    v-for="(events, key) in sortedCalendar"
                    :key="key"
                >
                    <div class="relative -left-8 -top-8" :ref="key"></div>
                    <div class="h-full border-b border-r border-highlight">
                        <router-link
                            class="block group h-full"
                            :to="{ name: 'event', params: { date: key } }"
                            v-if="events.length"
                        >
                            <div
                                :class="[key == selected ? 'bg-highlight' : '']"
                                class="absolute flex h-full justify-center rounded-[50%] transition-[border-radius] group-active:bg-highlight w-full z-20"
                            >
                                <div
                                    :class="[
                                        isToday(key)
                                            ? 'text-red'
                                            : key == selected
                                            ? 'text-white'
                                            : 'text-highlight group-active:text-white',
                                    ]"
                                    class="font-t3 self-center text-day"
                                >
                                    {{ events[0]._datetime.day }}
                                </div>
                            </div>

                            <div
                                class="flex flex-col h-full justify-end overflow-hidden p-2 relative z-30"
                            >
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
                                    class="font-t3 self-center text-day text-red"
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
            calendar: {},
            since: null,
            till: null,
            weekdays: Info.weekdays(),
            loading: false,
        }
    },
    mounted() {
        if (history.scrollRestoration) {
            history.scrollRestoration = 'manual'
        }

        this.$router.isReady().then(() => {
            if (!this.$route.matched.some(({ name }) => name === 'event')) {
                this.navigate(this.now)
            }
        })

        window.addEventListener('scroll', this.scroll)
    },
    methods: {
        scroll() {
            if (this.loading) {
                return
            }

            const delta = window.innerHeight / 3

            if (window.scrollY < delta) {
                this.loadPrevious()
            } else if (
                window.scrollY + window.innerHeight >
                document.body.scrollHeight - delta
            ) {
                this.loadNext()
            }
        },
        load(since, till, beforeCallback = null) {
            if (
                since >= this.since &&
                till <= this.till &&
                this.since !== null &&
                this.till !== null
            ) {
                return Promise.resolve()
            }

            const query = qs.stringify({
                populate: '*',
                sort: ['start'],
                filters: {
                    start: {
                        $gte: since.toISODate(),
                        $lt: till.plus({ days: 1 }).toISODate(),
                    },
                },
            })
            const url = `${import.meta.env.VITE_API_URL}/events?${query}`
            return axios
                .get(url)
                .then(response => {
                    if (beforeCallback) {
                        beforeCallback()
                    }
                    return response
                })
                .then(({ data }) => {
                    for (let i = since; i <= till; i = i.plus({ days: 1 })) {
                        if (!this.calendar[i.toISODate()]) {
                            this.calendar[i.toISODate()] = []
                        }
                    }

                    if (since < this.since || this.since === null) {
                        this.since = since
                    }

                    if (till > this.till || this.till === null) {
                        this.till = till
                    }

                    for (const event of data.data) {
                        const datetime = DateTime.fromISO(
                            event.attributes.start
                        )
                        event._datetime = datetime
                        const key = datetime.toISODate()
                        this.calendar[key].push(event)
                    }
                })
        },
        loadPrevious() {
            this.loading = true
            const since = this.since
                .endOf('week')
                .minus({ months: 1 })
                .startOf('month')
                .startOf('week')
            const till = this.since.minus({ days: 1 })

            let scrollTop, documentHeight
            return this.load(since, till, () => {
                scrollTop = window.scrollY
                documentHeight = document.body.scrollHeight
            })
                .then(() => {
                    if (scrollTop && documentHeight) {
                        this.$nextTick(() => {
                            document.documentElement.scrollTop =
                                scrollTop +
                                document.body.scrollHeight -
                                documentHeight
                        })
                    }
                })
                .finally(() => {
                    this.loading = false
                })
        },
        loadNext() {
            this.loading = true
            const since = this.till.plus({ days: 1 })
            const till = this.till
                .startOf('week')
                .plus({ month: 1 })
                .endOf('month')
                .endOf('week')

            return this.load(since, till).finally(() => {
                this.loading = false
            })
        },
        isToday(date) {
            return date === this.now.toISODate()
        },
        home() {
            this.$router.push({
                name: 'home',
            })

            const key = this.now.toISODate()
            if (this.calendar[key]) {
                this.scrollTo(this.now, 'smooth')
            } else {
                this.navigate(this.now)
            }
        },
        scrollTo(date, behavior) {
            this.$refs[date.toISODate()]?.[0]?.scrollIntoView({
                behavior,
            })
        },
        navigate(date) {
            const since = date
                .minus({ months: 1 })
                .startOf('month')
                .startOf('week')
            const till = date.plus({ months: 1 }).endOf('month').endOf('week')
            const behavior = this.calendar[date.toISODate()] ? 'smooth' : 'auto'

            const restorePosition = since < this.since

            let scrollTop, documentHeight
            return this.load(since, till, () => {
                scrollTop = window.scrollY
                documentHeight = document.body.scrollHeight

                if (
                    till < this.since?.minus({ days: 1 }) ||
                    since > this.till?.plus({ days: 1 })
                ) {
                    this.calendar = {}
                    this.since = null
                    this.till = null
                }
            }).then(() => {
                if (scrollTop && documentHeight && restorePosition) {
                    this.$nextTick(() => {
                        document.documentElement.scrollTop =
                            scrollTop +
                            document.body.scrollHeight -
                            documentHeight
                    })
                }
                this.$nextTick(() => {
                    this.scrollTo(date, behavior)
                })
            })
        },
        open(date) {
            this.date = date
            this.navigate(date)
        },
        close() {
            this.date = null
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
    computed: {
        selected() {
            return this.date?.toISODate()
        },
        dates() {
            return Object.keys(this.calendar)
                .filter(date => this.calendar[date].length)
                .map(date => DateTime.fromISO(date))
                .sort()
        },
        sortedCalendar() {
            return Object.keys(this.calendar)
                .sort()
                .reduce((accumulator, key) => {
                    accumulator[key] = this.calendar[key]

                    return accumulator
                }, {})
        },
        next() {
            return this.dates.find(date => {
                return date.startOf('day') > this.date
            })
        },
        prev() {
            // return this.dates.findLast(date => {
            return [...this.dates].reverse().find(date => {
                return date.startOf('day') < this.date
            })
        },
        months() {
            if (!this.since || !this.till) {
                return []
            }

            const months = []
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
}
</script>
