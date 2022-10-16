<script setup>
import { onMounted } from "vue";
import router from "/router";

async function redirect(id) {
    DZ.api('/track/' + id, function (response) {
        router.push('/album/' + response.album.id + '?track=' + response.id);
    });
}

onMounted(() => {
    redirect(router.currentRoute.value.params.id);
});
</script>