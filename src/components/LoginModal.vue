<template>
    <div id="loginModal" class="modal fade" role="dialog" tabindex="-1" data-bs-backdrop="static" aria-hidden="true"
        ref="modalEle">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Authorization</h4>
                </div>
                <div class="modal-body">
                    <p>If you want to use this application with your own account, you need to log in.</p>
                    <div class="input-group"><button class="btn btn-dark flex-fill" type="button"
                            @click="emit('requestLogin')">Log in</button></div>
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

const emit = defineEmits(['requestLogin']);

onMounted(() => {
    thisModalObj = new Modal(modalEle.value, {
        keyboard: false
    });
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