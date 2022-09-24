<template>
    <div class="card h-100 w-100 shadow-lg" :id="track_id" :album_id="album.id" :artist_id="artist.id" type="tracks">
        <div class="card-body d-flex flex-column">
            <figure class="d-flex flex-column">
                <div class="d-flex justify-content-center position-relative overflow-hidden ratio-1x1">
                    <img class="img-fluid figure-img rounded" :src="cover" />
                    <div class="position-absolute right-0 bottom-0">
                        <button class="btn btn-light bi bi-play shadow m-1 me-2" type="button" style="opacity: 0.90;"
                            @click="play(track_id)">
                        </button>
                    </div>
                </div>
            </figure>
            <router-link :to="/track/+track_id">
                <div class="d-flex flex-column mt-2">
                    <span class="text-truncate"><mark>{{artist.name}}</mark></span>
                    <span class="text-truncate">{{title}}</span>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script setup>
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

async function play(id) {
    DZ.player.playTracks([id]);
}
</script>