<template>
    <div class="card h-100 w-100 shadow-lg" :playlist_id="playlist_id" type="playlists">
        <div class="card-body d-flex flex-column">
            <figure class="d-flex flex-row justify-content-center">
                <div class="d-flex justify-content-end position-relative overflow-hidden ratio-1x1">
                    <img class="img-fluid figure-img rounded placeholder-img" :src="cover" height="250" width="250" />
                    <div class="position-absolute bottom-0">
                        <button class="btn btn-light bi bi-play shadow m-2" type="button" style="opacity: 0.90;"
                            @click="play(playlist_id)">
                        </button>
                    </div>
                </div>
            </figure>
            <router-link :to="/playlist/ + playlist_id">
                <div class="d-flex flex-column mt-2">
                    <span class="text-truncate"><mark>{{ user }}</mark></span>
                    <span class="text-truncate">{{ title }}</span>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { sessionAction } from '/js/session.js';
import { addToQueueStart, convert_playlist } from '/js/queue.js';

defineProps({
    playlist_id: {
        type: Number,
    },
    user: {
        type: String,
    },
    title: {
        type: String,
    },
    tracks: {
        type: Number,
    },
    cover: {
        type: String,
    },
});

// Must be synchronized in groupSession
async function play(id) {
    sessionAction({
        func: async function op() {
            DZ.player.playPlaylist(parseInt(id), async function (response) {
                await addToQueueStart(convert_playlist(response.tracks));
            });
        },
        object: id,
        operation: 'Playlist.play',
    });
}
</script>