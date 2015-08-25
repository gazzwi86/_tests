var CB = {

    // include some scripts
    express: null,
    app: null,
    server: null,
    io: null,
    SerialPort: require('serialport').SerialPort,

    // set the serial port name
    portName: '/dev/tty.usbmodem1411',
    // store serial port class
    sp: null,

    init: function (){
        
        // include some scripts
        CB.express = require('express');
        CB.app = CB.express();
        CB.server = require('http').createServer(CB.app);
        CB.io = require('socket.io').listen(CB.server);

        CB.sp = new CB.SerialPort(CB.portName, {
           baudRate: 9600,
           dataBits: 8,
           parity: 'none',
           stopBits: 1,
           flowControl: false
        });

        // server
        CB.server.listen(3000, '127.0.0.1');

        // routing
        CB.routing();

        // connect the websocket
        CB.server.on('connection', function (socket) {

            // delay the main function
            setTimeout(function(){
                CB.main(socket);
            }, 150);

        });

    },

    // routing files
    routing: function (){
        
        // set directory to use for files prefixed with /library
        CB.app.use('/library', CB.express.static(__dirname + '/library/'));

        // index page
        CB.app.get('/', function (req, res){
            res.sendfile(__dirname + '/index.html');
        });

        // if video page
        CB.app.get('/video', function (req, res){
            res.sendfile(__dirname + '/video.html');
        });

        // if on webcam page
        CB.app.get('/webcam', function (req, res){
            res.sendfile(__dirname + '/webcam.html');
        });
        
    },

    main: function (socket){

        // let the user know they have connected
        var data = {
            data: 'welcome'
        };
        CB.io.sockets.emit('connected', data);

        // open the serial port
        console.log('Openning SP...');
        CB.sp.on('open', function () {
            
            console.log('open');

            // if we recieve an serial input    
            CB.sp.on('data', function(data) {
                data = parseInt(data);
                if(!isNaN(data)){
                    console.log('data received: ' + data);
                    CB.io.sockets.emit('put_down', {int: data});
                }
            });  
            
            // write to serial
            // CB.sp.write('ls\n', function(err, results) {
            //     console.log('err ' + err);
            //     console.log('results ' + results);
            
            // });
        });

    }

};

// run the script
CB.init();