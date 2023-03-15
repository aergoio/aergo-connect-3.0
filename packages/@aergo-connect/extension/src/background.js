require('./manifest.json');

import 'regenerator-runtime/runtime';

import extension from 'webextension-polyfill';
import endOfStream from 'end-of-stream';
import PortStream from 'extension-port-stream';

import BackgroundController from './background/controller';
import { ExternalRequest } from './background/request';

const controller = new BackgroundController();

extension.runtime.onConnect.addListener(function connectRemote(remotePort) {
  const processName = remotePort.name;
  console.log('Establishing connection with', remotePort);
  function deleteTimer(port) {
    console.log(port, 'deleteTimer Port');
    if (port._timer) {
      clearTimeout(port._timer);
      delete port._timer;
    }
  }
  function forceReconnect(port) {
    console.log(port, 'forceReconnect Port');
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
      console.log('Closed connection with', processName);
      controller.state.set('inactive');
    });
  }
  remotePort._timer = setTimeout(forceReconnect, 250e3, remotePort);
});
// Setup idle detection
extension.idle.setDetectionInterval(60);

extension.idle.onStateChanged.addListener((newState) => {
  console.log('idle onStateChanged : ' + newState);
  if (newState === 'idle' || newState === 'locked') {
    // controller.lock();
  }
});
