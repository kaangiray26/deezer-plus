<template>
    <div @click="hide" @keyup.esc="hide" tabindex="0">
        <DeezerProvider></DeezerProvider>
        <Context ref="thisContext"></Context>
        <NavBar @right-click="right_click"></NavBar>
        <Player></Player>
    </div>
</template>

<script setup>
import { ref } from "vue";

import NavBar from './NavBar.vue';
import Player from './Player.vue';
import Context from './Context.vue';
import DeezerProvider from './DeezerProvider.vue';

let thisContext = ref(null);

async function right_click(event) {
    thisContext.value.right_click(event);
}

async function hide() {
    thisContext.value.hide();
}
</script>
