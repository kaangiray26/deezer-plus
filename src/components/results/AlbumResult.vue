<template>
    <tr class="row gx-0 d-flex flex-row" :album_id="album.id" :artist_id="artist.id" type="albums"
        style="flex-wrap: nowrap; width: 100% !important;">
        <td class="col-6 text-nowrap text-truncate">
            <div>
                <img class="img-fluid" :src="cover" width="40" height="40" />
                <router-link :to="/album/+album.id" class="btn btn-link track-link" @click="$emit('route-click')">
                    {{album.title}}</router-link>
            </div>
        </td>
        <td class="col-4 text-nowrap text-truncate">
            <div>
                <router-link :to="/artist/+artist.id" @click="$emit('route-click')">{{artist.title}}</router-link>
            </div>
        </td>
        <td class="col-1 text-nowrap text-truncate">
            <div><span>{{nb_tracks}}</span></div>
        </td>
        <td class="col-1 text-nowrap text-truncate">
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