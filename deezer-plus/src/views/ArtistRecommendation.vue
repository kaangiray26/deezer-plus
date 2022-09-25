<template>
    <div class="card h-100 w-100 shadow-lg" :id="artist_id" :artist_id="artist_id" type="artists">
        <div class="card-body d-flex flex-column">
            <figure class="d-flex flex-column">
                <div class="d-flex justify-content-center position-relative overflow-hidden ratio-1x1">
                    <img class="img-fluid figure-img rounded" :src="cover" />
                    <div class="position-absolute right-0 bottom-0">
                    </div>
                </div>
            </figure>
            <router-link :to="/artist/+artist_id">
                <div class="d-flex flex-column mt-2">
                    <span class="text-truncate"><mark>{{artist}}</mark></span>
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