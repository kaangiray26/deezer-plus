<template>
    <ul class="dropdown-menu shadow-lg context-menu show">
        <li>
            <button class="dropdown-item" type="button" @click="$emit('context-menu-event', 'playTrack')"><span
                    class="bi bi-play-fill me-1"></span>Play</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="$emit('context-menu-event','addTrackToQueue')"><span
                    class="bi bi-music-note-list me-1"></span>Add to queue</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="$emit('context-menu-event', 'launchTrackMix')"><span
                    class="bi bi-rainbow me-1"></span>Launch
                Track mix</button>
        </li>
        <li>
            <button class="dropdown-item" type="button"
                @click="$emit('context-menu-event','addTrackToFavourites')"><span
                    class="bi bi-heart-fill me-1"></span>Add to my
                favourites</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="$emit('context-menu-event','openAlbumPage')"><span
                    class="bi bi-vinyl-fill me-1"></span>Album page</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="$emit('context-menu-event','openArtistPage')"><span
                    class="bi bi-person-fill me-1"></span>Artist page</button>
        </li>
    </ul>
</template>