<template>
    <ul class="dropdown-menu shadow-lg context-menu show">
        <li>
            <button class="dropdown-item" type="button" @click="emit('context-menu-event', 'playRadio')"><span
                    class="bi bi-play-fill me-1"></span>Play</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="emit('context-menu-event','addRadioToQueue')"><span
                    class="bi bi-music-note-list me-1"></span>Add to queue</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="emit('context-menu-event','openRadioPage')"><span
                    class="bi bi-broadcast me-1"></span>Radio page</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="emit('context-menu-event','shareRadio')"><span
                    class="bi bi-share-fill me-1"></span>Share</button>
        </li>
    </ul>
</template>

<script setup>
import { computed } from "vue";

const emit = defineEmits(["context-menu-event"]);

const isFav = computed(() => {
    return JSON.parse(localStorage.getItem('fav_radios')).includes(props.item_id);
});

const props = defineProps({
    item_id: {
        type: Number,
    },
});
</script>