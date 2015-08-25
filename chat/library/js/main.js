var CGB = {

    ws: new WebSocket("ws://localhost:3000/"),
    
    init: function (){

        // open a connection to the server
        CGB.ws.onopen = function() {
            console.log('Openned a connection');
        };

        // set up the buttons
        CGB.buttons();

    },

    buttons: function (){

        // when a message is submitted
        $('#message').click(function (){

            // get the message
            var message = $('#messageTxt').val();

            // send the message to the server
            CGB.ws.send(message);

            // clear the text
            $('#messageTxt').val('');

        });
        
        // close the connection
        $('#close').click(function (){

            CGB.ws.close();
            
        });

        // connection remotly closed
        CGB.ws.onclose = function() {
            console.log('Session closed');
        };
        
        // on message recieved
        CGB.ws.onmessage = function(msg) {
            
            console.log(msg.data);

        };

    }

};

$(function () { CGB.init(); });