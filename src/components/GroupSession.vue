<template>
    <div id="helpModal" class="modal fade" role="dialog" tabindex="-1" aria-hidden="true" ref="modalEle">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header d-flex flex-column">
                    <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                    <div class="mb-2">
                        <h2 class="modal-title fw-bolder">Group Session</h2>
                    </div>
                    <div>
                        <span>Connect to another user to start a group session.</span>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="input-group mb-2">
                        <form class="form-floating">
                            <input type="text" class="form-control" id="floatingInputValue" :value="peer_id" readonly>
                            <label for="floatingInputValue">My PeerID <input class="form-check-input online"
                                    type="radio" checked>
                            </label>
                        </form>
                        <button class="btn btn-dark" @click="copyPeerID">Link</button>
                    </div>
                    <div class="input-group mb-2" v-show="store.peer_status.startsWith('disconnected')">
                        <span class="input-group-text" id="basic-addon1">@</span>
                        <input ref="recipient_id" type="text" class="form-control" placeholder="PeerID"
                            aria-label="Username" aria-describedby="basic-addon1">
                        <button v-show="store.peer_status == 'disconnected'" class="btn btn-dark"
                            @click="createConnection">Connect</button>
                        <button v-show="store.peer_status == 'disconnected.connecting'" class="btn btn-dark"
                            @click="stopConnection">Stop</button>
                    </div>
                    <PeerJS ref="thisPeerJS" v-if="peerInit" :key="peer_key" :peer="peer" :conn="conn"
                        :peer_id="peer_id" @show="_show" @reset="reset" @reaction="showReaction" @message="showMessage">
                    </PeerJS>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { store } from "/js/store.js";
import { Modal } from 'bootstrap';
import { Peer } from "peerjs";
import PeerJS from '/components/PeerJS.vue';

const emit = defineEmits(['reset', 'reaction', 'message']);

let modalEle = ref(null);
let thisModalObj = null;

const peer = ref(null);
const conn = ref(null);

let thisPeerJS = ref(null);
const peerInit = ref(false);

const peer_id = ref(null);
const recipient_id = ref(null);

const peer_key = ref(0);

async function createConnection() {
    let id = recipient_id.value.value;
    if (!id.length) {
        return;
    }

    store.peer_status = 'disconnected.connecting';

    conn.value = peer.value.connect(id);
    peerInit.value = true;

    conn.value.on("open", () => {
        conn.value.send({
            type: 'connect',
            peer_id: peer_id.value,
            username: localStorage.getItem('username'),
        });
    });
}

async function createConnectionWithStoredID(stored_id) {
    store.peer_status = 'disconnected.connecting';

    conn.value = peer.value.connect(stored_id);
    peerInit.value = true;

    conn.value.on("open", () => {
        conn.value.send({
            type: 'connect',
            peer_id: peer_id.value,
            username: localStorage.getItem('username'),
        });
    });
}

async function stopConnection() {
    store.peer_status = 'disconnected';
}

async function reset() {
    peerInit.value = false;
    peer_key.value += 1;
    peer.value.disconnect();
    _hide();
    emit('reset');
}

async function showReaction(event) {
    emit('reaction', event);
}

async function showMessage(event) {
    emit('message', event);
}

async function _show() {
    thisModalObj.show();
}

async function _hide() {
    thisModalObj.hide();
}

async function _toggle() {
    thisModalObj.toggle();
}

async function _peer_event(obj) {
    thisPeerJS.value.peer_event(obj);
}

async function copyPeerID() {
    navigator.clipboard.writeText('https://deezer.buzl.uk/groupsession/' + peer_id.value);
}

defineExpose({
    show: _show,
    hide: _hide,
    toggle: _toggle,
    peer_event: _peer_event,
});

onMounted(() => {
    thisModalObj = new Modal(modalEle.value);
    peer.value = new Peer();

    peer.value.on('open', id => {
        peer_id.value = id;
        localStorage.setItem('groupSession', JSON.stringify([]));
        store.queue = [];

        let group_session_id = localStorage.getItem('groupSessionID');
        if (group_session_id.length) {
            createConnectionWithStoredID(group_session_id);
            localStorage.setItem('groupSessionID', '');
        }
    });

    peer.value.on('connection', connection => {
        conn.value = connection;
        peerInit.value = true;
    });
});
</script>