// queue.js
import { store } from '/js/store.js';

function currentQueue() {
    return (store.peer_status == 'connected') ? 'groupSession' : 'queue';
}

function inGroupSession() {
    return (store.peer_status == 'connected');
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
}

async function addToQueueStart(tracks) {
    tracks.reverse();
    for (let id of tracks) {
        await getTrackStart(id);
    }
}

async function getQueueTracks() {
    return getQueue().map(item => parseInt(item.track.id));
}

async function getTrack(id) {
    return new Promise((resolve, reject) => {
        DZ.api(`/track/${id}`, item => {
            let arr = getQueue();
            arr.push({
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
            localStorage.setItem(
                currentQueue(),
                JSON.stringify(arr)
            );
            resolve(true);
        });
    });
}

async function getTrackStart(id) {
    return new Promise((resolve, reject) => {
        DZ.api(`/track/${id}`, item => {
            let arr = getQueue();
            arr.unshift({
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
            localStorage.setItem(
                currentQueue(),
                JSON.stringify(arr)
            );
            resolve(true);
        });
    });
}

async function notifyPeer(obj) {
    if (inGroupSession()) {
        window.dispatchEvent(new CustomEvent('peer', {
            detail: obj
        }));
        return true;
    }
    return false;
}

export { addToQueue, addToQueueStart, removeFromQueue, getQueue, clearQueue, getQueueTracks, getCurrentTrack, notifyPeer }