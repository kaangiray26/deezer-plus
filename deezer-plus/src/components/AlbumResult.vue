<template>
    <tr>
        <td v-bind:id="album.id">
            <div><img class="me-2 img-thumbnail" v-bind:src="cover" width="40" height="40" /><a
                    :href="/album/ + album.id" v-bind:id="album.id">{{album.title}}</a>
            </div>
        </td>
        <td>
            <div><a :href="/artist/ + artist.id">{{artist.title}}</a></div>
        </td>
        <td>
            <div><span>{{nb_tracks}}</span></div>
        </td>
        <td>
            <div><span>{{explicit_lyrics?'Yes' : 'No'}}</span></div>
        </td>
    </tr>
</template>

<script setup>
defineProps({
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
</script>