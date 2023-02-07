<template>
    <router-link
        class="active:text-highlight"
        v-slot="{ isActive }">
        <span :class="{'text-highlight': isActive}"><slot></slot></span>
    </router-link>
</template>