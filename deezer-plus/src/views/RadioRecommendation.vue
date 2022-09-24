<template>
    <div class="card h-100 w-100" :id="radio_id" type="radios">
        <div class="card-body d-flex justify-content-center">
            <figure class="figure d-flex flex-column justify-content-center align-items-center align-content-center">
                <img class="img-fluid figure-img rounded" :src="cover" style="width:250px" />
                <router-link :to="/radio/+radio_id">
                    <figcaption class="figure-caption text-break text-center"><mark>{{title}}</mark></figcaption>
                </router-link>
            </figure>
        </div>
    </div>
</template>

<script setup>
defineProps({
    radio_id: {
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