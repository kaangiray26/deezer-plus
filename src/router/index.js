import { createRouter, createWebHistory } from 'vue-router'
import Recommendations from '/views/Recommendations.vue';

import Track from '/views/Track.vue';
import Album from '/views/Album.vue';
import Artist from '/views/Artist.vue';
import Playlist from '/views/Playlist.vue';
import Radio from '/views/Radio.vue';
import Search from '/views/Search.vue';

import Profile from '/views/Profile.vue';
import ProfilePage from '/views/profile_sections/ProfilePage.vue';
import ListeningHistory from '/views/profile_sections/ListeningHistory.vue';
import FavoriteTracks from '/views/profile_sections/FavoriteTracks.vue';
import FavoriteAlbums from '/views/profile_sections/FavoriteAlbums.vue';
import FavoriteArtists from '/views/profile_sections/FavoriteArtists.vue';
import FavoritePlaylists from '/views/profile_sections/FavoritePlaylists.vue';
import Followings from '/views/profile_sections/Followings.vue';
import Followers from '/views/profile_sections/Followers.vue';

import User from '/views/User.vue';
import UserPage from '/views/user_sections/UserPage.vue';
import UserFavoriteTracks from '/views/user_sections/FavoriteTracks.vue';
import UserFavoriteAlbums from '/views/user_sections/FavoriteAlbums.vue';
import UserFavoriteArtists from '/views/user_sections/FavoriteArtists.vue';
import UserFavoritePlaylists from '/views/user_sections/FavoritePlaylists.vue';
import UserFollowings from '/views/user_sections/Followings.vue';
import UserFollowers from '/views/user_sections/Followers.vue';

import Settings from '/views/Settings.vue';
import Lastfm from '/views/Lastfm.vue';
import PageNotFound from '/views/PageNotFound.vue';
import GroupSessionLink from '/views/GroupSessionLink.vue';

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
        path: '/groupsession/:id',
        component: GroupSessionLink
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
                component: FavoriteTracks
            },
            {
                path: 'playlists',
                component: FavoritePlaylists
            },
            {
                path: 'albums',
                component: FavoriteAlbums
            },
            {
                path: 'artists',
                component: FavoriteArtists
            },
            {
                path: 'following',
                component: Followings
            },
            {
                path: 'followers',
                component: Followers
            }
        ]
    },
    {
        path: '/user/:id',
        component: User,
        children: [
            {
                path: '',
                component: UserPage
            },
            {
                path: 'tracks',
                component: UserFavoriteTracks
            },
            {
                path: 'playlists',
                component: UserFavoritePlaylists
            },
            {
                path: 'albums',
                component: UserFavoriteAlbums
            },
            {
                path: 'artists',
                component: UserFavoriteArtists
            },
            {
                path: 'following',
                component: UserFollowings
            },
            {
                path: 'followers',
                component: UserFollowers
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
    },
    {
        path: '/:catchAll(.*)',
        component: PageNotFound
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router