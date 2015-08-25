var APP = {

    // light stuff
    host: '10.0.1.3',
    path: '/api/newdeveloper/',
    date: 0,
    leftLight: false,
    rightLight: false,
    dayLight1: '{"on":true, "sat":175, "bri":200,"hue":8888}',
    dayLight2: '{"on":true, "sat":175, "bri":200,"hue":888}',
    eveLight1: '{"on":true, "sat":250, "bri":100,"hue":9999}',
    eveLight2: '{"on":true, "sat":200, "bri":100,"hue":5}',
    nightLight1: '{"on":true, "sat":0, "bri":100,"hue":9999}',
    nightLight2: '{"on":true, "sat":250, "bri":100,"hue":30323}',
    thunderLightOff: '{"on":false, "sat":250, "bri":10,"hue":10000}',
    thunderLight: '{"on":true, "sat":0, "bri":250,"hue":10000, "alert":"select"}',
    thunderPlaying: false,
    time: 12,
    lastLightTime: 0,
    lightDelay: 2000,

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

                // update time
                APP.time = data.params[3];

                if(APP.date > APP.lastLightTime + APP.lightDelay){
                    
                    // determine the light
                    if(APP.time > 21 || APP.time <= 5){
                        APP.leftOn(APP.nightLight1);
                        APP.rightOn(APP.nightLight2);
                    } else if(APP.time >= 9 && APP.time <= 18){
                        APP.leftOn(APP.dayLight1);
                        APP.rightOn(APP.dayLight2);
                    } else {
                        APP.leftOn(APP.eveLight1);
                        APP.rightOn(APP.eveLight2);
                    }

                    // update the last light update time
                    APP.lastLightTime = APP.date;

                  }


                // ensure we have an int
                var theInt = parseInt(data.params[1]);
                
                // determine the direction
                var writeData = 0x00;
                if(theInt < APP.sensitivityL){
                    writeData = 0x01;
                } else if(theInt > APP.sensitivityR){
                    writeData = 0x02;
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

        // detect thunder
        socket.on('thunder', function (data) {
            APP.thunder();
        });

    },

    leftOn: function (data){

        var options = {
          host: APP.host,
          port: 80,
          path: APP.path + 'lights/1/state',
          method: 'PUT'
        };

        var req = APP.http.request(options, function(res) {
          // console.log('STATUS: ' + res.statusCode);
          // console.log('HEADERS: ' + JSON.stringify(res.headers));
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
            // console.log('BODY: ' + chunk);
          });
        });

        req.on('error', function(e) {
          // console.log('Problem with request: ' + e.message);
        });

        // write data to request body
        req.write(data + '\n');
        req.end();

        APP.leftLight = true;

    },

    rightOn: function (data){
    
        var options = {
          host: APP.host,
          port: 80,
          path: APP.path + 'lights/2/state',
          method: 'PUT'
        };

        var req = APP.http.request(options, function(res) {
          // console.log('STATUS: ' + res.statusCode);
          // console.log('HEADERS: ' + JSON.stringify(res.headers));
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
            // console.log('BODY: ' + chunk);
          });
        });

        req.on('error', function(e) {
          // console.log('Problem with request: ' + e.message);
        });

        // write data to request body
        req.write(data + '\n');
        req.end();

        APP.rightLight = true;

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
              // console.log('STATUS: ' + res.statusCode);
              // console.log('HEADERS: ' + JSON.stringify(res.headers));
              res.setEncoding('utf8');
              res.on('data', function (chunk) {
                // console.log('BODY: ' + chunk);
              });
            });

            req.on('error', function(e) {
              // console.log('Problem with request: ' + e.message);
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
              // console.log('STATUS: ' + res.statusCode);
              // console.log('HEADERS: ' + JSON.stringify(res.headers));
              res.setEncoding('utf8');
              res.on('data', function (chunk) {
                // console.log('BODY: ' + chunk);
              });
            });

            req.on('error', function(e) {
              // console.log('Problem with request: ' + e.message);
            });

            // write data to request body
            var data = '{"on":false}';
            req.write(data + '\n');
            req.end();

            APP.rightLight = false;

        }

    },

    thunder: function (){

        APP.leftOn(APP.thunderLightOff);
        APP.rightOn(APP.thunderLightOff);

        // turn off
        setTimeout(function (){

            APP.leftOn(APP.thunderLight);
            APP.rightOn(APP.thunderLight);

            // turn off
            setTimeout(function (){

                APP.leftOff();
                APP.rightOff();

                // turn off
                setTimeout(function (){

                    // determine the light
                    if(APP.time > 21 || APP.time <= 5){
                        APP.leftOn(APP.nightLight1);
                        APP.rightOn(APP.nightLight2);
                    } else if(APP.time >= 9 && APP.time <= 18){
                        APP.leftOn(APP.dayLight1);
                        APP.rightOn(APP.dayLight2);
                    } else {
                        APP.leftOn(APP.eveLight1);
                        APP.rightOn(APP.eveLight2);
                    }

                }, 1500); // return to norm


            }, 1000); // return to norm

        }, 2000); // return to norm

    },

};

// run the script
APP.init();