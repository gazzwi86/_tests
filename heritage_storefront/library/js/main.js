var APP = {

  debug: true,
  iPad: navigator.userAgent.match(/iPad/i),
  sceneTime: (new Date()).getHours(),
  lastTimeChange: (new Date()).getTime(),
  timeDelay: 500,
  lastTsChange: (new Date()).getTime(),
  tsDelay: 100,

  threeSixtyCount: 1,

  // carousel stuff
  currentSkyline: 0,
  skylines: null,
  viewWidth: null,
  skylinesWidth: null,

  // setup the web socket
  socket: io.connect('http://gaz.local:8080'),

  init: function (){
      
      // when connected to web socket
      APP.socket.on('connected', function (data) {
        
        // console.log('Connected: ' + data.data);

        // setup the parallax
        var scene1 = document.getElementById('scene1');
        var sceneP1 = new Parallax(scene1);

        // start tracking iPad orientation
        if(APP.iPad !== null){
          APP.orientation();
        }

        // set up the carousel
        APP.carousel();

        // set the right scene
        APP.toggleScene();
        
        // setup audio buttons
        APP.audio();

      });

  },

  orientation: function (){

    // check orientation services are enabled
    if (window.DeviceOrientationEvent) {
        
      document.getElementById("doEvent").innerHTML = "DeviceOrientation";

      // Listen for the deviceorientation event and handle the raw data
      window.addEventListener('deviceorientation', function(eventData) {
          
        document.getElementById("doEvent").innerHTML = "DeviceOrientation";
        
        // in degrees positive being up or right
        var tiltLR = eventData.gamma,
            tiltFB = eventData.beta,
            dir = eventData.alpha;

        // call our orientation event handler
        APP.deviceOrientationHandler(tiltLR, tiltFB, dir);

      }, false);

    } else {
      document.getElementById("doEvent").innerHTML = "Not supported.";
    }

  },

  deviceOrientationHandler: function (tiltLR, tiltFB, dir){

      // in debug mode
      if(APP.debug === true){
        document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
        document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
        document.getElementById("doDirection").innerHTML = Math.round(dir);
        document.getElementById("time").innerHTML = Math.round(APP.sceneTime);
      }

      // set the app params
      var data = new Array();
      data[0] = tiltLR;
      data[1] = tiltFB;
      data[2] = dir;
      data[3] = APP.sceneTime;
      var params = {'params': data};
      APP.socket.emit('update', JSON.stringify(params));
      
      // add a delay
      var date = (new Date).getTime();
      if(date > APP.lastTimeChange + APP.timeDelay){
        // update the time
        if(Math.round(tiltLR) < -15){
          
          APP.sceneTime++;

          // remember 24 hour clock
          if(APP.sceneTime > 24)
            APP.sceneTime = 1;

        } else if(Math.round(tiltLR) > 15){
          
          APP.sceneTime--;

          // remember 24 hour clock
          if(APP.sceneTime < 1)
            APP.sceneTime = 24;

        }

        // show relevant scene
        APP.toggleScene();

        // update time
        APP.lastTimeChange = date;
      }

      // three sixty retation
      if(date > APP.lastTsChange + APP.tsDelay){
        
        // update the time
        if(Math.round(tiltFB) > 15){
          
          APP.threeSixtyNext();

        } else if(Math.round(tiltFB) < -15){
          
          APP.threeSixtyPrev();

        }

        APP.lastTsChange = date;
      }

  },

  carousel: function (){

    // setup carousel
    APP.skylines = $('#skylines li').length;
    APP.viewWidth = $('#main').width();
    APP.skylinesWidth = APP.viewWidth + (APP.viewWidth * $('.skyline').length);
    $('#skylines').width(APP.skylinesWidth);

    // put last item at the start
    $('#skylines').prepend($('#skylines .skyline:last-child'));
    $('#skylines').css('left', '-' + APP.viewWidth + 'px');

    // prev pressed
    $('#skylines').on('swipeLeft', function () {
      APP.carouselLeft();
    });

    // next pressed
    $('#skylines').on('swipeRight', function () {
      APP.carouselRight();
    });

  },

  carouselLeft: function (){
    
    // update the current hand
    if(APP.currentSkyline === ($('.skyline').length - 1)){
      APP.currentSkyline = 0;
    } else {
      APP.currentSkyline++;
    }
    
    // animate to the new hand
    $('#skylines').animate({
      left: (parseInt($('#skylines').css('left')) - APP.viewWidth)
    }, 1000, 'linear', function() {
      $('#skylines').append($('#skylines .skyline:first-child'));
      $('#skylines').css('left', '-' + APP.viewWidth + 'px');
    });

  },

  carouselRight: function (){
        
    // update the current hand
    if(APP.currentSkyline === 0){
        APP.currentSkyline = ($('.skyline').length - 1);
    } else {
        APP.currentSkyline--;
    }

    // animate to the new hand
    $('#skylines').animate({
        left: (parseInt($('#skylines').css('left')) + APP.viewWidth)
    }, APP.slideSpeed, 'linear', function() {
        $('#skylines').prepend($('#skylines .skyline:last-child'));
        $('#skylines').css('left', '-' + APP.viewWidth + 'px');
    });

  },

  toggleScene: function(){

    // show relevant scene
    if(APP.sceneTime > 22 || APP.sceneTime <= 2){

      if($('#scene1 .layer1 img').attr('src') !== 'library/images/b6.png'){
        $('#scene1 .layer1 img').attr('src', 'library/images/b6.png');
        $('#scene1 .layer2 img').attr('src', 'library/images/m6.png');
        $('#scene1 .layer3 img').attr('src', 'library/images/f6.png');
      }

    } else if(APP.sceneTime > 2 && APP.sceneTime <= 6){

      if($('#scene1 .layer1 img').attr('src') !== 'library/images/b5.png'){
        $('#scene1 .layer1 img').attr('src', 'library/images/b5.png');
        $('#scene1 .layer2 img').attr('src', 'library/images/m5.png');
        $('#scene1 .layer3 img').attr('src', 'library/images/f5.png');
      }
    
    } else if(APP.sceneTime > 6 && APP.sceneTime <= 10){

      if($('#scene1 .layer1 img').attr('src') !== 'library/images/b4.png'){
        $('#scene1 .layer1 img').attr('src', 'library/images/b4.png');
        $('#scene1 .layer2 img').attr('src', 'library/images/m4.png');
        $('#scene1 .layer3 img').attr('src', 'library/images/f4.png');
      }

    } else if(APP.sceneTime > 10 && APP.sceneTime <= 14){

      if($('#scene1 .layer1 img').attr('src') !== 'library/images/b3.png'){
        $('#scene1 .layer1 img').attr('src', 'library/images/b3.png');
        $('#scene1 .layer2 img').attr('src', 'library/images/m3.png');
        $('#scene1 .layer3 img').attr('src', 'library/images/f3.png');
      }

    } else if(APP.sceneTime > 14 && APP.sceneTime <= 18){

      if($('#scene1 .layer1 img').attr('src') !== 'library/images/b2.png'){
        $('#scene1 .layer1 img').attr('src', 'library/images/b2.png');
        $('#scene1 .layer2 img').attr('src', 'library/images/m2.png');
        $('#scene1 .layer3 img').attr('src', 'library/images/f2.png');
      }

    } else if(APP.sceneTime > 18 && APP.sceneTime <= 22){

      if($('#scene1 .layer1 img').attr('src') !== 'library/images/b1.png'){
        $('#scene1 .layer1 img').attr('src', 'library/images/b1.png');
        $('#scene1 .layer2 img').attr('src', 'library/images/m1.png');
        $('#scene1 .layer3 img').attr('src', 'library/images/f1.png');
      }

    }

  },

  threeSixtyNext: function (){

    // set image count
    APP.threeSixtyCount--;
    if(APP.threeSixtyCount < 1)
      APP.threeSixtyCount = 8;

    // update image
    $('#threesixty img').attr('src', 'library/images/c' + APP.threeSixtyCount + '.png');

  },

  threeSixtyPrev: function (){

    // set image count
    APP.threeSixtyCount++;
    if(APP.threeSixtyCount > 8)
      APP.threeSixtyCount = 1;

    // update image
    $('#threesixty img').attr('src', 'library/images/c' + APP.threeSixtyCount + '.png');

  },

  audio: function (){

    var audio = $('#rainAudio').get(0),
        thunderClap = $('#thunderClap').get(0);
    $('#thunder').on('tap', function (){
      
      // play the rain if not
      if(audio.currentTime === 0)
        audio.play();

      // delay thunder in time with lights
      setTimeout(function (){
        // f not started or stopped play
        if(thunderClap.currentTime === 0 || thunderClap.ended === true){
          thunderClap.play();
          APP.socket.emit('thunder', {thunder: 'd'});
        }

      }, 1000);

    });

    // play / pause the rain
    $('#rain').on('tap', function (){

      // if playing pause
      if(audio.currentTime > 0){
        audio.pause();
        audio.currentTime = 0;
      } else {
        audio.play();
      }

    });

  }

};

$(function (){ APP.init(); });