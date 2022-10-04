<template>
    <img v-show="scrobbleVisible" class="img-fluid fixed-top m-1" src="/assets/square-lastfm.svg"
        style="height: 24px; opacity: 0.50; pointer-events: none;">
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { store } from '/js/store.js';
import md5 from "md5";

const lastfm = ref({});

const scrobbleVisible = computed(() => {
    return (props.isPlaying && store.scrobbling);
})

const props = defineProps({
    isPlaying: {
        type: Boolean,
    },
});

async function updateNowPlaying(obj) {
    let params = {
        method: 'track.updateNowPlaying',
        artist: obj.artist,
        track: obj.track,
        album: obj.album,
        duration: obj.duration,
        api_key: store.api_key,
        sk: lastfm.value.key,
    };

    params['api_sig'] = get_api_sig(params);
    params['format'] = 'json';

    let Req = new Request("https://ws.audioscrobbler.com/2.0/", {
        method: "POST",
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
        },
        body: new URLSearchParams(params)
    });

    await fetch(Req).then((response) => response.json());
}

function get_api_sig(obj) {
    let keys = Object.keys(obj);
    keys.sort();
    let str = '';
    for (let i = 0; i < keys.length; i++) {
        str += keys[i] + obj[keys[i]];
    }
    str += store.shared_secret;
    return md5(str);
}

defineExpose({
    updateNowPlaying,
})

onMounted(() => {
    if (localStorage.getItem('lastfm')) {
        store.scrobbling = JSON.parse(localStorage.getItem('scrobbling'));
        lastfm.value = JSON.parse(localStorage.getItem('lastfm'));
    }
});
</script>