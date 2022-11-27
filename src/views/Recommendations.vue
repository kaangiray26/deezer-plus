<template>
    <div class="row justify-content-center gx-0">
        <div class="col">
            <div id="recommendationsAccordion" class="accordion" role="tablist">
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button bg-dark text-light"
                            type="button" data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-5"
                            aria-expanded="false"
                            aria-controls="recommendationsAccordion .item-5"><strong>Tracks</strong></button>
                    </h2>
                    <div class="accordion-collapse collapse show item-5" role="tabpanel">
                        <div class="accordion-body">
                            <div class="row gx-1 gy-1" style="margin: 0px;padding: 0px;">
                                <div class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2"
                                    v-for="item in recommendations.tracks">
                                    <TrackRecommendation :id="item.track_id" :title="item.title"
                                        :track_id="item.track_id" :album="item.album" :artist="item.artist"
                                        :cover="item.cover"
                                        @contextmenu.prevent="emit('right-click', { 'event': $event, 'target': $event.currentTarget })">
                                    </TrackRecommendation>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button bg-dark text-light"
                            type="button" data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-1"
                            aria-expanded="true"
                            aria-controls="recommendationsAccordion .item-1"><strong>Albums</strong></button>
                    </h2>
                    <div class="accordion-collapse collapse show item-1" role="tabpanel">
                        <div class="accordion-body">
                            <div class="row gx-1 gy-1" style="margin: 0px;padding: 0px;">
                                <div class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2"
                                    v-for="item in recommendations.albums">
                                    <AlbumRecommendation :id="item.album_id" :artist="item.artist" :title="item.title"
                                        :cover="item.cover" :album_id="item.album_id"
                                        @contextmenu.prevent="emit('right-click', { 'event': $event, 'target': $event.currentTarget })">
                                    </AlbumRecommendation>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button bg-dark text-light"
                            type="button" data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-2"
                            aria-expanded="false"
                            aria-controls="recommendationsAccordion .item-2"><strong>Releases</strong></button>
                    </h2>
                    <div class="accordion-collapse collapse show item-2" role="tabpanel">
                        <div class="accordion-body">
                            <div class="row gx-1 gy-1" style="margin: 0px;padding: 0px;">
                                <div class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2"
                                    v-for="item in recommendations.releases">
                                    <AlbumRecommendation :id="item.album_id" :artist="item.artist" :title="item.title"
                                        :cover="item.cover" :album_id="item.album_id"
                                        @contextmenu.prevent="emit('right-click', { 'event': $event, 'target': $event.currentTarget })">
                                    </AlbumRecommendation>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button bg-dark text-light"
                            type="button" data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-3"
                            aria-expanded="false"
                            aria-controls="recommendationsAccordion .item-3"><strong>Artists</strong></button>
                    </h2>
                    <div class="accordion-collapse collapse show item-3" role="tabpanel">
                        <div class="accordion-body">
                            <div class="row gx-1 gy-1" style="margin: 0px;padding: 0px;">
                                <div class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2"
                                    v-for="item in recommendations.artists">
                                    <ArtistRecommendation :id="item.artist_id" :artist="item.artist"
                                        :artist_id="item.artist_id" :cover="item.cover"
                                        @contextmenu.prevent="emit('right-click', { 'event': $event, 'target': $event.currentTarget })">
                                    </ArtistRecommendation>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button bg-dark text-light"
                            type="button" data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-4"
                            aria-expanded="false"
                            aria-controls="recommendationsAccordion .item-4"><strong>Playlists</strong></button>
                    </h2>
                    <div class="accordion-collapse collapse show item-4" role="tabpanel">
                        <div class="accordion-body">
                            <div class="row gx-1 gy-1" style="margin: 0px;padding: 0px;">
                                <div class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2"
                                    v-for="item in recommendations.playlists">
                                    <PlaylistRecommendation :id="item.playlist_id" :user="item.user"
                                        :playlist_id="item.playlist_id" :title="item.title" :tracks="item.tracks"
                                        :cover="item.cover"
                                        @contextmenu.prevent="emit('right-click', { 'event': $event, 'target': $event.currentTarget })">
                                    </PlaylistRecommendation>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button bg-dark text-light"
                            type="button" data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-6"
                            aria-expanded="false"
                            aria-controls="recommendationsAccordion .item-6"><strong>Radios</strong></button>
                    </h2>
                    <div class="accordion-collapse collapse show item-6" role="tabpanel">
                        <div class="accordion-body">
                            <div class="row gx-1 gy-1" style="margin: 0px;padding: 0px;">
                                <div class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2"
                                    v-for="item in recommendations.radios">
                                    <RadioRecommendation :id="item.radio_id" :radio_id="item.radio_id"
                                        :title="item.title" :cover="item.cover"
                                        @contextmenu.prevent="emit('right-click', { 'event': $event, 'target': $event.currentTarget })">
                                    </RadioRecommendation>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import TrackRecommendation from "./TrackRecommendation.vue";
