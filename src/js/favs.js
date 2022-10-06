// favs.js

function get_params(fav_array_name, id) {
    switch (fav_array_name) {
        case 'fav_tracks':
            return ['tracks', {
                track_id: id
            }]

        case 'fav_albums':
            return ['albums', {
                album_id: id
            }]

        case 'fav_artists':
            return ['artists', {
                artist_id: id
            }]

        case 'fav_playlists':
            return ['playlists', {
                playlist_id: id
            }]
    }
}

async function addToFav(fav_array_name, id) {
    let params = get_params(fav_array_name, id);
    DZ.api(`/user/me/${params[0]}?access_token=${localStorage.getItem("token")}`, 'POST', params[1], function (response) {
        if (response) {
            localStorage.setItem(
                fav_array_name,
                JSON.stringify(JSON.parse(localStorage.getItem(fav_array_name)).concat([id]))
            );
        }
    });
}

async function removeFromFav(fav_array_name, id) {
    let params = get_params(fav_array_name, id);
    DZ.api(`/user/me/${params[0]}?access_token=${localStorage.getItem("token")}`, 'DELETE', params[1], function (response) {
        if (response) {
            localStorage.setItem(
                fav_array_name,
                JSON.stringify(JSON.parse(localStorage.getItem(fav_array_name)).filter((item) => item !== id))
            );
        }
    });
}

export { addToFav, removeFromFav }