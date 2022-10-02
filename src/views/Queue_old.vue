<template>
    <div id="Collapse" ref="collapseEle" class="collapse" :style="{'max-height':heightLimit, 'overflow':'auto'}">
        <div class="row justify-content-center gx-0">
            <div class="card col-12">
                <ul class="list-group">
                    <li class="list-group-item">
                        <div class="table-responsive">
                            <table class="table table-hover table-borderless">
                                <thead>
                                    <tr class="row gx-0 table-active" style="width: 100% !important;">
                                        <th class="col-6">Track</th>
                                        <th class="col-2">Artist</th>
                                        <th class="col-3">Album</th>
                                        <th class="col-1 bi bi-clock-fill"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <TrackResult v-for="item in queue.tracks" :id="item.track.id" :artist="item.artist"
                                        :album="item.album" :track="item.track" :duration="item.duration"
                                        :cover="item.cover"
                                        @contextmenu.prevent="$emit('right-click', {'event':$event, 'target':$event.currentTarget})">
                                    </TrackResult>
                                </tbody>
                            </table>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="btn-group justify-content-end border p-2" role="group">
                <div>
                    <button class="btn btn-outline-dark hover-color" type="button" @click="buttonClear">Clear</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Collapse } from 'bootstrap';
import TrackResult from "/components/results/TrackResult.vue";

let collapseEle = ref(null);
let thisCollapseObj = null;

const queue = ref({
    tracks: []
});

const heightLimit = computed(() => {
    return (window.innerHeight - props.navBarHeight) + 'px';
});

async function buttonClear() {
    queue.value.tracks = [];
    let current_track = DZ.player.getCurrentTrack();
    DZ.player.playTracks([]);

    console.log(current_track);
    console.log(DZ.player.isPlaying());

    if (!current_track) {
        return;
    }

    if (!DZ.player.isPlaying) {
        DZ.player.addToQueue([parseInt(current_track.id)]);
        return;
    }

    DZ.player.playTracks([parseInt(current_track.id)]);
}

function handleTrackSearchResponse(item) {
    queue.value.tracks.push({
        cover: `https://api.deezer.com/album/${item.album.id}/image`,
        duration: parseInt(item.duration),
        artist: {
            "id": parseInt(item.artist.id),
            "title": item.artist.name,
        },
        album: {
            "id": parseInt(item.album.id),
            "title": item.album.title,
        },
        track: {
            "id": parseInt(item.id),
            "title": item.title,
        },
    })
    return;
}

function _show() {
    thisCollapseObj.show();
}

function _hide() {
    thisCollapseObj.hide();
}

async function _toggle() {
    thisCollapseObj.toggle();
}

async function _refresh() {
    queue.value.tracks = [];
    DZ.player.getTrackList().map(handleTrackSearchResponse);
}

defineExpose({
    show: _show,
    hide: _hide,
    toggle: _toggle,
    refresh: _refresh,
});

const props = defineProps(['navBarHeight']);

onMounted(() => {
    thisCollapseObj = new Collapse(collapseEle.value, {
        toggle: false
    });
})
</script>