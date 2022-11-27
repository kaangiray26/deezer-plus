// session.js
import { store } from '/js/store.js';

function inGroupSession() {
    return (store.peer_status == 'connected');
}

async function notifyPeer(obj) {
    if (inGroupSession()) {
        window.dispatchEvent(new CustomEvent('peer', {
            detail: obj
        }));
    }
}

async function sessionAction(options) {
    store.stack.push(options.func);
    notifyPeer({
        type: 'execute',
        object: options.object,
        operation: options.operation
    });
    if (!inGroupSession()) {
        let func = store.stack.pop();
        func();
    }
}

export { sessionAction }