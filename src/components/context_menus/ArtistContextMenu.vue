<template>
    <ul class="dropdown-menu shadow-lg context-menu show">
        <li>
            <button class="dropdown-item" type="button"
                @click="$emit('context-menu-event', 'addArtistToFavourites')"><span
                    class="bi bi-heart-fill me-1"></span>Add to my
                favourites</button>
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