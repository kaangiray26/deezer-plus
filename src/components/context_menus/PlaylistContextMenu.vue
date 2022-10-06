<template>
    <ul class="dropdown-menu shadow-lg context-menu show">
        <li>
            <button class="dropdown-item" type="button" @click="$emit('context-menu-event', 'playPlaylist')"><span
                    class="bi bi-play-fill me-1"></span>Play</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="$emit('context-menu-event','addPlaylistToQueue')"><span
                    class="bi bi-music-note-list me-1"></span>Add to queue</button>
        </li>
        <li>
            <button v-if="!isFav()" class="dropdown-item" type="button"
                @click="$emit('context-menu-event','addPlaylistToFavorites')"><span
                    class="bi bi-heart-fill me-1"></span>Add to favorites</button>
            <button v-if="isFav()" class="dropdown-item" type="button"
                @click="$emit('context-menu-event','removePlaylistFromFavorites')"><span
                    class="bi bi-heart-fill text-danger me-1"></span>Remove from favorites</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="$emit('context-menu-event','openPlaylistPage')"><span
                    class="bi bi-collection-fill me-1"></span>Playlist page</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="$emit('context-menu-event','openUserPage')"><span
                    class="bi bi-person-fill me-1"></span>User page</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="$emit('context-menu-event','sharePlaylist')"><span
                    class="bi bi-share-fill me-1"></span>Share</button>
        </li>
    </ul>
</template>

<script setup>
import { computed } from "vue";

function isFav() {
    return JSON.parse(localStorage.getItem('fav_playlists')).includes(props.item_id);
};

const props = defineProps({
    item_id: {
        type: Number,
    },
});
</script>