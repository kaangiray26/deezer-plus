<template>
    <component ref="contextMenu" id="contextMenu" v-show="isContextMenuVisible" :is="contextMenus[currentSearchField]"
        :style="{'bottom':posY+'px', 'right':posX+'px'}" @context-menu-event="contextMenuEvent">
    </component>
    <Toast ref="thisToast" :message="toastMessage"></Toast>
</template>

<script setup>
import { ref, nextTick } from "vue";

import router from "/router";
import Toast from "/components/liveToast.vue";

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

async function notify(message) {
    toastMessage.value = message;
    thisToast.value.show();
}

async function _hide() {
    isContextMenuVisible.value = false;
}

async function _right_click(obj) {
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
        router.push('/album/' + selectedItem.value.attributes.album_id.value);
        return;
    }

    if (event == 'openArtistPage') {
        router.push('/artist/' + selectedItem.value.attributes.artist_id.value);
        return;
    }

    if (event == 'openPlaylistPage') {
        router.push('/playlist/' + selectedItem.value.id);
        return;
    }

    if (event == 'openRadioPage') {
        router.push('/radio/' + selectedItem.value.id);
        return;
    }

    if (event == 'openUserPage') {
        router.push('/user/' + selectedItem.value.id);
        return;
    }

    // Play Events
    if (event == 'playTrack') {
        DZ.player.playTracks([parseInt(selectedItem.value.attributes.track_id.value)], true, 0);
        return;
    }

    if (event == 'playAlbum') {
        DZ.player.playAlbum(parseInt(selectedItem.value.attributes.album_id.value), true, 0);
        return;
    }

    if (event == 'playPlaylist') {
        DZ.player.playPlaylist(parseInt(selectedItem.value.id), true, 0);
        return;
    }

    if (event == 'playRadio') {
        DZ.player.playRadio(parseInt(selectedItem.value.id), true, 0);
        return;
    }

    // Add to Queue Events
    if (event == 'addTrackToQueue') {
        DZ.player.addToQueue([parseInt(selectedItem.value.attributes.track_id.value)]);
        notify("Added to the queue.");
        return;
    }
    if (event == 'addAlbumToQueue') {
        DZ.api('/album/' + selectedItem.value.attributes.album_id.value + '/tracks', function (response) {
            DZ.player.addToQueue([...response.data.map(item => item.id)]);
        });
        notify("Added to the queue.");
        return;
    }
    if (event == 'addPlaylistToQueue') {
        DZ.api('/playlist/' + selectedItem.value.id + '/tracks', function (response) {
            DZ.player.addToQueue([...response.data.map(item => item.id)]);
        });
        notify("Added to the queue.");
        return;
    }
    if (event == 'addRadioToQueue') {
        DZ.api('/radio/' + selectedItem.value.id + '/tracks', function (response) {
            DZ.player.addToQueue([...response.data.map(item => item.id)]);
        });
        notify("Added to the queue.");
        return;
    }

    // Add to Favorites Events
    if (event == 'addTrackToFavourites') {
        DZ.api(`/user/me/tracks?access_token=${localStorage.getItem("token")}`, 'POST', {
            track_id: parseInt(selectedItem.value.attributes.track_id.value)
        }, function (response) {
            if (response) {
                notify("Added to your favourites.");
            }
        });
        return;
    }

    if (event == 'addAlbumToFavourites') {
        DZ.api(`/user/me/albums?access_token=${localStorage.getItem("token")}`, 'POST', {
            album_id: parseInt(selectedItem.value.attributes.album_id.value)
        }, function (response) {
            if (response) {
                notify("Added to your favourites.");
            }
        });
        return;
    }

    if (event == 'addArtistToFavourites') {
        DZ.api(`/user/me/artists?access_token=${localStorage.getItem("token")}`, 'POST', {
            artist_id: parseInt(selectedItem.value.attributes.artist_id.value)
        }, function (response) {
            if (response) {
                notify("Added to your favourites.");
            }
        });
        return;
    }

    if (event == 'addPlaylistToFavourites') {
        DZ.api(`/user/me/playlists?access_token=${localStorage.getItem("token")}`, 'POST', {
            playlist_id: parseInt(selectedItem.value.id)
        }, function (response) {
            if (response) {
                notify("Added to your favourites.");
            }
        });
        return;
    }

    // Track Events


    if (event == 'launchTrackMix') {
        //
        return;
    }
}

defineExpose({
    hide: _hide,
    right_click: _right_click,
});
</script>