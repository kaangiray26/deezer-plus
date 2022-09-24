<template>
    <div class="card h-100 w-100" :id="playlist_id" type="playlists">
        <div class="card-body d-flex justify-content-center">
            <figure class="figure d-flex flex-column justify-content-center align-items-center align-content-center">
                <img class="img-fluid figure-img rounded" :src="cover" style="width:250px" />
                <router-link :to="/playlist/+playlist_id">
                    <figcaption class="figure-caption text-break text-center"><mark>{{user}}</mark></figcaption>
                    <figcaption class="figure-caption text-break text-center">{{title}}</figcaption>
                </router-link>
            </figure>
        </div>
    </div>
</template>

<script setup>
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
</script>