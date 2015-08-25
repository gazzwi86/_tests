/*
	Setup a server, RTC and face tracking

	Install opencv
		brew install opencv
	NPM
		https://www.npmjs.org/package/fs
		https://www.npmjs.org/package/express
		https://www.npmjs.org/package/socket.io
		https://www.npmjs.org/package/opencv
*/
var APP = {

	// include some scripts
	cv: require('opencv'),
	express: require('express'),
	fs: require("fs"),
	port: 3000,
	server: null,
	app: null,
	io: null,
	folder: '_tmp/',
	haar_cascade: './node_modules/opencv/data/haarcascade_frontalface_default.xml',

	init: function (){

		// connect stuff up
		APP.app = APP.express();
		APP.server = require('http').createServer(APP.app).listen(APP.port, '0.0.0.0');
		APP.io = require('socket.io').listen(APP.server);

		// http routing
		APP.routing();

		// connect the websocket
		APP.io.on('connection', function (socket){

			console.log('Server started on port ' + APP.port);

			APP.main(socket);

		});

	},

	// routing files
	routing: function (){
		
		// set directory to use for files prefixed with /library
		APP.app.use('/library', APP.express.static(__dirname + '/library'));

		// index page
		APP.app.get('/*', function (req, res){
			
			// get query
			// console.log(req.query);

			// get file
			res.sendfile(__dirname + '/' + req.route.params);

		});
		
	},

	main: function (socket){

		// on update message
		socket.on('update', function (data) {

			// get the data
			data = JSON.parse(data);
			
			// write the file to the disk
			var filename = 'file' + data.count + '.jpg';
			APP.fs.writeFile(APP.folder + filename, data.imgData, 'base64', function(err) {
				if(err)
					console.log(err);

				// analize image with open cv
				APP.cv.readImage(APP.folder + filename, function(err, im){
				
					// handle errors
					if(err)
						return err;
					
					// open file with open cv
					im.detectObject(APP.haar_cascade, {}, function(err, faces){
						
						// let the browser know the number of faces
						if(faces.length !== 0){
							APP.io.sockets.emit('num_faces', {'faces': faces.length});
						}

						// get the position of the faces
						for (var i=0;i < faces.length; i++){
							var face = faces[i];
							im.ellipse(face.x + face.width/2, face.y + face.height/2, face.width/2, face.height/2);
						}

						// delete file
						APP.fs.unlink(APP.folder + filename, function (err) {
							
							if(err)
								throw err;

							// log file deletion
							console.log('Deleted ' + filename);

						});

						// save the image with face circled
						im.save(APP.folder + '_' + filename);

					});

				});

			});

		});

	}

};

// run the script
APP.init();