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
                style="backdrop-filter: blur(5px)"
                class="bg-white/50 border-transparent border-l-3 h-8"
                v-for="weekday in weekdays"
                :key="weekday"
            >
                {{ weekday.substring(0, 2) }}
            </div>
        </div>

        <div
            style="backdrop-filter: blur(5px)"
            class="box-content fixed bg-white/50 border-black border-r-3 bottom-0 left-0 top-8 w-8 z-20"
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
                                    v-if="events?.[0].type"
                                    class="font-gates text-xxs md:text-xs tracking-normal leading-snug mb-0.5 uppercase [font-variation-settings:'wght'_600]"
                                >
                                    <span
                                        class="bg-black pb-[.075em] pt-[.25em] px-[.5em] tracking-normal rounded-full text-white"
                                        >{{ events?.[0].type }}</span
                                    >
                                </div>
                                <div class="whitespace-pre-line tracking-wide">
                                    {{ normalize(events?.[0].name) }}
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

        <div
            v-if="selected"
            class="bg-[white] border-black lg:border-l-3 bottom-0 fixed overflow-y-auto overscroll-none right-0 top-0 w-full lg:w-[calc(3*(100%-2rem+1px)/7)] z-50"
        >
            <div
                style="backdrop-filter: blur(5px)"
                class="border-black border-b-3 bg-[white]/50 grid grid-cols-3 px-5 lg:px-10 sticky top-0 w-full z-10"
            >
                <div>
                    <button
                        v-show="prev"
                        class="cursor-pointer active:text-highlight font-[Maxeville] scale-150 h-8"
                        @click="selected = prev"
                    >
                        &larr;
                    </button>
                </div>
                <div class="text-center">
                    <button
                        class="text-base uppercase leading-8 active:text-highlight h-8"
                        @click="selected = null"
                    >
                        zavrieť
                    </button>
                </div>
                <div class="text-right">
                    <button
                        v-show="next"
                        class="cursor-pointer text-right active:text-highlight font-[Maxeville] scale-150 h-8"
                        @click="selected = next"
                    >
                        &rarr;
                    </button>
                </div>
            </div>

            <div class="mx-5 lg:mx-10 my-10 pb-14 relative">
                <!-- <div v-if="calendar[selected][0].type" class="font-gates text-xs tracking-normal leading-snug mb-0.5 uppercase">
          <span class="bg-black pb-0.5 pt-1 pl-2 pr-2.5 rounded-full text-[white] uppercase">{{ (calendar[selected][0].type) }}</span>
        </div> -->
                <!-- <span class="font-gates tracking-normal absolute -top-6 ">{{ normalize(calendar[selected][0].type) }}</span> -->
                <!-- <h2 class="leading-tighter mr-20 text-2xl whitespace-pre-line">{{ normalize(calendar[selected][0].name) }}</h2> -->
                <div
                    class="flex font-media justify-between leading-tight text-base mt-3"
                >
                    <div class="uppercase">
                        <span>{{
                            calendar[selected][0]._datetime.toFormat('d')
                        }}</span>
                        <span class="px-1">{{
                            calendar[selected][0]._datetime.toFormat('LLLL')
                        }}</span>
                        <span>{{
                            calendar[selected][0]._datetime.toFormat('yyyy')
                        }}</span
                        ><br />
                        <span>{{ time(calendar[selected][0]._datetime) }}</span>
                    </div>
                    <div class="text-right">
                        vstup<br />{{
                            calendar[selected][0].price
                        }}
                        &euro;<br />
                        <!-- <a class="underline hover:no-underline active:text-highlight" href="https://www.facebook.com/events/538614304316283" target="_blank">fb event</a> -->
                    </div>
                </div>

                <!-- <img class="mb-6 mt-5" v-if="calendar[selected][0]?.image" :src="`./src/assets/${calendar[selected][0].image}`"> -->
                <!-- <img class="mb-6 mt-5" src="/src/assets/pelada.png"> -->

                <template v-if="'artists' in calendar[selected][0]">
                    <div
                        class="mt-10"
                        v-for="artist in calendar[selected][0].artists"
                        :key="artist"
                    >
                        <h3 class="my-4 text-2xl">{{ artist.name }}</h3>
                        <p class="font-gates my-4 tracking-normal">
                            {{ artist.description }}
                        </p>
                        <iframe
                            v-if="'bandcamp' in artist"
                            style="border: 0; width: 100%; height: 42px"
                            :src="`https://bandcamp.com/EmbeddedPlayer/album=${artist.bandcamp}/size=small/bgcol=ffffff/linkcol=333333/transparent=true/`"
                            seamless
                        ></iframe>
                        <iframe
                            v-if="'soundcloud' in artist"
                            class="w-full"
                            height="166"
                            scrolling="no"
                            frameborder="no"
                            allow="autoplay"
                            :src="`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${artist.soundcloud}&amp;color=%23000000&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false&amp;show_teaser=false`"
                        ></iframe>
                    </div>
                </template>
                <template v-else>
                    <div
                        class="mt-10"
                        v-for="artist in parseArtists(
                            calendar[selected][0].name
                        )"
                        :key="artist"
                    >
                        <h3 class="my-4 text-2xl">{{ normalize(artist) }}</h3>
                        <p class="font-gates my-4 tracking-normal">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nulla et odio placerat, accumsan libero non,
                            blandit elit. Ut nec ex a libero finibus mattis id
                            laoreet nisi. Orci varius natoque penatibus et
                            magnis dis parturient montes, nascetur ridiculus
                            mus. Curabitur in lorem imperdiet, dapibus ante
                            eget, tristique turpis. Aliquam ut imperdiet ligula,
                            luctus ullamcorper est. Vestibulum nec nisl
                            molestie, aliquam est vel, posuere nibh. Curabitur
                            dapibus nunc in pretium pulvinar. Curabitur ex
                            tortor, hendrerit in nunc a, imperdiet facilisis
                            neque. Vestibulum laoreet fringilla turpis sit amet
                            pretium. Praesent aliquam augue eu dolor iaculis,
                            vel iaculis purus efficitur. Ut ullamcorper orci
                            nulla, vel iaculis mauris efficitur vel.
                        </p>
                    </div>
                </template>
            </div>
        </div>

        <InfoComponent v-if="menuOpen" />
    </div>
</template>

<script>
import axios from 'axios'
import { DateTime, Info } from 'luxon'
import InfoComponent from '../components/InfoComponent.vue'
import PathComponent from '../components/PathComponent.vue'

export default {
    components: { InfoComponent, PathComponent },
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

        axios.get('/events.json').then(({ data }) => {
            this.events.push(...data)
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
                event._datetime = DateTime.fromISO(event.start)
                const date = event._datetime.toISODate()
                this.dates.push(event._datetime)
                if (date in this.calendar) {
                    this.calendar[date].push(event)
                }

                const x = (event._datetime.weekday - 1) * 100 + 50
                const weeksDiff = Math.floor(
                    event._datetime.diff(this.since, 'weeks').weeks
                )
                const y = weeksDiff * 100 + 50
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
        normalize(str) {
            return str
        },
        date(dt) {
            return dt.toLocaleString(DateTime.DATE_FULL)
        },
        time(dt) {
            return dt.toLocaleString(DateTime.TIME_SIMPLE)
        },
        parseArtists(name) {
            return name.split(',\n')
        },
    },
}
</script>
