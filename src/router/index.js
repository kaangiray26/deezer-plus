import { createRouter, createWebHistory } from 'vue-router'
import Recommendations from '../views/Recommendations.vue';

import Track from '/views/Track.vue';
import Album from '/views/Album.vue';
import Artist from '/views/Artist.vue';
import Playlist from '/views/Playlist.vue';
import Radio from '/views/Radio.vue';
import Search from '/views/Search.vue';

import Profile from '/views/Profile.vue';
import ProfilePage from '/views/profile_sections/ProfilePage.vue';
import ListeningHistory from '/views/profile_sections/ListeningHistory.vue';
import FavouriteTracks from '/views/profile_sections/FavouriteTracks.vue';
import FavouriteAlbums from '/views/profile_sections/FavouriteAlbums.vue';
import FavouriteArtists from '/views/profile_sections/FavouriteArtists.vue';
import FavouritePlaylists from '/views/profile_sections/FavouritePlaylists.vue';

import Settings from '/views/Settings.vue';
import Lastfm from '/views/Lastfm.vue';

const routes = [
    {
        path: '/',
        component: Recommendations
    },
    {
        path: '/search/:query',
        component: Search
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
    {
        path: '/profile',
        component: Profile,
        children: [
            {
                path: '',
                component: ProfilePage
            },
            {
                path: 'history',
                component: ListeningHistory
            },
            {
                path: 'tracks',
                component: FavouriteTracks
            },
            {
                path: 'playlists',
                component: FavouritePlaylists
            },
            {
                path: 'albums',
                component: FavouriteAlbums
            },
            {
                path: 'artists',
                component: FavouriteArtists
            }
        ]
    },
    {
        path: '/settings',
        component: Settings
    },
    {
        path: '/lastfm',
        component: Lastfm
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router