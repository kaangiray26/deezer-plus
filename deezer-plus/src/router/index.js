import { createRouter, createWebHistory } from 'vue-router'
import Recommendations from '../views/Recommendations.vue';
import Track from '../views/Track.vue';
import Album from '../views/Album.vue';
import Artist from '../views/Artist.vue';
import Playlist from '../views/Playlist.vue';
import Radio from '../views/Radio.vue';

const routes = [
    {
        path: '/',
        component: Recommendations
    },
    {
        path: '/track/:id',
        component: Track
    },
    {
        path: '/album/:id',
        component: Album
    },
    {
        path: '/artist/:id',
        component: Artist
    },
    {
        path: '/playlist/:id',
        component: Playlist
    },
    {
        path: '/radio/:id',
        component: Radio
    },

]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router