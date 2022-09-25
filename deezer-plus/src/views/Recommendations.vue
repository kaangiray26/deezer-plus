<template>
    <component ref="contextMenu1" id="contextMenu1" v-show="isContextMenuVisible" :is="contextMenus[currentSearchField]"
        :style="{'bottom':posY+'px', 'right':posX+'px'}" @context-menu-event="contextMenuEvent">
    </component>
    <Toast ref="thisToast" :message="toastMessage"></Toast>
    <div class=" row justify-content-center gx-0" @click="leftClick($event)">
        <div class="col">
            <div id="recommendationsAccordion" class="accordion" role="tablist">
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button" type="button"
                            data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-1"
                            aria-expanded="true"
                            aria-controls="recommendationsAccordion .item-1"><strong>Albums</strong></button>
                    </h2>
                    <div class="accordion-collapse collapse show item-1" role="tabpanel">
                        <div class="accordion-body">
                            <div class="row gx-1 gy-1" style="margin: 0px;padding: 0px;">
                                <div class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2"
                                    v-for="item in recommendations.albums">
                                    <AlbumRecommendation :id="item.album_id" :artist="item.artist" :title="item.title"
                                        :cover="item.cover" :album_id="item.album_id" @contextmenu="rightClick($event)">
                                    </AlbumRecommendation>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button collapsed" type="button"
                            data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-2"
                            aria-expanded="false"
                            aria-controls="recommendationsAccordion .item-2"><strong>Releases</strong></button>
                    </h2>
                    <div class="accordion-collapse collapse show item-2" role="tabpanel">
                        <div class="accordion-body">
                            <div class="row gx-1 gy-1" style="margin: 0px;padding: 0px;">
                                <div class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2"
                                    v-for="item in recommendations.releases">
                                    <AlbumRecommendation :id="item.album_id" :artist="item.artist" :title="item.title"
                                        :cover="item.cover" :album_id="item.album_id" @contextmenu="rightClick($event)">
                                    </AlbumRecommendation>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button collapsed" type="button"
                            data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-3"
                            aria-expanded="false"
                            aria-controls="recommendationsAccordion .item-3"><strong>Artists</strong></button>
                    </h2>
                    <div class="accordion-collapse collapse show item-3" role="tabpanel">
                        <div class="accordion-body">
                            <div class="row gx-1 gy-1" style="margin: 0px;padding: 0px;">
                                <div class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2"
                                    v-for="item in recommendations.artists">
                                    <ArtistRecommendation :id="item.artist_id" :artist="item.artist"
                                        :artist_id="item.artist_id" :cover=" item.cover"
                                        @contextmenu="rightClick($event)">
                                    </ArtistRecommendation>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button collapsed" type="button"
                            data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-4"
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
                                        :cover="item.cover" @contextmenu="rightClick($event)">
                                    </PlaylistRecommendation>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button collapsed" type="button"
                            data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-5"
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
                                        :cover="item.cover" @contextmenu="rightClick($event)">
                                    </TrackRecommendation>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button collapsed" type="button"
                            data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-6"
                            aria-expanded="false"
                            aria-controls="recommendationsAccordion .item-6"><strong>Radios</strong></button>
                    </h2>
                    <div class="accordion-collapse collapse show item-6" role="tabpanel">
                        <div class="accordion-body">
                            <div class="row gx-1 gy-1" style="margin: 0px;padding: 0px;">
                                <div class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2"
                                    v-for="item in recommendations.radios">
                                    <RadioRecommendation :id="item.radio_id" :radio_id="item.radio_id"
                                        :title="item.title" :cover="item.cover" @contextmenu="rightClick($event)">
                                    </RadioRecommendation>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="height: 100px;"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";

import Toast from "../components/liveToast.vue";

import TrackRecommendation from "./TrackRecommendation.vue";
import AlbumRecommendation from './AlbumRecommendation.vue';
import ArtistRecommendation from './ArtistRecommendation.vue';
import PlaylistRecommendation from "./PlaylistRecommendation.vue";
import RadioRecommendation from "./RadioRecommendation.vue";

import TrackContextMenu from "../components/context_menus/TrackContextMenu.vue";
import AlbumContextMenu from "../components/context_menus/AlbumContextMenu.vue";
import ArtistContextMenu from '../components/context_menus/ArtistContextMenu.vue';
import PlaylistContextMenu from '../components/context_menus/PlaylistContextMenu.vue';
import RadioContextMenu from '../components/context_menus/RadioContextMenu.vue';

import router from "../router";

const recommendations = ref({
    albums: [],
    releases: [],
    artists: [],
    playlists: [],
    tracks: [],
    radios: []
});

const recsVisible = ref(false);
const currentSearchField = ref("albums");
const isContextMenuVisible = ref(false);

const contextMenu1 = ref(null);

const posX = ref(0);
const posY = ref(0);

let thisToast = ref(null);
const toastMessage = ref("");

const selectedItem = ref(null);

const contextMenus = {
    "tracks": TrackContextMenu,
    "albums": AlbumContextMenu,
    "artists": ArtistContextMenu,
    "playlists": PlaylistContextMenu,
    "radios": RadioContextMenu,
};

async function get_recommendations() {
    get_rec_albums();
    get_rec_releases();
    get_rec_artists();
    get_rec_playlists();
    get_rec_tracks();
    get_rec_radios();
    recsVisible.value = true;
}

