<template>
    <div ref="desktopPlayer" class="card border-top border-dark hide-on-mobile">
        <div class="card-body d-flex flex-column">
            <div class="d-flex" id="player">
                <div class="d-flex flex-fill align-items-center">
                    <div class="d-flex flex-column flex-fill">
                        <div v-if="isLoaded" class="mx-2 mb-2">
                            <router-link :to="/album/ + album.id + '?track=' + track.id">{{ track.title }}
                            </router-link>
                            <span> - </span>
                            <router-link :to="/artist/ + artist.id">{{ artist.title }}</router-link>
                        </div>
                        <div class="d-flex flex-row align-items-center">
                            <div class="btn-group btn-group-sm me-4" role="group">
                                <button class="btn btn-dark bi-skip-start-fill hover-color" type="button"
                                    @click="buttonPrev"></button>
                                <button :class="{ 'bi-play-fill': !isPlaying, 'bi-pause-fill': isPlaying }"
                                    class="btn btn-dark bi hover-color" type="button" @click="buttonPlay"></button>
                                <button class="btn btn-dark bi-skip-end-fill hover-color" type="button"
                                    @click="buttonNext"></button>
                            </div>
                            <span class="font-monospace mx-2">{{ now }}</span>
                            <div class="progress flex-fill" @click="seekProgress($event)">
                                <div class="progress-bar bg-dark progress-bar-striped progress-bar-animated"
                                    aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                    :style="{ 'width': position + '%' }">
                                    <span class="visually-hidden"></span>
                                </div>
                            </div>
                            <span class="font-monospace mx-2">{{ duration }}</span>
                            <div class="d-flex ms-4">
                                <div class="btn-group">
                                    <button class="btn btn-dark bi bi-soundwave hover-color" type="button"
                                        @click="emit('groupSession')">
                                    </button>
                                    <button class="btn btn-dark bi hover-color" :class="repeat_classes[repeat]"
                                        type="button" @click="buttonRepeat">
                                    </button>
                                    <VolumeButton ref="thisTooltip" @change-volume="changeVolume($event)"
                                        @trigger-volume="triggerVolume" :mute="mute" :volumeLevel="volumeLevel">
                                    </VolumeButton>
                                    <button class="btn btn-dark bi bi-collection hover-color" type="button"
                                        @click="emit('queueButton')">
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div ref="mobilePlayer" class="card border-top border-dark hide-on-desktop w-100">
        <div class="card-body d-flex flex-column">
            <div class="d-flex" id="player">
                <div class="d-flex w-100 align-items-center">
                    <div class="d-flex w-100 flex-column">
                        <div class="d-flex flex-column mb-2">
                            <router-link :to="/album/ + album.id + '?track=' + track.id" class="text-truncate">{{
                                    track.title
                            }}
                            </router-link>
                            <router-link :to="/artist/ + artist.id" class="text-truncate">{{
                                    artist.title
                            }}</router-link>
                        </div>
                        <div class="d-flex flex-row align-items-center mb-2">
                            <div class="progress flex-fill" @click="seekProgress($event)">
                                <div class="progress-bar bg-dark progress-bar-striped progress-bar-animated"
                                    aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                    :style="{ 'width': position + '%' }">
                                    <span class="visually-hidden"></span>
                                </div>
                            </div>
                        </div>
                        <div class="btn-group btn-group-sm" role="group">
                            <button class="btn btn-dark bi-skip-start-fill hover-color" type="button"
                                @click="buttonPrev"></button>
                            <button :class="{ 'bi-play-fill': !isPlaying, 'bi-pause-fill': isPlaying }"
                                class="btn btn-dark bi hover-color" type="button" @click="buttonPlay"></button>
                            <button class="btn btn-dark bi-skip-end-fill hover-color" type="button"
                                @click="buttonNext"></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <MobilePlayer ref="thisMobileView" :track="track" :album="album" :artist="artist" :position="position"
        :repeat_classes="repeat_classes" :repeat="repeat" :now="now" :duration="duration" :isPlaying="isPlaying"
        :seekProgress="seekProgress" @buttonPlay="buttonPlay" @buttonRepeat="buttonRepeat" @buttonPrev="buttonPrev"
        @buttonNext="buttonNext" @groupSession="emit('groupSession')" @queueButton="emit('queueButton')" />
    <Scrobbler ref="thisScrobbler" :isPlaying="isPlaying"></Scrobbler>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { store } from '/js/store.js';
