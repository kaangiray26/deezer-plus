<template>
    <tr class="row gx-0 d-flex flex-row" :artist_id="props.artist.id" type="artists"
        style="flex-wrap: nowrap; width: 100% !important;">
        <td class="col-10 d-flex align-items-center text-nowrap text-truncate">
            <div><img class="img-fluid" :src="props.cover" width="40" height="40" />
                <router-link :to="/artist/+props.artist.id" class="btn btn-link track-link"
                    @click="emit('route-click')">
                    {{props.artist.title}}</router-link>
            </div>
        </td>
        <td class="col-1 d-flex align-items-center text-nowrap text-truncate">
            <div><span>{{props.nb_album}}</span></div>
        </td>
        <td class="col-1 d-flex align-items-center text-nowrap text-truncate">
            <div><span>{{props.nb_fan}}</span></div>
        </td>
    </tr>
</template>

<script setup>
const emit = defineEmits(['route-click']);

const props = defineProps({
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