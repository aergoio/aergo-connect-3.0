API
===

The extension includes a light API so that websites can send permission requests to the extension.

You can find example code here: https://github.com/aergoio/wallet-api-test

Flow
----

```
+---------------+                           +---------------+
|               |    window.postMessage()   |               |
|               |  +--------------------->  |               |
|    Website*   |                           |   Extension   |
|               |  <---------------------+  |               |
|               |           Event           |               |
+---------------+                           +---------------+
```

* Website needs to be served over http(s), it does not work with other protocols like `file:` due to extension security restrictions.

1. Website sends a request using `window.postMessage()`:
```js
action = 'ACTIVE_ACCOUNT' | 'SIGN' | 'SIGN_TX' | 'SEND_TX'
data = { ... } // see below
window.postMessage({
  type: 'AERGO_REQUEST',
  action: action,
  data: data,
});
```

2. Extension activates, asking user for permission.

3. If user confirms, extension sends an event to the website.
```js
responseType = 'AERGO_ACTIVE_ACCOUNT' | 'AERGO_SIGN_RESULT' | 'AERGO_SIGN_TX_RESULT' | 'AERGO_SEND_TX_RESULT'
window.addEventListener(responseType, function(event) {
  if ('error' in event.detail) {
    // Do something with event.detail.error
  } else {
    // Do something with event.detail
  }
}, { once: true });
```

Request and response types
--------------------------

| Request message action | Request data            | Response event name  | Response event detail                             |
|------------------------|-------------------------|----------------------|---------------------------------------------------|
| ACTIVE_ACCOUNT         | {}                      | AERGO_ACTIVE_ACCOUNT | { account: { address: string, chainId: string,    |
|                        |                                                  nodeUrl:string?, scanApiUrl?:string, scanExplorerUrl?:string } } |
| SIGN (prehashed)       | { hash: hex string }    | AERGO_SIGN_RESULT    | { signature: string }                             |
| SIGN (unhashed)        | { message: hex string } | AERGO_SIGN_RESULT    | { signature: string }                             |
| SIGN_TX                | { ...txBody }           | AERGO_SIGN_TX_RESULT | { signature: string }                             |
| SEND_TX                | { ...txBody }           | AERGO_SEND_TX_RESULT | { hash: string }                                  |

**txBody**

```js
interface TxBody {
  from: string;  // e.g. 'AmQCPe9eoAkF1i1pcrpVmxKLNACXhGnuShZazySVVVfABz78e7XT'
  to: string;  // e.g. 'AmQCPe9eoAkF1i1pcrpVmxKLNACXhGnuShZazySVVVfABz78e7XT'
  amount: string; // e.g. '1 aergo'
  payload_json: Object; // e.g. { "Name": "setRate", "Args": [{"_bignum": "9070000000"}] }
  payload: string; // can also pass raw payload, but using json is recommended for better UX
  type: number;
}
```

**Signining hashed or unhashed messages**

In previous versions of Aergo Connect, only already hashed messaged could be signed (by passing the `{ hash: ... }` data).
Since Aergo Connect 2.0, unhashed messaged are also supported (by passing the `{ message: ... }` data instead).
The message is then hashed by the application, or potentially by a connected hardware wallet, before signing.

Passing the raw message is recommended, as signing hashes using a hardware wallet is not best practice.
(You are or of course free to use a hash as a message, with the resulting signature effectively being for the doubly hashed message.)

Using promises
--------------

Here is some example code to wrap the flow into a promise:

```js
function aergoConnectCall(action, responseType, data) {
  return new Promise((resolve, reject) => {
    window.addEventListener(responseType, function(event) {
      if ('error' in event.detail) {
        reject(event.detail.error);
      } else {
        resolve(event.detail);
      }
    }, { once: true });
    window.postMessage({
      type: 'AERGO_REQUEST',
      action: action,
      data: data,
    });
  });
}
```

Please see the [example code](https://github.com/aergoio/wallet-api-test/blob/master/script.js) that this was taken from.
