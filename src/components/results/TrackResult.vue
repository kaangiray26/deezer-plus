<template>
    <tr class="row gx-0 d-flex flex-row" :track_id="props.track.id" :album_id="props.album.id"
        :artist_id="props.artist.id" type="tracks" style="flex-wrap: nowrap; width: 100% !important;">
        <td class="col-6 d-flex align-items-center text-nowrap text-truncate">
            <div><img class="img-fluid" :src="props.cover" width="40" height="40" />
                <button class="btn btn-link track-link" @click="play(props.track.id)">{{props.track.title}}</button>
            </div>
        </td>
        <td class="col-2 d-flex align-items-center text-nowrap text-truncate">
            <div>
                <router-link :to="/artist/+props.artist.id" @click="emit('route-click')">{{props.artist.title}}
                </router-link>
            </div>
        </td>
        <td class="col-3 d-flex align-items-center text-nowrap text-truncate">
            <div>
                <router-link :to="/album/+props.album.id" @click="emit('route-click')">{{props.album.title}}
                </router-link>
            </div>
        </td>
        <td class="col-1 d-flex align-items-center justify-content-end text-nowrap text-truncate">
            <div><span>{{Math.floor(props.duration/60)}}:{{padWithZero(props.duration % 60)}}</span></div>
        </td>
    </tr>
</template>

<script setup>
import { sessionAction } from '/js/session.js';
import { addToQueueStart, getQueueTracks } from '/js/queue.js';

const emit = defineEmits(['route-click']);

function padWithZero(num) {
    return String(num).padStart(2, '0');
}

// Must be synchronized in groupSession: ok
async function play(id) {
    sessionAction({
        func: async function op() {
            await addToQueueStart([parseInt(id)]);
            getQueueTracks().then(tracks => {
                DZ.player.playTracks(tracks);
            });
        },
        object: id,
        operation: 'Track.play',
    });
}

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
</script>