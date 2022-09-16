<template>
    <svg
        v-if="this.dates.length"
        class="absolute left-0 right-0 z-10"
        viewBox="0 0 700 1400"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            :d="`M 0,0 ${pointsString}`"
            class="fill-transparent stroke-highlight stroke-[9px] [stroke-linejoin:bevel]"
        ></path>
    </svg>
</template>

<script>
import Victor from 'victor'
import { DateTime } from 'luxon'

export default {
    props: {
        dates: Array,
    },
    data() {
        return {
            points: [],
            since: null,
            now: DateTime.now()
                .minus({ months: 0, days: 0 })
                .plus({ months: 0, days: 0 }),
        }
    },
    created() {
        this.since = this.now
            .minus({ months: 0 })
            .startOf('month')
            .startOf('week')
    },
    computed: {
        pointsString() {
            const centers = this.dates.map(date => {
                const x = (date.weekday - 1) * 100 + 50
                const weeksDiff = Math.floor(
                    date.diff(this.since, 'weeks').weeks
                )
                const y = weeksDiff * 100 + 50

                return new Victor(x, y)
            })

            const p1s = []
            const p2s = []
            for (let i = 0; i < centers.length; i++) {
                if (i > 0) {
                    p1s.push(this.pointOnCircle(centers[i], centers[i - 1]))
                }
                if (i < centers.length - 1) {
                    p2s.push(this.pointOnCircle(centers[i], centers[i + 1]))
                }
            }

            const q1s = []
            const q2s = []
            const signs = []
            let F = 100
            for (let i = 0; i < centers.length; i++) {
                signs.push(
                    Math.sign(
                        i > 0 && i < centers.length - 1
                            ? p2s[i]
                                  .clone()
                                  .subtract(p1s[i - 1])
                                  .cross(p2s[i].clone().subtract(centers[i]))
                            : 0
                    )
                )

                if (i > 0) {
                    const f =
                        p1s[i - 1]
                            .clone()
                            .subtract(p2s[i - 1])
                            .length() == 0
                            ? 0
                            : F
                    const q1 = p1s[i - 1]
                        .clone()
                        .subtract(centers[i])
                        .rotate(-Math.PI / 2)
                        .multiplyScalar(signs[i] >= 0 ? 1 : -1)
                        .normalize()
                        .multiplyScalar(f)
                        .add(p1s[i - 1])
                    q1s.push(q1)
                }

                if (i < centers.length - 1) {
                    const f =
                        p1s[i].clone().subtract(p2s[i]).length() == 0 ? 0 : F
                    const q2 = p2s[i]
                        .clone()
                        .subtract(centers[i])
                        .rotate(Math.PI / 2)
                        .multiplyScalar(signs[i] >= 0 ? 1 : -1)
                        .normalize()
                        .multiplyScalar(f)
                        .add(p2s[i])
                    q2s.push(q2)
                }
            }

            const points = []
            for (let i = 0; i < centers.length; i++) {
                if (i < centers.length - 1) {
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

            return `M 0,0 ${path}`
        },
    },
    methods: {
        pointOnCircle(c1, c2) {
            const v = c1.clone().subtract(c2).normalize().multiplyScalar(50)
            return c1.clone().subtract(v)
        },
    },
}
</script>
