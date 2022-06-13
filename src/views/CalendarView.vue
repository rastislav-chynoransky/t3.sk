<template>
  <div class="font-univers text-black">
    <div @click="scrollToToday"  class="active:bg-highlight bg-white/50 box-content border-[black] border-b-3 border-r-3 cursor-pointer fixed h-8 leading-8 left-0 text-base text-center text-black top-0 w-8 z-50">T3</div>

    <div class="border-[black] border-b-3 lg:border-x-3 top-0 grid grid-cols-calendar leading-8 ml-8 sticky text-center text-base w-fit lg:w-auto z-20 uppercase">
        <div style="backdrop-filter: blur(5px);" class="bg-white/50 border-transparent border-l-3 h-8" v-for="weekday in weekdays" :key="weekday">{{ weekday.substring(0, 2) }}</div>
    </div>

    <div style="backdrop-filter: blur(5px);" class="bg-white/50 border-[black] border-r-3 bottom-0 box-content fixed left-0 top-8 w-8 z-20">
      <div class="fixed left-8 origin-top-left rotate-90 text-base leading-8 uppercase">
        <span class="px-4 whitespace-nowrap">{{ now.toFormat('LLLL yyyy') }}</span>
      </div>
    </div>

    <div class="border-[white] border-l-3 grid grid-cols-calendar ml-8 relative text-lg lg:text-2xl w-fit lg:w-auto z-10">
        <svg ref="svg" class="absolute left-0 right-0 z-10" viewBox="0 0 700 1400" xmlns="http://www.w3.org/2000/svg">
            <path class="fill-transparent stroke-highlight stroke-[9px] [stroke-linejoin:bevel]" ></path>
        </svg>

        <div class="aspect-square border-r-3 border-b-3 border-highlight leading-tighter relative" v-for="(events, date) in calendar" :key="date">
          <div v-if="isToday(date)" class="relative -top-8" ref="today"></div>
          <div class="h-full">
            <div class="cursor-pointer group h-full" @click="click(date)" v-if="events.length">
              <div :class="[ date == selected ? 'bg-highlight' : '' ]" class="absolute flex h-full justify-center rounded-[50%] transition-[border-radius] group-hover:bg-highlight w-full z-20">
                  <div :class="[ date == selected ? 'text-white' : 'text-highlight' ]" class="font-t3 self-center group-hover:text-white text-[clamp(5rem,8.5vw,8.5vw)] group-hover:[text-shadow:0]" :style="[isToday(date) && date != selected ? 'text-shadow: red 0 0 .5rem' : '']">{{ events[0]._datetime.day }}</div>
              </div>

              <div class="flex flex-col h-full justify-end overflow-hidden p-2 relative z-30">
                  <div class="font-gates text-xs tracking-normal leading-snug mb-0.5 uppercase"><span v-if="events?.[0].type" class="bg-black pb-0.5 pt-1 pl-2 pr-2.5 tracking-normal rounded-full text-white">{{ (events?.[0].type) }}</span></div>
                  <div class="whitespace-pre-line tracking-wide">{{ normalize(events?.[0].name) }}</div>
              </div>
            </div>
            <div class="h-full" v-else-if="isToday(date)">
              <div class="absolute flex h-full justify-center w-full">
                  <div class="font-t3 self-center text-[clamp(5rem,9vw,9vw)] text-white" style="text-shadow: red 0 0 .5rem">{{ now.day }}</div>
              </div>
            </div>
          </div>
        </div>
    </div>

    <button @click="menuOpen = !menuOpen" class="fixed bottom-0 p-5 right-0 text-5xl uppercase z-50 active:text-highlight">
      Info
    </button>

    <div v-if="selected" class="bg-[white] border-black lg:border-l-3 bottom-0 fixed overflow-y-auto overscroll-none right-0 top-0 w-full lg:w-[calc(3*(100%-2rem+1px)/7)] z-50">

      <div style="backdrop-filter: blur(5px);" class="border-black border-b-3 bg-[white]/50 grid grid-cols-3 px-10 sticky top-0 w-full z-10">
        <div><button v-show="prev" class="cursor-pointer  active:text-highlight font-[Maxeville] scale-150 h-8 " @click="selected = prev">&larr;</button></div>
        <div class="text-center"><button class="text-base uppercase leading-8 active:text-highlight h-8 " @click="selected = null">close</button></div>
        <div class="text-right"><button v-show="next" class="cursor-pointer text-right  active:text-highlight font-[Maxeville] scale-150 h-8 " @click="selected = next">&rarr;</button></div>
      </div>

      <div class="mx-10 my-10 pb-10 relative">

        <div class="font-gates text-xs tracking-normal leading-snug mb-0.5 uppercase"><span v-if="calendar[selected][0].type" class="bg-black pb-0.5 pt-1 pl-2 pr-2.5 rounded-full text-[white] uppercase">{{ (calendar[selected][0].type) }}</span></div>
        <!-- <span class="font-gates tracking-normal absolute -top-6 ">{{ normalize(calendar[selected][0].type) }}</span> -->
        <!-- <h2 class="leading-tighter mr-20 text-2xl whitespace-pre-line">{{ normalize(calendar[selected][0].name) }}</h2> -->
        <div class="flex font-gates justify-between tracking-normal mt-3 leading-tight">
          <div>Odporúčané 10 &euro;</div>
          <div>{{ date(calendar[selected][0]._datetime)  }}<br>{{ time(calendar[selected][0]._datetime) }}</div>
        </div>

        <!-- <img class="mb-6 mt-5" v-if="calendar[selected][0]?.image" :src="`./src/assets/${calendar[selected][0].image}`"> -->
        <!-- <img class="mb-6 mt-5" src="/src/assets/pelada.png"> -->

        <div v-for="artist in parseArtists(calendar[selected][0].name)" :key="artist">
          <h3 class="mt-4 text-2xl">{{ normalize(artist) }}</h3>
          <p class="font-gates my-4 tracking-normal">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et odio placerat, accumsan libero non, blandit elit. Ut nec ex a libero finibus mattis id laoreet nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur in lorem imperdiet, dapibus ante eget, tristique turpis. Aliquam ut imperdiet ligula, luctus ullamcorper est. Vestibulum nec nisl molestie, aliquam est vel, posuere nibh. Curabitur dapibus nunc in pretium pulvinar. Curabitur ex tortor, hendrerit in nunc a, imperdiet facilisis neque. Vestibulum laoreet fringilla turpis sit amet pretium. Praesent aliquam augue eu dolor iaculis, vel iaculis purus efficitur. Ut ullamcorper orci nulla, vel iaculis mauris efficitur vel.</p>
          <iframe style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/album=4180549449/size=small/bgcol=ffffff/linkcol=333333/transparent=true/" seamless><a href="https://pelada.bandcamp.com/album/movimiento-para-cambio">Movimiento Para Cambio by Pelada</a></iframe>        </div>
      </div>
    </div>

    <InfoComponent v-if="menuOpen" />
  </div>

