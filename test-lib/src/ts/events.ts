type Listener = {target: HTMLElement | Document, eventName: string, callback: (event: any) => void};

const listeners = new Map<number, Listener>();
let nextId = 0;

export const createListener = (target: HTMLElement | Document, eventName: string, callback: (event: any) => void) => {
    const id = nextId++;
    listeners.set(id, {target, eventName, callback});
    target.addEventListener(eventName, callback);
    return id;
}

export const removeListener = (id: number) => {
    const listener = listeners.get(id);
    if (listener) {
        listener.target.removeEventListener(listener.eventName, listener.callback);
    }
    listeners.delete(id);
}