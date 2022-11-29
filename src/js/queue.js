// queue.js
import { store } from '/js/store.js';

function currentQueue() {
    return (store.peer_status == 'connected') ? 'groupSession' : 'queue';
}

function getCurrentTrack() {
    return getQueue()[store.queue_index];
}

function removeFromQueue(id) {
    localStorage.setItem(
        currentQueue(),
        JSON.stringify(getQueue().filter((item) => item !== id))
    );
}

function getQueue() {
    return JSON.parse(localStorage.getItem(currentQueue()));
}

function clearQueue(arr = []) {
    localStorage.setItem(
        currentQueue(),
        JSON.stringify(arr)
    );
}

async function addToQueue(tracks) {
    for (let track of tracks) {
        store.queue.push({
            cover: `https://api.deezer.com/album/${track.album.id}/image`,
            duration: parseInt(track.duration),
            artist: {
                "id": parseInt(track.artist.id),
                "title": track.artist.name,
            },
            album: {
                "id": parseInt(track.album.id),
                "title": track.album.title,
            },
            track: {
                "id": parseInt(track.id),
                "title": track.title,
            },
        });
    }
    localStorage.setItem(
        currentQueue(),
        JSON.stringify(store.queue)
    );
}

async function addToQueueStart(tracks) {
    tracks.reverse();
    for (let track of tracks) {
        store.queue.unshift({
            cover: `https://api.deezer.com/album/${track.album.id}/image`,
            duration: parseInt(track.duration),
            artist: {
                "id": parseInt(track.artist.id),
                "title": track.artist.name,
            },
            album: {
                "id": parseInt(track.album.id),
                "title": track.album.title,
            },
            track: {
                "id": parseInt(track.id),
                "title": track.title,
            },
        });
    }
    localStorage.setItem(
        currentQueue(),
        JSON.stringify(store.queue)
    );
}

async function getQueueTracks() {
    return getQueue().map(item => parseInt(item.track.id));
}

function convert_track(track) {
    return [{
        id: track.id,
        duration: track.duration,
        title: track.title,
        artist: {
            id: track.artist.id,
            name: track.artist.name,
        },
        album: {
            id: track.album.id,
            title: track.album.title,
        },
    }]
}

function convert_album(data, album_id, album_title) {
    let tracks = [];
    for (let track of data) {
        tracks.push({
            id: track.id,
            duration: track.duration,
            title: track.title,
            artist: {
                id: track.artist.id,
                name: track.artist.name,
            },
            album: {
                id: album_id,
                title: album_title,
            },
        })
    }
    return tracks;
}


function convert_playlist(data) {
    let tracks = [];
    for (let track of data) {
        tracks.push({
            id: track.id,
            duration: track.duration,
            title: track.title,
            artist: {
                id: track.artist.id,
                name: track.artist.name,
            },
            album: {
                id: track.album.id,
                title: track.album.title,
            },
        })
    }
    return tracks;
}

function convert_radio() {
    //
}

export { addToQueue, addToQueueStart, removeFromQueue, getQueue, clearQueue, getQueueTracks, getCurrentTrack, convert_track, convert_album, convert_playlist }