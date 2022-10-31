// open questions should clarify with the interviewer 
// 1. Big O
// 2. Error handling if listner doesn't exist in unsubscribe or eventType doesn't exist in publish method?
// 3. this context?
class EventManager {
    #events;

    constructor() {
        this.#events = {};
    }

    subscribe(eventType, listener) {
        if (this.#events[eventType] === undefined) {
            this.#events[eventType] = new Set(); // so that we could unsubscribe in O(1)
        }

        this.#events[eventType].add(listener);
    }

    unsubscribe(eventType, listener) {
        const events = this.#events[eventType];
        if (!Object.hasOwn(this.#events, eventType) || !events.has(listener)) {
            return;
        }

        events.delete(listener);
    }

    publish(eventType, data) {
        const events = this.#events[eventType];
        if (!Object.hasOwn(this.#events, eventType) || events.size === 0) {
            return;
        }

        events.forEach(event => {
            event(data);
        });
    }
}

const channel = new EventManager();
const callback1 = data => console.log('Callback 1:', data);
const callback2 = data => console.log('Callback 2:', data);
const callback3 = data => console.log('Callback 3:', data);
channel.subscribe('request.error', callback1);
channel.subscribe('request.error', callback2);
channel.subscribe('request.success', callback3);
channel.publish('request.error', { foo: 'bar' });
channel.publish('request.success', { lorem: 'ipsum' });

channel.unsubscribe('request.error', callback1);
channel.publish('request.error', { bar: 'baz' });