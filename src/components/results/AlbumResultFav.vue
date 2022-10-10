<template>
    <tr class="row gx-0 d-flex flex-row" :album_id="props.album.id" :artist_id="props.artist.id" type="albums"
        style="flex-wrap: nowrap; width: 100% !important;">
        <td class="col-6 text-nowrap text-truncate">
            <div>
                <img class="img-fluid" :src="props.cover" width="40" height="40" />
                <router-link :to="/album/+props.album.id" class="btn btn-link track-link" @click="$emit('route-click')">
                    {{props.album.title}}</router-link>
            </div>
        </td>
        <td class="col-3 text-nowrap text-truncate">
            <div>
                <router-link :to="/artist/+props.artist.id" @click="$emit('route-click')">{{props.artist.title}}
                </router-link>
            </div>
        </td>
        <td class="col-1 text-nowrap text-truncate">
            <div><span>{{props.nb_tracks}}</span></div>
        </td>
        <td class="col-1 text-nowrap text-truncate">
            <div><span>{{props.explicit_lyrics ? 'Yes' : 'No'}}</span></div>
        </td>
        <td class="col-1 d-flex justify-content-end text-nowrap text-truncate">
            <button class="btn btn-light bi" :class="isFav" type="button" style="opacity: 0.90;"
                @click="fav(props.album.id)">
            </button>
        </td>
    </tr>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
const fav_albums = ref([]);

async function fav(id) {
    if (fav_albums.value.includes(id)) {
        fav_albums.value = fav_albums.value.filter((item) => item !== id);
        localStorage.setItem('fav_albums', JSON.stringify(fav_albums.value));
    } else {
        fav_albums.value.push(id);
        localStorage.setItem('fav_albums', JSON.stringify(fav_albums.value));
    }
}

const isFav = computed(() => {
    return fav_albums.value.includes(props.album.id) ? 'bi-heart-fill text-danger' : 'bi-heart';
});

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

onMounted(() => {
    fav_albums.value = JSON.parse(localStorage.getItem('fav_albums'));
});
</script>