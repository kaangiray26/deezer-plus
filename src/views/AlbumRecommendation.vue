<template>
    <div class="card h-100 w-100 shadow-lg" :album_id="album.id" :album_title="album.title" :artist_id="artist.id"
        type="albums">
        <div class="card-body d-flex flex-column">
            <figure class="d-flex flex-row justify-content-center">
                <div class="d-flex justify-content-end position-relative overflow-hidden ratio-1x1">
                    <img class="img-fluid figure-img rounded" :src="cover" />
                    <div class="position-absolute bottom-0">
                        <button class="btn btn-light bi bi-play shadow m-2" type="button" style="opacity: 0.90;"
                            @click="play(album.id)">
                        </button>
                    </div>
                </div>
            </figure>
            <router-link :to="/album/ + album.id">
                <div class="d-flex flex-column mt-2">
                    <span class="text-truncate"><mark>{{ artist.name }}</mark></span>
                    <span class="text-truncate">{{ album.title }}</span>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { sessionAction } from '/js/session.js';
import { addToQueueStart } from '/js/queue.js';

defineProps({
    album: {
        type: Object,
    },
    artist: {
        type: Object,
    },
    cover: {
        type: String,
    },
});

// Must be synchronized in groupSession: ok
async function play(id) {
    sessionAction({
        func: async function op() {
            DZ.player.playAlbum(parseInt(id), async function (response) {
                await addToQueueStart(response.tracks);
            });
        },
        object: id,
        operation: 'Album.play',
    });
}
</script>