<template>
    <div id="liveToast" class="toast-container position-fixed top-0 end-0 p-3">
        <div ref="toastEle" class="toast text-bg-secondary" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header text-bg-dark">
                <strong class="me-auto">From: {{from}}</strong>
            </div>

            <div class="d-flex">
                <div class="toast-body">
                    {{message}}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
                    aria-label="Close"></button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Toast } from 'bootstrap';

let toastEle = ref(null);
let thisToastObj = null;

onMounted(() => {
    thisToastObj = new Toast(toastEle.value);
});

function _show() {
    thisToastObj.show();
}

function _hide() {
    thisToastObj.hide();
}

defineProps({
    message: {
        type: String,
    },
    from: {
        type: String,
    },
});

defineExpose({
    show: _show,
    hide: _hide,
});
</script>