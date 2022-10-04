<script setup>
import { onMounted } from "vue";
import { store } from '/js/store.js';
import router from "/router";
import md5 from "md5";

async function get_session(token) {
    let data = await fetch(`https://ws.audioscrobbler.com/2.0/?method=auth.getSession&token=${token}&api_key=${store.api_key}&api_sig=${get_api_sig(token)}&format=json`, {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
        }
    }).then((response) => response.json()).then(data => {
        return data;
    });

    if (data.hasOwnProperty('session')) {
        localStorage.setItem('lastfm', JSON.stringify(data.session));
    }
}

function get_api_sig(token) {
    return md5(`api_key${store.api_key}methodauth.getSessiontoken${token}${store.shared_secret}`);
}

async function get_token(params) {
    if (params.hasOwnProperty('token')) {
        await get_session(params.token);
    }
    router.push('/settings');
}

onMounted(() => {
    get_token(router.currentRoute.value.query);
})
</script>