<template>
    <ul class="dropdown-menu shadow-lg context-menu show">
        <li>
            <button class="dropdown-item" type="button" @click="emit('context-menu-event', 'playTrack')"><span
                    class="bi bi-play-fill me-1"></span>Play</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="emit('context-menu-event','addTrackToQueue')"><span
                    class="bi bi-music-note-list me-1"></span>Add to queue</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="emit('context-menu-event', 'launchTrackMix')"><span
                    class="bi bi-rainbow me-1"></span>Launch
                Track mix</button>
        </li>
        <li>
            <button v-if="!isFav()" class="dropdown-item" type="button"
                @click="emit('context-menu-event','addTrackToFavorites')"><span class="bi bi-heart-fill me-1"></span>Add
                to favorites</button>
            <button v-if="isFav()" class="dropdown-item" type="button"
                @click="emit('context-menu-event','removeTrackFromFavorites')"><span
                    class="bi bi-heart-fill text-danger me-1"></span>Remove from favorites</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="emit('context-menu-event','addTrackToPlaylist')"><span
                    class="bi bi-cassette-fill me-1"></span>Add to playlist</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="emit('context-menu-event','openTrackPage')"><span
                    class="bi bi-music-note-beamed me-1"></span>Show Track in Album</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="emit('context-menu-event','openAlbumPage')"><span
                    class="bi bi-vinyl-fill me-1"></span>Album page</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="emit('context-menu-event','openArtistPage')"><span
                    class="bi bi-person-fill me-1"></span>Artist page</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="emit('context-menu-event','shareTrack')"><span
                    class="bi bi-share-fill me-1"></span>Share</button>
        </li>
    </ul>
</template>

<script setup>
const emit = defineEmits(['context-menu-event']);

function isFav() {
    return JSON.parse(localStorage.getItem('fav_tracks')).includes(props.item_id);
};

const props = defineProps({
    item_id: {
        type: Number,
    },
});
</script>