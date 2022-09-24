<template>
    <div class="card h-100 w-100" :id="track_id" type="tracks">
        <div class="card-body d-flex justify-content-center">
            <figure class="figure d-flex flex-column justify-content-center align-items-center align-content-center">
                <img class="img-fluid figure-img rounded" :src="cover" style="width:250px" />
                <router-link :to="/track/+track_id">
                    <figcaption class="figure-caption text-break text-center"><mark>{{artist.name}}</mark></figcaption>
                    <figcaption class="figure-caption text-break text-center">{{title}}</figcaption>
                </router-link>
            </figure>
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
</script>