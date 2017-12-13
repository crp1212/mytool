const socket = new WebSocket('ws://localhost:8080');

// Connection opened
socket.addEventListener('open', function (event) {
    
});

// Listen for messages
socket.addEventListener('message', function (event) {
    if (event.data === 'update') {
        location.reload()
    }
})