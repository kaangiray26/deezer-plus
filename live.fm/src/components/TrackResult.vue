<template>
    <tr>
        <td v-bind:id="track.id">
            <div><img class="me-2 img-thumbnail" v-bind:src="cover" width="40" height="40" /><a href="#"
                    @click="playTrack($event)" v-bind:id="track.id">{{track.title}}</a>
            </div>
        </td>
        <td>
            <div class="content"><a :href="/artist/ + artist.id">{{artist.title}}</a></div>
        </td>
        <td>
            <div><a :href="/album/ + album.id">{{album.title}}</a></div>
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