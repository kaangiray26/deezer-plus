<template>
    <ul class="dropdown-menu shadow-lg context-menu show">
        <li>
            <button class="dropdown-item" type="button" @click="emit('context-menu-event', 'playAlbum')"><span
                    class="bi bi-play-fill me-1"></span>Play</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="emit('context-menu-event', 'playAlbumNext')"><span
                    class="bi bi-fast-forward-fill me-1"></span>Play next</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="emit('context-menu-event', 'addAlbumToQueue')"><span
                    class="bi bi-music-note-list me-1"></span>Add to queue</button>
        </li>
        <li>
            <button v-if="!isFav()" class="dropdown-item" type="button"
                @click="emit('context-menu-event', 'addAlbumToFavorites')"><span class="bi bi-heart-fill me-1"></span>Add
                to favorites</button>
            <button v-if="isFav()" class="dropdown-item" type="button"
                @click="emit('context-menu-event', 'removeAlbumFromFavorites')"><span
                    class="bi bi-heart-fill text-danger me-1"></span>Remove from favorites</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="emit('context-menu-event', 'openAlbumPage')"><span
                    class="bi bi-vinyl-fill me-1"></span>Album page</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="emit('context-menu-event', 'openArtistPage')"><span
                    class="bi bi-person-fill me-1"></span>Artist page</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="emit('context-menu-event', 'shareAlbum')"><span
                    class="bi bi-share-fill me-1"></span>Share</button>
        </li>
    </ul>
</template>

<script setup>
const emit = defineEmits(['context-menu-event']);

function isFav() {
    return JSON.parse(localStorage.getItem('fav_albums')).includes(props.item_id);
};

const props = defineProps({
    item_id: {
        type: Number,
    },
});
</script>