<template>
    <component ref="contextMenu" id="contextMenu" v-show="isContextMenuVisible" :is="contextMenus[currentSearchField]"
        :style="{'bottom':posY+'px', 'right':posX+'px'}" @context-menu-event="contextMenuEvent" :item_id="item_id">
    </component>
    <ShareModal @text-copy="notify({ n: 'URL Copied.' })" ref="thisShareModal"></ShareModal>
    <PlaylistModal @playlist-add="notify({ n: 'Added to playlist.' })" ref="thisPlaylistModal"></PlaylistModal>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { addToFav, removeFromFav } from "/js/favs.js";
import { addToQueue, addToQueueStart, getQueueTracks } from "/js/queue.js";
import { sessionAction } from '/js/session.js';
import { notify } from '/js/store.js';

import router from "/router";
import ShareModal from '/components/ShareModal.vue';
import PlaylistModal from '/components/PlaylistModal.vue';

import TrackContextMenu from "./context_menus/TrackContextMenu.vue";
import AlbumContextMenu from "./context_menus/AlbumContextMenu.vue";
import ArtistContextMenu from './context_menus/ArtistContextMenu.vue';
import PlaylistContextMenu from './context_menus/PlaylistContextMenu.vue';
import RadioContextMenu from './context_menus/RadioContextMenu.vue';

const posX = ref(0);
const posY = ref(0);

const item_id = ref(0);
const selectedItem = ref(null);

let thisShareModal = ref(null);

let thisPlaylistModal = ref(null);

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
    if (event == 'openTrackPage') {
        router.push('/album/' + selectedItem.value.attributes.album_id.value + '?track=' + selectedItem.value.attributes.track_id.value);
        return;
    }

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
    // Must be synchronized in groupSession: ok
    if (event == 'playTrack') {
        sessionAction({
            func: async function op() {
                await addToQueueStart([parseInt(selectedItem.value.attributes.track_id.value)]);
                getQueueTracks().then(tracks => {
                    DZ.player.playTracks(tracks);
                });
            },
            object: parseInt(selectedItem.value.attributes.track_id.value),
            operation: 'Track.play',
        });
        return;
    }

    // Must be synchronized in groupSession: ok
    if (event == 'playAlbum') {
        sessionAction({
            func: async function op() {
                DZ.api('/album/' + selectedItem.value.attributes.album_id.value, async function (response) {
                    await addToQueueStart(response.tracks.data.map(item => parseInt(item.id)));
                    getQueueTracks().then(tracks => {
                        DZ.player.playTracks(tracks);
                    });
                });
            },
            object: selectedItem.value.attributes.album_id.value,
            operation: 'Album.play',
        });
        return;
    }

    // Must be synchronized in groupSession: ok
    if (event == 'playPlaylist') {
        sessionAction({
            func: async function op() {
                DZ.api('/playlist/' + selectedItem.value.id, async function (response) {
                    await addToQueueStart(response.tracks.data.map(item => parseInt(item.id)));
                    getQueueTracks().then(tracks => {
                        DZ.player.playTracks(tracks);
                    });
                });
            },
            object: selectedItem.value.id,
            operation: 'Playlist.play',
        });
        return;
    }

    // Must be synchronized in groupSession: ok
    if (event == 'playRadio') {
        sessionAction({
            func: async function op() {
                DZ.player.playRadio(parseInt(selectedItem.value.id));
            },
            object: parseInt(selectedItem.value.id),
            operation: 'Radio.play',
        });
        return;
    }

    // Add to Queue Events
    // Must be synchronized in groupSession: ok
    if (event == 'addTrackToQueue') {
        sessionAction({
            func: async function op() {
                await addToQueue([parseInt(selectedItem.value.attributes.track_id.value)]);
            },
            object: parseInt(selectedItem.value.attributes.track_id.value),
            operation: 'Queue.Track.add',
        });
        notify({ n: "Added to the queue." });
        return;
    }

    // Must be synchronized in groupSession: ok
    if (event == 'addAlbumToQueue') {
        sessionAction({
            func: async function op() {
                DZ.api('/album/' + selectedItem.value.attributes.album_id.value + '/tracks', async function (response) {
                    await addToQueue([...response.data.map(item => parseInt(item.id))]);
                });
            },
            object: selectedItem.value.attributes.album_id.value,
            operation: 'Queue.Album.add',
        });
        notify({ n: "Added to the queue." });
        return;
    }

    // Must be synchronized in groupSession: ok
    if (event == 'addPlaylistToQueue') {
        sessionAction({
            func: async function op() {
                DZ.api('/playlist/' + selectedItem.value.id + '/tracks', async function (response) {
                    await addToQueue([...response.data.map(item => parseInt(item.id))]);
                });
            },
            object: selectedItem.value.id,
            operation: 'Queue.Playlist.add',
        });
        notify({ n: "Added to the queue." });
        return;
    }

    // Must be synchronized in groupSession: ok
    if (event == 'addRadioToQueue') {
        sessionAction({
            func: async function op() {
                DZ.api('/radio/' + selectedItem.value.id + '/tracks', async function (response) {
                    await addToQueue([...response.data.map(item => parseInt(item.id))]);
                });
            },
            object: selectedItem.value.id,
            operation: 'Queue.Radio.add',
        });
        notify({ n: "Added to the queue." });
        return;
    }

    // Add to Favorites Events
    if (event == 'addTrackToFavorites') {
        addToFav('fav_tracks', parseInt(selectedItem.value.attributes.track_id.value));
        notify({ n: "Added to favorites." });
    }

    if (event == 'addAlbumToFavorites') {
        addToFav('fav_albums', parseInt(selectedItem.value.attributes.album_id.value));
        notify({ n: "Added to favorites." });
    }

    if (event == 'addArtistToFavorites') {
        addToFav('fav_artists', parseInt(selectedItem.value.attributes.artist_id.value));
        notify({ n: "Added to favorites." });
    }

    if (event == 'addPlaylistToFavorites') {
        addToFav('fav_playlists', parseInt(selectedItem.value.attributes.playlist_id.value));
        notify({ n: "Added to favorites." });
    }

    // Remove From Favorites Events
    if (event == 'removeTrackFromFavorites') {
        removeFromFav('fav_tracks', parseInt(selectedItem.value.attributes.track_id.value));
        notify({ n: "Removed from favorites." });
    }

    if (event == 'removeAlbumFromFavorites') {
        removeFromFav('fav_albums', parseInt(selectedItem.value.attributes.album_id.value));
        notify({ n: "Removed from favorites." });
    }

    if (event == 'removeArtistFromFavorites') {
        removeFromFav('fav_artists', parseInt(selectedItem.value.attributes.artist_id.value));
        notify({ n: "Removed from favorites." });
    }

    if (event == 'removePlaylistFromFavorites') {
        removeFromFav('fav_playlists', parseInt(selectedItem.value.attributes.playlist_id.value));
        notify({ n: "Removed from favorites." });
    }

    // Track Events
    if (event == 'launchTrackMix') {
        //
        return;
    }
    if (event == 'addTrackToPlaylist') {
        thisPlaylistModal.value.show(selectedItem.value.attributes.track_id.value);
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