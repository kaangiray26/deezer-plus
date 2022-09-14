<template>
    <div class="container-fluid mb-4" style="height: 100%;width: 100%;margin: 0px;padding: 0px;">
        <div class="card" style="width: 100%;">
            <div class="card-body">
                <div class="d-flex align-items-center"><a class="page-heading-link hover-color me-2" href="/"
                        style="padding: 0.25em;font-family: 'Secular One', sans-serif;">
                        <h4 class="page-heading">Live.fm</h4>
                    </a>
                    <div class="input-group"><span class="input-group-text bi bi-search"
                            style="background: transparent;border-right-style: none;"></span><input class="form-control"
                            type="text" id="searchField" placeholder="Search"
                            style="background: transparent;border-left-style: none;" autocomplete="off"
                            @keyup.enter="search($event)">
                    </div>
                </div>
            </div>
        </div>
        <div class="row justify-content-center gx-0">
            <div class="col-11 mb-5">
                <div v-if="searchVisible">
                    <ul class="nav nav-pills my-2" role="tablist">
                        <li class="nav-item" role="presentation"><a id="tracks-tab" class="nav-link active" role="tab"
                                data-bs-toggle="tab" href="#tab-4">Tracks</a>
                        </li>
                        <li class="nav-item" role="presentation"><a id="albums-tab" class="nav-link" role="tab"
                                data-bs-toggle="tab" href="#tab-3">Albums</a></li>
                        <li class="nav-item" role="presentation"><a id="artists-tab" class="nav-link" role="tab"
                                data-bs-toggle="tab" href="#tab-2">Artists</a></li>
                        <li class="row align-items-center ms-2"><span class="badge bg-secondary">{{total}}</span></li>
                    </ul>
                    <div class="tab-content">
                        <div id="tab-2" class="tab-pane" role="tabpanel">
                            <ul class="list-group">
                                <li class="list-group-item" v-for="artist in artists">
                                    <Artist></Artist>
                                </li>
                            </ul>
                        </div>
                        <div id="tab-3" class="tab-pane" role="tabpanel">
                            <ul class="list-group">
                                <li class="list-group-item" v-for="album in albums">
                                    <Album></Album>
                                </li>
                            </ul>
                        </div>
                        <div id="tab-4" class="tab-pane active" role="tabpanel">
                            <TrackContextMenu v-if="isContextMenuVisible"
                                :style="{'bottom':posY+'px', 'right':posX+'px'}" @playTrack="playTrack"
                                @addTrackToQueue="addTrackToQueue" @launchTrackMix="launchTrackMix"></TrackContextMenu>
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <div class="table-responsive">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th>Track</th>
                                                    <th>Artist</th>
                                                    <th>Album</th>
                                                    <th class="bi bi-clock-fill"></th>
                                                </tr>
                                            </thead>
                                            <tbody v-for="item in tracks" @scroll.passive="onScroll($event)">
                                                <Track @click="leftClick($event)" :id=" item.id" :cover="item.cover"
                                                    :artist="item.artist" :album="item.album" :track="item.track"
                                                    :duration="item.duration" @contextmenu="rightClick($event)">
                                                </Track>
                                            </tbody>
                                        </table>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import Artist from "./ArtistResult.vue";
import Album from "./AlbumResult.vue";
import Track from "./TrackResult.vue";
import TrackContextMenu from "./TrackContextMenu.vue";

const searchVisible = ref(false);
const artists = ref({ value: [] })
const albums = ref({ value: [] })
const tracks = ref({ value: [] })

const total = ref(0);
const next = ref(null);
const searchFinished = ref(true);

const isContextMenuVisible = ref(false);
let posX = ref(0);
let posY = ref(0);

let selectedTrack = ref(null);

window.onscroll = () => {
    if (((window.innerHeight + window.scrollY) >= document.body.scrollHeight) && searchFinished.value) {
        next_search();
    }
};


async function search(event) {
    let query = event.target.value;
    if (!query.length) {
        return;
    }
    tracks.value = [];
    DZ.api(`/search?q=${query}&access_token=${sessionStorage.getItem("token")}`, function (response) {
        searchVisible.value = true;
        total.value = response.total;
        next.value = response.next;
        response.data.map(handleSearchResponse);
    });
}

async function next_search() {
    searchFinished.value = false;
    DZ.api(next.value.split("https://api.deezer.com")[1], function (response) {
        response.data.map(handleSearchResponse);
        if (response.next) {
            next.value = response.next;
            searchFinished.value = true;
            return;
        }
        searchFinished.value = false;
    });
}

async function playTrack() {
    DZ.player.playTracks([selectedTrack.value]);
    isContextMenuVisible.value = false;
}

async function addTrackToQueue() {
    isContextMenuVisible.value = false;
    //
}

async function launchTrackMix() {
    isContextMenuVisible.value = false;
    //
}

function rightClick(event) {
    event.preventDefault();
    selectedTrack.value = event.currentTarget.firstChild.id
    posX.value = window.innerWidth - event.screenX;
    posY.value = window.innerHeight - event.screenY;
    isContextMenuVisible.value = true;
}

function leftClick(event) {
    isContextMenuVisible.value = false;
}

function handleSearchResponse(item) {
    console.log(item.type);
    if (item.type == "track") {
        tracks.value.push({
            cover: item.album.cover_small,
            artist: {
                "id": item.artist.id,
                "title": item.artist.name,
            },
            album: {
                "id": item.album.id,
                "title": item.album.title,
            },
            track: {
                "id": item.id,
                "title": item.title,
            },
            duration: item.duration
        })
        return;
    }
    // if (item.type == "album") {
    //     albums.value.push({
    //         id: item.id,
    //         cover: item.album.cover_small,
    //         artist: item.artist.name,
    //         album: item.album.title,
    //         track: item.title,
    //         duration: item.duration
    //     })
    //     return;
    // }
    // if (item.type == "artist") {
    //     artist.value.push({
    //         id: item.id,
    //         cover: item.album.cover_small,
    //         artist: item.artist.name,
    //         album: item.album.title,
    //         track: item.title,
    //         duration: item.duration
    //     })
    //     return;
    // }
}
</script>