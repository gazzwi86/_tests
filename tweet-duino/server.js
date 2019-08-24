var five = require('johnny-five');  
var Twit = require('twit');

var sanFrancisco = ['-122.75', '36.8', '-121.75', '37.8']
var board = new five.Board();  
var t = new Twit({
  consumer_key: '',
  consumer_secret: '',
  access_token: '',
  access_token_secret: '',
  timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests. 
});
var stream = t.stream('statuses/filter', {
  // follow: 'gazzwi86,grandtourists',
  track: 'travel',
  locations: sanFrancisco,
});

board.on('ready', function() {  
   console.log('Ready!');  
   var led = new five.Led(13);
   
   stream.on('tweet', function (tweet) {
     led.on();

     setTimeout(function() {
       led.off();
     }, 500);
   })
});

stream.on('error', function (error) {
  console.log(error);
});

stream.on('limitation', function (error) {
  console.log(error);
});

// t.get('statuses/home_timeline', function (err, reply) {
//   if (err)
//     return console.log('err', err)

//   console.log('reply', reply)
// });