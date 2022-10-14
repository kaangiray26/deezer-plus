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
        return true;
    }
    return false;
}

async function sessionAction(options) {
    store.stack.push(options.func);
    let groupSession = await notifyPeer({
        type: 'execute',
        object: options.object,
        operation: options.operation
    });
    if (!groupSession) {
        let func = store.stack.pop();
        func();
    }
}

export { sessionAction }