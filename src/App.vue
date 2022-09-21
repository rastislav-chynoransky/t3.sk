<template>
    <div>
        <div
            @click="home"
            class="active:bg-highlight bg-gray box-content border-black border-b border-r cursor-pointer fixed font-media h-8 leading-8 left-0 select-none text-center top-0 w-8 z-30"
        >
            T3
        </div>

        <div
            class="border-black border-b lg:border-x font-media grid grid-cols-calendar leading-8 ml-8 sticky text-center tracking-widest top-0 w-fit lg:w-auto z-20 uppercase"
        >
            <div
                class="backdrop-blur-sm bg-gray/90 [@supports(backdrop-filter:blur(0))]:bg-gray/50 border-transparent border-l h-8"
                v-for="weekday in weekdays"
                :key="weekday"
            >
                {{ weekday.substring(0, 2) }}
            </div>
        </div>

        <div
            class="backdrop-blur-sm box-content fixed bg-gray/90 [@supports(backdrop-filter:blur(0))]:bg-gray/50 border-black border-r bottom-0 left-0 top-8 w-8 z-20"
        ></div>

        <div class="flex w-fit lg:w-full">
            <div
                class="font-media leading-8 left-0 shrink-0 sticky tracking-widest uppercase w-8 z-20"
            >
                <div
                    class="box-content -mt-8 pb-8 z-20"
                    :style="`height: max(var(--sm-col-width) * ${month.length}, (100vw - 2rem - var(--border-width))/7 * ${month.length});`"
                    v-for="(month, i) in months"
                    :key="`month_${i}`"
                >
                    <!-- sticky container cannot have style -->
                    <div class="h-full relative">
                        <div :ref="sticky" class="ui sticky !left-0">
                            <div
                                class="py-4 translate-y-8 whitespace-nowrap [writing-mode:vertical-lr]"
                            >
                                {{ month.label }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="border-gray border-l grid grid-cols-calendar relative text-lg xl:text-2xl w-fit lg:w-full z-10"
            >
                <PathComponent :dates="dates" :since="since" :till="till" />

                <div
                    class="aspect-square relative"
                    v-for="(events, key) in sortedCalendar"
                    :key="key"
                >
                    <div class="relative -left-8 -top-8" :ref="key"></div>
                    <div class="h-full border-b border-r border-highlight">
                        <router-link
                            class="block group h-full"
                            :to="helpers.route(events[0])"
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
                                            ? 'text-gray'
                                            : 'text-highlight group-active:text-gray',
                                    ]"
                                    class="font-t3 self-center text-day"
                                >
                                    {{ events[0]._datetime.day }}
                                </div>
                            </div>

                            <div
                                class="flex flex-col h-full justify-end overflow-hidden p-1.5 relative z-30"
                            >
                                <EventTypeComponent
                                    :event="events?.[0]"
                                    class="text-gray"
                                />
                                <div class="font-media whitespace-pre-line">
                                    {{ helpers.formatTitle(events?.[0]) }}
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

    <MenuLinkComponent :to="{ name: 'info' }" class="z-40"
        >Info</MenuLinkComponent
    >

    <RouterView
        :event="calendar[selected]?.[0]"
        :prev="prev"
        :next="next"
        @close="close"
        @open="open"
    />
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import $ from 'jquery'
import slugify from 'slugify'
import { DateTime, Info } from 'luxon'
import EventTypeComponent from './components/EventTypeComponent.vue'
import PathComponent from './components/PathComponent.vue'
import MenuLinkComponent from './components/MenuLinkComponent.vue'
import helpers from './events'

export default {
    components: { EventTypeComponent, PathComponent, MenuLinkComponent },
    data() {
        return {
            now: DateTime.now(),
            date: null,
            calendar: {},
            since: null,
            till: null,
            weekdays: Info.weekdays(),
            loading: false,
            helpers,
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
        sticky(el) {
            if (!el) {
                return
            }

            this.$nextTick(() => {
                $(el).sticky({
                    container: el.parentElement,
                })
            })
        },
        scroll() {
            if (this.loading) {
                return
            }

            const delta = window.innerHeight / 2

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
                    this.$nextTick(() => {
                        this.loading = false
                    })
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
                this.$nextTick(() => {
                    this.loading = false
                })
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
                inline: 'start',
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
            const date = this.dates.find(date => {
                return date.startOf('day') > this.date
            })
            return date ? this.calendar[date.toISODate()][0] : null
        },
        prev() {
            // return this.dates.findLast(date => {
            const date = [...this.dates].reverse().find(date => {
                return date.startOf('day') < this.date
            })
            return date ? this.calendar[date.toISODate()][0] : null
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