import AlbumRecommendation from './AlbumRecommendation.vue';
import ArtistRecommendation from './ArtistRecommendation.vue';
import PlaylistRecommendation from "./PlaylistRecommendation.vue";
import RadioRecommendation from "./RadioRecommendation.vue";

const emit = defineEmits(['right-click']);

const recommendations = ref({
    albums: [],
    releases: [],
    artists: [],
    playlists: [],
    tracks: [],
    radios: []
});

const recsVisible = ref(false);

async function get_recommendations() {
    get_rec_tracks();
    get_rec_albums();
    get_rec_releases();
    get_rec_artists();
    get_rec_playlists();
    get_rec_radios();
    recsVisible.value = true;
}

async function get_rec_albums() {
    DZ.api(`/user/me/recommendations/albums?access_token=${localStorage.getItem("token")}`, function (response) {
        response.data.map(handleRecAlbums);
    });
}

async function get_rec_releases() {
    DZ.api(`/user/me/recommendations/releases?access_token=${localStorage.getItem("token")}`, function (response) {
        response.data.map(handleRecReleases);
    });
}

async function get_rec_artists() {
    DZ.api(`/user/me/recommendations/artists?access_token=${localStorage.getItem("token")}`, function (response) {
        response.data.map(handleRecArtists);
    });
}

async function get_rec_playlists() {
    DZ.api(`/user/me/recommendations/playlists?access_token=${localStorage.getItem("token")}`, function (response) {
        response.data.map(handleRecPlaylists);
    });
}

async function get_rec_tracks() {
    DZ.api(`/user/me/recommendations/tracks?access_token=${localStorage.getItem("token")}`, function (response) {
        response.data.map(handleRecTracks);
    });
}

async function get_rec_radios() {
    DZ.api(`/user/me/recommendations/radios?access_token=${localStorage.getItem("token")}`, function (response) {
        response.data.map(handleRecRadios);
    });
}

function handleRecAlbums(item) {
    recommendations.value.albums.push({
        album_id: item.id,
        artist: item.artist,
        title: item.title,
        cover: item.cover_medium,
    })
    return;
}

function handleRecReleases(item) {
    recommendations.value.releases.push({
        album_id: item.id,
        artist: item.artist,
        title: item.title,
        cover: item.cover_medium,
    })
    return;
}

function handleRecArtists(item) {
    recommendations.value.artists.push({
        artist_id: item.id,
        artist: item.name,
        cover: item.picture_medium,
    })
    return;
}

function handleRecPlaylists(item) {
    recommendations.value.playlists.push({
        playlist_id: item.id,
        user: item.user.name,
        title: item.title,
        tracks: item.nb_tracks,
        cover: item.picture_medium,
    })
    return;
}

function handleRecTracks(item) {
    recommendations.value.tracks.push({
        track_id: item.id,
        title: item.title,
        album: item.album,
        artist: item.artist,
        cover: item.album.cover_medium,
    })
    return;
}

function handleRecRadios(item) {
    recommendations.value.radios.push({
        radio_id: item.id,
        title: item.title,
        cover: item.picture_medium,
    })
    return;
}

onMounted(() => {
    get_recommendations();
});
</script>