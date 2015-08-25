var APP = {

    // setup the web socket
    socket: io.connect('http://gaz.local:8080'),

    init: function (){
        
        APP.socket.on('connected', function (data) {

            console.log('Connected: ' + data.data);
            APP.orientation();

            $('#button1').click(function(){
              var params = {'params': [-11, 11, 0]};
              APP.socket.emit('update', JSON.stringify(params));
            });
            $('#button2').click(function(){
              var params = {'params': [11, 11, 0]};
              APP.socket.emit('update', JSON.stringify(params));
            });

        });

    },

    orientation: function (){

        if (window.DeviceOrientationEvent) {
            
            document.getElementById("doEvent").innerHTML = "DeviceOrientation";

            // Listen for the deviceorientation event and handle the raw data
            window.addEventListener('deviceorientation', function(eventData) {
                
            document.getElementById("doEvent").innerHTML = "DeviceOrientation";
              // gamma is the left-to-right tilt in degrees, where right is positive
              var tiltLR = eventData.gamma;

              // beta is the front-to-back tilt in degrees, where front is positive
              var tiltFB = eventData.beta;

              // alpha is the compass direction the device is facing in degrees
              var dir = eventData.alpha;

              // call our orientation event handler
              APP.deviceOrientationHandler(tiltLR, tiltFB, dir);

              // set the app params
              var params = {'params': [tiltLR, tiltFB, dir]};
              APP.socket.emit('update', JSON.stringify(params));

            }, false);

        } else {
            
            document.getElementById("doEvent").innerHTML = "Not supported.";

        }

    },

    deviceOrientationHandler: function (tiltLR, tiltFB, dir){

        document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
        document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
        document.getElementById("doDirection").innerHTML = Math.round(dir);

        // Apply the transform to the image
        var logo = document.getElementById("imgLogo");
        logo.style.webkitTransform = "rotate("+ tiltLR +"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
        logo.style.MozTransform = "rotate("+ tiltLR +"deg)";
        logo.style.transform ="rotate("+ tiltLR +"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";

    }

};

$(function (){ APP.init(); });