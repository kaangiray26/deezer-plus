<template>
    <div class="card h-100 w-100 shadow-lg" :track_id="track_id" :album_id="album.id" :artist_id="artist.id"
        type="tracks">
        <div class="card-body d-flex flex-column">
            <figure class="d-flex flex-row justify-content-center">
                <div class="d-flex justify-content-end position-relative overflow-hidden ratio-1x1">
                    <img class="img-fluid figure-img rounded" :src="cover" />
                    <div class="position-absolute bottom-0">
                        <button class="btn btn-light bi bi-play shadow m-2" type="button" style="opacity: 0.90;"
                            @click="play(track_id)">
                        </button>
                    </div>
                </div>
            </figure>
            <router-link :to="/album/+album.id">
                <div class="d-flex flex-column mt-2">
                    <span class="text-truncate"><mark>{{artist.name}}</mark></span>
                    <span class="text-truncate">{{title}}</span>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { sessionAction } from '/js/session.js';
import { addToQueueStart, getQueueTracks } from '/js/queue.js';

defineProps({
    track_id: {
        type: Number,
    },
    title: {
        type: String,
    },
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
            await addToQueueStart([parseInt(id)]);
            getQueueTracks().then(tracks => {
                DZ.player.playTracks(tracks);
            });
        },
        object: id,
        operation: 'Track.play',
    });
}
</script>