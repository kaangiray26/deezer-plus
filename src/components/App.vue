<template>
    <div @click="context_hide" @key.esc="context_hide" tabindex="0">
        <DeezerProvider @player_initialized="set_player_init" />
        <div v-if="player_init">
            <div class="complete-view d-flex flex-column vh-100 vw-100">
                <div class="content-view pb-4" style="flex: 1 1 auto;">
                    <NavBar ref="thisNavBar" @right-click="right_click" />
                </div>
                <div class="player-view">
                    <Player ref="thisPlayer" @queueButton="thisOffCanvas.toggle()"
                        @groupSession="thisGroupSession.toggle()" />
                </div>
            </div>
            <HelpModal ref="thisHelpModal" />
            <Context ref="thisContext" />
            <Queue ref="thisOffCanvas" />
            <Animation ref="thisAnimation" />
            <GroupSession ref="thisGroupSession" :key="groupKey" @reset="reset_group_session"
                @reaction="thisAnimation.toggle($event)" @notify="notify($event)" @message="message($event)" />
        </div>
        <liveToast ref="thisToast" :message="toastNotification"></liveToast>
        <messageToast ref="thisMessageToast" :message="toastMessage" :from="toastFrom"></messageToast>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DeezerProvider from '/components/DeezerProvider.vue';

import liveToast from "/components/liveToast.vue";
import messageToast from "/components/messageToast.vue";
import Context from '/components/Context.vue';
import NavBar from '/components/NavBar.vue';
import Player from '/components/Player.vue';
import Queue from '/components/Queue.vue';
import HelpModal from '/components/HelpModal.vue';
import GroupSession from '/components/GroupSession.vue';
import Animation from '/components/Animation.vue';

let thisContext = ref(null);
let thisOffCanvas = ref(null);
let thisNavBar = ref(null);
let thisHelpModal = ref(null);
let thisPlayer = ref(null);
let thisAnimation = ref(null);
let thisGroupSession = ref(null);

const player_init = ref(false);

const groupKey = ref(0);

let thisToast = ref(null);
let thisMessageToast = ref(null);

const toastNotification = ref("");
const toastMessage = ref("");
const toastFrom = ref("");

async function set_player_init() {
    console.log("=> Player initialized.");
    player_init.value = true;
}

async function notify(msg) {
    toastNotification.value = msg;
    thisToast.value.show();
}

async function message(obj) {
    toastMessage.value = obj.message;
    toastFrom.value = obj.from;
    thisMessageToast.value.show();
}

async function reset_group_session() {
    groupKey.value += 1;
}

async function right_click(event) {
    thisContext.value.right_click(event);
}

async function context_hide() {
    thisContext.value.hide();
}

async function keyPress(event) {
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

    if (event.target.tagName != 'INPUT' && event.key == 'g') {
        event.preventDefault();
        thisGroupSession.value.show();
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

    window.addEventListener('peer', event => {
        thisGroupSession.value.peer_event(event.detail);
    });

    window.addEventListener('notify', event => {
        notify(event.detail.n);
    });
});
</script>
