# Websockets

You can find a websockets endpoint where you can gather realtime data from LN Markets such as bid, offer, index, and last price.

The websocket endpoint for mainnet is: `wss://api.lnmarkets.com`

The websocket API follow the [JSON-RPC](https://www.jsonrpc.org/specification) spec

Request sent to the api should be a valid JSON like this

```json
{
  "jsonrpc": "2.0",
  "method": "debug/echo",
  "id": "faffssdfsdf432", // Random id
  "params": {
    "hello": "world"
  }
}
```

And response will look like this

```json
{
  "jsonrpc": "2.0",
  "id": "faffssdfsdf432", // Same id
  "result": {
    "hello": "world"
  }
}
```

If you wish to have a response you need to listen of the id provided in the request

## Authentication

To create an authenticated websocket you need to send a payload one time to be authentificated.

The payload should be like this

```json
{
  "jsonrpc": "2.0",
  "method": "auth/api-key",
  "params": {
    "timestamp": 1636389122390, // The current timestamp
    "signature": "SAFiGx46GGqztiHu31Mfm89VT3Cp0kqhap4DEs6Pv/U=", // HMAC SHA256 (method + timestamp) Base 64
    "passphrase": "fd026g0d4i52", // Your passphrase
    "key": "DKJLy/OlXQqQgbT0bE18HJgzQOJnuaTW43OQD8EEHuM=" // Your api key
  }
}
```

Here is an example about how doing it with javascript

```JS
const Websocket = require('ws')

const ws = new Websocket('wss://api.lnmarkets.com')

const key = 'API_KEY'
const secret = 'API_SECRET'
const passphrase = 'API_PASSPHRASE'

const timestamp = Date.now()
const method = `auth/api-key`
const payload = `${timestamp}${method}`

const signature = createHmac('sha256', secret)
  .update(payload)
  .digest('base64')

const request = {
  jsonrpc: '2.0',
  method,
  params: {
    timestamp,
    signature,
    passphrase,
    key,
  },
}

ws.on('message', console.log)
ws.send(JSON.stringify(request))
```

If you want a full implementation example you can take a look at our npm package [@ln-markets/api](https://www.npmjs.com/package/@ln-markets/api)

## Heartbeats

Some WebSocket libraries are better than others at detecting connection drops. If your websocket library supports hybi-13, or ping/pong, you may send a ping at any time and the server will return with a pong.

Due to changes in browser power-saving modes, we no longer support expectant pings via the WebSocket API.

If you are concerned about your connection silently dropping, we recommend implementing the following flow:

After receiving each message, set a timer a duration of 5 seconds.
If any message is received before that timer fires, restart the timer.
When the timer fires (no messages received in 5 seconds), send a raw ping frame (if supported) or the literal string 'ping'.
Expect a raw pong frame or the literal string 'pong' in response. If this is not received within 5 seconds, throw an error or reconnect.

## Subscription

You can subscribe to differents events using the `subscribe` method

If you wish to unsubscribe call the `unsubscribe` and wich events you want to be unsubscribed

```json
[
  "futures/market/bid-offer",
  "futures/market/index",
  "options/data/forwards",
  "options/data/volcurve",
  "options/data/ordermap"
]
```
