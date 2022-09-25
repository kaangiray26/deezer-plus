<template>
    <tr :track_id="track.id" :album_id="album.id" :artist_id="artist.id" type="tracks">
        <td>
            <div><img class=" me-2 img-thumbnail" :src="cover" width="40" height="40" />
                <button class="btn btn-link track-link" :id="track.id"
                    @click="playTrack($event)">{{track.title}}</button>
            </div>
        </td>
        <td>
            <div class="content">
                <router-link :to="/artist/+artist.id" @click="$emit('route-click')">{{artist.title}}</router-link>
            </div>
        </td>
        <td>
            <div>
                <router-link :to="/album/+album.id" @click="$emit('route-click')">{{album.title}}</router-link>
            </div>
        </td>
        <td>
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

async function playTrack(event) {
    DZ.player.playTracks([event.target.id]);
}
</script>