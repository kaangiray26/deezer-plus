<template>
    <div class="card h-100 w-100 shadow-lg" :artist_id="artist_id" type="artists">
        <div class="card-body d-flex flex-column">
            <figure class="d-flex flex-row justify-content-center">
                <div class="d-flex justify-content-end position-relative overflow-hidden ratio-1x1">
                    <img class="img-fluid figure-img rounded placeholder-img" :src="cover" height="250" width="250" />
                    <div class="position-absolute bottom-0">
                    </div>
                </div>
            </figure>
            <router-link :to="/artist/ + artist_id">
                <div class="d-flex flex-column mt-2">
                    <span class="text-truncate"><mark>{{ artist }}</mark></span>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script setup>
defineProps({
    artist_id: {
        type: Number,
    },
    artist: {
        type: String,
    },
    cover: {
        type: String,
    },
});
</script>