require('./manifest.json');

import 'regenerator-runtime/runtime';

import extension from 'webextension-polyfill';
import endOfStream from 'end-of-stream';
import PortStream from 'extension-port-stream';

import BackgroundController from './background/controller';
import { ExternalRequest } from './background/request';

let controller;

async function setupController() {
  controller = new BackgroundController();

  function connectRemote(remotePort) {
    const processName = remotePort.name;
    console.log('Establishing connection with', processName);

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
      console.log(remotePort, 'port');
      endOfStream(portStream, () => {
        controller.uiState.popupOpen = false;
        console.log('Closed connection with', processName);
        controller.state.set('inactive');
      });
    }
  }

const controller = new BackgroundController();

  extension.idle.onStateChanged.addListener((newState) => {
    console.log('idle onStateChanged : ' + newState);
    if (newState === 'idle' || newState === 'locked') {
      // controller.lock();
    }
  });
}

console.log('AERGO Wallet Background Script');
console.log('Extension ID', extension.runtime.id);

extension.runtime.onInstalled.addListener(() => {
  // chrome.storage.sync.set({ color });
  // console.log('Default background color set to %cgreen', `color: ${color}`);

  if (processName === 'external') {
    remotePort.onMessage.addListener((msg, port) => {
      const request = ExternalRequest.fromPortMessage(port, msg);
      controller.permissionRequest(request);
    });
  } else {
    // setupController();
    // extension.contextMenus.removeAll();
    // temp
    // extension.contextMenus.create({
    //   title: 'Open full page',
    //   contexts: ['browser_action'],
    //   onclick: function () {
    //     extension.tabs.create({ url: 'index.html' });
    //   },
    // });
  }
  console.log('onInstalled End');
});

extension.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request === 'popup') {
    if (!controller) {
      setupController();
    }
  }
});
// Setup idle detection
extension.idle.setDetectionInterval(60);

extension.idle.onStateChanged.addListener((newState) => {
  console.log('idle onStateChanged : ' + newState);
  if (newState === 'idle' || newState === 'locked') {
    controller.lock();
  }
});

// console.log('AERGO Wallet Background Script');
// console.log('Extension ID', extension.runtime.id);

// chrome.runtime.onInstalled.addListener(() => {
//   // chrome.storage.sync.set({ color });
//   // console.log('Default background color set to %cgreen', `color: ${color}`);
//   if (!extension.runtime.id) {
//     console.error('Script needs run in extension context. Aborting');
//   } else {
//     console.log(extension, 'extension');

//     setupController();
//     extension.contextMenus.removeAll();
//     // temp
//     // extension.contextMenus.create({
//     //   title: 'Open full page',
//     //   contexts: ['browser_action'],
//     //   onclick: function () {
//     //     extension.tabs.create({ url: 'index.html' });
//     //   },
//     // });
//     console.log('onInstalled End');
//   }

//   // const aergo = new AergoClient(
//   //   {},
//   //   new GrpcWebProvider({ url: 'https://testnet-api-http.aergo.io' }),
//   // );
//   // aergo.blockchain().then((blockchainState) => {
//   //   const currentHeight = blockchainState.bestHeight;
//   //   console.log('currentHeight', currentHeight);
//   // });

//   //   setupController();

//   // extension.contextMenus.removeAll();
//   // extension.contextMenus.create({
//   //   title: 'Open full page',
//   //   contexts: ['browser_action'],
//   //   onclick: function () {
//   //     extension.tabs.create({ url: 'index.html' });
//   //   },
//   // });
// });

//////////////////////////////////////////////////////////////////////////////////

// require('./manifest.json');

// import 'regenerator-runtime/runtime';

// import extension from 'extensionizer';
// import endOfStream from 'end-of-stream';
// import PortStream from 'extension-port-stream';

// import BackgroundController from './background/controller';
// import { ExternalRequest } from './background/request';

// const controller = new BackgroundController();

// extension.runtime.onConnect.addListener(function connectRemote(remotePort) {
//   const processName = remotePort.name;
//   console.log('Establishing connection with', remotePort);
//   function deleteTimer(port) {
//     console.log(port, 'deleteTimer Port');
//     if (port._timer) {
//       clearTimeout(port._timer);
//       delete port._timer;
//     }
//   }
//   function forceReconnect(port) {
//     console.log(port, 'forceReconnect Port');
//     deleteTimer(port);
//     port.disconnect();
//   }

//   if (processName === 'external') {
//     remotePort.onMessage.addListener((msg, port) => {
//       const request = ExternalRequest.fromPortMessage(port, msg);
//       controller.permissionRequest(request);
//     });
//   } else {
//     const portStream = new PortStream(remotePort);
//     controller.state.set('active');
//     controller.setupCommunication(portStream);
//     controller.uiState.popupOpen = true;

//     endOfStream(portStream, () => {
//       controller.uiState.popupOpen = false;
//       console.log('Closed connection with', processName);
//       controller.state.set('inactive');
//     });
//   }
//   remotePort._timer = setTimeout(forceReconnect, 250e3, remotePort);
// });
// // Setup idle detection
// extension.idle.setDetectionInterval(60);

// extension.idle.onStateChanged.addListener((newState) => {
//   console.log('idle onStateChanged : ' + newState);
//   if (newState === 'idle' || newState === 'locked') {
//     controller.lock();
//   }
// });
