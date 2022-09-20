<template>
    <div
        v-if="event.attributes.type"
        class="font-gates text-xxs md:text-xs tracking-normal leading-snug uppercase [font-variation-settings:'wght'_600]"
    >
        <span
            class="bg-black pb-[.075em] pt-[.25em] px-[.5em] tracking-normal rounded-full"
            >{{ event.attributes.type }}</span
        >
    </div>
</template>

<script>
export default {
    props: ['event'],
}
</script>
