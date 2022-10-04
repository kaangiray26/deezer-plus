<template>
    <div id="helpModal" class="modal fade" role="dialog" tabindex="-1" data-bs-backdrop="static" aria-hidden="true"
        ref="modalEle">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header d-flex flex-column">
                    <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                    <div class="mb-2">
                        <h2 class="modal-title fw-bolder">Keyboard Shortcuts</h2>
                    </div>
                    <div>
                        <span>Press<span class="keypress-dark">Alt</span><span class="keypress-dark">H</span>to toggle
                            this
                            modal.</span>
                    </div>
                </div>
                <div class="modal-body">
                    <table class="table table-dark table-hover">
                        <tbody>
                            <tr>
                                <td>Search</td>
                                <td><span class="keypress">Alt</span><span class="keypress">S</span></td>
                            </tr>
                            <tr>
                                <td>Queue</td>
                                <td><span class="keypress">Alt</span><span class="keypress">Q</span></td>
                            </tr>
                            <tr>
                                <td>Play / Pause</td>
                                <td><span class="keypress">Space</span></td>
                            </tr>
                            <tr>
                                <td>Raise Volume</td>
                                <td><span class="keypress">→</span></td>
                            </tr>
                            <tr>
                                <td>Lower Volume</td>
                                <td><span class="keypress">←</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Modal } from 'bootstrap'

let modalEle = ref(null);
let thisModalObj = null;

onMounted(() => {
    thisModalObj = new Modal(modalEle.value);
});

function _show() {
    thisModalObj.show();
}

function _hide() {
    thisModalObj.hide();
}

defineExpose({
    show: _show,
    hide: _hide,
});
</script>