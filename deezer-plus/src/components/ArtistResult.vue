<template>
    <tr>
        <td v-bind:id="artist.id">
            <div><img class="me-2 img-thumbnail" v-bind:src="cover" width="40" height="40" /><a
                    :href="/artist/ + artist.id" v-bind:id="artist.id">{{artist.title}}</a>
            </div>
        </td>
        <td>
            <div><span>{{nb_album}}</span></div>
        </td>
        <td>
            <div><span>{{nb_fan}}</span></div>
        </td>
    </tr>
</template>

<script setup>
defineProps({
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
        type: Number,
    },
});
</script>