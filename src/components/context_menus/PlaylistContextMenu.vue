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
            <button class="dropdown-item" type="button"
                @click="$emit('context-menu-event','addPlaylistToFavourites')"><span
                    class="bi bi-heart-fill me-1"></span>Add to my
                favourites</button>
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