<template>
    <component ref="contextMenu" id="contextMenu" v-show="isContextMenuVisible" :is="contextMenus[currentSearchField]"
        :style="{'bottom':posY+'px', 'right':posX+'px'}" @context-menu-event="contextMenuEvent">
    </component>
    <Toast ref="thisToast" :message="toastMessage"></Toast>
</template>

<script setup>
import { ref, nextTick } from "vue";

import router from "../router";
import Toast from "./liveToast.vue";

import TrackContextMenu from "./context_menus/TrackContextMenu.vue";
import AlbumContextMenu from "./context_menus/AlbumContextMenu.vue";
import ArtistContextMenu from './context_menus/ArtistContextMenu.vue';
import PlaylistContextMenu from './context_menus/PlaylistContextMenu.vue';
import RadioContextMenu from './context_menus/RadioContextMenu.vue';

const posX = ref(0);
const posY = ref(0);

const selectedItem = ref(null);

let thisToast = ref(null);
const toastMessage = ref("");

const currentSearchField = ref("");
const isContextMenuVisible = ref(false);
const contextMenu = ref(null);
const contextMenus = {
    "tracks": TrackContextMenu,
    "albums": AlbumContextMenu,
    "artists": ArtistContextMenu,
    "playlists": PlaylistContextMenu,
    "radios": RadioContextMenu,
};

async function _left_click(obj) {
    isContextMenuVisible.value = false;
}

async function _right_click(obj) {
    console.log("Target:", obj.target);
    selectedItem.value = obj.target;
    currentSearchField.value = selectedItem.value.attributes.type.value;
    isContextMenuVisible.value = true;

    let mouse_x = obj.event.x;
    let mouse_y = obj.event.y;

    await nextTick();

    let context_x = document.getElementById("contextMenu").offsetWidth;
    let context_y = document.getElementById("contextMenu").offsetHeight;

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

    // Open Page Events
    if (event == 'openAlbumPage') {
        // searchVisible.value = false;
        router.push('/album/' + selectedItem.value.attributes.album_id.value);
        return;
    }

    if (event == 'openArtistPage') {
        // searchVisible.value = false;
        router.push('/artist/' + selectedItem.value.attributes.artist_id.value);
        return;
    }

    if (event == 'openPlaylistPage') {
        // searchVisible.value = false;
        router.push('/playlist/' + selectedItem.value.id);
        return;
    }

    if (event == 'openRadioPage') {
        // searchVisible.value = false;
        router.push('/radio/' + selectedItem.value.id);
        return;
    }

    // Play Events
    if (event == 'playTrack') {
        DZ.player.playTracks([parseInt(selectedItem.value.attributes.track_id.value)]);
        return;
    }

    if (event == 'playAlbum') {
        DZ.player.playAlbum(parseInt(selectedItem.value.attributes.album_id.value), 0);
        return;
    }

    if (event == 'playPlaylist') {
        DZ.player.playPlaylist(parseInt(selectedItem.value.id), 0);
        return;
    }

    if (event == 'playRadio') {
        DZ.player.playRadio(parseInt(selectedItem.value.id));
        return;
    }

    // Track Events
    if (event == 'addTrackToQueue') {
        DZ.player.addToQueue([parseInt(selectedItem.value.attributes.track_id.value)]);
        return;
    }

    if (event == 'addTrackToFavourites') {
        DZ.api(`/user/me/tracks?access_token=${sessionStorage.getItem("token")}`, 'POST', {
            track_id: parseInt(selectedItem.value.attributes.track_id.value)
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

    // Album Events
    if (event == 'addAlbumToQueue') {
        DZ.api('/album/' + selectedItem.value.attributes.album_id.value + '/tracks', function (response) {
            DZ.player.addToQueue([...response.data.map(item => item.id)]);
        });
        return;
    }

    if (event == 'addAlbumToFavourites') {
        DZ.api(`/user/me/albums?access_token=${sessionStorage.getItem("token")}`, 'POST', {
            album_id: parseInt(selectedItem.value.attributes.album_id.value)
        }, function (response) {
            toastMessage.value = "Added to your favourites."
            thisToast.value.show();
        });
        return;
    }

    // Artist Events
    if (event == 'addArtistToFavourites') {
        DZ.api(`/user/me/artists?access_token=${sessionStorage.getItem("token")}`, 'POST', {
            artist_id: parseInt(selectedItem.value.attributes.artist_id.value)
        }, function (response) {
            toastMessage.value = "Added to your favourites."
            thisToast.value.show();
        });
        return;
    }

    // Playlist Events
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

    // Radio Events
    if (event == 'addRadioToQueue') {
        DZ.api('/radio/' + selectedItem.value.id + '/tracks', function (response) {
            DZ.player.addToQueue([...response.data.map(item => item.id)]);
        });
        return;
    }
}

defineExpose({
    left_click: _left_click,
    right_click: _right_click,
});
</script>