</template>

<script>
import axios from 'axios'
import Victor from 'victor'
import { DateTime, Info } from 'luxon'
import InfoComponent from '../components/InfoComponent.vue'

export default {
  components: { InfoComponent },
  data() {
    return {
      events: [],
      calendar: {},
      selected: null,
      pointToDate: [],
      points: [],
      since: null,
      till: null,
      now: DateTime.now().minus({ months: 0, days: 0 }).plus({ months: 0, days: 0 }),
      menuOpen: false,
      weekdays: Info.weekdays()
    }
  },
  created() {
    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual';
    }

    this.since = this.now.minus({ months: 0 }).startOf('month').startOf('week')
    this.till = this.now.plus({ months: 2 }).endOf('month').endOf('week')

    for (let i = this.since; i <= this.till; i = i.plus({ days: 1 })) {
      this.calendar[i.toISODate()] = []
    }

    axios.get('/src/assets/events.json')
      .then(({ data }) => {
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
      deep: true
    }
  },
  computed: {
    pointsString() {
      const path = this.points.map(({ x, y }, i) => {
        return `0,0 ${x},${y}`
      }).join(' ')

      return `M 0,0 S${path}`
    },
    next() {
      return Object.entries(this.calendar)
        .filter(([key, value]) => {
          return value.length > 0
        })
        .find(([key, value]) => {
          return key > this.selected
        })
        ?.[0]
    },
    prev() {
      return Object.entries(this.calendar)
        .filter(([key, value]) => {
          return value.length > 0
        })
        .reverse()
        .find(([key, value]) => {
          return key < this.selected
        })
        ?.[0]
    },
  },
  methods: {
    refreshData() {
      for (const event of this.events) {
        event._datetime = DateTime.fromISO(event.start)
        const date = event._datetime.toISODate()
        if (date in this.calendar) {
          this.calendar[date].push(event)
          if (this.calendar[date].length === 1) {
            const x = (event._datetime.weekday - 1) * 100 + 50
            const weeksDiff = Math.floor(event._datetime.diff(this.since, 'weeks').weeks)
            const y = weeksDiff * 100 + 50

            this.pointToDate.push(event._datetime)
            this.points.push(new Victor(x, y))
          }
        }
      }

      this.updatePoints()
    },
    pointOnCircle(c1, c2) {
      const v = c1
        .clone()
        .subtract(c2)
        .normalize()
        .multiplyScalar(50)

      return c1.clone().subtract(v)
    },
    updatePoints() {
      const p1s = []
      const p2s = []
      for (let i = 0; i < this.points.length; i++) {
        if (i > 0) {
          p1s.push(this.pointOnCircle(this.points[i], this.points[i - 1]))
        }
        if (i < this.points.length - 1) {
          p2s.push(this.pointOnCircle(this.points[i], this.points[i + 1]))
        }
      }

      const q1s = []
      const q2s = []
      const signs = []
      let F = 100
      for (let i = 0; i < this.points.length; i++) {
        signs.push(Math.sign(
          i > 0 && i < this.points.length - 1
          ? p2s[i].clone().subtract(p1s[i - 1]).cross(
            p2s[i].clone().subtract(this.points[i])
          )
          : 0
        ))

        if (i > 0) {
          const f = p1s[i - 1].clone().subtract(p2s[i - 1]).length() == 0 ? 0 : F;
          const q1 = p1s[i - 1]
            .clone()
            .subtract(this.points[i])
            .rotate(-Math.PI / 2)
            .multiplyScalar(signs[i] >= 0 ? 1 : -1)
            .normalize()
            .multiplyScalar(f)
            .add(p1s[i - 1])
          q1s.push(q1)
        }

        if (i < this.points.length - 1) {
          const f = p1s[i].clone().subtract(p2s[i]).length() == 0 ? 0 : F;
          const q2 = p2s[i]
            .clone()
            .subtract(this.points[i])
            .rotate(Math.PI / 2)
            .multiplyScalar(signs[i] >= 0 ? 1 : -1)
            .normalize()
            .multiplyScalar(f)
            .add(p2s[i])
          q2s.push(q2)
        }
      }

      const points = []
      for (let i = 0; i < this.points.length; i++) {
        if (i > 0) {
        }
        if (i < this.points.length - 1) {
          points.push(`A 50 50 0 1 ${signs[i] < 0 ? 0 : 1}`, p2s[i])
          points.push('C', q2s[i], q1s[i], p1s[i])
        }
      }

      const path = points
        .map(v => {
          if (typeof v === 'string') {
            return v
          } else {
            return `${v.x},${v.y}`
          }
        })
        .join(' ')
      this.$refs.svg.querySelector('path').setAttribute('d', `M 0,0 ${path}`)
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
      return name.split('.\n')
    }
  }
}
</script>