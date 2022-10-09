<template>
    <div v-if="navBarVisible" :style="{'height': navBar.clientHeight + 'px', 'color':'transparent'}">
        {{store.playerHeight =
        navBar.clientHeight}}</div>
    <nav id="playerBar" ref="navBar" class="navbar navbar-light navbar-expand fixed-bottom" style="width: 100%;">
        <div class="container-fluid">
            <div class="card border-dark border rounded shadow-lg" style="width: 100%;">
                <div class="card-body border-dark d-flex flex-column">
                    <div class="d-flex" id="player">
                        <div class="d-flex flex-fill align-items-center">
                            <div class="d-flex flex-column flex-fill">
                                <div v-if="isLoaded" class="mx-2 mb-2">
                                    <router-link :to="/track/ + track.id">{{track.title}}</router-link>
                                    <span> - </span>
                                    <router-link :to="/artist/ + artist.id">{{artist.title}}</router-link>
                                </div>
                                <div class="d-flex flex-row align-items-center">
                                    <div class="btn-group btn-group-sm me-4" role="group">
                                        <button class="btn btn-dark bi-skip-start-fill hover-color" type="button"
                                            @click="buttonPrev"></button>
                                        <button :class="{ 'bi-play-fill': !isPlaying, 'bi-pause-fill': isPlaying }"
                                            class="btn btn-dark bi hover-color" type="button"
                                            @click="buttonPlay"></button>
                                        <button class="btn btn-dark bi-skip-end-fill hover-color" type="button"
                                            @click="buttonNext"></button>
                                    </div>
                                    <span class="font-monospace mx-2">{{now}}</span>
                                    <div id="seekProgress" class="progress flex-fill" @click="seekProgress($event)">
                                        <div class="progress-bar bg-dark progress-bar-animated" aria-valuenow="0"
                                            aria-valuemin="0" aria-valuemax="100" :style="{'width': position + '%'}">
                                            <span class="visually-hidden"></span>
                                        </div>
                                    </div>
                                    <span class="font-monospace mx-2">{{duration}}</span>
                                    <div class="d-flex ms-4">
                                        <div class="btn-group">
                                            <button class="btn btn-dark bi hover-color" :class="repeat_classes[repeat]"
                                                type="button" @click="buttonRepeat">
                                            </button>
                                            <VolumeButton ref="thisTooltip" @change-volume="changeVolume($event)"
                                                @trigger-volume="triggerVolume" :mute="mute" :volumeLevel="volumeLevel">
                                            </VolumeButton>
                                            <button class="btn btn-dark bi bi-collection hover-color" type="button"
                                                @click="$emit('queueButton')">
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    <Scrobbler ref="thisScrobbler" :isPlaying="isPlaying"></Scrobbler>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { store } from '/js/store.js';
import { addToQueue, removeFromQueue, getQueue, clearQueue, getQueueTracks } from '/js/queue.js';

import VolumeButton from "/components/VolumeButton.vue";
import Scrobbler from "/components/Scrobbler.vue";

const isPlaying = ref(false);
const isLoaded = ref(false);

const position = ref(0);

const track = ref({ title: '', id: '', duration: 0 });
const album = ref({ title: '', id: '' });
const artist = ref({ title: '', id: '' });

const navBar = ref(null);
const navBarVisible = ref(false);

let thisTooltip = ref(null);
let thisScrobbler = ref(null);

const repeat = ref(0);
const repeat_classes = {
    0: 'bi-repeat text-muted',
    1: 'bi-repeat',
    2: 'bi bi-repeat-1'
}

const mute = ref(false);
const volumeLevel = ref(100);

const progress_x = ref(0);
const progress_width = ref(0);
const progress_max = ref(0);

const now = ref('00:00');
const duration = ref('00:00');

async function buttonPlay() {
    if (DZ.player.getCurrentTrack()) {
        if (isPlaying.value) {
            DZ.player.pause();
        } else {
            DZ.player.play();
        }
        return;
    }

    getQueueTracks().then(tracks => {
        DZ.player.playTracks(tracks);
    });
}

