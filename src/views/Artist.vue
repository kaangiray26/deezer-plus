<template>
    <div v-show="artistLoaded" class="row justify-content-center gx-0">
        <div class="card col-11">
            <div class="card-body rounded d-flex row shadow-lg">
                <div class="col-auto">
                    <figure class="d-flex flex-row">
                        <div class="d-flex justify-content-end position-relative overflow-hidden ratio-1x1">
                            <img class="img-fluid figure-img rounded" :src="artist.cover" />
                            <div class="position-absolute bottom-0">
                                <button class="btn btn-light bi shadow m-2" :class="isFav" type="button"
                                    style="opacity: 0.90;" @click="fav(artist.id)">
                                </button>
                            </div>
                        </div>
                    </figure>
                </div>
                <div class="col">
                    <div class="d-inline-flex flex-column">
                        <h1 class="text-bold mb-4" style="font-size: 32px; font-weight: 700;">{{artist.name}}</h1>
                        <p class="mb-0">
                            <small class="text-muted">{{artist.fans}} fans - {{artist.nb_albums}} albums</small>
                        </p>
                    </div>
                    <hr />
                    <table class="table table-borderless table-hover">
                        <thead>
                            <tr class="row gx-0 table-active" style="width: 100% !important;">
                                <th class="col-9">Album</th>
                                <th class="col-2">Release Date</th>
                                <th class="col-1 bi bi-explicit-fill"></th>
                            </tr>
                        </thead>
                        <div class="row justify-content-center gx-0">
                            <div class="card col-12">
                                <button v-show="!albumsLoaded" class="btn btn-dark" type="button" disabled>
                                    <span class="spinner-border spinner-border-sm" role="status"
                                        aria-hidden="true"></span>
                                    Loading...
                                </button>
                            </div>
                        </div>
                        <tbody v-show="albumsLoaded">
                            <tr v-for="album in artist.albums" :album_id="album.id" :artist_id="artist.id"
                                class="row gx-0 d-flex flex-row"
                                @contextmenu.prevent="$emit('right-click', {'event':$event, 'target':$event.currentTarget})"
                                type="albums" style="flex-wrap: nowrap; width: 100% !important;">
                                <td class="col-9 text-nowrap text-truncate">
                                    <div><img class="me-2 img-thumbnail" :src="album.cover" width="56" height="56" />
                                        <router-link :to="/album/+album.id" @click="$emit('route-click')">
                                            {{album.title}}
                                        </router-link>
                                    </div>
                                </td>
                                <td class="col-2 text-nowrap text-truncate">
                                    <div><span>{{formatDate(album.release_date)}}</span></div>
                                </td>
                                <td class="col-1 text-nowrap text-truncate">
                                    <div><span>{{album.explicit_lyrics?'Yes' : 'No'}}</span></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import router from "../router";

const artist = ref({
    albums: [],
});

const artistLoaded = ref(false);
const albumsLoaded = ref(false);

const fav_artists = ref([]);

const isFav = computed(() => {
    if (fav_artists.value.includes(artist.value.id)) {
        return "bi-heart-fill text-danger";
    } else {
        return "bi-heart";
    }
});

function compareAlbums(a, b) {
    if (a.release_date < b.release_date) {
        return 1;
    }
    if (a.release_date > b.release_date) {
        return -1;
    }
    return 0;
}

async function get_artist(id) {
    DZ.api('/artist/' + id, function (response) {
        artist.value['id'] = response.id;
        artist.value['name'] = response.name;
        artist.value['cover'] = response.picture_medium;
        artist.value['fans'] = numberWithCommas(response.nb_fan);
        artist.value['nb_albums'] = response.nb_album;
    });
    artistLoaded.value = true;
}

function get_albums(url) {
    DZ.api(url, function (response) {
        response.data.map(function (album) {
            artist.value['albums'].push({
                id: album.id,
                title: album.title,
                cover: album.cover_medium,
                release_date: album.release_date,
                explicit_lyrics: album.explicit_lyrics,
            })
        });
        if (response.next) {
            get_albums(response.next.split("https://api.deezer.com")[1]);
        } else {
            artist.value.albums.sort(compareAlbums);
            albumsLoaded.value = true;
        }
    });
}

function formatDate(date) {
    let date_arr = date.split('-');
    date_arr.reverse();
    return date_arr.join("/")
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function fav(id) {
    if (fav_artists.value.includes(id)) {
        fav_artists.value = fav_artists.value.filter((item) => item !== id);
        localStorage.setItem('fav_artists', JSON.stringify(fav_artists.value));
    } else {
        fav_artists.value.push(id);
        localStorage.setItem('fav_artists', JSON.stringify(fav_artists.value));
    }
}

onMounted(() => {
    fav_artists.value = localStorage.getItem('fav_artists') ? JSON.parse(localStorage.getItem('fav_artists')) : [];
    get_artist(router.currentRoute.value.params.id);
    get_albums('/artist/' + router.currentRoute.value.params.id + '/albums');
})
</script>