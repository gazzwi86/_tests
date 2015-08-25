var APP = {

  debug: true,

  images: 0,
  interval: null,
  fadeSpeed: 1500,
  intervalTime: 2500,

  down: true,
  video: null,

  // setup the web socket
  socket: io.connect('http://gaz.local:3000'),

  init: function (){
      
      // get video as var
      APP.video = $('#someVideo').get(0);

      // set up the slideshow
      APP.slideshow();

      // when connected to web socket
      APP.socket.on('connected', function (data) {
        
        if(APP.debug === true){
          console.log('Connected: ' + data.data);
        }

      });

      // if up
      APP.socket.on('up', function (data) {

        // if debugging
        if(APP.debug === true){
          console.log('Picked up');
        }

        // if was down
        if(APP.down === true){

          // set to up
          APP.down = false;

          $('#someVideo').fadeIn(APP.fadeSpeed, 'linear');
          APP.video.play();

        }

      });

      // if down
      APP.socket.on('down', function (data) {
        
        // if debugging
        if(APP.debug === true){
          console.log('Put down');
        }

        // if was up
        if(APP.down === false){

          // set to down
          APP.down = true;

          $('#someVideo').fadeOut(APP.fadeSpeed, 'linear', function (){
            APP.video.pause();
            APP.video.currentTime = 0;
          });
          
        }

      });

  },

  slideshow: function (){

    // setup slideshow
    APP.interval = setInterval(function (){

      // fade out the last image
      $('#slideshow img:last-child').fadeOut(APP.fadeSpeed, 'linear', function (){

        // move to the start
        $('#slideshow img:last-child').prependTo('#slideshow');

        // set it to visible
        $('#slideshow img:first-child').show();

      });

    }, APP.intervalTime);

  }

};

$(function (){ APP.init(); });