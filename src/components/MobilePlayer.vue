<template>
    <div id="MobileCanvas" ref="offCanvasEle" class="offcanvas offcanvas-bottom" data-bs-backdrop="false" tabindex="-1"
        aria-labelledby="offcanvasBottomLabel" style="height: 100%; z-index: 1029;">
        <div class="offcanvas-body">
            <div class="row h-100 justify-content-center align-items-end gx-0">
                <div class="col h-100">
                    <div class="card h-100">
                        <img src="https://e-cdns-images.dzcdn.net/images/cover/e29df808d39deca9d932504f819af078/380x380-000000-80-0-0.jpg"
                            class="card-img-top image-stable mb-2">
                        <div class="card-body p-0 d-flex flex-column justify-content-end">
                            <div id="seekProgress" class="progress mb-2" @click="seekProgress($event)">
                                <div class="progress-bar bg-dark progress-bar-striped progress-bar-animated"
                                    aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                    :style="{ 'width': position + '%' }">
                                    <span class="visually-hidden"></span>
                                </div>
                            </div>
                            <div class="d-flex flex-column text-center mb-2">
                                <span class="text-truncate">Fascination Street (Live)</span>
                                <span class="text-truncate">The Cure - Anniversary: 1978 - 2018 Live In Hyde Park London
                                    (Live)</span>
                            </div>
                            <div class="d-flex btn-group btn-group-sm mb-2" role="group">
                                <button class="btn btn-outline-dark bi bi-soundwave hover-color" type="button"
                                    @click="emit('groupSession')">
                                </button>
                                <button class="btn btn-outline-dark bi hover-color" :class="repeat_classes[repeat]"
                                    type="button" @click="buttonRepeat">
                                </button>
                                <button class="btn btn-outline-dark bi bi-collection hover-color" type="button"
                                    @click="emit('queueButton')">
                                </button>
                            </div>
                            <div class="d-flex btn-group btn-group-sm" role="group">
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
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Offcanvas } from 'bootstrap';
import Hammer from "hammerjs";

const emit = defineEmits(['showMobile', 'hideMobile']);

let offCanvasEle = ref(null);
let thisOffCanvasObj = null;

const repeat = ref(0);
const repeat_classes = {
    0: 'bi-repeat text-muted',
    1: 'bi-repeat',
    2: 'bi bi-repeat-1'
}

async function canvas_shown() {
    emit('hideMobile');
}

async function canvas_hidden() {
    emit('showMobile');
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

defineExpose({
    show: _show,
    hide: _hide,
    toggle: _toggle,
});

onMounted(() => {
    var hammertime = new Hammer(offCanvasEle.value);
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    hammertime.on("swipedown", function () {
        thisOffCanvasObj.hide();
        emit('showMobile');
    });

    thisOffCanvasObj = new Offcanvas(offCanvasEle.value, {
        toggle: false
    });
    document.getElementById('MobileCanvas').addEventListener('show.bs.offcanvas', canvas_shown);
    document.getElementById('MobileCanvas').addEventListener('hide.bs.offcanvas', canvas_hidden);
});
</script>