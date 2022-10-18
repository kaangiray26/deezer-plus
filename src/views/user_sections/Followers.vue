<template>
    <ul class="nav nav-pills" role="tablist">
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" :to="'/user/'+user_id+'/tracks'">Favorite Tracks
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" :to="'/user/'+user_id+'/playlists'">Playlists
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" :to="'/user/'+user_id+'/albums'">Albums
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" :to="'/user/'+user_id+'/artists'">Artists
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" :to="'/user/'+user_id+'/following'">Following
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link active fw-bolder" :to="'/user/'+user_id+'/followers'">Followers
            </router-link>
        </li>
    </ul>
    <hr />
    <div v-show="followersLoaded">
        <div class="row gx-1 gy-1" style="margin: 0px;padding: 0px;">
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2" v-for="profile in followers.profiles">
                <ProfileRecommendation :id="profile.id" :name="profile.name" :cover="profile.cover" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import router from "/router";
import ProfileRecommendation from "/views/ProfileRecommendation.vue";

const user_id = ref(0);

const followersLoaded = ref(false);
const followers = ref({
    profiles: [],
});

async function get_followers(id) {
    DZ.api(`/user/${id}/followers?access_token=${localStorage.getItem("token")}`, function (response) {
        response.data.map(handleFollowersResponse);
    });
    followersLoaded.value = true;
}

function handleFollowersResponse(item) {
    followers.value.profiles.push({
        id: parseInt(item.id),
        name: item.name,
        cover: item.picture_medium,
    });
}

onMounted(() => {
    user_id.value = router.currentRoute.value.params.id;
    get_followers(router.currentRoute.value.params.id);
});
</script>