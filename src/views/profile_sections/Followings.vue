<template>
    <ul class="nav nav-pills" role="tablist">
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" to="/profile/history">Listening history
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" to="/profile/tracks">Favorite Tracks
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" to="/profile/playlists">Playlists
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" to="/profile/albums">Albums
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" to="/profile/artists">Artists
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link active fw-bolder" to="/profile/following">Following
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" to="/profile/followers">Followers
            </router-link>
        </li>
    </ul>
    <hr />
    <div v-show="followingLoaded">
        <div class="row gx-1 gy-1" style="margin: 0px;padding: 0px;">
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2" v-for="profile in followings.profiles">
                <ProfileRecommendation :id="profile.id" :name="profile.name" :cover="profile.cover" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ProfileRecommendation from "/views/ProfileRecommendation.vue";

const followingLoaded = ref(false);
const followings = ref({
    profiles: [],
});

async function get_following() {
    DZ.api(`/user/me/followings?access_token=${localStorage.getItem("token")}`, function (response) {
        response.data.map(handleFollowingsResponse);
    });
    followingLoaded.value = true;
}

function handleFollowingsResponse(item) {
    followings.value.profiles.push({
        id: parseInt(item.id),
        name: item.name,
        cover: item.picture_medium,
    });
}

onMounted(() => {
    get_following();
});
</script>