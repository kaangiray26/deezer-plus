<template>
    <nav class="navbar navbar-light navbar-expand fixed-bottom" id="playerBar" style="width: 100%;">
        <div class="container-fluid">
            <div class="card border-dark border rounded shadow-lg" style="width: 100%;">
                <div class="card-body border-dark d-flex flex-column">
                    <div class="d-flex" id="player">
                        <div class="d-flex flex-fill align-items-center">
                            <div class="d-flex flex-column flex-fill">
                                <div v-if="isLoaded" class="mx-2 mb-2">
                                    <a :href="/track/ + track.id">{{track.title}}</a>
                                    <span> - </span>
                                    <a :href="/artist/ + artist.id">{{artist.title}}</a>
                                </div>
                                <div class="d-flex flex-row align-items-center">
                                    <div class="btn-group btn-group-sm me-4" role="group"><button
                                            class="btn btn-dark bi-skip-start-fill hover-color" type="button"
                                            onclick="buttonBack()"></button><button
                                            :class="{ 'bi-play-fill': !isPlaying, 'bi-pause-fill': isPlaying }"
                                            class="btn btn-dark bi hover-color" type="button"
                                            v-on:click="buttonPlay"></button><button
                                            class="btn btn-dark bi-skip-end-fill hover-color" type="button"
                                            onclick="buttonNext()"></button></div>
                                    <span class="font-monospace mx-2">{{now}}</span>
                                    <div class="progress flex-fill">
                                        <div class="progress-bar bg-dark progress-bar progress-bar-animated"
                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                            :style="{'width': position + '%'}"><span class="visually-hidden"></span>
                                        </div>
                                    </div>
                                    <span class="font-monospace mx-2">{{duration}}</span>
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
import { ref } from "vue";

const isPlaying = ref(false);
const isLoaded = ref(false);

const position = ref(0);

const track = ref({ title: '', id: '' });
const album = ref({ title: '', id: '' });
const artist = ref({ title: '', id: '' });

const now = ref('00:00');
const duration = ref('00:00');

DZ.Event.subscribe('player_play', function () {
    isPlaying.value = true;
});

DZ.Event.subscribe('track_end', function () {
    isPlaying.value = false;
});

DZ.Event.subscribe('current_track', function (obj) {
    track.value.title = obj.track.title;
    track.value.id = obj.track.id;
    artist.value.title = obj.track.artist.name;
    artist.value.id = obj.track.artist.id;
    duration.value = formatTime(parseInt(obj.track.duration));
    isLoaded.value = true;
});

DZ.Event.subscribe('player_position', function (arr) {
    now.value = formatTime(arr[0]);
    position.value = arr[0] / arr[1] * 100;
});

function buttonPlay() {
    if (isPlaying.value) {
        DZ.player.pause();
    } else {
        DZ.player.play();
    }
    isPlaying.value = !isPlaying.value;
}

function padWithZero(num) {
    return String(num).padStart(2, '0');
}

function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - minutes * 60);
    return padWithZero(minutes) + ":" + padWithZero(seconds);
}
</script>