async function buttonNext() {
    getQueueTracks().then(tracks => {
        let index = (DZ.player.getCurrentIndex() + 1) % tracks.length;
        DZ.player.playTracks(tracks, index);
    });
}

async function buttonPrev() {
    getQueueTracks().then(tracks => {
        let index = (DZ.player.getCurrentIndex() - 1) % tracks.length;
        DZ.player.playTracks(tracks, index);
    });
}

async function buttonRepeat() {
    repeat.value = (DZ.player.getRepeat() + 1) % 3;
    DZ.player.setRepeat(repeat.value);
}

async function seekProgress(event) {
    let pos = event.offsetX;

    if (pos <= 0) {
        DZ.player.seek(0);
        return;
    }

    if (pos >= progress_width.value) {
        DZ.player.seek(100);
        return;
    }

    DZ.player.seek(pos / progress_width.value * 100);
    return;
}

async function changeVolume(obj) {
    if (obj.event.wheelDelta > 0) {
        raiseVolume();
    } else {
        lowerVolume();
    }
}

async function triggerVolume() {
    if (DZ.player.getMute()) {
        DZ.player.setMute(false);
        return;
    }
    DZ.player.setMute(true);
}

async function raiseVolume() {
    let volume = DZ.player.getVolume();
    volume += 5;
    if (volume >= 100) {
        DZ.player.setVolume(100);
        return;
    }
    DZ.player.setVolume(volume);
}

async function lowerVolume() {
    let volume = DZ.player.getVolume();
    volume -= 5;
    if (volume <= 0) {
        DZ.player.setVolume(0);
        return;
    }
    DZ.player.setVolume(volume);
}

async function showVolume() {
    thisTooltip.value.show();
}

function padWithZero(num) {
    return String(num).padStart(2, '0');
}

function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - minutes * 60);
    return padWithZero(minutes) + ":" + padWithZero(seconds);
}


DZ.Event.subscribe('player_play', async function () {
    isPlaying.value = true;
    if (store.scrobbling) {
        thisScrobbler.value.updateNowPlaying({
            artist: artist.value.title,
            track: track.value.title,
            album: album.value.title,
            duration: track.value.duration,
        });
    }
});

DZ.Event.subscribe('player_paused', async function () {
    isPlaying.value = false;
});

DZ.Event.subscribe('current_track', async function (obj) {
    track.value.id = obj.track.id;
    track.value.title = obj.track.title;
    track.value.duration = obj.track.duration;

    album.value.id = obj.track.album.id;
    album.value.title = obj.track.album.title;

    artist.value.id = obj.track.artist.id;
    artist.value.title = obj.track.artist.name;

    duration.value = formatTime(parseInt(obj.track.duration));

    document.title = track.value.title + ' - ' + artist.value.title;

    if (!isLoaded.value) {
        DZ.player.playTracks([...DZ.player.getTrackList().map(item => parseInt(item.id))]);
        isLoaded.value = true;
    }
});

DZ.Event.subscribe('player_position', async function (arr) {
    now.value = formatTime(arr[0]);
    position.value = arr[0] / arr[1] * 100;
});

DZ.Event.subscribe('mute_changed', async function (val) {
    mute.value = val;
});

DZ.Event.subscribe('volume_changed', async function (val) {
    volumeLevel.value = val;
});

DZ.Event.subscribe('track_end', async function (val) {
    console.log("Track ending:", val);
})

defineExpose({
    buttonPlay,
    buttonRepeat,
    buttonNext,
    buttonPrev,
    triggerVolume,
    raiseVolume,
    lowerVolume,
    showVolume,
});

onMounted(() => {
    let box = document.getElementById('seekProgress').getBoundingClientRect();
    progress_x.value = box.x;
    progress_width.value = box.width;
    progress_max.value = box.x + box.width;
    navBarVisible.value = true;
});
</script>