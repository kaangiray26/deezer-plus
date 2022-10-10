<template>
    <div @click="context_hide" @key.esc="context_hide" tabindex="0">
        <HelpModal ref="thisHelpModal"></HelpModal>
        <DeezerProvider></DeezerProvider>
        <Context ref="thisContext"></Context>
        <NavBar ref="thisNavBar" @right-click="right_click"></NavBar>
        <Player ref="thisPlayer" @queueButton="thisOffCanvas.toggle()"></Player>
        <Queue ref="thisOffCanvas"></Queue>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import DeezerProvider from '/components/DeezerProvider.vue';
import Context from '/components/Context.vue';
import NavBar from '/components/NavBar.vue';
import Player from '/components/Player.vue';
import Queue from '/components/Queue.vue';
import HelpModal from '/components/HelpModal.vue';

let thisContext = ref(null);
let thisOffCanvas = ref(null);
let thisNavBar = ref(null);
let thisHelpModal = ref(null);
let thisPlayer = ref(null);

async function right_click(event) {
    thisContext.value.right_click(event);
}

async function context_hide() {
    thisContext.value.hide();
}

async function keyPress(event) {
    console.log("Event:", event);
    console.log(event.target.tagName);

    if (event.target.tagName != 'INPUT' && event.key == 's') {
        event.preventDefault();
        thisNavBar.value.focus_search();
        return;
    }

    if (event.target.tagName != 'INPUT' && event.key == 'h') {
        event.preventDefault();
        thisHelpModal.value.show();
        return;
    }

    if (event.target.tagName != 'INPUT' && event.key == 'q') {
        event.preventDefault();
        thisOffCanvas.value.show();
        return;
    }

    if (event.target.tagName != 'INPUT' && event.code == 'Space') {
        event.preventDefault();
        thisPlayer.value.buttonPlay();
        return;
    }

    if (event.target.tagName != 'INPUT' && event.key == 'm') {
        event.preventDefault();
        thisPlayer.value.triggerVolume();
        return;
    }

    if (event.target.tagName != 'INPUT' && event.key == 'r') {
        event.preventDefault();
        thisPlayer.value.buttonRepeat();
        return;
    }

    if (event.target.tagName != 'INPUT' && event.key == 'ArrowUp') {
        event.preventDefault();
        thisPlayer.value.raiseVolume();
        thisPlayer.value.showVolume();
        return;
    }

    if (event.target.tagName != 'INPUT' && event.key == 'ArrowDown') {
        event.preventDefault();
        thisPlayer.value.lowerVolume();
        thisPlayer.value.showVolume();
        return;
    }

    if (event.target.tagName != 'INPUT' && event.key == 'ArrowLeft') {
        event.preventDefault();
        thisPlayer.value.buttonPrev();
        return;
    }

    if (event.target.tagName != 'INPUT' && event.key == 'ArrowRight') {
        event.preventDefault();
        thisPlayer.value.buttonNext();
        return;
    }

}

onMounted(() => {
    window.focus();
    window.addEventListener('keydown', keyPress);
});
</script>
