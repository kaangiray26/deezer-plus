// store.js
import { reactive } from 'vue';

var api_key = '2a7539c736c9838c10fb817115436535';
var shared_secret = 'afc66ba911c489efaa13d6faf02c3a5c';

if (window.location.hostname == 'localhost') {
    api_key = 'f69c106b53203ed9fd98fd12dccfff43';
    shared_secret = 'fbe7d3161c399a80cd77dd3e6a660a5e';
}

async function notify(obj) {
    window.dispatchEvent(new CustomEvent('notify', {
        detail: obj
    }));
}

const store = reactive({
    playerHeight: 0,
    mobilePlayerHeight: 0,
    queue_index: 0,
    peer_status: 'disconnected',
    scrobbling: false,
    api_key: api_key,
    shared_secret: shared_secret,
    queue: [],
    stack: [],
    recommendations_loaded: false,
    recommendations: {
        albums: [],
        releases: [],
        artists: [],
        playlists: [],
        tracks: [],
        radios: []
    },
    charts_loaded: false,
    charts: { tracks: [] },
    profile_loaded: false,
    profile: { data: {} },
});

export { store, notify }