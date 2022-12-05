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
    store.queue.push(...tracks);
    localStorage.setItem(
        currentQueue(),
        JSON.stringify(store.queue)
    );
}

async function addToQueueStart(tracks) {
    store.queue.unshift(...tracks);
    localStorage.setItem(
        currentQueue(),
        JSON.stringify(store.queue)
    );
}

async function addToQueueNext(tracks) {
    store.queue.splice(1, 0, ...tracks);
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
        cover: `https://api.deezer.com/album/${track.album.id}/image`,
        duration: parseInt(track.duration),
        artist: {
            id: parseInt(track.artist.id),
            name: track.artist.name,
        },
        album: {
            id: parseInt(track.album.id),
            title: track.album.title,
        },
        track: {
            id: parseInt(track.id),
            title: track.title,
        }
    }]
}

function convert_album(data, album_id, album_title) {
    let tracks = [];
    for (let track of data) {
        tracks.push({
            cover: `https://api.deezer.com/album/${album_id}/image`,
            duration: parseInt(track.duration),
            artist: {
                id: parseInt(track.artist.id),
                name: track.artist.name,
            },
            album: {
                id: parseInt(album_id),
                title: album_title,
            },
            track: {
                id: parseInt(track.id),
                title: track.title,
            }
        })
    }
    return tracks;
}


function convert_playlist(data) {
    let tracks = [];
    for (let track of data) {
        tracks.push({
            cover: `https://api.deezer.com/album/${track.album.id}/image`,
            duration: parseInt(track.duration),
            artist: {
                id: parseInt(track.artist.id),
                name: track.artist.name,
            },
            album: {
                id: parseInt(track.album.id),
                title: track.album.title,
            },
            track: {
                id: parseInt(track.id),
                title: track.title,
            }
        })
    }
    return tracks;
}

export { addToQueue, addToQueueStart, addToQueueNext, removeFromQueue, getQueue, clearQueue, getQueueTracks, getCurrentTrack, convert_track, convert_album, convert_playlist }