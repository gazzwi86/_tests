var APP = {

    // setup the web socket
    socket: io.connect('http://gaz.local:3000'),
    video: null,
    canvas: null,
    ctx: null,
    imgData: null,
    interval: null,
    fps: 4000,
    newFrame: null,

    init: function (){

        // get elements
        APP.video = document.getElementById('myVideo');
        APP.canvas = document.getElementById('myCanvas');
        APP.ctx = APP.canvas.getContext('2d');

        // start app
        APP.main();

    },

    main: function(){

      // if we can get a webcam
      if(APP.hasGetUserMedia()){

          navigator.webkitGetUserMedia(
                  {video:true, audio:false},
                  APP.videoSuccess,
                  APP.videoError
              );

      } else {

          alert('Sorry, you do not have webcam access');
      }

      // draw video
      var i = 0;
      APP.interval = setInterval(function(){

        if(APP.newFrame){

          // darw the image to the canvas
          APP.ctx.drawImage(APP.video, 0, 0);

          // get the base64 image
          APP.imgData = APP.canvas.toDataURL('image/jpeg').replace('data:image/jpeg;base64,', '');
          
          // send the file in json format to the server
          var jsonData = JSON.stringify({imgData: APP.imgData, count: i});
          APP.socket.emit('update', jsonData);

          // clear previous frame
          APP.newFrame = null;

          // update the counter
          i++;

        }

      }, APP.fps);

      // if the server speak to us
      APP.socket.on('num_faces', function (data) {
        console.log(data.faces);
      });

      APP.socket.on('known_face', function (data) {
        console.log(data);
      });

    },

    hasGetUserMedia: function (){

      return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    },

    videoSuccess: function (stream){

      // set the video to stream
      setInterval(function(){
        
        APP.video.src = window.URL.createObjectURL(stream);
        APP.newFrame = stream;

        // set canvas size
        if(APP.canvas.width == '')
          APP.canvas.width = APP.video.width;

        if(APP.canvas.height == '')
          APP.canvas.height = APP.video.height;

      }, 1000/APP.fps);

    },

    videoError: function (err){
      alert('Error: ' + err);
    },

};

$(function (){ APP.init(); });