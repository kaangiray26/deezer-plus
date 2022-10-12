<template>
    <div v-show="store.peer_status == 'connected'">
        <div class="input-group mb-2">
            <span class="input-group-text bg-dark text-white">Connected to:</span>
            <input type="text" class="form-control" :value="contacts.recipient.username" readonly>
        </div>
        <div>
            <button class="btn btn-danger" @click="disconnect">Disconnect</button>
        </div>
    </div>
    <div v-show="alert.show">
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            {{alert.message}}
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
                    <a class="text-danger" :href="recipient_profile">{{contacts.requester.username}}</a>
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
import { store } from "/js/store.js";

const emit = defineEmits(['show', 'reset']);

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

async function notify(msg) {
    alert.value = {
        show: true,
        message: msg,
    };
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

props.conn.on("data", data => {
    if (data.type == 'connect') {
        contacts.value.requester = {
            peer_id: data.peer_id,
            username: data.username,
            deezer_id: data.peer_id.split('dz')[1],
        };
        store.peer_status = 'requesting';
        emit('show');
    }

    if (data.type == 'disconnect') {
        cleanup();
        emit('reset');
    }

    if (data.type == 'accept') {
        contacts.value.recipient = {
            peer_id: data.peer_id,
            username: data.username,
            deezer_id: data.peer_id.split('dz')[1],
        };
        store.peer_status = 'connected';
        emit('show');
    }

    if (data.type == 'reject') {
        store.peer_status = 'disconnected';
        notify(data.username + ' rejected your request.');
        cleanup();
        emit('reset');
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
});
</script>