async function get_rec_albums() {
    DZ.api(`/user/me/recommendations/albums?access_token=${sessionStorage.getItem("token")}`, function (response) {
        response.data.map(handleRecAlbums);
    });
}

async function get_rec_releases() {
    DZ.api(`/user/me/recommendations/releases?access_token=${sessionStorage.getItem("token")}`, function (response) {
        response.data.map(handleRecReleases);
    });
}

async function get_rec_artists() {
    DZ.api(`/user/me/recommendations/artists?access_token=${sessionStorage.getItem("token")}`, function (response) {
        response.data.map(handleRecArtists);
    });
}

async function get_rec_playlists() {
    DZ.api(`/user/me/recommendations/playlists?access_token=${sessionStorage.getItem("token")}`, function (response) {
        response.data.map(handleRecPlaylists);
    });
}

async function get_rec_tracks() {
    DZ.api(`/user/me/recommendations/tracks?access_token=${sessionStorage.getItem("token")}`, function (response) {
        response.data.map(handleRecTracks);
    });
}

async function get_rec_radios() {
    DZ.api(`/user/me/recommendations/radios?access_token=${sessionStorage.getItem("token")}`, function (response) {
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

async function leftClick(event) {
    isContextMenuVisible.value = false;
}

async function rightClick(event) {
    event.preventDefault();
    selectedItem.value = event.currentTarget;
    currentSearchField.value = event.currentTarget.attributes.type.value;
    isContextMenuVisible.value = true;

    let mouse_x = event.x;
    let mouse_y = event.y;

    await nextTick()

    let context_x = document.getElementById("contextMenu1").offsetWidth;
    let context_y = document.getElementById("contextMenu1").offsetHeight;

    if (mouse_x <= context_x) {
        posX.value = window.innerWidth - mouse_x - context_x;
    } else {
        posX.value = window.innerWidth - mouse_x;
    }

    if (mouse_y + context_y >= window.innerHeight) {
        posY.value = window.innerHeight - mouse_y;
    } else {
        posY.value = window.innerHeight - mouse_y - context_y;
    }
}

async function contextMenuEvent(event) {
    isContextMenuVisible.value = false;
    // Album Events
    if (event == 'playAlbum') {
        DZ.player.playAlbum(parseInt(selectedItem.value.id), 0);
        return;
    }

    if (event == 'addAlbumToQueue') {
        DZ.api('/album/' + selectedItem.value.id + '/tracks', function (response) {
            DZ.player.addToQueue([...response.data.map(item => item.id)]);
        });
        return;
    }

    if (event == 'addAlbumToFavourites') {
        DZ.api(`/user/me/albums?access_token=${sessionStorage.getItem("token")}`, 'POST', {
            album_id: parseInt(selectedItem.value.id)
        }, function (response) {
            toastMessage.value = "Added to your favourites."
            thisToast.value.show();
        });
        return;
    }

    if (event == 'openAlbumPage') {
        router.push('/album/' + selectedItem.value.id);
        return;
    }

    if (event == 'openArtistPage') {
        router.push('/artist/' + selectedItem.value.attributes.artist_id.value);
        return;
    }

    // Artist Events
    if (event == 'addArtistToFavourites') {
        DZ.api(`/user/me/artists?access_token=${sessionStorage.getItem("token")}`, 'POST', {
            artist_id: parseInt(selectedItem.value.id)
        }, function (response) {
            toastMessage.value = "Added to your favourites."
            thisToast.value.show();
        });
        return;
    }

    // Playlist Events
    if (event == 'playPlaylist') {
        DZ.player.playPlaylist(parseInt(selectedItem.value.id), 0);
        return;
    }

    if (event == 'addPlaylistToQueue') {
        DZ.api('/playlist/' + selectedItem.value.id + '/tracks', function (response) {
            DZ.player.addToQueue([...response.data.map(item => item.id)]);
        });
        return;
    }

    if (event == 'addPlaylistToFavourites') {
        DZ.api(`/user/me/playlists?access_token=${sessionStorage.getItem("token")}`, 'POST', {
            playlist_id: parseInt(selectedItem.value.id)
        }, function (response) {
            toastMessage.value = "Added to your favourites."
            thisToast.value.show();
        });
        return;
    }

    if (event == 'openPlaylistPage') {
        router.push('/playlist/' + selectedItem.value.id);
        return;
    }

    // Track Events
    if (event == 'playTrack') {
        DZ.player.playTracks([parseInt(selectedItem.value.id)], 0);
        return;
    }

    if (event == 'addTrackToQueue') {
        DZ.player.addToQueue([parseInt(selectedItem.value.id)]);
        return;
    }

    if (event == 'addTrackToFavourites') {
        DZ.api(`/user/me/tracks?access_token=${sessionStorage.getItem("token")}`, 'POST', {
            track_id: parseInt(selectedItem.value.id)
        }, function (response) {
            toastMessage.value = "Added to your favourites."
            thisToast.value.show();
        });
        return;
    }

    if (event == 'launchTrackMix') {
        //
        return;
    }

    // Radio Events
    if (event == 'playRadio') {
        DZ.player.playRadio(parseInt(selectedItem.value.id));
        return;
    }

    if (event == 'addRadioToQueue') {
        DZ.api('/radio/' + selectedItem.value.id + '/tracks', function (response) {
            DZ.player.addToQueue([...response.data.map(item => item.id)]);
        });
        return;
    }

    if (event == 'openRadioPage') {
        router.push('/radio/' + selectedItem.value.id);
        return;
    }
}

onMounted(function () {
    get_recommendations();
});
</script>