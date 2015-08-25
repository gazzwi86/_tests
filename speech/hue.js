/*
	Docs:
		https://github.com/peter-murray/node-hue-api
*/

var APP = {
	hue: require("node-hue-api"),
	username: '10db979822e7747f25637148180b448f',
	HueApi: null,
	lightState: null,
	lights: [],

	init: function (){

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