<template>
    <div v-show="artistLoaded" class="row justify-content-center gx-0">
        <div class="card col-11">
            <div class="card-body rounded d-flex row shadow-lg">
                <div class="col-auto">
                    <figure class="d-flex flex-row">
                        <div class="d-flex justify-content-end position-relative overflow-hidden ratio-1x1">
                            <img class="img-fluid figure-img rounded" :src="artist.cover" />
                            <div class="position-absolute bottom-0">
                            </div>
                        </div>
                    </figure>
                </div>
                <div class="col">
                    <div class="d-inline-flex flex-column">
                        <h1 class="text-bold mb-4" style="font-size: 32px; font-weight: 700;">{{artist.name}}</h1>
                        <p>
                            <small class="text-muted">{{artist.fans}} fans - {{artist.nb_albums}} albums</small>
                        </p>
                    </div>
                    <hr />
                    <table class="table table-borderless table-hover">
                        <thead>
                            <tr class="table-active">
                                <th scope="col">Album</th>
                                <th scope="col">Release Date</th>
                                <th class="bi bi-explicit-fill"></th>
                            </tr>
                        </thead>
                        <tbody v-show="albumsLoaded">
                            <tr v-for="album in artist.albums" :album_id="album.id" :artist_id="artist.id"
                                @contextmenu.prevent="$emit('right-click', {'event':$event, 'target':$event.currentTarget})"
                                type="albums">
                                <td>
                                    <div><img class="me-2 img-thumbnail" :src="album.cover" width="56" height="56" />
                                        <router-link :to="/album/+album.id" @click="$emit('route-click')">
                                            {{album.title}}
                                        </router-link>
                                    </div>
                                </td>
                                <td>
                                    <div><span>{{formatDate(album.release_date)}}</span></div>
                                </td>
                                <td>
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
import { ref, onMounted } from "vue";
import router from "../router";

const artist = ref({
    albums: [],
});

const artistLoaded = ref(false);
const albumsLoaded = ref(false);

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

onMounted(() => {
    get_artist(router.currentRoute.value.params.id);
    get_albums('/artist/' + router.currentRoute.value.params.id + '/albums');
})
</script>