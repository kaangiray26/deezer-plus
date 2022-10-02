<template>
    <div v-if="navBarVisible" :style="{'height': navBar.clientHeight + 'px'}"></div>
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
                                                type="button" @click="buttonRepeat"></button>
                                            <button class="btn btn-dark bi bi-collection hover-color" type="button"
                                                @click="$emit('queueButton')"></button>
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
</template>

<script setup>
import { ref, onMounted } from "vue";

const isPlaying = ref(false);
const isLoaded = ref(false);

const position = ref(0);

const track = ref({ title: '', id: '' });
const artist = ref({ title: '', id: '' });

const navBar = ref(null);
const navBarVisible = ref(false);

const repeat = ref(0);
const repeat_classes = {
    0: 'bi-repeat text-muted',
    1: 'bi-repeat',
    2: 'bi bi-repeat-1'
}

const progress_x = ref(0);
const progress_width = ref(0);
const progress_max = ref(0);

const now = ref('00:00');
const duration = ref('00:00');

async function buttonPlay() {
    if (isPlaying.value) {
        DZ.player.pause();
    } else {
        DZ.player.play();
    }
}

async function buttonNext() {
    let tracklist = [...DZ.player.getTrackList().map(item => parseInt(item.id))];
    let index = (DZ.player.getCurrentIndex() + 1) % tracklist.length;
    DZ.player.playTracks(tracklist, index);
}

async function buttonPrev() {
    let tracklist = [...DZ.player.getTrackList().map(item => parseInt(item.id))];
    let index = (DZ.player.getCurrentIndex() - 1) % tracklist.length;
    DZ.player.playTracks(tracklist, index);
}

async function buttonRepeat() {
    repeat.value = (DZ.player.getRepeat() + 1) % 3;
    DZ.player.setRepeat(repeat.value);
}

async function buttonQueue() {
    thisCollapse.value.refresh();
    thisCollapse.value.toggle();
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

function padWithZero(num) {
    return String(num).padStart(2, '0');
}

function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - minutes * 60);
    return padWithZero(minutes) + ":" + padWithZero(seconds);
}

DZ.Event.subscribe('player_play', function () {
    isPlaying.value = true;
});

DZ.Event.subscribe('player_paused', function () {
    isPlaying.value = false;
});

DZ.Event.subscribe('current_track', function (obj) {
    track.value.title = obj.track.title;
    track.value.id = obj.track.id;
    artist.value.title = obj.track.artist.name;
    artist.value.id = obj.track.artist.id;
    duration.value = formatTime(parseInt(obj.track.duration));

    if (!isLoaded.value) {
        DZ.player.playTracks([...DZ.player.getTrackList().map(item => parseInt(item.id))]);
        isLoaded.value = true;
    }
});

DZ.Event.subscribe('player_position', function (arr) {
    now.value = formatTime(arr[0]);
    position.value = arr[0] / arr[1] * 100;
});

onMounted(() => {
    let box = document.getElementById('seekProgress').getBoundingClientRect();
    progress_x.value = box.x;
    progress_width.value = box.width;
    progress_max.value = box.x + box.width;
    navBarVisible.value = true;
});
</script>