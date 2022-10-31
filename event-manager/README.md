// Implement an EventManager class
//
// There should be three methods on this class:
//
// 1. subscribe(eventType: string, listener: Function)
// 2. unsubscribe(eventType: string, listener: Function)
// 3. publish(eventType: string, data: any)
//
// You can use either ES5 or ES6 notation
const channel = new EventManager();
const callback1 = data => console.log('Callback 1:', data);
const callback2 = data => console.log('Callback 2:', data);
const callback3 = data => console.log('Callback 3:', data);
channel.subscribe('request.error', callback1);
channel.subscribe('request.error', callback2);
channel.subscribe('request.success', callback3);
channel.publish('request.error', { foo: 'bar' });
channel.publish('request.success', { lorem: 'ipsum' });
// Expected output in console:
//
// Callback 1: { foo: 'bar' }
// Callback 2: { foo: 'bar' }
// Callback 3: { lorem: 'ipsum' }
channel.unsubscribe('request.error', callback1);
channel.publish('request.error', { bar: 'baz' });
// Expected output in console:
//
// Callback 2: { bar: 'baz' }