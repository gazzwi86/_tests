var FG = {

    // include some scripts
    express: null,
    app: null,
    server: null,
    io: null,
    serialPort: require('serialport'),
    SerialPort: null,

    // set the serial port name
    portName: '/dev/tty.usbmodem1411',
    // store serial port class
    sp: null,

    down: true,

    init: function (){
        
        // include some scripts
        FG.SerialPort = FG.serialPort.SerialPort;
        FG.express = require('express');
        FG.app = FG.express();
        FG.server = require('http').createServer(FG.app);
        FG.io = require('socket.io').listen(FG.server);

        // connect to the arduino
        FG.sp = new FG.SerialPort(FG.portName, {
            parser: FG.serialPort.parsers.readline("\r\n"),
            baudRate: 9600,
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            flowControl: false
        });

        // http routing
        FG.routing();

        // connect the websocket
        FG.server.listen(3000, '127.0.0.1');

        // delay the main function
        setTimeout(function(){
            FG.main();
        }, 150);

    },

    // routing files
    routing: function (){
        
        // set directory to use for files prefixed with /library
        FG.app.use('/library', FG.express.static(__dirname + '/library/'));

        // index page
        FG.app.get('/', function (req, res){
            res.sendfile(__dirname + '/index.html');
        });
        
    },

    main: function (){

        // let the user know they have connected
        var data = {
            data: 'Welcome'
        };
        FG.io.sockets.emit('connected', data);

        // open the serial port
        console.log('Openning serial port...');
        FG.sp.on('open', function () {
            
            // if we recieve an serial input
            console.log('Serial port open');
            FG.sp.on('data', function(data) {

                // make sure the data is numeric
                data = parseInt(data);
                if(!isNaN(data)){

                    // if were set to down and it was up
                    if(FG.down === false && data > 4){
                        
                        FG.down = true;
                        FG.io.sockets.emit('down', {'int': 1});

                    // if were set to up and it was down
                    } else if(FG.down === true && data === 0){

                        FG.down = false;
                        FG.io.sockets.emit('up', {'int': 1});

                    }

                }
            });  
            
            // write to serial
            // FG.sp.write('ls\n', function(err, results) {
            //     console.log('err ' + err);
            //     console.log('results ' + results);    
            // });

        });

    }

};

// run the script
FG.init();