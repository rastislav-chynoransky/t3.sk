<template>
    <div class="font-media text-black">
        <div
            @click="scrollToToday"
            class="active:bg-highlight bg-white box-content border-black border-b-3 border-r-3 cursor-pointer fixed h-8 leading-8 left-0 text-base text-center text-black top-0 w-8 z-30"
        >
            T3
        </div>

        <div
            class="border-black border-b-3 lg:border-x-3 top-0 grid grid-cols-calendar leading-8 ml-8 sticky text-center text-base w-fit lg:w-auto z-20 uppercase"
        >
            <div
                class="backdrop-blur-sm bg-white/50 border-transparent border-l-3 h-8"
                v-for="weekday in weekdays"
                :key="weekday"
            >
                {{ weekday.substring(0, 2) }}
            </div>
        </div>

        <div
            class="backdrop-blur-sm box-content fixed bg-white/50 border-black border-r-3 bottom-0 left-0 top-8 w-8 z-20"
        ></div>

        <div class="flex w-fit">
            <div class="sticky left-0 z-20 w-8 shrink-0">
                <div
                    class="text-base leading-8 uppercase z-20"
                    :style="`height: max(8rem * ${month.length}, (100vw - 2rem)/7 * ${month.length});`"
                    v-for="month in [
                        { datetime: now, start: 0, length: 4 },
                        {
                            datetime: now.plus({ months: 1 }),
                            start: 4,
                            length: 5,
                        },
                        {
                            datetime: now.plus({ months: 2 }),
                            start: 9,
                            length: 5,
                        },
                    ]"
                    :key="month.start"
                >
                    <div v-sticky="{ topSpacing: 32 }">
                        <div
                            class="py-4 whitespace-nowrap [writing-mode:vertical-lr]"
                        >
                            {{ month.datetime.toFormat('LLLL yyyy') }}
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="border-white border-l-3 grid grid-cols-calendar relative text-lg lg:text-lg xl:text-2xl w-fit lg:w-auto z-10"
            >
                <PathComponent :dates="dates" />

                <div
                    class="aspect-square leading-tighter relative"
                    v-for="(events, date) in calendar"
                    :key="date"
                >
                    <div
                        v-if="isToday(date)"
                        class="relative -top-8"
                        ref="today"
                    ></div>
                    <div class="h-full border-b-3 border-r-3 border-highlight">
                        <div
                            class="cursor-pointer group h-full"
                            @click="click(date)"
                            v-if="events.length"
                        >
                            <div
                                :class="[
                                    date == selected ? 'bg-highlight' : '',
                                ]"
                                class="absolute flex h-full justify-center rounded-[50%] transition-[border-radius] group-hover:bg-highlight w-full z-20"
                            >
                                <div
                                    :class="[
                                        isToday(date)
                                            ? 'text-red'
                                            : date == selected
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
                                <div
                                    v-if="events?.[0].attributes.type"
                                    class="font-gates text-xxs md:text-xs tracking-normal leading-snug mb-0.5 uppercase [font-variation-settings:'wght'_600]"
                                >
                                    <span
                                        class="bg-black pb-[.075em] pt-[.25em] px-[.5em] tracking-normal rounded-full text-white"
                                        >{{ events?.[0].attributes.type }}</span
                                    >
                                </div>
                                <div class="whitespace-pre-line tracking-wide">
                                    {{ events?.[0].attributes.title }}
                                </div>
                            </div>
                        </div>
                        <div class="h-full" v-else-if="isToday(date)">
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

        <button
            @click="menuOpen = !menuOpen"
            class="fixed bottom-0 mx-2 my-2 px-2 right-0 text-4xl lg:text-5xl uppercase z-50 active:text-highlight"
        >
            {{ menuOpen ? 'Program' : 'Info' }}
        </button>

        <DetailComponent
            :event="calendar[selected]?.[0]"
            :prev="prev"
            :next="next"
            @open="event => (selected = event)"
            @close="selected = null"
        />

        <InfoComponent v-if="menuOpen" />
    </div>
</template>

<script>
import axios from 'axios'
import { DateTime, Info } from 'luxon'
import InfoComponent from '../components/InfoComponent.vue'
import PathComponent from '../components/PathComponent.vue'
import DetailComponent from '../components/DetailComponent.vue'

export default {
    components: { InfoComponent, PathComponent, DetailComponent },
    data() {
        return {
            dates: [],
            events: [],
            calendar: {},
            selected: null,
            since: null,
            till: null,
            now: DateTime.now()
                .minus({ months: 0, days: 0 })
                .plus({ months: 0, days: 0 }),
            menuOpen: false,
            weekdays: Info.weekdays(),
        }
    },
    created() {
        if (history.scrollRestoration) {
            history.scrollRestoration = 'manual'
        }

        this.since = this.now
            .minus({ months: 0 })
            .startOf('month')
            .startOf('week')
        this.till = this.now.plus({ months: 2 }).endOf('month').endOf('week')

        for (let i = this.since; i <= this.till; i = i.plus({ days: 1 })) {
            this.calendar[i.toISODate()] = []
        }

        const url = `${
            import.meta.env.VITE_API_URL
        }/events?populate=*&sort[0]=start`

        axios.get(url).then(({ data }) => {
            this.events.push(...data.data)
            this.refreshData()

            this.$nextTick(() => {
                this.scrollToToday()
            })
        })
    },
    watch: {
        events: {
            handler() {
                // this.refreshData()
            },
            deep: true,
        },
    },
    computed: {
        next() {
            return Object.entries(this.calendar)
                .filter(([key, value]) => {
                    return value.length > 0
                })
                .find(([key, value]) => {
                    return key > this.selected
                })?.[0]
        },
        prev() {
            return Object.entries(this.calendar)
                .filter(([key, value]) => {
                    return value.length > 0
                })
                .reverse()
                .find(([key, value]) => {
                    return key < this.selected
                })?.[0]
        },
    },
    methods: {
        refreshData() {
            for (const event of this.events) {
                event._datetime = DateTime.fromISO(event.attributes.start)
                const date = event._datetime.toISODate()
                this.dates.push(event._datetime)
                if (date in this.calendar) {
                    this.calendar[date].push(event)
                }
            }
        },
        click(date) {
            this.selected = date
        },
        isToday(date) {
            return date === this.now.toISODate()
        },
        scrollToToday() {
            this.$refs.today[0].scrollIntoView({
                behavior: 'smooth',
            })
        },
    },
}
</script>
