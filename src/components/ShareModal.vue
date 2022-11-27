<template>
    <div id="shareModal" class="modal fade" role="dialog" tabindex="-1" data-bs-backdrop="static" aria-hidden="true"
        ref="modalEle">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header d-flex flex-column">
                    <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                    <div class="mb-2">
                        <h2 class="modal-title fw-bolder">Sharing</h2>
                    </div>
                </div>
                <div class="modal-body">
                    <div v-if="type == 'track'">
                        <span class="fw-bold"><mark>{{ content.artist.name }}</mark> - {{ content.title }}</span>
                        <div class="input-group my-2">
                            <span class="input-group-text">via Deezer+</span>
                            <input type="text" class="form-control" :value="'https://deezer.buzl.uk/track/' + content.id"
                                readonly>
                            <button class="btn btn-dark" @click="copyText($event); emit('text-copy')">Copy</button>
                        </div>
                        <div class="input-group mb-2">
                            <span class="input-group-text">via Google</span>
                            <input type="text" class="form-control" :value="googleSearch" readonly>
                            <button class="btn btn-dark" @click="copyText($event); emit('text-copy')">Copy</button>
                        </div>
                    </div>
                    <div v-if="type == 'album'">
                        <span class="fw-bold"><mark>{{ content.artist.name }}</mark> - {{ content.title }}</span>
                        <div class="input-group my-2">
                            <span class="input-group-text">via Deezer+</span>
                            <input type="text" class="form-control" :value="'https://deezer.buzl.uk/album/' + content.id"
                                readonly>
                            <button class="btn btn-dark" @click="copyText($event); emit('text-copy')">Copy</button>
                        </div>
                        <div class="input-group mb-2">
                            <span class="input-group-text">via Google</span>
                            <input type="text" class="form-control" :value="googleSearch" readonly>
                            <button class="btn btn-dark" @click="copyText($event); emit('text-copy')">Copy</button>
                        </div>
                    </div>
                    <div v-if="type == 'artist'">
                        <span class="fw-bold"><mark>{{ content.name }}</mark></span>
                        <div class="input-group my-2">
                            <span class="input-group-text">via Deezer+</span>
                            <input type="text" class="form-control" :value="'https://deezer.buzl.uk/artist/' + content.id"
                                readonly>
                            <button class="btn btn-dark" @click="copyText($event); emit('text-copy')">Copy</button>
                        </div>
                        <div class="input-group mb-2">
                            <span class="input-group-text">via Google</span>
                            <input type="text" class="form-control" :value="googleSearch" readonly>
                            <button class="btn btn-dark" @click="copyText($event); emit('text-copy')">Copy</button>
                        </div>
                    </div>
                    <div v-if="type == 'playlist'">
                        <span class="fw-bold"><mark>{{ content.title }}</mark></span>
                        <div class="input-group my-2">
                            <span class="input-group-text">via Deezer+</span>
                            <input type="text" class="form-control"
                                :value="'https://deezer.buzl.uk/playlist/' + content.id" readonly>
                            <button class="btn btn-dark" @click="copyText($event); emit('text-copy')">Copy</button>
                        </div>
                    </div>
                    <div v-if="type == 'radio'">
                        <span class="fw-bold"><mark>{{ content.title }}</mark></span>
                        <div class="input-group my-2">
                            <span class="input-group-text">via Deezer</span>
                            <input type="text" class="form-control" :value="'https://deezer.buzl.uk/radio/' + content.id"
                                readonly>
                            <button class="btn btn-dark" @click="copyText($event); emit('text-copy')">Copy</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Modal } from 'bootstrap'

const emit = defineEmits(['text-copy'])

let modalEle = ref(null);
let thisModalObj = null;

const content = ref(null);
const type = ref('');

function _show(obj) {
    handleContent(obj);
}

function _hide() {
    thisModalObj.hide();
}

async function handleContent(obj) {
    DZ.api(`/${obj.type}/` + obj.id, function (response) {
        content.value = response;
        type.value = obj.type;
        thisModalObj.show();
    });
}

const googleSearch = computed(() => {
    if (type.value == 'track') {
        let title_param = content.value.title.replace(' ', '+');
        let artist_param = content.value.artist.name.replace(' ', '+');
        return "https://www.google.com/search?q=" + title_param + "+" + artist_param;
    }

    if (type.value == 'album') {
        let album_param = content.value.title.replace(' ', '+');
        let artist_param = content.value.artist.name.replace(' ', '+');
        return "https://www.google.com/search?q=" + album_param + "+" + artist_param;
    }

    if (type.value == 'artist') {
        let artist_param = content.value.name.replace(' ', '+');
        return "https://www.google.com/search?q=" + artist_param;
    }
})

function copyText(event) {
    navigator.clipboard.writeText(event.target.parentElement.children[1].value).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

defineExpose({
    show: _show,
    hide: _hide,
});

onMounted(() => {
    thisModalObj = new Modal(modalEle.value);
    content.value = {};
});
</script>