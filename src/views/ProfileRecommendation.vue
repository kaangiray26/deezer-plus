<template>
    <div class="card h-100 w-100 shadow-lg">
        <div class="card-body d-flex flex-column">
            <figure class="d-flex flex-row justify-content-center">
                <div class="d-flex justify-content-end position-relative overflow-hidden ratio-1x1">
                    <img class="img-fluid figure-img rounded" :src="cover" />
                </div>
            </figure>
            <router-link :to="/user/ + id">
                <div class="d-flex flex-column mt-2">
                    <span class="text-truncate"><mark>{{ name }}</mark></span>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script setup>

defineProps({
    id: {
        type: Number,
    },
    name: {
        type: String,
    },
    cover: {
        type: String,
    }
});
</script>