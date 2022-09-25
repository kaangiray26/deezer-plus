<template>
    <ul class="dropdown-menu shadow-lg context-menu show">
        <li>
            <button class="dropdown-item" type="button" @click="$emit('context-menu-event', 'playRadio')"><span
                    class="bi bi-play-fill me-1"></span>Play</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="$emit('context-menu-event','addRadioToQueue')"><span
                    class="bi bi-music-note-list me-1"></span>Add to queue</button>
        </li>
        <li>
            <button class="dropdown-item" type="button" @click="$emit('context-menu-event','openRadioPage')"><span
                    class="bi bi-broadcast me-1"></span>Radio page</button>
        </li>
    </ul>
</template>