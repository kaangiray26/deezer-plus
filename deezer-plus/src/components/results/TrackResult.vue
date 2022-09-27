<template>
    <tr class="row gx-0 d-flex flex-row" :track_id="track.id" :album_id="album.id" :artist_id="artist.id" type="tracks"
        style="flex-wrap: nowrap; width: 100% !important;">
        <td class="col-6 text-nowrap text-truncate">
            <div><img class="img-fluid" :src="cover" width="40" height="40" />
                <button class="btn btn-link track-link" @click="play(track.id)">{{track.title}}</button>
            </div>
        </td>
        <td class="col-2 text-nowrap text-truncate">
            <div>
                <router-link :to="/artist/+artist.id" @click="$emit('route-click')">{{artist.title}}</router-link>
            </div>
        </td>
        <td class="col-3 text-nowrap text-truncate">
            <div>
                <router-link :to="/album/+album.id" @click="$emit('route-click')">{{album.title}}</router-link>
            </div>
        </td>
        <td class="col-1 text-nowrap text-truncate">
            <div><span>{{Math.floor(duration/60)}}:{{padWithZero(duration % 60)}}</span></div>
        </td>
    </tr>
</template>

<script setup>
defineProps({
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

async function play(id) {
    DZ.player.playTracks([parseInt(id)]);
}
</script>