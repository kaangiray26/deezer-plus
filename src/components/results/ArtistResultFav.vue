<template>
    <tr class="row gx-0 d-flex flex-row" :artist_id="props.artist.id" type="artists"
        style="flex-wrap: nowrap; width: 100% !important;">
        <td class="col-9 d-flex align-items-center text-nowrap text-truncate">
            <div><img class="img-fluid" :src="props.cover" width="40" height="40" />
                <router-link :to="/artist/+props.artist.id" class="btn btn-link track-link"
                    @click="emit('route-click')">
                    {{props.artist.title}}</router-link>
            </div>
        </td>
        <td class="col-1 d-flex align-items-center text-nowrap text-truncate">
            <div><span>{{props.nb_album}}</span></div>
        </td>
        <td class="col-1 d-flex align-items-center text-nowrap text-truncate">
            <div><span>{{props.nb_fan}}</span></div>
        </td>
        <td class="col-1 d-flex align-items-center justify-content-end text-nowrap text-truncate">
            <button class="btn btn-light bi" :class="isFav" type="button" style="opacity: 0.90;"
                @click="fav(props.artist.id)">
            </button>
        </td>
    </tr>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const emit = defineEmits(['route-click']);

const fav_artists = ref([]);

async function fav(id) {
    if (fav_artists.value.includes(id)) {
        fav_artists.value = fav_artists.value.filter((item) => item !== id);
        localStorage.setItem('fav_artists', JSON.stringify(fav_artists.value));
    } else {
        fav_artists.value.push(id);
        localStorage.setItem('fav_artists', JSON.stringify(fav_artists.value));
    }
}

const isFav = computed(() => {
    return fav_artists.value.includes(props.artist.id) ? 'bi-heart-fill text-danger' : 'bi-heart';
});

const props = defineProps({
    artist: {
        type: Object,
    },
    cover: {
        type: String,
    },
    nb_album: {
        type: Number,
    },
    nb_fan: {
        type: String,
    },
});

onMounted(() => {
    fav_artists.value = JSON.parse(localStorage.getItem('fav_artists'));
});
</script>