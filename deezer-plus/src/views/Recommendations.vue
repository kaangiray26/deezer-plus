<template>
    <div class="row justify-content-center gx-0">
        <div class="col-12 mb-5 px-3">
            <div id="recommendationsAccordion" class="my-2 accordion accordion-flush" role="tablist">
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button" type="button"
                            data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-1"
                            aria-expanded="true" aria-controls="recommendationsAccordion .item-1">Albums</button>
                    </h2>
                    <div class="accordion-collapse collapse show item-1" role="tabpanel"
                        data-bs-parent="#recommendationsAccordion">
                        <div class="accordion-body">
                            <div class="row gx-1 gy-1" style="margin: 0px;padding: 0px;">
                                <div class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2" v-for="item in rec_albums">
                                    <AlbumRecommendation :id="item.album_id" :artist="item.artist" :title="item.title"
                                        :cover="item.cover" :album_id="item.album_id"></AlbumRecommendation>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button collapsed" type="button"
                            data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-2"
                            aria-expanded="false" aria-controls="recommendationsAccordion .item-2">Releases</button>
                    </h2>
                    <div class="accordion-collapse collapse item-2" role="tabpanel"
                        data-bs-parent="#recommendationsAccordion">
                        <div class="accordion-body">
                            <p class="mb-0">Nullam id dolor id nibh ultricies vehicula ut id elit. Cras justo odio,
                                dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at
                                eget metus.</p>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button collapsed" type="button"
                            data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-3"
                            aria-expanded="false" aria-controls="recommendationsAccordion .item-3">Artists</button>
                    </h2>
                    <div class="accordion-collapse collapse item-3" role="tabpanel"
                        data-bs-parent="#recommendationsAccordion">
                        <div class="accordion-body">
                            <p class="mb-0">Nullam id dolor id nibh ultricies vehicula ut id elit. Cras justo odio,
                                dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at
                                eget metus.</p>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button collapsed" type="button"
                            data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-4"
                            aria-expanded="false" aria-controls="recommendationsAccordion .item-4">Playlists</button>
                    </h2>
                    <div class="accordion-collapse collapse item-4" role="tabpanel"
                        data-bs-parent="#recommendationsAccordion">
                        <div class="accordion-body">
                            <p class="mb-0">Nullam id dolor id nibh ultricies vehicula ut id elit. Cras justo odio,
                                dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at
                                eget metus.</p>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button collapsed" type="button"
                            data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-5"
                            aria-expanded="false" aria-controls="recommendationsAccordion .item-5">Tracks</button>
                    </h2>
                    <div class="accordion-collapse collapse item-5" role="tabpanel"
                        data-bs-parent="#recommendationsAccordion">
                        <div class="accordion-body">
                            <p class="mb-0">Nullam id dolor id nibh ultricies vehicula ut id elit. Cras justo odio,
                                dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at
                                eget metus.</p>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" role="tab"><button class="accordion-button collapsed" type="button"
                            data-bs-toggle="collapse" data-bs-target="#recommendationsAccordion .item-6"
                            aria-expanded="false" aria-controls="recommendationsAccordion .item-6">Radios</button>
                    </h2>
                    <div class="accordion-collapse collapse item-6" role="tabpanel"
                        data-bs-parent="#recommendationsAccordion">
                        <div class="accordion-body">
                            <p class="mb-0">Nullam id dolor id nibh ultricies vehicula ut id elit. Cras justo odio,
                                dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at
                                eget metus.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AlbumRecommendation from '@/views/AlbumRecommendation.vue';

const rec_albums = ref({ value: [] });
const recsVisible = ref(false);

async function get_recommendations() {
    get_rec_albums();
    // get_rec_releases();
}

async function get_rec_albums() {
    DZ.api(`/user/me/recommendations/albums&access_token=${sessionStorage.getItem("token")}`, function (response) {
        response.data.map(handleRecAlbums);
    });
    recsVisible.value = true;
}

async function get_rec_releases() {
    DZ.api(`/user/me/recommendations/releases&access_token=${sessionStorage.getItem("token")}`, function (response) {
        console.log(response);
        // response.data.map(handleRecAlbums);
    });
}

function handleRecAlbums(item) {
    rec_albums.value.push({
        album_id: item.id,
        artist: item.artist.name,
        title: item.title,
        cover: item.cover_medium,
    })
    return;
}

onMounted(function () {
    rec_albums.value = [];
    get_recommendations();
});
</script>