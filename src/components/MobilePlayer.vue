<template>
    <div id="MobileCanvas" ref="offCanvasEle" class="offcanvas offcanvas-bottom h-100 border-0" data-bs-backdrop="false"
        tabindex="-1" aria-labelledby="offcanvasBottomLabel" style="z-index: 1029;">
        <div class="offcanvas-body">
            <div class="row h-100 justify-content-center align-items-end gx-0">
                <div class="col h-100">
                    <div ref="cardView" class="card h-100">
                        <img :src="cover" class="card-img-top img-thumbnail image-stable mb-2">
                        <div class="card-body p-0 d-flex flex-column justify-content-end">
                            <div class="d-flex justify-content-between">
                                <span class="font-monospace mx-2">{{ now }}</span>
                                <span class="font-monospace mx-2">{{ duration }}</span>
                            </div>
                            <div class="progress mb-2" @click="props.seekProgress($event)">
                                <div class="progress-bar bg-dark progress-bar-striped progress-bar-animated"
                                    aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                    :style="{ 'width': position + '%' }">
                                    <span class="visually-hidden"></span>
                                </div>
                            </div>
                            <div class="d-flex flex-column text-center mb-2">
                                <span class="text-truncate">{{ props.track.title }}</span>
                                <span class="text-truncate">{{ props.artist.title }} - {{ props.album.title }}</span>
                            </div>
                            <div class="d-flex btn-group btn-group-sm mb-2" role="group">
                                <button class="btn btn-outline-dark bi bi-soundwave hover-color" type="button"
                                    @click="emit('groupSession')">
                                </button>
                                <button class="btn btn-outline-dark bi hover-color" :class="repeat_classes[repeat]"
                                    type="button" @click="emit('buttonRepeat')">
                                </button>
                                <button class="btn btn-outline-dark bi bi-collection hover-color" type="button"
                                    @click="emit('queueButton')">
                                </button>
                            </div>
                            <div class="d-flex btn-group btn-group-sm" role="group">
                                <button class="btn btn-dark bi-skip-start-fill hover-color" type="button"
                                    @click="emit('buttonPrev')"></button>
                                <button :class="{ 'bi-play-fill': !isPlaying, 'bi-pause-fill': isPlaying }"
                                    class="btn btn-dark bi hover-color" type="button"
                                    @click="emit('buttonPlay')"></button>
                                <button class="btn btn-dark bi-skip-end-fill hover-color" type="button"
                                    @click="emit('buttonNext')"></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Offcanvas } from 'bootstrap';
import Hammer from "hammerjs";

const emit = defineEmits(['queueButton', 'groupSession', 'buttonNext', 'buttonPlay', 'buttonPrev', 'buttonPrev']);

let offCanvasEle = ref(null);
let thisOffCanvasObj = null;
const cardView = ref(null);

const cover = ref(null);

async function get_cover() {
    DZ.api('/album/' + props.album.id, async function (response) {
        cover.value = response.cover_big;
    });
}

async function _show() {
    thisOffCanvasObj.show();
}

async function _hide() {
    thisOffCanvasObj.hide();
}

async function _toggle() {
    get_cover();
    thisOffCanvasObj.toggle();
}

defineExpose({
    show: _show,
    hide: _hide,
    toggle: _toggle,
});

const props = defineProps({
    track: {
        type: Object,
        required: true
    },
    album: {
        type: Object,
        required: true
    },
    artist: {
        type: Object,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    repeat_classes: {
        type: Object,
        required: true
    },
    repeat: {
        type: Number,
        required: true
    },
    isPlaying: {
        type: Boolean,
        required: true
    },
    seekProgress: {
        type: Function,
        required: true
    },
    now: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    }
});

onMounted(() => {
    var hammertime = new Hammer(cardView.value);
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    hammertime.on("swipedown", function () {
        thisOffCanvasObj.hide();
    });

    thisOffCanvasObj = new Offcanvas(offCanvasEle.value, {
        toggle: false
    });
});
</script>