import { createRouter, createWebHistory } from 'vue-router'
import Recommendations from '../views/Recommendations.vue';
import Album from '../views/Album.vue';

const routes = [
    {
        path: '/',
        component: Recommendations
    },
    {
        path: '/album/:id',
        component: Album
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router