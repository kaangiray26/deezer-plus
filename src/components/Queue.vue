<template>
    <div id="OffCanvas" ref="offCanvasEle" class="offcanvas offcanvas-bottom" data-bs-backdrop="false" tabindex="-1"
        aria-labelledby="offcanvasBottomLabel" style="height: 100%; z-index: 1029;">
        <div class="offcanvas-body">
            <div class="row justify-content-center gx-0">
                <div class="btn-group bg-dark justify-content-end border p-2 mb-1" role="group">
                    <div>
                        <button class="btn btn-outline-light hover-color" type="button"
                            @click="buttonClear">Clear</button>
                    </div>
                </div>
                <div class="card col-12">
                    <ul class="list-group">
                        <li class="list-group-item">
                            <div class="table-responsive">
                                <table class="table table-hover table-borderless">
                                    <tbody>
                                        <QueueTrack v-for="(item, index) in queue.tracks" :index="index"
                                            :id="item.track.id" :artist="item.artist" :album="item.album"
                                            :track="item.track" :duration="item.duration" :cover="item.cover"
                                            @remove-track="removeTrack" @route-click="_hide">
                                        </QueueTrack>
                                    </tbody>
                                </table>
                            </div>
                        </li>
                        <div :style="{'height': store.playerHeight + 'px'}"></div>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { store } from '/js/store.js';
import { Offcanvas } from 'bootstrap';
import QueueTrack from "/components/results/QueueTrack.vue";

let offCanvasEle = ref(null);
let thisOffCanvasObj = null;

const queue = ref({
    tracks: []
});

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

async function buttonClear() {
    let current_track = DZ.player.getCurrentTrack();

    if (!current_track) {
        queue.value.tracks = [];
        DZ.player.playTracks([]);
        return;
    }

    if (DZ.player.isPlaying) {
        queue.value.tracks.splice(1);
        DZ.player.playTracks([parseInt(current_track.id)]);
        return;
    }

    DZ.player.addToQueue([parseInt(current_track.id)]);
}

async function removeTrack(index) {
    queue.value.tracks.splice(index, 1);
    if (DZ.player.isPlaying) {
        DZ.player.playTracks(queue.value.tracks.map(item => parseInt(item.track.id)));
        return;
    }
    DZ.player.addToQueue(queue.value.tracks.map(item => parseInt(item.track.id)));
}

async function refresh() {
    queue.value.tracks = [];
    DZ.player.getTrackList().map(handleTrackSearchResponse);
}

function _show() {
    thisOffCanvasObj.show();
}

function _hide() {
    thisOffCanvasObj.hide();
}

async function _toggle() {
    refresh();
    thisOffCanvasObj.toggle();
}

defineExpose({
    show: _show,
    hide: _hide,
    toggle: _toggle,
});

onMounted(() => {
    thisOffCanvasObj = new Offcanvas(offCanvasEle.value, {
        toggle: false
    });
})
</script>