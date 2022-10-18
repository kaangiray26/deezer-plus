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
            <router-link class="nav-link active fw-bolder" :to="'/user/'+user_id+'/following'">Following
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link fw-bolder text-dark" :to="'/user/'+user_id+'/followers'">Followers
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
import router from "/router";
import ProfileRecommendation from "/views/ProfileRecommendation.vue";

const user_id = ref(0);

const followingLoaded = ref(false);
const followings = ref({
    profiles: [],
});

async function get_following(id) {
    DZ.api(`/user/${id}/followings?access_token=${localStorage.getItem("token")}`, function (response) {
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
    user_id.value = router.currentRoute.value.params.id;
    get_following(router.currentRoute.value.params.id);
});
</script>