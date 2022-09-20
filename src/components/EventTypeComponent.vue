<template>
    <div class="leading-none pb-0.5 text-xxs md:text-xs">
        <span
            class="bg-black [font-variation-settings:'wght'_600] pt-[.25em] px-[.5em] rounded-full uppercase"
            v-if="event.attributes.type"
            >{{ event.attributes.type }}</span
        >
    </div>
</template>

<script>
export default {
    props: ['event'],
}
</script>
