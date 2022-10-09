<template>
    <tr class="row gx-0 d-flex flex-row" :track_id="track.id" :album_id="album.id" :artist_id="artist.id" type="tracks"
        style="flex-wrap: nowrap; width: 100% !important;">
        <td class="col-6 d-flex align-items-center text-nowrap text-truncate">
            <div><img class="img-fluid" :src="cover" width="40" height="40" />
                <button class="btn btn-link track-link" @click="play(index)">{{track.title}}</button>
            </div>
        </td>
        <td class="col-2 d-flex align-items-center text-nowrap text-truncate">
            <div>
                <router-link :to="/artist/+artist.id" @click="$emit('route-click')">{{artist.title}}
                </router-link>
            </div>
        </td>
        <td class="col-2 d-flex align-items-center text-nowrap text-truncate">
            <div>
                <router-link :to="/album/+album.id" @click="$emit('route-click')">{{album.title}}</router-link>
            </div>
        </td>
        <td class="col-1 d-flex align-items-center text-nowrap text-truncate">
            <div><span>{{Math.floor(duration/60)}}:{{padWithZero(duration % 60)}}</span></div>
        </td>
        <td class="col-1 d-flex justify-content-end text-nowrap text-truncate">
            <button type="button" class="btn btn-outline-dark bi bi-x-lg"
                @click="$emit('remove-track', index)"></button>
        </td>
    </tr>
</template>

<script setup>
import { getQueueTracks } from "/js/queue.js";

defineProps({
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
</script>