let port;
function connect() {
  /* eslint-disable no-undef */
  port = chrome.runtime.connect({ name: 'external' });

  // Message from extension to website
  port.onMessage.addListener((msg) => {
    if (msg.type !== 'AERGO_RESPONSE' && msg.type !== 'AERGO_CANCEL') return;
    // console.log('[Contentscript] Received message from extension', msg);
    const event = new CustomEvent(msg.eventName, { detail: msg.result });
    window.dispatchEvent(event);
  });

  port.onDisconnect.addListener(connect);
}
connect();
