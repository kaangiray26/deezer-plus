<template>
    <component ref="contextMenu" id="contextMenu" v-show="isContextMenuVisible" :is="contextMenus[currentSearchField]"
        :style="{'bottom':posY+'px', 'right':posX+'px'}" @context-menu-event="contextMenuEvent" :item_id="item_id">
    </component>
    <Toast ref="thisToast" :message="toastMessage"></Toast>
    <ShareModal @text-copy="notify('URL Copied.')" ref="thisShareModal"></ShareModal>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { addToFav, removeFromFav } from "/js/favs.js";
import { addToQueue, removeFromQueue } from "/js/queue.js";

import router from "/router";
import Toast from "/components/liveToast.vue";
import ShareModal from '/components/ShareModal.vue';

import TrackContextMenu from "./context_menus/TrackContextMenu.vue";
import AlbumContextMenu from "./context_menus/AlbumContextMenu.vue";
import ArtistContextMenu from './context_menus/ArtistContextMenu.vue';
import PlaylistContextMenu from './context_menus/PlaylistContextMenu.vue';
import RadioContextMenu from './context_menus/RadioContextMenu.vue';

const posX = ref(0);
const posY = ref(0);

const item_id = ref(0);
const selectedItem = ref(null);

let thisToast = ref(null);
const toastMessage = ref("");

let thisShareModal = ref(null);

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

    switch (currentSearchField.value) {
        case 'tracks':
            item_id.value = parseInt(selectedItem.value.attributes.track_id.value);
            break;
        case 'albums':
            item_id.value = parseInt(selectedItem.value.attributes.album_id.value);
            break;
        case 'artists':
            item_id.value = parseInt(selectedItem.value.attributes.artist_id.value);
            break;
        case 'playlists':
            item_id.value = parseInt(selectedItem.value.attributes.playlist_id.value);
            break;
    }

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
        // DZ.player.addToQueue([parseInt(selectedItem.value.attributes.track_id.value)]);
        addToQueue([parseInt(selectedItem.value.attributes.track_id.value)]);
        notify("Added to the queue.");
        return;
    }
    if (event == 'addAlbumToQueue') {
        DZ.api('/album/' + selectedItem.value.attributes.album_id.value + '/tracks', function (response) {
            // DZ.player.addToQueue([...response.data.map(item => item.id)]);
            addToQueue([...response.data.map(item => parseInt(item.id))]);
        });
        notify("Added to the queue.");
        return;
    }
    if (event == 'addPlaylistToQueue') {
        DZ.api('/playlist/' + selectedItem.value.id + '/tracks', function (response) {
            // DZ.player.addToQueue([...response.data.map(item => item.id)]);
            addToQueue([...response.data.map(item => parseInt(item.id))]);
        });
        notify("Added to the queue.");
        return;
    }
    if (event == 'addRadioToQueue') {
        DZ.api('/radio/' + selectedItem.value.id + '/tracks', function (response) {
            // DZ.player.addToQueue([...response.data.map(item => item.id)]);
            addToQueue([...response.data.map(item => parseInt(item.id))]);
        });
        notify("Added to the queue.");
        return;
    }

    // Add to Favorites Events
    if (event == 'addTrackToFavorites') {
        addToFav('fav_tracks', parseInt(selectedItem.value.attributes.track_id.value));
        notify("Added to favorites.");
    }

    if (event == 'addAlbumToFavorites') {
        addToFav('fav_albums', parseInt(selectedItem.value.attributes.album_id.value));
        notify("Added to favorites.");
    }

    if (event == 'addArtistToFavorites') {
        addToFav('fav_artists', parseInt(selectedItem.value.attributes.artist_id.value));
        notify("Added to favorites.");
    }

    if (event == 'addPlaylistToFavorites') {
        addToFav('fav_playlists', parseInt(selectedItem.value.attributes.playlist_id.value));
        notify("Added to favorites.");
    }

    // Remove From Favorites Events
    if (event == 'removeTrackFromFavorites') {
        removeFromFav('fav_tracks', parseInt(selectedItem.value.attributes.track_id.value));
        notify("Removed from favorites.");
    }

    if (event == 'removeAlbumFromFavorites') {
        removeFromFav('fav_albums', parseInt(selectedItem.value.attributes.album_id.value));
        notify("Removed from favorites.");
    }

    if (event == 'removeArtistFromFavorites') {
        removeFromFav('fav_artists', parseInt(selectedItem.value.attributes.artist_id.value));
        notify("Removed from favorites.");
    }

    if (event == 'removePlaylistFromFavorites') {
        removeFromFav('fav_playlists', parseInt(selectedItem.value.attributes.playlist_id.value));
        notify("Removed from favorites.");
    }

    // Track Events
    if (event == 'launchTrackMix') {
        //
        return;
    }

    // Sharing Events
    if (event == 'shareTrack') {
        thisShareModal.value.show({
            type: "track",
            id: selectedItem.value.attributes.track_id.value,
        });
        return;
    }

    if (event == 'shareAlbum') {
        thisShareModal.value.show({
            type: "album",
            id: selectedItem.value.attributes.album_id.value,
        });
        return;
    }

    if (event == 'shareArtist') {
        thisShareModal.value.show({
            type: "artist",
            id: selectedItem.value.attributes.artist_id.value,
        });
        return;
    }

    if (event == 'sharePlaylist') {
        thisShareModal.value.show({
            type: "playlist",
            id: selectedItem.value.attributes.playlist_id.value,
        });
        return;
    }

    if (event == 'shareRadio') {
        thisShareModal.value.show({
            type: "radio",
            id: selectedItem.value.attributes.radio_id.value,
        });
        return;
    }
}

defineExpose({
    hide: _hide,
    right_click: _right_click,
});
</script>