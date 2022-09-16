<template>
    <div
        v-if="event"
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
                    @click="$emit('open', prev)"
                >
                    &larr;
                </button>
            </div>
            <div class="text-center">
                <button
                    class="text-base uppercase leading-8 active:text-highlight h-8"
                    @click="$emit('close')"
                >
                    zavrieť
                </button>
            </div>
            <div class="text-right">
                <button
                    v-show="next"
                    class="cursor-pointer text-right active:text-highlight font-[Maxeville] scale-150 h-8"
                    @click="$emit('open', next)"
                >
                    &rarr;
                </button>
            </div>
        </div>

        <div class="mx-5 lg:mx-10 my-10 pb-14 relative">
            <!-- <div v-if="event.attributes.type" class="font-gates text-xs tracking-normal leading-snug mb-0.5 uppercase">
          <span class="bg-black pb-0.5 pt-1 pl-2 pr-2.5 rounded-full text-[white] uppercase">{{ (event.attributes.type) }}</span>
        </div> -->
            <!-- <span class="font-gates tracking-normal absolute -top-6 ">{{ event.attributes.type }}</span> -->
            <!-- <h2 class="leading-tighter mr-20 text-2xl whitespace-pre-line">{{ event.attributes.title }}</h2> -->
            <div
                class="flex font-media justify-between leading-tight text-base mt-3"
            >
                <div class="uppercase">
                    <span>{{ event._datetime.toFormat('d') }}</span>
                    <span class="px-1">{{
                        event._datetime.toFormat('LLLL')
                    }}</span>
                    <span>{{ event._datetime.toFormat('yyyy') }}</span
                    ><br />
                    <span>{{ time(event._datetime) }}</span>
                </div>
                <div class="text-right">
                    vstup<br />{{ event.attributes.price }} &euro;<br />
                    <!-- <a class="underline hover:no-underline active:text-highlight" href="https://www.facebook.com/events/538614304316283" target="_blank">fb event</a> -->
                </div>
            </div>

            <!-- <img class="mb-6 mt-5" v-if="event?.attributes.image" :src="`./src/assets/${event.attributes.image}`"> -->
            <!-- <img class="mb-6 mt-5" src="/src/assets/pelada.png"> -->

            <template v-if="event.attributes.artists.data.length">
                <div
                    class="mt-10"
                    v-for="artist in event.attributes.artists.data"
                    :key="artist"
                >
                    <h3 class="my-4 text-2xl">
                        {{ artist.attributes.name }}
                    </h3>
                    <p class="font-gates my-4 tracking-normal">
                        {{ artist.attributes.description }}
                    </p>
                    <iframe
                        v-if="'bandcamp' in artist.attributes"
                        style="border: 0; width: 100%; height: 42px"
                        :src="`https://bandcamp.com/EmbeddedPlayer/album=${artist.attributes.bandcamp}/size=small/bgcol=ffffff/linkcol=333333/transparent=true/`"
                        seamless
                    ></iframe>
                    <iframe
                        v-if="'soundcloud' in artist.attributes"
                        class="w-full"
                        height="166"
                        scrolling="no"
                        frameborder="no"
                        allow="autoplay"
                        :src="`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${artist.attributes.soundcloud}&amp;color=%23000000&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false&amp;show_teaser=false`"
                    ></iframe>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { DateTime } from 'luxon'

export default {
    props: {
        event: Object,
        prev: Object,
        next: Object,
    },
    emits: ['close', 'open'],
    methods: {
        time(dt) {
            return dt.toLocaleString(DateTime.TIME_SIMPLE)
        },
    },
}
</script>
