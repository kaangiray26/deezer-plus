<template>
    <div id="OffCanvas" ref="offCanvasEle" class="offcanvas offcanvas-bottom" data-bs-backdrop="false" tabindex="-1"
        aria-labelledby="offcanvasBottomLabel" style="height: 100%; z-index: 1029;">
        <div class="offcanvas-body">
            <div class="row justify-content-center gx-0">
                <div class="btn-group bg-dark justify-content-end border p-2 mb-1" role="group">
                    <div class="d-flex align-items-center">
                        <div>
                            <input type="checkbox" class="btn-check" id="btn-check" autocomplete="off"
                                @change="buttonFlow">
                            <label class="btn btn-outline-light" for="btn-check">Flow</label>
                        </div>
                        <button class="btn btn-outline-light hover-color mx-1" type="button"
                            @click="buttonClear">Clear</button>
                    </div>
                </div>
                <div class="card col-12">
                    <ul class="list-group">
                        <li class="list-group-item">
                            <div class="table-responsive">
                                <table class="table table-hover table-borderless">
                                    <tbody>
                                        <QueueTrack v-for="(item, index) in store.queue" :index="index"
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
import { sessionAction } from '/js/session.js';
import { addToQueue, getQueue, clearQueue, getQueueTracks } from "/js/queue.js";
import QueueTrack from "/components/results/QueueTrack.vue";

let offCanvasEle = ref(null);
let thisOffCanvasObj = null;

const flow = ref(false);

const increment = ref({
    index: -1,
});

// Must be synchronized in groupSession: ok
function buttonClear() {
    let current_track = DZ.player.getCurrentTrack();

    if (!current_track) {
        sessionAction({
            func: async function op() {
                store.queue = [];
                store.queue_index = 0;
                clearQueue();
            },
            object: null,
            operation: 'Queue.clear_all',
        });
        return;
    }

    sessionAction({
        func: async function op() {
            let current_track_id = parseInt(current_track.id);
            store.queue = store.queue.filter(item => item.track.id === current_track_id);
            store.queue_index = 0;
            clearQueue(store.queue);
        },
        object: current_track.id,
        operation: 'Queue.clear_except',
    });
    return;
}

// Must not be synchronized in groupSession!
async function buttonFlow(event) {
    flow.value = event.target.checked;
}

// Must not be synchronized in groupSession!
async function getFlow() {
    console.log("Getting flow...");
    DZ.api(`/user/me/flow?access_token=${localStorage.getItem("token")}`, async function (response) {
        await addToQueue(response.data.map(item => parseInt(item.id)));
        getQueueTracks().then(tracks => {
            DZ.player.playTracks(tracks, store.queue_index);
        });
    });
}

// Must be synchronized in groupSession: ok
async function removeTrack(index) {
    sessionAction({
        func: async function op() {
            store.queue.splice(index, 1);
            clearQueue(store.queue);

            getQueueTracks().then(tracks => {
                DZ.player.playTracks(tracks);
            });
        },
        object: index,
        operation: 'Queue.remove',
    });
}

async function refresh() {
    store.queue = getQueue();
}

async function _show() {
    thisOffCanvasObj.show();
}

async function _hide() {
    thisOffCanvasObj.hide();
}

async function _toggle() {
    thisOffCanvasObj.toggle();
}

DZ.Event.subscribe('track_end', async function (val) {
    console.log("Track end.");
    if (increment.value.index != store.queue_index) {
        increment.value.index = store.queue_index;
        store.queue_index++;
        getQueueTracks().then(tracks => {
            DZ.player.playTracks(tracks, store.queue_index);
        });
    }

    if (store.queue_index == store.queue.length) {
        console.log("Reached queue end.");
        if (flow.value) {
            getFlow();
        }
    }
});

DZ.Event.subscribe('tracklist_changed', async function (obj) {
    store.queue_index = obj.index;
});

defineExpose({
    show: _show,
    hide: _hide,
    toggle: _toggle,
});

onMounted(() => {
    thisOffCanvasObj = new Offcanvas(offCanvasEle.value, {
        toggle: false
    });
    document.getElementById('OffCanvas').addEventListener('show.bs.offcanvas', refresh);
    window.addEventListener('queue', () => {
        refresh();
    });
});
</script>