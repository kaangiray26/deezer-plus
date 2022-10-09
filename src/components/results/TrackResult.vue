<template>
    <tr class="row gx-0 d-flex flex-row" :track_id="props.track.id" :album_id="props.album.id"
        :artist_id="props.artist.id" type="tracks" style="flex-wrap: nowrap; width: 100% !important;">
        <td class="col-6 text-nowrap text-truncate">
            <div><img class="img-fluid" :src="props.cover" width="40" height="40" />
                <button class="btn btn-link track-link" @click="play(props.track.id)">{{props.track.title}}</button>
            </div>
        </td>
        <td class="col-2 text-nowrap text-truncate">
            <div>
                <router-link :to="/artist/+props.artist.id" @click="$emit('route-click')">{{props.artist.title}}
                </router-link>
            </div>
        </td>
        <td class="col-2 text-nowrap text-truncate">
            <div>
                <router-link :to="/album/+props.album.id" @click="$emit('route-click')">{{props.album.title}}
                </router-link>
            </div>
        </td>
        <td class="col-1 text-nowrap text-truncate">
            <div><span>{{Math.floor(props.duration/60)}}:{{padWithZero(props.duration % 60)}}</span></div>
        </td>
        <td class="col-1 text-nowrap text-truncate">
            <button class="btn btn-light bi" :class="isFav" type="button" style="opacity: 0.90;"
                @click="fav(props.track.id)">
            </button>
        </td>
    </tr>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { addToQueueStart, getQueue } from '/js/queue.js';

const fav_tracks = ref([]);

function padWithZero(num) {
    return String(num).padStart(2, '0');
}

async function play(id) {
    addToQueueStart([id]);
    getQueue().then(tracks => {
        DZ.player.playTracks(tracks);
    });
}

async function fav(id) {
    if (fav_tracks.value.includes(id)) {
        fav_tracks.value = fav_tracks.value.filter((item) => item !== id);
        localStorage.setItem('fav_tracks', JSON.stringify(fav_tracks.value));
    } else {
        fav_tracks.value.push(id);
        localStorage.setItem('fav_tracks', JSON.stringify(fav_tracks.value));
    }
}

const isFav = computed(() => {
    return fav_tracks.value.includes(props.track.id) ? 'bi-heart-fill text-danger' : 'bi-heart';
});

const props = defineProps({
    cover: {
        type: String,
    },
    artist: {
        type: Object,
    },
    album: {
        type: Object,
    },
    track: {
        type: Object,
    },
    duration: {
        type: Number,
    },
    fav: {
        type: Boolean,
    }
});

onMounted(() => {
    fav_tracks.value = JSON.parse(localStorage.getItem('fav_tracks'));
});
</script>