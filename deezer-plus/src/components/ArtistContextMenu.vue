<template>
    <ul class="dropdown-menu dropdown-menu-dark context-menu show">
        <li>
            <button class="dropdown-item" type="button" @click="$emit('openArtistPage')">Artist page</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="$emit('addAlbumToFavourites')">Add to my
                favourites</button>
        </li>
    </ul>
</template>