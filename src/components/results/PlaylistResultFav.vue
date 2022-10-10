<template>
    <tr class="row gx-0 d-flex flex-row" :playlist_id="props.playlist.id" :user_id="props.user.id" type="playlists"
        style="flex-wrap: nowrap; width: 100% !important;">
        <td class="col-6 text-nowrap text-truncate">
            <div>
                <img class="img-fluid" :src="props.cover" width="40" height="40" />
                <router-link :to="/playlist/+props.playlist.id" class="btn btn-link track-link"
                    @click="$emit('route-click')">
                    {{props.playlist.title}}</router-link>
            </div>
        </td>
        <td class="col-4 text-nowrap text-truncate">
            <div>
                <router-link :to="/user/+props.user.id" @click="$emit('route-click')">{{props.user.name}}</router-link>
            </div>
        </td>
        <td class="col-1 text-nowrap text-truncate">
            <div><span>{{props.nb_tracks}}</span></div>
        </td>
        <td class="col-1 d-flex justify-content-end text-nowrap text-truncate">
            <button class="btn btn-light bi" :class="isFav" type="button" style="opacity: 0.90;"
                @click="fav(props.playlist.id)">
            </button>
        </td>
    </tr>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
const fav_playlists = ref([]);

async function fav(id) {
    if (fav_playlists.value.includes(id)) {
        fav_playlists.value = fav_playlists.value.filter((item) => item !== id);
        localStorage.setItem('fav_playlists', JSON.stringify(fav_playlists.value));
    } else {
        fav_playlists.value.push(id);
        localStorage.setItem('fav_playlists', JSON.stringify(fav_playlists.value));
    }
}

const isFav = computed(() => {
    return fav_playlists.value.includes(props.playlist.id) ? 'bi-heart-fill text-danger' : 'bi-heart';
});

const props = defineProps({
    playlist: {
        type: Object,
    },
    user: {
        type: Object,
    },
    cover: {
        type: String,
    },
    nb_tracks: {
        type: Number,
    },
});

onMounted(() => {
    fav_playlists.value = JSON.parse(localStorage.getItem('fav_playlists'));
});
</script>