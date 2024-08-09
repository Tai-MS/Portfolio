const socket = io()
socket.emit('message', 'Comunicacion desde websocket')