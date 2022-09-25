<template>
    <tr :album_id="album.id" :artist_id="artist.id" type="albums">
        <td>
            <div><img class="me-2 img-thumbnail" :src="cover" width="40" height="40" />
                <router-link :to="/album/+album.id" @click="$emit('route-click')">{{album.title}}</router-link>
            </div>
        </td>
        <td>
            <div>
                <router-link :to="/artist/+artist.id" @click="$emit('route-click')">{{artist.title}}</router-link>
            </div>
        </td>
        <td>
            <div><span>{{nb_tracks}}</span></div>
        </td>
        <td>
            <div><span>{{explicit_lyrics?'Yes' : 'No'}}</span></div>
        </td>
    </tr>
</template>

<script setup>
defineProps({
    artist: {
        type: Object,
    },
    album: {
        type: Object,
    },
    cover: {
        type: String,
    },
    nb_tracks: {
        type: Number,
    },
    explicit_lyrics: {
        type: Boolean,
    },
});
</script>