var APP = {

    host: '10.0.1.2',
    path: '/api/newdeveloper/',
    date: 0,
    leftLight: false,
    rightLight: false,

    // include some scripts
    port: 8080,
    express: require('express'),
    http: require('http'),
    app: null,
    server: null,
    io: null,
    serialPort: require('serialport'),
    SerialPort: null,
    portName: '/dev/tty.usbmodem1411',
    sp: null,
    lastTime: 0,
    delay: 50,
    sensitivityL: -15,
    sensitivityR: 15,

    init: function (){
        
        // include some http server and socket stuff
        APP.app = APP.express();
        APP.server = APP.http.createServer(APP.app).listen(APP.port, '0.0.0.0');
        APP.io = require('socket.io').listen(APP.server);

        // connect to the arduino
        APP.SerialPort = APP.serialPort.SerialPort;
        APP.sp = new APP.SerialPort(APP.portName, {
            parser: APP.serialPort.parsers.readline("\r\n"),
            baudRate: 9600,
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            flowControl: false
        });

        // http routing
        APP.routing();
        
        // connect to the serial device
        APP.serialConnect();

        // connect the websocket
        APP.io.on('connection', function (socket) {

            console.log('Server started on port ' + APP.port);
            APP.main(socket);

        });

    },

    // routing files
    routing: function (){
        
        // set directory to use for files prefixed with /library
        APP.app.use('/library', APP.express.static(__dirname + '/library/'));

        // index page
        APP.app.get('/', function (req, res){
            res.sendfile(__dirname + '/index.html');
        });
        
    },

    serialConnect: function (){

        // open the serial port
        console.log('Openning serial port...');
        APP.sp.on('open', function () {
            console.log('Serial port open');
        });

        APP.sp.on('data', function(data) {

            // print the data to the nodes
            // console.log('data received: ' + data);
            // APP.io.sockets.emit('put_down', {int: data});

        });

    },

    main: function (socket){

        // let the user know they have connected
        var data = {
            data: 'Welcome'
        };
        APP.io.sockets.emit('connected', data);

        // detect updates
        socket.on('update', function (data) {

            // check sufficient time has passed since the last time
            APP.date = (new Date).getTime();
            if(APP.date > APP.lastTime + APP.delay){
            
                // console.log('Update: ' + data);

                // decode json
                data = JSON.parse(data);

                // ensure we have an int
                var theInt = parseInt(data.params[1]);
                
                // determine the direction
                var writeData = 0x00;
                if(theInt < APP.sensitivityL){
                    
                    writeData = 0x01;
                    APP.leftOn();

                } else if(theInt > APP.sensitivityR){
                    
                    writeData = 0x02;
                    APP.rightOn();

                }
                
                // swicth off lights
                if(writeData == 0x00){
                    APP.leftOff();
                    APP.rightOff();
                }

                // write to serial
                APP.sp.write(new Buffer([writeData]), function(err, results) {
                    // console.log('err ' + err);
                    // console.log('results ' + results);
                });

                // update the last time
                APP.lastTime = APP.date;

              }

        });

    },

    leftOn: function (){

        if(APP.leftLight === false){

            var options = {
              host: APP.host,
              port: 80,
              path: APP.path + 'lights/1/state',
              method: 'PUT'
            };

            var req = APP.http.request(options, function(res) {
              console.log('STATUS: ' + res.statusCode);
              console.log('HEADERS: ' + JSON.stringify(res.headers));
              res.setEncoding('utf8');
              res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
              });
            });

            req.on('error', function(e) {
              console.log('Problem with request: ' + e.message);
            });

            // write data to request body
            var data = '{"on":true}';
            req.write(data + '\n');
            req.end();

            APP.leftLight = true;
            
        }

    },

    rightOn: function (){
    
        if(APP.rightLight === false){
            
            var options = {
              host: APP.host,
              port: 80,
              path: APP.path + 'lights/2/state',
              method: 'PUT'
            };

            var req = APP.http.request(options, function(res) {
              console.log('STATUS: ' + res.statusCode);
              console.log('HEADERS: ' + JSON.stringify(res.headers));
              res.setEncoding('utf8');
              res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
              });
            });

            req.on('error', function(e) {
              console.log('Problem with request: ' + e.message);
            });

            // write data to request body
            var data = '{"on":true}';
            req.write(data + '\n');
            req.end();

            APP.rightLight = true;
            
        }

    },

    leftOff: function (){

        if(APP.leftLight === true){
        
            var options = {
              host: APP.host,
              port: 80,
              path: APP.path + 'lights/1/state',
              method: 'PUT'
            };

            var req = APP.http.request(options, function(res) {
              console.log('STATUS: ' + res.statusCode);
              console.log('HEADERS: ' + JSON.stringify(res.headers));
              res.setEncoding('utf8');
              res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
              });
            });

            req.on('error', function(e) {
              console.log('Problem with request: ' + e.message);
            });

            // write data to request body
            var data = '{"on":false}';
            req.write(data + '\n');
            req.end();

            APP.leftLight = false;
            
        }

    },

    rightOff: function (){

        if(APP.rightLight === true){
            
            var options = {
              host: APP.host,
              port: 80,
              path: APP.path + 'lights/2/state',
              method: 'PUT'
            };

            var req = APP.http.request(options, function(res) {
              console.log('STATUS: ' + res.statusCode);
              console.log('HEADERS: ' + JSON.stringify(res.headers));
              res.setEncoding('utf8');
              res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
              });
            });

            req.on('error', function(e) {
              console.log('Problem with request: ' + e.message);
            });

            // write data to request body
            var data = '{"on":false}';
            req.write(data + '\n');
            req.end();

            APP.rightLight = false;

        }

    }

};

// run the script
APP.init();