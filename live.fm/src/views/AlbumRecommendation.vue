<template>
    <router-link :to="/album/+album_id">
        <div class="card h-100 w-100">
            <div class="card-body d-flex justify-content-center">
                <figure
                    class="figure d-flex flex-column justify-content-center align-items-center align-content-center">
                    <img class="img-fluid figure-img rounded" :src="cover" style="width:250px" />
                    <figcaption class="figure-caption text-break text-center">{{artist}} - {{title}}</figcaption>
                </figure>
            </div>
        </div>
    </router-link>
</template>

<script setup>
defineProps({
    album_id: {
        type: Number,
    },
    artist: {
        type: String,
    },
    title: {
        type: String,
    },
    cover: {
        type: String,
    },
});
</script>