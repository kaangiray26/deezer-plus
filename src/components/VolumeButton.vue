<template>
    <button id="volumeButton" ref="thisTooltipObj" class="volumeButton btn btn-dark hover-color bi" type="button"
        @wheel.prevent="$emit('change-volume', {'event':$event})" @click="$emit('trigger-volume')" :class="volumeClass"
        data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="100" :volume="setVolume">
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

const volumeClass = computed(() => {
    if (props.mute) {
        return 'bi-volume-mute';
    }
    if (props.volumeLevel > 75) {
        return 'bi-volume-up';
    }
    if (props.volumeLevel > 50) {
        return 'bi-volume-down';
    }
    if (props.volumeLevel > 0) {
        return 'bi-volume-off';
    }
})

async function show() {
    tooltip.value.show();
}

defineExpose({
    show
});

onMounted(() => {
    tooltip.value = new Tooltip('#volumeButton', {
        'placement': 'top',
        'container': 'body',
        'trigger': 'hover',
        'delay': {
            'hide': 300
        }
    });
});
</script>