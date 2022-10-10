<template>
    <tr class="row gx-0 d-flex flex-row" :class="{'table-warning placeholder-glow':playing}" :track_id="props.track.id"
        :album_id="props.album.id" :artist_id="props.artist.id" type="tracks"
        style="flex-wrap: nowrap; width: 100% !important;">
        <td class="col-6 d-flex align-items-center text-nowrap text-truncate">
            <div>
                <img class="img-fluid" :src="props.cover" width="40" height="40" />
                <button class="btn btn-link track-link" @click="play(props.index)">{{props.track.title}}</button>
            </div>
        </td>
        <td class="col-2 d-flex align-items-center text-nowrap text-truncate">
            <div>
                <router-link :to="/artist/+props.artist.id" @click="emit('route-click')">{{props.artist.title}}
                </router-link>
            </div>
        </td>
        <td class="col-2 d-flex align-items-center text-nowrap text-truncate">
            <div>
                <router-link :to="/album/+props.album.id" @click="emit('route-click')">{{props.album.title}}
                </router-link>
            </div>
        </td>
        <td class="col-1 d-flex align-items-center text-nowrap text-truncate">
            <div><span>{{Math.floor(props.duration/60)}}:{{padWithZero(props.duration % 60)}}</span></div>
        </td>
        <td class="col-1 d-flex align-items-center justify-content-end text-nowrap text-truncate">
            <button type="button" class="btn btn-outline-dark bi bi-x-lg"
                @click="emit('remove-track', props.index)"></button>
        </td>
    </tr>
</template>

<script setup>
import { computed } from "vue";
import { store } from '/js/store.js';
import { getQueueTracks } from "/js/queue.js";

const emit = defineEmits(['route-click', 'remove-track']);

const playing = computed(() => {
    return (store.queue_index == props.index);
});

const props = defineProps({
    index: {
        type: Number,
        required: true
    },
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
});

function padWithZero(num) {
    return String(num).padStart(2, '0');
}

async function play(index) {
    getQueueTracks().then((tracks) => {
        DZ.player.playTracks(tracks, index);
    });
}

// onMounted(() => {
//     if (props.index == parseInt(DZ.player.getCurrentIndex())) {
//         playing.value = true;
//     }
// })

</script>