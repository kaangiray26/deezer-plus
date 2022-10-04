<script setup>
import { onMounted } from "vue";
import router from "/router";

async function get_token(params) {
    if (params.hasOwnProperty('token')) {
        localStorage.setItem('lastfm', params.token);
    }
    router.push('/settings');
}

onMounted(() => {
    get_token(router.currentRoute.value.query);
})
</script>