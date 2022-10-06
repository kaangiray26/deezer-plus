<template>
    <ul class="dropdown-menu shadow-lg context-menu show">
        <li>
            <button v-if="!isFav()" class="dropdown-item" type="button"
                @click="$emit('context-menu-event', 'addArtistToFavorites')"><span
                    class="bi bi-heart-fill me-1"></span>Add to favorites</button>
            <button v-if="isFav()" class="dropdown-item" type="button"
                @click="$emit('context-menu-event', 'removeArtistFromFavorites')"><span
                    class="bi bi-heart-fill text-danger me-1"></span>Remove from favorites</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="$emit('context-menu-event', 'openArtistPage')"><span
                    class="bi bi-person-fill me-1"></span>Artist page</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="$emit('context-menu-event','shareArtist')"><span
                    class="bi bi-share-fill me-1"></span>Share</button>
        </li>
    </ul>
</template>

<script setup>
import { computed } from "vue";

function isFav() {
    return JSON.parse(localStorage.getItem('fav_artists')).includes(props.item_id);
};

const props = defineProps({
    item_id: {
        type: Number,
    },
});
</script>