<template>
    <div @click="context_hide" @keyup.esc="context_hide" tabindex="0">
        <DeezerProvider></DeezerProvider>
        <Context ref="thisContext"></Context>
        <NavBar @right-click="right_click"></NavBar>
        <Player @queueButton="thisOffCanvas.toggle()"></Player>
        <Queue ref="thisOffCanvas"></Queue>
    </div>
</template>

<script setup>
import { ref } from "vue";

import DeezerProvider from '/components/DeezerProvider.vue';
import Context from '/components/Context.vue';
import NavBar from '/components/NavBar.vue';
import Player from '/components/Player.vue';
import Queue from '/components/Queue.vue';

let thisContext = ref(null);
let thisOffCanvas = ref(null);

async function right_click(event) {
    thisContext.value.right_click(event);
}

async function context_hide() {
    thisContext.value.hide();
}
</script>
