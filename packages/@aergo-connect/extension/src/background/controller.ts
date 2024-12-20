/* eslint-disable @typescript-eslint/ban-ts-comment */
import { EventEmitter } from 'events';
import pump from 'pump';
import Dnode from 'dnode/browser.js';
import Transport from '@ledgerhq/hw-transport-webusb';

import { Wallet, Account, Transaction } from '@herajs/wallet';
import config from '../config';
import store from './store';
import { AergoscanTransactionScanner } from './tx-scanner';
import { getServerApi } from './api';

import AppState from './app-state';
import { ExternalRequest } from './request';
//import 'whatwg-fetch';

import { Buffer } from 'buffer';
import { hashTransaction, hash } from '@herajs/crypto';
import { TxTypes } from '@herajs/common';
// import { BasicType, Data } from '@herajs/wallet/dist/types/models/record';

// type NodeURLType = string | number | boolean | Data | BasicType[] | Data[];

class BackgroundController extends EventEmitter {
  wallet: Wallet;
  id: string;
  requests: Record<string, ExternalRequest>;
  lastRequestId: number;
  state: AppState;
  idleTimeout?: number;
  uiState: {
    popupOpen: boolean;
  };
  activeAccount?: Account;

  constructor() {
    super();

    this.id = chrome.runtime.id;

    this.requests = {};
    this.lastRequestId = 0;

    this.uiState = {
      popupOpen: false,
    };
    this.idleTimeout = 60;
    this.state = new AppState(this.idleTimeout * 1000);

    this.wallet = new Wallet({
      appName: 'aergo-browser-wallet',
      instanceId: this.id,
    });
    this.wallet.use(AergoscanTransactionScanner as any);
    this.wallet.useStorage(store).then(async () => {
      if (!this.wallet.datastore) throw new Error('wallet failed to initiate storage');
      this.firstLoad();

      // Load custom defined chains
      try {
        const customChains = await this.wallet.datastore.getIndex('settings').get('customChains');
        if (customChains && customChains.data) {
          for (const chainId of Object.keys(customChains.data)) {
            this.wallet.useChain({
              chainId,
              // @ts-ignore
              nodeUrl: customChains.data[chainId].nodeUrl,
            });
          }
        }
      } catch (e) {
        // not found
      }
    });
    for (const chain of config.ChainConfigs) {
      this.wallet.useChain(chain);
    }

    this.wallet.keyManager.on('lock', () => {
      this.emit('update', { unlocked: false });
      console.log('[lock] locked');
    });
    this.wallet.keyManager.on('unlock', () => {
      this.emit('update', { unlocked: true });
      console.log('[lock] unlocked');
    });

    this.wallet.accountManager.on('remove', (accountSpec) => {
      this.emit('update', { accountsRemoved: [accountSpec] });
    });

    // Background script cannot access USB device
    this.wallet.keyManager.useExternalLedger = true;

    // On idle (60s after UI becoming inactive)
    this.state.on('idle', () => {
      this.lock();
      console.log('[state] idle, pausing trackers');
      this.wallet.accountManager.pause();
      this.wallet.transactionManager.pause();
    });
    this.state.on('active', () => {
      console.log('[state] active, resuming trackers');
      this.wallet.accountManager.resume();
      this.wallet.transactionManager.resume();
    });

    this.lock();
  }

  async firstLoad() {
    const accounts = await this.wallet.accountManager.getAccounts();
    for (const account of accounts) {
      this.trackAccount(account);
    }
  }

  async getAccounts() {
    const accounts = await this.wallet.accountManager.getAccounts();
    return accounts;
  }

  lock() {
    this.wallet.lock();
  }

  async unlock(passphrase: string) {
    await this.wallet.unlock(passphrase);
  }

  async setupAndUnlock(passphrase: string) {
    await this.wallet.setupAndUnlock(passphrase);
  }

  async setActiveAccount({ chainId, address }: any) {
    const account = await this.wallet.accountManager.getOrAddAccount({
      address,
      chainId,
    });
    this.activeAccount = account;
  }

  async getActiveAccount() {
    return this.activeAccount;
  }

  /**
   * Returns true if the UI is currently open.
   * Currently unused, but can be used in the future to detect where notifications should be shown.
   */
  isUiOpen() {
    return this.uiState.popupOpen;
  }

  trackAccount(account: Account, onceCb?: (account: Account) => void) {
    const accountTracker = this.wallet.accountManager.trackAccount(account);

    this.wallet.transactionManager.trackAccount(account);
    accountTracker.then((t) => {
      t.removeAllListeners('update');
      t.on('update', (account) => {
        this.emit('update', { accounts: [account] });
        if (onceCb) {
          onceCb(account);
          onceCb = undefined;
        }
      });
      // Force an initial load and update with data
      t.load().then((account) => {
        this.emit('update', { accounts: [account] });
      });
    });
    // Make an initial update (data might be empty)
    this.emit('update', { accounts: [account] });
  }

