<template>
    <ul class="dropdown-menu dropdown-menu-dark context-menu show">
        <li>
            <button class="dropdown-item" type="button" @click="$emit('playTrack')">Play</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="$emit('addTrackToQueue')">Add to queue</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="$emit('launchTrackMix')">Launch Track mix</button>
        </li>
    </ul>
</template>