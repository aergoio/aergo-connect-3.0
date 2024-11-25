require('./manifest.json');
import 'regenerator-runtime/runtime';
import endOfStream from 'end-of-stream';
import PortStream from 'extension-port-stream';
import BackgroundController from './background/controller';
import { ExternalRequest } from './background/request';

const controller = new BackgroundController();

/** Already use ports   */
chrome.runtime.onConnect.addListener(function connectRemote(remotePort) {
  const processName = remotePort.name;

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
});

// Setup idle detection
chrome.idle.setDetectionInterval(60);

chrome.idle.onStateChanged.addListener((newState) => {
  console.log(newState, 'newState');
  if (newState === 'idle' || newState === 'locked') {
    controller.lock();
  }
});

chrome.windows.onFocusChanged.addListener(function (windowId) {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    controller.state.set('inactive');
  }
});

/** "Persistent" service worker via bug exploit */
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();

/** Full Screen Context */
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
