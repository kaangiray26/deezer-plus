<template>
    <tr :album_id="album.id" :artist_id="artist.id" type="albums">
        <td style="white-space: nowrap; overflow: hidden;">
            <div>
                <img class=" img-fluid" :src="cover" width="40" height="40" />
                <router-link :to="/album/+album.id" class="btn btn-link track-link" @click="$emit('route-click')"
                    style="text-overflow:ellipsis; overflow: hidden;">
                    {{album.title}}</router-link>
            </div>
        </td>
        <td class="text-center" style="text-overflow:ellipsis; overflow: hidden; white-space: nowrap;">
            <div>
                <router-link :to="/artist/+artist.id" @click="$emit('route-click')">{{artist.title}}</router-link>
            </div>
        </td>
        <td class="text-center">
            <div><span>{{nb_tracks}}</span></div>
        </td>
        <td class="text-center">
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