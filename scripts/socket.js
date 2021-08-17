const { io } = require('socket.io-client')

const socket = io('ws://localhost:3000')

socket.on('connect', () => {
    socket.on('test.channels.testapp.apps.testorganization.iam.ewc', console.log)
})
