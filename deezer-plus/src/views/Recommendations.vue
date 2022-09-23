<template>
    <component v-if="isContextMenuVisible" :is="contextMenus[currentSearchField]"
        :style="{'bottom':posY+'px', 'right':posX+'px'}" @context-menu-event="contextMenuEvent">
    </component>
    <div class="row justify-content-center gx-0" @click="leftClick($event)">
        <div class="col-12 mb-5">
            <div id="recommendationsAccordion" class="mt-2 accordion" role="tablist">
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button" type="button"
                            data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-1"
                            aria-expanded="true" aria-controls="recommendationsAccordion .item-1">Albums</button>
                    </h2>
                    <div class="accordion-collapse collapse show item-1" role="tabpanel">
                        <div class="accordion-body">
                            <div class="row gx-1 gy-1" style="margin: 0px;padding: 0px;">
                                <div class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2" v-for="item in rec_albums">
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
                            aria-expanded="false" aria-controls="recommendationsAccordion .item-2">Releases</button>
                    </h2>
                    <div class="accordion-collapse collapse show item-2" role="tabpanel">
                        <div class="accordion-body">
                            <div class="row gx-1 gy-1" style="margin: 0px;padding: 0px;">
                                <div class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2" v-for="item in rec_releases">
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
                            aria-expanded="false" aria-controls="recommendationsAccordion .item-3">Artists</button>
                    </h2>
                    <div class="accordion-collapse collapse show item-3" role="tabpanel">
                        <div class="accordion-body">
                            <div class="row gx-1 gy-1" style="margin: 0px;padding: 0px;">
                                <div class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2" v-for="item in rec_artists">
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
                            aria-expanded="false" aria-controls="recommendationsAccordion .item-4">Playlists</button>
                    </h2>
                    <div class="accordion-collapse collapse show item-4" role="tabpanel">
                        <div class="accordion-body">
                            <p class="mb-0">Nullam id dolor id nibh ultricies vehicula ut id elit. Cras justo odio,
                                dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at
                                eget metus.</p>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button collapsed" type="button"
                            data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-5"
                            aria-expanded="false" aria-controls="recommendationsAccordion .item-5">Tracks</button>
                    </h2>
                    <div class="accordion-collapse collapse show item-5" role="tabpanel">
                        <div class="accordion-body">
                            <p class="mb-0">Nullam id dolor id nibh ultricies vehicula ut id elit. Cras justo odio,
                                dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at
                                eget metus.</p>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button collapsed" type="button"
                            data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-6"
                            aria-expanded="false" aria-controls="recommendationsAccordion .item-6">Radios</button>
                    </h2>
                    <div class="accordion-collapse collapse show item-6" role="tabpanel">
                        <div class="accordion-body">
                            <p class="mb-0">Nullam id dolor id nibh ultricies vehicula ut id elit. Cras justo odio,
                                dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at
                                eget metus.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AlbumRecommendation from './AlbumRecommendation.vue';
import ArtistRecommendation from './ArtistRecommendation.vue';

import TrackContextMenu from "../components/TrackContextMenu.vue";
import AlbumContextMenu from "../components/AlbumContextMenu.vue";
import ArtistContextMenu from '../components/ArtistContextMenu.vue';

const rec_albums = ref({ value: [] });
const rec_releases = ref({ value: [] });
const rec_artists = ref({ value: [] });

const recsVisible = ref(false);
const currentSearchField = ref("albums");

const isContextMenuVisible = ref(false);

const posX = ref(0);
const posY = ref(0);

const contextMenus = {
    "tracks": TrackContextMenu,
    "albums": AlbumContextMenu,
    "artists": ArtistContextMenu,
};

async function get_recommendations() {
    get_rec_albums();
    get_rec_releases();
    get_rec_artists();
    recsVisible.value = true;
}

async function get_rec_albums() {
    DZ.api(`/user/me/recommendations/albums&access_token=${sessionStorage.getItem("token")}`, function (response) {
        response.data.map(handleRecAlbums);
    });
}

async function get_rec_releases() {
    DZ.api(`/user/me/recommendations/releases&access_token=${sessionStorage.getItem("token")}`, function (response) {
        response.data.map(handleRecReleases);
    });
}

async function get_rec_artists() {
    DZ.api(`/user/me/recommendations/artists&access_token=${sessionStorage.getItem("token")}`, function (response) {
        response.data.map(handleRecArtists);
    });
}

function handleRecAlbums(item) {
    rec_albums.value.push({
        album_id: item.id,
        artist: item.artist.name,
        title: item.title,
        cover: item.cover_medium,
    })
    return;
}

function handleRecReleases(item) {
    rec_releases.value.push({
        album_id: item.id,
        artist: item.artist.name,
        title: item.title,
        cover: item.cover_medium,
    })
    return;
}

function handleRecArtists(item) {
    rec_artists.value.push({
        artist_id: item.id,
        artist: item.name,
        cover: item.picture_medium,
    })
    return;
}

function leftClick(event) {
    isContextMenuVisible.value = false;
}

function rightClick(event) {
    event.preventDefault();
    currentSearchField.value = event.currentTarget.attributes.type.value;
    posX.value = window.innerWidth - event.screenX - 5;
    posY.value = window.innerHeight - event.screenY + 20;
    isContextMenuVisible.value = true;
}

async function contextMenuEvent(event) {
    if (event == 'playTrack') {
        DZ.player.playTracks([selectedTrack.value]);
        return;
    }

    if (event == 'addTrackToQueue') {
        DZ.player.addToQueue([selectedTrack.value]);
        return;
    }

    if (event == 'launchTrackMix') {
        //
        return;
    }
}

onMounted(function () {
    rec_albums.value = [];
    rec_releases.value = [];
    rec_artists.value = [];
    get_recommendations();
});
</script>