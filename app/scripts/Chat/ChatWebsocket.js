import RefluxActions from '../RefluxActions'

var socket = null
var address = [
  'ws://',
  document.location.hostname,
  ':',
  document.location.port,
  '/chatWs'
].join('')

var chatMessageCallback = function() {}

function connect() {
  socket = new WebSocket(address)
  socket.onmessage = function(message) {
    var messageObject = JSON.parse(message.data)
    handleMessage(messageObject)
  }
}

function handleMessage(message) {
  switch (message.type) {
    case "chat":
      chatMessageCallback(message.data)
      break;
    case 'userJoin':
    case 'userLeave':
    case 'userList':
      RefluxActions[message.type](message.data)
      break;
    default:
      console.log('unhandled message type')
      console.log(message)
      break;
  }
}

function send(userId, message) {
  if (socket === null) {
    return
  }
  socket.send(JSON.stringify({
    type: 'chat',
    data: {
      userId: userId,
      message: message,
    }
  }))
}

function setChatMessageCallback(callback) {
  chatMessageCallback = callback
}


module.exports = {
  connect: connect,
  send: send,
  setChatMessageCallback: setChatMessageCallback,
}