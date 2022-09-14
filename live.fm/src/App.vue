<script setup>
import NavBar from './components/NavBar.vue'
import Player from './components/Player.vue'
import DeezerProvider from './components/DeezerProvider.vue'
</script>

<template>
    <DeezerProvider></DeezerProvider>
    <NavBar></NavBar>
    <Player></Player>
</template>