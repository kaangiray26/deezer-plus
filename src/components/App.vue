<template>
    <div @click="hide" @keyup.esc="hide" tabindex="0">
        <DeezerProvider></DeezerProvider>
        <Context ref="thisContext"></Context>
        <NavBar @right-click="right_click"></NavBar>
        <Queue ref="thisOffCanvas"></Queue>
        <Player @queueButton="thisOffCanvas.toggle()"></Player>
    </div>
</template>

<script setup>
import { ref } from "vue";

import DeezerProvider from '/components/DeezerProvider.vue';
import Context from '/components/Context.vue';
import NavBar from '/components/NavBar.vue';
import Queue from '/components/Queue.vue';
import Player from '/components/Player.vue';

let thisContext = ref(null);
let thisOffCanvas = ref(null);

async function right_click(event) {
    thisContext.value.right_click(event);
}

async function hide() {
    thisContext.value.hide();
}
</script>
