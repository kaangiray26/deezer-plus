<template>
    <tr :artist_id="artist.id" type="artists">
        <td>
            <div><img class="img-fluid" :src="cover" width="40" height="40" />
                <router-link :to="/artist/+artist.id" class="btn btn-link track-link" @click="$emit('route-click')">
                    {{artist.title}}</router-link>
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
        type: String,
    },
});
</script>