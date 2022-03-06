// // https://nextjs.org/docs/advanced-features/custom-server
// // https://levelup.gitconnected.com/set-up-next-js-with-a-custom-express-server-typescript-9096d819da1c
// import next from 'next'
// import { createServer } from 'http'
// import { parse } from 'url'
// import { config } from './config'
// import { BalanceState, WebSocketClientOptions, WebSocketImplementation } from './utils'
// import { WebSocketClient, WebSocketServer } from './services/websocket.service'
// import { DsbApiService } from './services/dsb-api.service'
// import { initEnrolment, validateBalance, validatePrivateKey } from './services/identity.service'
// import { writeIdentity } from './services/storage.service'
//
// const dev = process.env.NODE_ENV !== 'production'
// const app = next({ dev })
// const handle = app.getRequestHandler()
//
// export const startServer = async () => {
//   await app.prepare()
//
//   /**
//    * INIT IDENTITY
//    */
//   if (config.iam.privateKey) {
//     console.log('Validating private key...')
//     const { ok: wallet, err: walletError } = validatePrivateKey(config.iam.privateKey)
//     if (!wallet) {
//       throw walletError
//     }
//     console.log('Fetching address balance...')
//     const { ok: balance, err: balanceError } = await validateBalance(wallet.address)
//     if (balance === undefined) {
//       throw balanceError
//     }
//     const identity = {
//       address: wallet.address,
//       publicKey: wallet.publicKey,
//       privateKey: wallet.privateKey,
//       balance
//     }
//     console.log('Saving identity...')
//     const { ok: saved, err: saveError } = await writeIdentity(identity)
//     if (!saved) {
//       throw saveError
//     }
//     if (balance === BalanceState.NONE) {
//       console.log('Balance is 0. Skipping enrolment.')
//     } else {
//       console.log('Initialising IAM connection...')
//       const { ok: requestor, err: initError } = await initEnrolment(identity)
//       if (!requestor) {
//         throw initError
//       }
//       console.log('Fetching enrolment state...')
//       const { ok: state, err: stateErr } = await requestor.getState()
//       if (stateErr) {
//         throw stateErr
//       }
//       if (state) {
//         if (state.approved || state.waiting) {
//           console.log('Saving completed enrolment state...')
//           await requestor.save(state)
//           console.log('Saved identity. Done.')
//         } else {
//           console.log('Starting enrolment...')
//           const { ok: enroled, err: enrolError } = await requestor.handle(state)
//           if (!enroled) {
//             throw enrolError
//           }
//           console.log('Fetching new enrolment state...')
//           const { ok: newState, err: newStateError } = await requestor.getState()
//           if (!newState) {
//             throw newStateError
//           }
//           console.log('Saving enrolment state...')
//           const { ok: saved, err: saveError } = await requestor.save(newState)
//           if (!saved) {
//             throw saveError
//           }
//           console.log('Saved identity. Done.')
//         }
//       }
//     }
//   }
//
//   const server = createServer((req, res) => {
//     if (!req.url) {
//       return res.end()
//     }
//     const parsedUrl = parse(req.url, true)
//     handle(req, res, parsedUrl)
//   })
//
//   /**
//    * INIT WEBSOCKETS
//    */
//   if (config.server.websocket === WebSocketImplementation.SERVER) {
//     const ws = WebSocketServer.init(server, '/events')
//     console.log('WebSocket available on /events')
//     DsbApiService.init().pollForNewMessages((message) => ws.emit(message))
//   } else if (config.server.websocket === WebSocketImplementation.CLIENT) {
//     if (config.server.websocketClient?.url) {
//       try {
//         const ws = await WebSocketClient.init(config.server.websocketClient as WebSocketClientOptions)
//         console.log('WebSocket client connected to', config.server.websocketClient.url)
//         DsbApiService.init().pollForNewMessages((message) => ws.emit(message))
//       } catch (err) {
//         console.log('WebSocket client failed to connect:', err)
//       }
//     } else {
//       console.log('Need URL to connect to WebSocket Server. Skipping...')
//     }
//   }
//
//   server.listen(config.server.port, () => {
//     console.log(`Server listening on port ${config.server.port}`)
//   })
// }