import { sessionAction } from '/js/session.js';
import { getQueueTracks } from '/js/queue.js';
import MobilePlayer from "./MobilePlayer.vue";
import Hammer from "hammerjs";

import VolumeButton from "/components/VolumeButton.vue";
import Scrobbler from "/components/Scrobbler.vue";

const emit = defineEmits(['queueButton', 'groupSession']);

const isPlaying = ref(false);
const isLoaded = ref(false);

const position = ref(0);

const track = ref({ title: '', id: '', duration: 0 });
const album = ref({ title: '', id: '' });
const artist = ref({ title: '', id: '' });

const desktopPlayer = ref(null);
const mobilePlayer = ref(null);
let thisMobileView = ref(null);

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

const now = ref('00:00');
const duration = ref('00:00');

// Must be synchronized in groupSession: ok
async function buttonPlay() {
    if (DZ.player.getCurrentTrack()) {
        if (isPlaying.value) {
            sessionAction({
                func: async function op() {
                    DZ.player.pause();
                },
                object: null,
                operation: 'Player.pause',
            });
        } else {
            sessionAction({
                func: async function op() {
                    DZ.player.play();
                },
                object: null,
                operation: 'Player.play',
            });
        }
        return;
    }

    sessionAction({
        func: async function op() {
            getQueueTracks().then(tracks => {
                DZ.player.playTracks(tracks);
            });
        },
        object: null,
        operation: 'Player.playTracks',
    });
}

// Must be synchronized in groupSession: ok
async function buttonNext() {
    sessionAction({
        func: async function op() {
            getQueueTracks().then(tracks => {
                let index = (store.queue_index + 1) % tracks.length;
                DZ.player.playTracks(tracks, index);
                store.queue_index++;
            });
        },
        object: null,
        operation: 'Player.next',
    });
}

// Must be synchronized in groupSession: ok
async function buttonPrev() {
    sessionAction({
        func: async function op() {
            getQueueTracks().then(tracks => {
                let index = (store.queue_index - 1) % tracks.length;
                DZ.player.playTracks(tracks, index);
                store.queue_index--;
            });
        },
        object: null,
        operation: 'Player.prev',
    });
}

// Must be synchronized in groupSession:
async function buttonRepeat() {
    repeat.value = (DZ.player.getRepeat() + 1) % 3;
    sessionAction({
        func: async function op() {
            DZ.player.setRepeat(repeat.value);
        },
        object: repeat.value,
        operation: 'Player.repeat',
    });
}

// Must be synchronized in groupSession: ok
async function seekProgress(event) {
    let src = null;

    if (event.target.classList.contains('progress')) {
        src = event.target;
    } else {
        src = event.target.parentElement;
    }

    let pos = event.offsetX;
    let width = src.offsetWidth;

    if (pos <= 0) {
        sessionAction({
            func: async function op() {
                DZ.player.seek(0);
            },
            object: 0,
            operation: 'Player.seek',
        });
        return;
    }

    if (pos >= width) {
        sessionAction({
            func: async function op() {
                DZ.player.seek(100);
            },
            object: 100,
            operation: 'Player.seek',
        });
        return;
    }

    sessionAction({
        func: async function op() {
            DZ.player.seek((pos / width) * 100);
        },
        object: (pos / width) * 100,
        operation: 'Player.seek',
    });
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
    isLoaded.value = true;
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
    var hammertime = new Hammer(mobilePlayer.value);
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    hammertime.on("swipeup", function () {
        thisMobileView.value.toggle();
    });
});
</script>