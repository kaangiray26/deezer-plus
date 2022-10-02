<template>
    <button id="volumeButton" ref="thisTooltipObj" class="volumeButton btn btn-dark bi hover-color" type="button"
        @wheel.prevent="$emit('change-volume', {'event':$event})" @click="$emit('trigger-volume')"
        :class="{'bi-volume-up':!props.mute, 'bi-volume-mute':props.mute}" data-bs-toggle="tooltip"
        data-bs-placement="top" data-bs-title="100" :volume="setVolume">
    </button>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Tooltip } from 'bootstrap';

const tooltip = ref(null);

const props = defineProps({
    mute: {
        type: Boolean,
        default: false,
    },
    volumeLevel: {
        type: Number,
        default: 100,
    }
});

const setVolume = computed(() => {
    if (tooltip.value) {
        tooltip.value.setContent({
            '.tooltip-inner': props.volumeLevel.toString()
        });
    }
})

onMounted(() => {
    tooltip.value = new Tooltip('#volumeButton', {
        'placement': 'top',
        'container': 'body',
        'trigger': 'hover'
    });
})
</script>