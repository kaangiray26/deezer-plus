<script setup>
import { onMounted } from "vue";
import router from "/router";

onMounted(() => {
    localStorage.setItem('groupSessionID', router.currentRoute.value.params.id);
    window.location.href = "/";
});
</script>