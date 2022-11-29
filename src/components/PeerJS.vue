<template>
    <div v-show="store.peer_status == 'connected'">
        <div class="input-group mb-2">
            <span class="input-group-text bg-dark text-white">Connected to:</span>
            <input type="text" class="form-control" :value="contacts.recipient.username" readonly>
            <button class="btn btn-danger" @click="disconnect">Disconnect</button>
        </div>
        <hr />
        <div class="d-flex mb-2">
            <div class="input-group">
                <button class="btn btn-outline-light border" type="button" @click="send_reaction('love')">❤️</button>
                <button class="btn btn-outline-light border" type="button" @click="send_reaction('hand')">🤘</button>
                <button class="btn btn-outline-light border" type="button" @click="send_reaction('eyes')">👀</button>
                <button class="btn btn-outline-light border" type="button" @click="send_reaction('ship')">🚀</button>
                <button class="btn btn-outline-light border" type="button" @click="send_reaction('bomb')">💣</button>
                <button class="btn btn-outline-light border" type="button" @click="send_reaction('puke')">🤮</button>
                <button class="btn btn-outline-light border" type="button" @click="send_reaction('shit')">💩</button>
            </div>
        </div>
        <div class="input-group">
            <input ref="message" type="text" class="form-control" placeholder="Send a message..."
                @keyup.enter="sendMessage">
            <button class="btn btn-outline-dark" @click="sendMessage">Send</button>
        </div>
    </div>
    <div v-show="alert.show">
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            {{ alert.message }}
            <button type="button" class="btn-close" @click="reset_alert"></button>
        </div>
    </div>
    <div v-show="store.peer_status == 'disconnected.connecting'" class="progress" style="height: 2em">
        <div class="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar"
            aria-label="Animated striped example" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"
            style="width: 100%">
            Connecting...
        </div>
    </div>
    <div v-show="store.peer_status == 'requesting'">
        <div class="d-flex flex-column card bg-dark p-4 rounded text-white">
            <div class="d-flex mb-2 ">
                <p>
                    <a class="text-danger" :href="recipient_profile">{{ contacts.requester.username }}</a>
                    wants to start a group session with you.
                </p>
            </div>
            <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-danger" @click="rejectRequest">Reject</button>
                <button type="button" class="btn btn-success" @click="acceptRequest">Accept</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { store, notify } from "/js/store.js";
import { addToQueue, addToQueueStart, getQueueTracks, clearQueue, convert_track, convert_album, convert_playlist } from '/js/queue.js';

const emit = defineEmits(['show', 'reset', 'reaction', 'message']);

const message = ref(null);
const status = ref("disconnected");

const peer_id = ref(null);
const recipient_id = ref(null);

const alert = ref({
    show: false,
    message: null,
});

const contacts = ref({
    requester: {},
    recipient: {},
});

const recipient_profile = computed(() => {
    return 'https://www.deezer.com/profile/' + contacts.value.requester.deezer_id;
});

async function reset_alert() {
    alert.value = {
        show: false,
        message: null,
    };
}

async function cleanup() {
    contacts.value.requester = {};
    contacts.value.recipient = {};
    store.peer_status = 'disconnected';
}

async function alert_notify(msg) {
    alert.value = {
        show: true,
        message: msg,
    };
}

async function sendMessage() {
    let msg = message.value.value;
    if (!msg.length) {
        return;
    }

    props.conn.send({
        type: 'message',
        message: msg,
    });
    message.value.value = '';
}

async function acceptRequest() {
    setRecipient();
    props.conn.send({
        type: 'accept',
        peer_id: props.peer_id,
        username: localStorage.getItem('username'),
    });
    contacts.value.requester = {};
    store.peer_status = 'connected';
}

async function rejectRequest() {
    props.conn.send({
        type: 'reject',
        peer_id: props.peer_id,
        username: localStorage.getItem('username'),
    });
    cleanup();
    emit('reset');
}

async function disconnect() {
    props.conn.send({
        type: 'disconnect',
        peer_id: peer_id.value,
        username: localStorage.getItem('username'),
    });
    cleanup();
    emit('reset');
}

function setRecipient() {
    contacts.value.recipient = contacts.value.requester;
}

function ack() {
    props.conn.send({
        type: 'ack'
    });
}

async function peer_event(obj) {
    props.conn.send(obj);
}

async function send_reaction(event) {
    notify({ n: 'Reaction sent.' });
    props.conn.send({
        type: 'reaction',
        event: event,
    });
}

async function runFunc() {
    ack();
    let func = store.stack.pop();
    func();
}

