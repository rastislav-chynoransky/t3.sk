<template>
    <svg
        v-if="since && till"
        class="absolute left-0 right-0 z-10"
        :viewBox="`0 0 700 ${height}`"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            :d="path"
            class="fill-transparent stroke-highlight stroke-[9px] [stroke-linejoin:bevel]"
        ></path>

        <circle
            class="fill-transparent stroke-highlight stroke-[9px] [stroke-linejoin:bevel]"
            v-if="centers.length"
            :cx="centers[0].x"
            :cy="centers[0].y"
            r="50"
        />
        <circle
            class="fill-transparent stroke-highlight stroke-[9px] [stroke-linejoin:bevel]"
            v-if="centers.length"
            :cx="centers[centers.length - 1].x"
            :cy="centers[centers.length - 1].y"
            r="50"
        />
    </svg>
</template>

<script>
import Victor from 'victor'
import { DateTime } from 'luxon'

export default {
    props: {
        dates: Array,
        since: DateTime,
        till: DateTime,
    },
    computed: {
        centers() {
            return this.dates.map(date => {
                const x = (date.weekday - 1) * 100 + 50
                const weeksDiff = Math.floor(
                    date.diff(this.since, 'weeks').weeks
                )
                const y = weeksDiff * 100 + 50

                return new Victor(x, y)
            })
        },
        height() {
            return this.till.diff(this.since, 'weeks').weeks * 100
        },
        path() {
            const p1s = []
            const p2s = []
            for (let i = 0; i < this.centers.length; i++) {
                if (i > 0) {
                    p1s.push(
                        this.pointOnCircle(this.centers[i], this.centers[i - 1])
                    )
                }
                if (i < this.centers.length - 1) {
                    p2s.push(
                        this.pointOnCircle(this.centers[i], this.centers[i + 1])
                    )
                }
            }

            const q1s = []
            const q2s = []
            const signs = []
            let F = 100
            for (let i = 0; i < this.centers.length; i++) {
                signs.push(
                    Math.sign(
                        i > 0 && i < this.centers.length - 1
                            ? p2s[i]
                                  .clone()
                                  .subtract(p1s[i - 1])
                                  .cross(
                                      p2s[i].clone().subtract(this.centers[i])
                                  )
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
                        .subtract(this.centers[i])
                        .rotate(-Math.PI / 2)
                        .multiplyScalar(signs[i] >= 0 ? 1 : -1)
                        .normalize()
                        .multiplyScalar(f)
                        .add(p1s[i - 1])
                    q1s.push(q1)
                }

                if (i < this.centers.length - 1) {
                    const f =
                        p1s[i].clone().subtract(p2s[i]).length() == 0 ? 0 : F
                    const q2 = p2s[i]
                        .clone()
                        .subtract(this.centers[i])
                        .rotate(Math.PI / 2)
                        .multiplyScalar(signs[i] >= 0 ? 1 : -1)
                        .normalize()
                        .multiplyScalar(f)
                        .add(p2s[i])
                    q2s.push(q2)
                }
            }

            const points = []
            for (let i = 0; i < this.centers.length; i++) {
                if (i < this.centers.length - 1) {
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

            return path
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
