/*
	Setup a server, RTC and face tracking and recognition

	Install opencv
		brew install opencv
	NPM
		https://www.npmjs.org/package/fs
		https://www.npmjs.org/package/express
		https://www.npmjs.org/package/socket.io
		https://www.npmjs.org/package/opencv
*/
var APP = {

	// include some libs
	express: require('express'),
	cv: require('opencv'),
	fs: require('fs'),
	em: require('easyimage'),

	// setup paths
	tmpFolder: '_tmp/',
	facesFolder: '_faces/',
	haar_cascade: './node_modules/opencv/data/haarcascade_frontalface_alt2.xml',

	// setup vars
	port: 3000,
	server: null,
	app: null,
	io: null,
	facerec: null,
	filename: null,
	tmpExt: '.jpg',
	ext: '.pgm',
	trainingData: [],
	faceWidth: 100,
	faceHeight: 100,

	init: function (){

		// connect stuff up
		APP.app = APP.express();
		APP.server = require('http').createServer(APP.app).listen(APP.port, '0.0.0.0');
		APP.io = require('socket.io').listen(APP.server);
		APP.facerec = APP.cv.FaceRecognizer.createLBPHFaceRecognizer();

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

			// console.log(data);

			// get the data
			data = JSON.parse(data);
			
			// update the filename
			APP.filename = (new Date()).getTime();

			// write the file to the disk
			var tmpFile = APP.tmpFolder + APP.filename + data.count + APP.tmpExt;
			APP.fs.writeFile(tmpFile, data.imgData, 'base64', function(err) {
				
				if(err)
					throw err;

				// analize image with open cv
				APP.cv.readImage(tmpFile, function(err, image){
				
					// handle errors
					if(err)
						throw err;
					
					// open file with open cv
					image.detectObject(APP.haar_cascade, {}, function(err, faces){
						
						// if we have faces
						if(faces.length !== 0){

							// loop through the faces
							for(var i=0;i < faces.length; i++){

								// if the face is big enough
								if(faces[i].width > APP.faceWidth && faces[i].height > APP.faceHeight){

									// let the browser know the number of faces
									APP.io.sockets.emit('num_faces', {'faces': faces.length});

									// covert to greyscale and save image
									var the_face = image.roi(faces[i].x, faces[i].y, faces[i].width, faces[i].height);
									the_face.convertGrayscale();
									the_face.save(tmpFile);

									// crop image and resize
									// setTimeout(function (){

										APP.em.resize({
											src: tmpFile,
											dst: tmpFile,
											width: APP.faceWidth,
										}, function(err, image){
											
											if (err)
												throw err;

											// if we have known faces see if we recognise it
											APP.processFace(tmpFile);

										});
									
									// }, 1500);

								}

							}

						} else {

							APP.deleteImg(tmpFile);

						}

					});

				});

			});

		});

	},

	processFace: function (file){
		
		APP.getTrainingData();
		if(APP.trainingData.length > 0){

			// open the image
			APP.cv.readImage(file, function(e, image){

				// train on available faces
				APP.facerec.trainSync(APP.trainingData);

				// recognise faces
				var face = APP.facerec.predictSync(image);

				if(face.id != -1 && face.confidence > 25){

					// console.log(face.id);
					// console.log(face.confidence);

					// notify we kow them
					APP.io.sockets.emit('known_face', face);

					// move the file to the user folder
					var dirs = APP.fs.readdirSync(APP.facesFolder + face.id);

					// move image to the new face
					var newFile = APP.facesFolder + face.id + '/' + (dirs.length) + APP.ext;
					APP.fs.rename(file, newFile, function (err){

						if(err)
							throw err;

						// log file move
						// console.log('Moved ' + file + ' to ' + newFile);

					});

				} else {

					APP.addNewFace(file);

				}

			});

		} else {
			
			APP.addNewFace(file);

		}

	},

	getTrainingData: function (){

		// reset the array
		APP.trainingData = [];

		// add the user to known faces
		var k = 0;
		var dirs = APP.fs.readdirSync(APP.facesFolder);
		for(var i = 0; i < dirs.length; i++){
			
			var is_dir = APP.fs.lstatSync(APP.facesFolder + dirs[i]).isDirectory();
			if(is_dir){

				// make the directory
				var faceDir = APP.facesFolder + k + '/';
				var faces = APP.fs.readdirSync(faceDir);
				for(var j = 0; j < faces.length; j++){
					APP.trainingData.push([k, faceDir + j + '.pgm' ]);
				}

				k++;
			}

		}

	},

	addNewFace: function (file){

		// add the user to known faces
		var k = 0,
		dirs = APP.fs.readdirSync(APP.facesFolder);
		for(var i = 0; i < dirs.length; i++){
			
			var is_dir = APP.fs.lstatSync(APP.facesFolder + dirs[i]).isDirectory();
			if(is_dir){
				k++;
			}

		}

		// make the directory
		var faceDir = APP.facesFolder + k + '/';
		APP.fs.mkdir(faceDir, function (err){

			if(err)
				throw err;

			// move image to the new face
			var newFile = faceDir + '0' + APP.ext;
			APP.fs.rename(file, newFile, function (err){

				if(err)
					throw err;

				// log file move
				console.log('Moved ' + file + ' to ' + newFile);

			});

		});

	},

	deleteImg: function (file){

		// delete file
		APP.fs.unlink(file, function (err) {
			
			if(err)
				throw err;

			// log file deletion
			console.log('Deleted ' + file);

		});

	}

};

// run the script
APP.init();