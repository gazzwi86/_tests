// include the library and create the server
var ws = require('websocket.io'),
    server = ws.listen(3000);

//wait for connections
server.on('connection', function (socket) {
    
    // log client joining server
    //console.log(server.clients);
    console.log('Client joined: ' + server.clientsCount);

    // wait for a message
    socket.on('message', function (msg) {
        
        // log the message
        console.log('Message sent: ' + msg);

        console.log(server);
        console.log(socket);

        // // loop through all the clients and send message
        // for(var i=0; i < server.clientsCount; i++){

        //     // send the message to all clients
            socket.send(msg);

        // }

    });

    // on connection close
    socket.on('close', function () {
        console.log('Client left: ' + server.clientsCount);
    });

});