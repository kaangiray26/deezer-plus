<template>
    <div class="card h-100 w-100" :id="artist_id" type="artists">
        <div class="card-body d-flex justify-content-center">
            <figure class="figure d-flex flex-column justify-content-center align-items-center align-content-center">
                <img class="img-fluid figure-img rounded" :src="cover" style="width:250px" />
                <router-link :to="/artist/+artist_id">
                    <figcaption class="figure-caption text-break text-center">{{artist}}</figcaption>
                </router-link>
            </figure>
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