let port;
function connect() {
  /* eslint-disable no-undef */
  port = chrome.runtime.connect({ name: 'external' });

  port.onDisconnect.addListener(connect);
  // Message from extension to website
  port.onMessage.addListener((msg) => {
    if (msg.type !== 'AERGO_RESPONSE' && msg.type !== 'AERGO_CANCEL') return;
    console.log('[Contentscript] Received message from extension', msg);
    const event = new CustomEvent(msg.eventName, { detail: msg.result });
    window.dispatchEvent(event);
  });
}
connect();

// Message from website to extension
window.addEventListener('message', (event) => {
  // We only accept messages from ourselves
  if (event.source != window) {
    return;
  }

  if (event.data.type && event.data.type == 'AERGO_REQUEST') {
    console.log('[Contentscript] Received message from website', event.data);
    port.postMessage(event.data);
  }
});
