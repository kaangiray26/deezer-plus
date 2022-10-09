// queue.js

function removeFromQueue(id) {
    localStorage.setItem(
        "queue",
        JSON.stringify(JSON.parse(localStorage.getItem("queue")).filter((item) => item !== id))
    );
}

function getQueue() {
    return JSON.parse(localStorage.getItem("queue"));
}


function clearQueue(arr = []) {
    localStorage.setItem(
        "queue",
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
    let tracks = getQueue();
    return tracks.map(item => parseInt(item.track.id));
}

async function getTrack(id) {
    return new Promise((resolve, reject) => {
        DZ.api(`/track/${id}`, item => {
            let arr = JSON.parse(localStorage.getItem("queue"));
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
                "queue",
                JSON.stringify(arr)
            );
            resolve(true);
        });
    });
}

async function getTrackStart(id) {
    return new Promise((resolve, reject) => {
        DZ.api(`/track/${id}`, item => {
            let arr = JSON.parse(localStorage.getItem("queue"));
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
                "queue",
                JSON.stringify(arr)
            );
            resolve(true);
        });
    });
}

export { addToQueue, addToQueueStart, removeFromQueue, getQueue, clearQueue, getQueueTracks }