<template>
    <tr class="row gx-0 d-flex flex-row" :album_id="props.album.id" :artist_id="props.artist.id" type="albums"
        style="flex-wrap: nowrap; width: 100% !important;">
        <td class="col-6 d-flex align-items-center text-nowrap text-truncate">
            <div>
                <img class="img-fluid" :src="props.cover" width="40" height="40" />
                <router-link :to="/album/+props.album.id" class="btn btn-link track-link" @click="emit('route-click')">
                    {{props.album.title}}</router-link>
            </div>
        </td>
        <td class="col-4 d-flex align-items-center text-nowrap text-truncate">
            <div>
                <router-link :to="/artist/+props.artist.id" @click="emit('route-click')">{{props.artist.title}}
                </router-link>
            </div>
        </td>
        <td class="col-1 d-flex align-items-center text-nowrap text-truncate">
            <div><span>{{props.nb_tracks}}</span></div>
        </td>
        <td class="col-1 d-flex align-items-center text-nowrap text-truncate">
            <div><span>{{props.explicit_lyrics ? 'Yes' : 'No'}}</span></div>
        </td>
    </tr>
</template>

<script setup>
const emit = defineEmits(['route-click']);

const props = defineProps({
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