props.conn.on("data", async function (data) {
    if (data.type == 'ack') {
        let func = store.stack.pop();
        func();
        return;
    }

    if (data.type == 'execute') {
        switch (data.operation) {
            case 'Track.play':
                store.stack.push(async function op() {
                    DZ.player.playTracks([parseInt(data.object)], async function (response) {
                        await addToQueueStart(response.tracks);
                    });
                });
                break;

            case 'Album.play':
                store.stack.push(async function op() {
                    DZ.player.playAlbum(parseInt(data.object), async function (response) {
                        await addToQueueStart(response.tracks);
                    });
                });
                break;

            case 'Playlist.play':
                store.stack.push(async function op() {
                    DZ.player.playPlaylist(parseInt(data.object), async function (response) {
                        await addToQueueStart(response.tracks);
                    });
                });
                break;

            case 'Radio.play':
                store.stack.push(async function op() {
                    DZ.player.playRadio(parseInt(data.object), async function (response) {
                        await addToQueueStart(response.tracks);
                    });
                });
                break;

            case 'Player.play':
                store.stack.push(async function op() {
                    DZ.player.play();
                });
                break;

            case 'Player.pause':
                store.stack.push(async function op() {
                    DZ.player.pause();
                });
                break;

            case 'Player.playTracks':
                store.stack.push(async function op() {
                    getQueueTracks().then(tracks => {
                        DZ.player.playTracks(tracks);
                    });
                });
                break;

            case 'Player.next':
                store.stack.push(async function op() {
                    getQueueTracks().then(tracks => {
                        let index = (store.queue_index + 1) % tracks.length;
                        DZ.player.playTracks(tracks, index);
                        store.queue_index++;
                    });
                });
                break;

            case 'Player.prev':
                store.stack.push(async function op() {
                    getQueueTracks().then(tracks => {
                        let index = (store.queue_index - 1) % tracks.length;
                        DZ.player.playTracks(tracks, index);
                        store.queue_index--;
                    });
                });
                break;

            case 'Player.repeat':
                store.stack.push(async function op() {
                    DZ.player.setRepeat(data.object);
                });
                break;

            case 'Player.seek':
                store.stack.push(async function op() {
                    DZ.player.seek(data.object);
                });
                break;

            case 'Queue.Track.add':
                store.stack.push(async function op() {
                    DZ.api('/track/' + data.object, async function (response) {
                        await addToQueue(convert_track(response));
                    });
                });
                break;

            case 'Queue.Album.add':
                store.stack.push(async function op() {
                    DZ.api('/album/' + data.object[0] + '/tracks', async function (response) {
                        await addToQueue(convert_album(response.data, data.object[0], data.object[1]));
                    });
                });
                break;

            case 'Queue.Playlist.add':
                store.stack.push(async function op() {
                    DZ.api('/playlist/' + data.object + '/tracks', async function (response) {
                        await addToQueue(convert_playlist(response.data));
                    });
                });
                break;

            case 'Queue.Radio.add':
                store.stack.push(async function op() {
                    DZ.api('/radio/' + data.object + '/tracks', async function (response) {
                        await addToQueue(convert_playlist(response.data));
                    });
                });
                break;

            case 'Queue.play':
                store.stack.push(async function op() {
                    getQueueTracks().then((tracks) => {
                        DZ.player.playTracks(tracks, data.object);
                    });
                });
                break;

            case 'Queue.clear_all':
                store.stack.push(async function op() {
                    store.queue_index = 0;
                    store.queue = [];
                    queue.value = store.queue;
                    clearQueue();
                });
                break;

            case 'Queue.clear_except':
                store.stack.push(async function op() {
                    let current_track_id = parseInt(current_track.id);
                    store.queue = store.queue.filter(item => item.track.id === current_track_id);
                    queue.value = store.queue;
                    store.queue_index = 0;
                    clearQueue(store.queue);
                });
                break;

            case 'Queue.remove':
                store.stack.push(async function op() {
                    store.queue.splice(index, 1);
                    queue.value = store.queue;
                    clearQueue(store.queue);
                });
                break;

            default:
                return;
        }
        runFunc();
        return;
    }

    if (data.type == 'message') {
        emit('message', {
            message: data.message,
            from: contacts.value.recipient.username,
        });
        return;
    }

    if (data.type == 'reaction') {
        emit('reaction', data.event);
        return;
    }

    if (data.type == 'connect') {
        contacts.value.requester = {
            peer_id: data.peer_id,
            username: data.username,
            deezer_id: data.peer_id.split('dz')[1],
        };
        store.peer_status = 'requesting';
        emit('show');
        return;
    }

    if (data.type == 'disconnect') {
        cleanup();
        emit('reset');
        return;
    }

    if (data.type == 'accept') {
        contacts.value.recipient = {
            peer_id: data.peer_id,
            username: data.username,
            deezer_id: data.peer_id.split('dz')[1],
        };
        store.peer_status = 'connected';
        emit('show');
        return;
    }

    if (data.type == 'reject') {
        store.peer_status = 'disconnected';
        alert_notify(data.username + ' rejected your request.');
        cleanup();
        emit('reset');
        return;
    }
});

const props = defineProps({
    peer: {
        type: Object,
    },
    conn: {
        type: Object,
    },
    peer_id: {
        type: String,
    },
});

defineExpose({
    status,
    peer_id,
    recipient_id,
    peer_event,
});
</script>