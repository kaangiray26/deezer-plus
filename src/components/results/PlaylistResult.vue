<template>
    <tr class="row gx-0 d-flex flex-row" :playlist_id="playlist.id" :user_id="user.id" type="playlists"
        style="flex-wrap: nowrap; width: 100% !important;">
        <td class="col-6 text-nowrap text-truncate">
            <div>
                <img class="img-fluid" :src="cover" width="40" height="40" />
                <router-link :to="/playlist/+playlist.id" class="btn btn-link track-link" @click="$emit('route-click')">
                    {{playlist.title}}</router-link>
            </div>
        </td>
        <td class="col-5 text-nowrap text-truncate">
            <div>
                <router-link :to="/user/+user.id" @click="$emit('route-click')">{{user.name}}</router-link>
            </div>
        </td>
        <td class="col-1 text-nowrap text-truncate">
            <div><span>{{nb_tracks}}</span></div>
        </td>
    </tr>
</template>

<script setup>
defineProps({
    playlist: {
        type: Object,
    },
    user: {
        type: Object,
    },
    cover: {
        type: String,
    },
    nb_tracks: {
        type: Number,
    },
});
</script>