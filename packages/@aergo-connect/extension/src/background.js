require('./manifest.json');
import 'regenerator-runtime/runtime';
import endOfStream from 'end-of-stream';
import PortStream from 'extension-port-stream';
import BackgroundController from './background/controller';
import { ExternalRequest } from './background/request';

const controller = new BackgroundController();

chrome.runtime.onConnect.addListener(function connectRemote(remotePort) {
  const processName = remotePort.name;
  function deleteTimer(port) {
    if (port._timer) {
      clearTimeout(port._timer);
      delete port._timer;
    }
  }
  function forceReconnect(port) {
    controller.setupCommunication(port);
    deleteTimer(port);
    port.disconnect();
  }

  if (processName === 'external') {
    remotePort.onMessage.addListener((msg, port) => {
      const request = ExternalRequest.fromPortMessage(port, msg);
      controller.permissionRequest(request);
    });
  } else {
    const portStream = new PortStream(remotePort);
    controller.state.set('active');
    controller.setupCommunication(portStream);
    controller.uiState.popupOpen = true;

    endOfStream(portStream, () => {
      controller.uiState.popupOpen = false;
      controller.state.set('inactive');
    });
  }
  remotePort._timer = setTimeout(forceReconnect, 50000, remotePort);
});

// Setup idle detection
chrome.idle.setDetectionInterval(60);

chrome.idle.onStateChanged.addListener((newState) => {
  if (newState === 'idle' || newState === 'locked') {
    controller.lock();
  }
});

// chrome.contextMenus.create(
//   {
//     id: 'fullPage',
//     title: 'Open Full Page',
//     contexts: ['action'],
//   },
//   () => chrome.runtime.lastError,
// );

// chrome.contextMenus.onClicked.addListener(function (info, tab) {
//   const { menuItemId } = info;
//   if (menuItemId === 'fullPage') {
//     chrome.tabs.create({ url: 'index.html#' });
//   }
// });
