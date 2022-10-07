// queue.js

function getTrack(id) {
    DZ.api(`/track/${id}`, function (item) {
        let queue = JSON.parse(localStorage.getItem("queue"));
        queue.push(
            {
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
            }
        );

        localStorage.setItem(
            "queue",
            JSON.stringify(queue)
        );
    });
}

async function addToQueue(tracks) {
    console.log("Queue before:", JSON.parse(localStorage.getItem("queue")));
    tracks.map(id => getTrack(id));
    console.log("Queue after:", JSON.parse(localStorage.getItem("queue")));
    return;
}

async function removeFromQueue(id) {
    localStorage.setItem(
        "queue",
        JSON.stringify(JSON.parse(localStorage.getItem("queue")).filter((item) => item !== id))
    );
}

async function getQueue() {
    return JSON.parse(localStorage.getItem("queue"));
}

async function clearQueue(arr = []) {
    localStorage.setItem(
        "queue",
        JSON.stringify(arr)
    );
}

export { addToQueue, removeFromQueue, getQueue, clearQueue }