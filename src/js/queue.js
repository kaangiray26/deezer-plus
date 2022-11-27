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
    for (let id of tracks) {
        await getTrack(id);
    }
    localStorage.setItem(
        currentQueue(),
        JSON.stringify(store.queue)
    );
}

async function addToQueueStart(tracks) {
    tracks.reverse();
    for (let id of tracks) {
        await getTrackStart(id);
    }
    localStorage.setItem(
        currentQueue(),
        JSON.stringify(store.queue)
    );
}

async function getQueueTracks() {
    return getQueue().map(item => parseInt(item.track.id));
}

async function getTrack(id) {
    return new Promise((resolve, reject) => {
        DZ.api(`/track/${id}`, item => {
            store.queue.push({
                cover: `https://api.deezer.com/album/${item.album.id}/image`,
                duration: parseInt(item.duration),
                artist: {
                    "id": parseInt(item.artist.id),
                    "title": item.artist.name,
                },
                album: {
                    "id": parseInt(item.album.id),
                    "title": item.album.title,
                },
                track: {
                    "id": parseInt(item.id),
                    "title": item.title,
                },
            });
            resolve(true);
        });
    });
}

async function getTrackStart(id) {
    return new Promise((resolve, reject) => {
        DZ.api(`/track/${id}`, item => {
            store.queue.unshift({
                cover: `https://api.deezer.com/album/${item.album.id}/image`,
                duration: parseInt(item.duration),
                artist: {
                    "id": parseInt(item.artist.id),
                    "title": item.artist.name,
                },
                album: {
                    "id": parseInt(item.album.id),
                    "title": item.album.title,
                },
                track: {
                    "id": parseInt(item.id),
                    "title": item.title,
                },
            });
            resolve(true);
        });
    });
}

export { addToQueue, addToQueueStart, removeFromQueue, getQueue, clearQueue, getQueueTracks, getCurrentTrack }