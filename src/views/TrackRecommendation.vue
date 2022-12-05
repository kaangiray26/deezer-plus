<template>
    <div class="card h-100 w-100 shadow-lg" :track_id="track_id" :duration="duration" :title="title"
        :artist_id="artist.id" :artist_name="artist.name" :album_id="album.id" :album_title="album.title" type="tracks">
        <div class="card-body d-flex flex-column">
            <figure class="d-flex flex-row justify-content-center">
                <div class="d-flex justify-content-end position-relative overflow-hidden ratio-1x1">
                    <img class="img-fluid figure-img rounded placeholder-img" :src="cover" height="250" width="250" />
                    <div class="position-absolute bottom-0">
                        <button class="btn btn-light bi bi-play shadow m-2" type="button" style="opacity: 0.90;"
                            @click="play(track_id)">
                        </button>
                    </div>
                </div>
            </figure>
            <router-link :to="/album/ + album.id">
                <div class="d-flex flex-column mt-2">
                    <span class="text-truncate"><mark>{{ artist.name }}</mark></span>
                    <span class="text-truncate">{{ title }}</span>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { sessionAction } from '/js/session.js';
import { addToQueueStart } from '/js/queue.js';

defineProps({
    track_id: {
        type: Number,
    },
    duration: {
        type: Number,
    },
    title: {
        type: String,
    },
    artist: {
        type: Object,
    },
    album: {
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
            DZ.player.playTracks([parseInt(id)], async function (response) {
                await addToQueueStart(response.tracks);
            });
        },
        object: id,
        operation: 'Track.play',
    });
}
</script>