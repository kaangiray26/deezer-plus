<template>
    <div id="playlistModal" class="modal fade" role="dialog" tabindex="-1" data-bs-backdrop="static" aria-hidden="true"
        ref="modalEle">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header d-flex flex-column">
                    <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                    <div class="mb-2">
                        <h2 class="modal-title fw-bolder">Add To Playlist</h2>
                    </div>
                </div>
                <div class="modal-body">
                    <table class="table table-hover mb-2">
                        <tbody>
                            <tr v-for="playlist in data.playlists" class="row gx-0 d-flex flex-row"
                                style="cursor: pointer;" @click="addToPlaylist(playlist.id)">
                                <td class="col-2 d-flex align-items-center text-nowrap text-truncate">
                                    <div>
                                        <img class="img-fluid" :src="playlist.cover" width="40" height="40" />
                                    </div>
                                </td>
                                <td class="col-10">{{playlist.title}}</td>
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

const emit = defineEmits(['playlist-add']);

let modalEle = ref(null);
let thisModalObj = null;

const data = ref({
    playlists: []
});

const track_id = ref(0);

async function get_playlists(url = null) {
    if (!url) {
        url = `/user/me/playlists?access_token=${localStorage.getItem('token')}`;
    }
    DZ.api(url, function (response) {
        if (data.value.playlists.length == response.total) {
            return;
        }

        response.data.map(item => {
            data.value.playlists.push({
                id: item.id,
                title: item.title,
                cover: item.picture_medium,
            });
        });

        if (response.next) {
            get_playlists(response.next.split('https://api.deezer.com')[1]);
        }
    });
}

function addToPlaylist(playlist_id) {
    DZ.api(`/playlist/${playlist_id}/tracks?access_token=${localStorage.getItem('token')}`, 'POST', {
        songs: String(track_id.value)
    }, response => {
        _hide();
        emit('playlist-add');
    });

}

function _show(id) {
    track_id.value = parseInt(id);
    get_playlists();
    thisModalObj.show();
}

function _hide() {
    thisModalObj.hide();
}

defineExpose({
    show: _show,
    hide: _hide,
});

onMounted(() => {
    thisModalObj = new Modal(modalEle.value);
    get_playlists();
});
</script>