/*
	Docs: 
		https://github.com/peter-murray/node-hue-api
		https://github.com/sreuter/node-speakable
*/

var APP = {
	hue: require("node-hue-api"),
	username: '10db979822e7747f25637148180b448f',
	HueApi: null,
	lightState: null,
	lights: [],
	rave: false,

	init: function (){

		// setup lightState class
		APP.lightState = APP.hue.lightState;

		// get the bridges
		APP.hue.locateBridges(function (err, bridge){
			
			APP.error(err, bridge, 'Bridges found: ');
			
			// connect to the bridge
			var host = bridge[0].ipaddress;
			APP.HueApi = new APP.hue.HueApi(host, APP.username);

			APP.deleteExtraUsers();

			APP.getFullState();

			setTimeout(function (){
				
				// turn off lights
				APP.turnOff();

				APP.main();

			}, 2000);

		});

	},

	main: function (){

		// APP.turnOn();

	},

	processWords: function (spokenWords){

		var light = '',
			color = [],
			state;

		console.log(spokenWords);

		// collect the key words
		for(var i = 0; i <= spokenWords.length; i++){
			
			// which light
			if(spokenWords[i] == 'left' || spokenWords[i] == 'less' || spokenWords[i] == 'let' || spokenWords[i] == 'let\'s' || spokenWords[i] == 'two'){
				light = 2;
			} else if(spokenWords[i] == 'right' || spokenWords[i] == 'write' || spokenWords[i] == 'one' || spokenWords[i] == 'what\'s on'){
				light = 1;
			}

			// what color
			if(spokenWords[i] == 'red' || spokenWords[i] == 'reed' || spokenWords[i] == 'read'){
				color[0] = 0;
				color[1] = 100;
			} else if(spokenWords[i] == 'green'){
				color[0] = 120;
				color[1] = 100;
			} else if(spokenWords[i] == 'blue'){
				color[0] = 240;
				color[1] = 100;
			} else if(spokenWords[i] == 'yellow'){
				color[0] = 60;
				color[1] = 100;
			} else if(spokenWords[i] == 'pink'){
				color[0] = 300;
				color[1] = 100;
			} else if(spokenWords[i] == 'white' || spokenWords[i] == 'wight'){
				color[0] = 500;
				color[1] = 10;
			}

			// brightness
			if(spokenWords[i] == 'loud' || spokenWords[i] == 'hard' || spokenWords[i] == 'intense'){
				color[2] = 100;
			} else if(spokenWords[i] == 'soft' || spokenWords[i] == 'gentle' || spokenWords[i] == 'pale' || spokenWords[i] == 'light' || spokenWords[i] == 'low' || spokenWords[i] == 'logo'){
				color[2] = 5;
			} else if(spokenWords[i] == 'normal'){
				color[2] = 50;
			}

			// on or off
			if(spokenWords[i] == 'on'){
				state = APP.lightState.create().on().hsl(color[0], color[1], color[2]);
			} else if(spokenWords[i] == 'off'){
				state = APP.lightState.create().off();
			}

			if(spokenWords[i] == 'rave'){
				APP.rave = true;
			}
		}

		if(APP.rave == false){
			
			// update the lights
			if(light == '1' || light == '2'){
				APP.updateState(light, state);
			} else {
				for(var i = 0; i < APP.lights.length; i++){
					APP.updateState(APP.lights[i], state);
				}
			}

		} else {

			var x = 0;
			var alertMe = setInterval(function (){
				
				if(x%2 == 0){

					var state = APP.lightState.create().on().hsl(0, 100, 0);
					for(var i = 0; i < APP.lights.length; i++){
						APP.updateState(APP.lights[i], state);
					}

				} else {
					
					var state = APP.lightState.create().on().hsl(0, 100, 100);
					for(var i = 0; i < APP.lights.length; i++){
						APP.updateState(APP.lights[i], state);
					}

				}

				if(x == 10){
					APP.turnOff();
					APP.rave = false;
					clearInterval(alertMe);
				}

				x++;

			}, 1000);

		}

	},

	updateState: function (light, state){
		
		APP.HueApi.setLightState(light, state, function (err, result){

			APP.error(err, result, 'Light off: ');

		});

	},

	turnOn: function (light){

		var state = APP.lightState.create().on().hsl(500, 10, 100);
		if(typeof(light) !== 'int'){
			for(var i = 0; i < APP.lights.length; i++){
				APP.updateState(APP.lights[i], state);
			}
		} else {
			APP.updateState(light, state);
		}

	},

	turnOff: function (light){
		
		var state = APP.lightState.create().off();
		if(typeof(light) !== 'int'){
			for(var i = 0; i < APP.lights.length; i++){
				APP.updateState(APP.lights[i], state);
			}
		} else {
			APP.updateState(light, state);
		}

	},

	getFullState: function (){

		APP.HueApi.getFullState(function(err, state) {

			APP.error(err, state, 'Full state: ');

			for(var k in state.lights){
				APP.lights.push(k);
			}

		});

	},

	deleteExtraUsers: function (){

		APP.HueApi.registeredUsers(function(err, deleted) {
			
			APP.error(err, deleted, 'Register users: ');

			// delete all users but the current
			for(var i = 0; i < deleted.devices.length; i++){
				
				var user = deleted.devices[i].username;
				if(deleted.devices[i].username !== APP.username){

					APP.HueApi.unregisterUser(user, function (err, user){
						APP.error(err, user, 'Deleted user: ');
					});

				}

			}

		});

	},

	error: function (err, data, msg){

		if(err){
			throw err;
		} else {
			// console.log(msg + JSON.stringify(data));
		}
	}

};

APP.init();

var Speakable = require('speakable');
var speakable = new Speakable({lang: 'en-GB'});

// speakable.on('speechStart', function() {
// 	console.log('onSpeechStart');
// });

// speakable.on('speechStop', function() {
// 	console.log('onSpeechStop');
// });

// speakable.on('speechReady', function() {
// 	console.log('onSpeechReady');
// });

speakable.on('error', function(err) {
	console.log('Error: ' + err);
	speakable.recordVoice();
});

speakable.on('speechResult', function(spokenWords) {

	APP.processWords(spokenWords);

	// start recording again
	speakable.recordVoice();

});

// begin recording
speakable.recordVoice();