  permissionRequest(request: ExternalRequest) {
    const requestId = this.lastRequestId++;
    this.requests[requestId] = request;
    chrome.windows.getCurrent((window: any) => {
      const left = Math.max(0, window.left + window.width - 360);
      chrome.windows.create({
        // @ts-ignore
        url: chrome.runtime.getURL(`popup-request.html?request=${requestId}`),
        type: 'popup',
        width: 360,
        height: 620,
        top: window.top,
        left,
      });
    });
  }

  respondToPermissionRequest(requestId: string, result: any, respondCancel = false) {
    const request = this.requests[requestId];
    if (!request) return;
    if (respondCancel) {
      request.sendCancel({
        error: 'user cancelled request',
      });
      return;
    }
    request.sendSuccess(result);
  }

  async signMessage({ address, chainId, message, hash: msgHash }: any) {
    const account = await this.wallet.accountManager.getOrAddAccount({
      address,
      chainId,
    });
    const signMessage = msgHash ? Buffer.from(msgHash) : hash(Buffer.from(message));
    return await this.wallet.keyManager.signMessage(account, signMessage);
  }

  async signTransaction({ address, chainId, txData }: any) {
    const account = await this.wallet.accountManager.getOrAddAccount({
      address,
      chainId,
    });
    const preparedTxData = await this.wallet.accountManager.prepareTransaction(account, txData);
    return await this.wallet.keyManager.signTransaction(account, preparedTxData);
  }

  async sendTransaction({ txBody, chainId }: any) {
    const accountSpec = {
      address: txBody.from,
      chainId: chainId,
    };
    let tx = txBody;
    if (txBody.sign) {
      // Externally pre-signed transaction
      tx = await this.wallet.prepareTransaction(accountSpec, txBody);
      tx.txBody.sign = txBody.sign;
      tx.txBody.hash = await hashTransaction(txBody, 'base58');
    }
    const txTracker = await this.wallet.sendTransaction(accountSpec, tx);
    // console.log(txTracker, txTracker.transaction.txBody);
    txTracker.getReceipt().then((receipt) => {
      if (receipt.status === 'SUCCESS') {
        this.handleConfirmedTx(txTracker.transaction);
      }
    });
    return txTracker.transaction.txBody;
  }

  /**
   * Handle confirmed transactions sent through the wallet
   */
  async handleConfirmedTx(transaction: Transaction) {
    if (!transaction.txBody) return;
    // Apply name transactions to internal db
    if (transaction.txBody.type === TxTypes.Governance && transaction.txBody.to === 'aergo.name') {
      const client = this.wallet.getClient(transaction.data.chainId);
      const blockhash = transaction.data.blockhash as string;
      const block = await client.getBlockMetadata(blockhash);
      const events = await client.getEvents({
        address: 'aergo.name',
        blockfrom: block.header.blockno,
        blockto: block.header.blockno,
      });
      for (const event of events) {
        if (event.eventName === 'update name' || event.eventName === 'create name') {
          //console.log('Handling name event...', event);
          this.wallet.nameManager.updateName(
            {
              address: (event.args[1] as string) || transaction.data.from,
              chainId: transaction.data.chainId,
            },
            event.args[0] as string,
          );
        }
      }
    }
  }

  async connectLedger(): Promise<void> {
    if (this.wallet.ledger) return;

    try {
      console.log('Connecting Ledger...');
      const transport = await Transport.create(30000, 1500); // 타임아웃 설정
      this.wallet.connectLedger(transport);
    } catch (error) {
      console.error('Failed to connect to Ledger:', error);
    }
  }

  setupCommunication(outStream: any) {
    const api = getServerApi(this);
    const dnode = Dnode(api);
    pump(outStream, dnode, outStream, (err: any) => {
      if (err) console.error('Communication error:', err);
      setTimeout(() => {
        this.setupCommunication(outStream);
      }, 1000); // 1s after reconnection
    });

    dnode.on('remote', (remote: any) => {
      const sendUpdate = remote.sendUpdate.bind(remote);
      this.on('update', sendUpdate);
    });

    this.state.on('change', (state: string) => {
      this.emit('update', { state });
    });
  }

  async setIdleTimeout(newTimeout: number): Promise<void> {
    this.idleTimeout = newTimeout;
    chrome.idle.setDetectionInterval(this.idleTimeout);
    this.state.updateIdleTimeout(this.idleTimeout * 1000);
    console.log(`Idle timeout updated to ${this.idleTimeout} seconds`);
  }
}

export default BackgroundController;
