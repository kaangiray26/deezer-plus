<template>
    <div class="row justify-content-center gx-0" style="max-height:500px; overflow-y:auto;">
        <div class="card col-12">
            <ul class="list-group">
                <li class="list-group-item">
                    <div class="table-responsive">
                        <table class="table table-hover table-borderless">
                            <thead>
                                <tr class="row gx-0 table-active" style="width: 100% !important;">
                                    <th class="col-6">Track</th>
                                    <th class="col-2">Artist</th>
                                    <th class="col-3">Album</th>
                                    <th class="col-1 bi bi-clock-fill"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <TrackResult v-for="item in queue.tracks" :id="item.track.id" :artist="item.artist"
                                    :album="item.album" :track="item.track" :duration="item.duration"
                                    @contextmenu.prevent="$emit('right-click', {'event':$event, 'target':$event.currentTarget})">
                                </TrackResult>
                            </tbody>
                        </table>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TrackResult from "/components/results/TrackResult.vue";

const queue = ref({
    tracks: []
});

function handleTrackSearchResponse(item) {
    queue.value.tracks.push({
        duration: parseInt(item.DURATION),
        artist: {
            "id": parseInt(item.ART_ID),
            "title": item.ART_NAME,
        },
        album: {
            "id": parseInt(item.ALB_ID),
            "title": item.ALB_TITLE,
        },
        track: {
            "id": parseInt(item.SNG_ID),
            "title": item.SNG_TITLE,
        },
    })
    return;
}

DZ.Event.subscribe('tracklist_changed', function (response) {
    queue.value.tracks = [];
    response.data.map(handleTrackSearchResponse);
});

onMounted(() => {
    console.log("Queue mounted!");
})
</script>