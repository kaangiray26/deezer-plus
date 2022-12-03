<template>
    <div id="helpModal" class="modal fade" role="dialog" tabindex="-1" data-bs-backdrop="static" aria-hidden="true"
        ref="modalEle"
        style="background-image: url('/images/404.png'); background-size:cover; background-position: center; background-repeat: no-repeat;">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header d-flex flex-column">
                    <div class="mb-2">
                        <h2 class="modal-title fw-bolder">Looking for more music?</h2>
                    </div>
                    <div>
                        <span>Sorry, the page you're looking for does not exist.</span>
                    </div>
                </div>
                <div class="modal-body d-flex justify-content-center">
                    <button class="btn btn-dark bi bi-plugin" @click="goHome">
                        Plug back in.
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Modal } from 'bootstrap'

let modalEle = ref(null);
let thisModalObj = null;

async function goHome() {
    window.location.href = "/";
}

onMounted(() => {
    document.title = "Page Not Found | Deezer+";
    thisModalObj = new Modal(modalEle.value, {
        keyboard: false
    });
    thisModalObj.show();
});
</script>