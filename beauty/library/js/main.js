var CB = {

    // setup the web socket
    socket: io.connect('http://127.0.0.1:3000'),
    // set the path
    path: 'library/images/',
    // set the images
    images: ['nail1.jpg', 'nail2.jpg', 'nail3.jpg'],
    // set the element counter
    img: 0,
    // get webcam stuff
    video: null,
    ani: null,
    aniCtx: null,
    canvas: null,
    ctx: null,
    stream: null,
    colour: null,
    lastTime: 0,
    x: 150,
    y: 150,
    dx: 2,
    dy: 4,
    width: null,
    height: null,
    curColour: '#FF1C0A',
    radius: 30,

    nails: null,

    init: function (){

        // on click change the image
        if($('#change_img').length > 0){

            $('#change_img').click(function () {
                
                // add to element count
                CB.img++;
                
                // if we are back to the begining showthe first image
                if(CB.img > CB.images.length - 1){
                    CB.img = 0;
                }

                // change the image src
                $('#nails').attr('src', CB.path + CB.images[CB.img]);

            });

        }

        // if we are on a video page
        if($('#change_vid').length > 0){

            // on click change video time
            CB.nails = document.getElementById('nails');
            $('#change_vid').click(function () {
                
                CB.nails.currentTime += 10;

            });

            $('#one').click(function () {
                CB.nails.currentTime = 0;
            });
            $('#two').click(function () {
                CB.nails.currentTime = 60;
            });
            $('#three').click(function () {
                CB.nails.currentTime = 120;
            });

        }

        // if we are on the webcam page
        if($('#webcam').length > 0){
            
            // get the video & canvas elements
            CB.video = document.getElementById('webcam');
            CB.canvas = document.getElementById('canvas');
            CB.ctx = CB.canvas.getContext('2d');
            CB.ani = document.getElementById('ani');
            CB.aniCtx = CB.ani.getContext('2d');
            CB.stream = null;

            // get the width and height of the webcam stream
            $('#webcam').bind('loadedmetadata', function () {
                CB.canvas.width = this.videoWidth;
                CB.canvas.height = this.videoHeight;
            });

            // if we can get a webcam
            if (CB.hasGetUserMedia()) {

                // get the webcam
                // navigator.getUserMedia(
                navigator.webkitGetUserMedia(
                        {video:true, audio:false},
                        CB.videoSuccess,
                        CB.videoError
                    );

            } else {

                alert('Sorry, you do not have webcam access');

            }

            // if we have a stream
            setInterval(function (){
                CB.colour = CB.colourAvg();
                if(CB.colour != '#0'){
                    CB.curColour = CB.colour;
                }
            }, 40);

            // setup the animation
            CB.setupAni();
            
        }

        // recieve data
        CB.recieve();

    },

    // recieve data from the server
    recieve: function (){
        
        console.log('Connecting to the server...');

        // when we have connected to the server
        CB.socket.on('connected', function(data) {
            console.log(data.data);
        });

        // when we have a lipstick picked up
        CB.socket.on('put_down', function(data) {
            
            // console.log(data);
            if($('#change_img').length > 0){
                CB.changeImage(data);
            } else if($('#change_vid').length > 0){
                CB.changeVideo(data);
            }

        });

    },

    hasGetUserMedia: function (){
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia || navigator.msGetUserMedia);
    },

    // video success
    videoSuccess: function (strm){

        // write the content to the video element
        CB.video.src = window.URL.createObjectURL(strm);
        // setup stream for canvas
        CB.stream = strm;

    },

    // video error
    videoError: function (e){

        console.log(e);
        alert('Sorry, an error occured');

    },

    // get the average color
    colourAvg: function () {

        // set the canvas element
        if(CB.stream){
            CB.ctx.drawImage(CB.video, 0, 0);
        }

        var blockSize = 5, // only visit every 5 pixels
            defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
            data, width, height,
            i = -4,
            length,
            rgb = {r:0,g:0,b:0},
            count = 0;

        // if we have no canvas reurn default colour
        if(!CB.ctx){
            return defaultRGB;
        }

        // get the pixel data or reurn default
        try {
            data = CB.ctx.getImageData(0, 0, CB.canvas.width, CB.canvas.height);
        } catch(e) {
            /* security error, img on diff domain */
            return defaultRGB;
        }

        // get the length of the data
        length = data.data.length;

        // loop through pixels by pixel ratio
        while((i += blockSize * 4) < length){
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i+1];
            rgb.b += data.data[i+2];
        }

        // ~~ used to floor values
        rgb.r = ~~(rgb.r/count);
        rgb.g = ~~(rgb.g/count);
        rgb.b = ~~(rgb.b/count);

        // convert to hex
        rgb = parseInt(rgb.b) | (parseInt(rgb.g) << 8) | (parseInt(rgb.r) << 16);
        
        return '#' + rgb.toString(16);

    },

    changeImage: function (data){

        var date = (new Date).getTime();

        // if 5 seconds has passed since last time
        // if((CB.lastTime + 5000) < date){

            // check which we have a valid item
            console.log(data.int);
            switch (data.int){
                case 0:
                    $('#nails').attr('src', CB.path + CB.images[0]);
                break;
                case 18:
                    $('#nails').attr('src', CB.path + CB.images[1]);
                break;
                case 29:
                    $('#nails').attr('src', CB.path + CB.images[2]);
                break;
            }

            CB.lastTime = date;

        // }

    },

    changeVideo: function (data){

        var date = (new Date).getTime();

        // if 5 seconds has passed since last time
        if((CB.lastTime + 1000) < date){
            
            // check which we have a valid item
            console.log(data.int);
            switch (data.int){
                case 0:
                    CB.nails.currentTime = 0;
                break;
                case 18:
                    CB.nails.currentTime = 60;
                break;
                case 29:
                    CB.nails.currentTime = 120;
                break;
            }
            
            CB.lastTime = date;

        }

    },

    setupAni: function (){

        CB.width = CB.ani.width;
        CB.height = CB.ani.height;

        // create a loop
        setInterval(function (){

            // clear the previous data
            CB.aniCtx.clearRect(0, 0, CB.width, CB.height);

            // draw a circle
            CB.aniCtx.fillStyle = CB.curColour;
            CB.aniCtx.beginPath();
            CB.aniCtx.arc(CB.x, CB.y, CB.radius, 0, Math.PI*2, true); 
            CB.aniCtx.closePath();
            CB.aniCtx.fill();

            if(CB.x + CB.dx > CB.width || CB.x + CB.dx < 0){
                CB.dx = -CB.dx;
            }

            if(CB.y + CB.dy > CB.height || CB.y + CB.dy < 0){
                CB.dy = -CB.dy;
            }

            CB.x += CB.dx;
            CB.y += CB.dy;

        }, 10);
        
    }

};

$(function (){ CB.init(); });