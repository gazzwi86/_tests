/*
	Webserver
		Should use port 80 on production
		Mongo DB for database - http://docs.mongodb.org/manual/tutorial/
		Use pm2 to ensure it runs forever and load balanced

	NPM
		https://www.npmjs.org/package/fs
		https://www.npmjs.org/package/express
		https://www.npmjs.org/package/socket.io
*/

// server monitoring
require('newrelic');

var APP = {

	// include some scripts
	express: require('express'),
	mdb: require('mongodb'),
	fs: require("fs"),
	
	// setup
	port: 3000,
	dbUrl: 'mongodb://127.0.0.1:27017/test',

	// vars
	server: null,
	app: null,
	db: null,

	init: function (){

		// connect stuff up
		APP.app = APP.express();
		APP.server = require('http').createServer(APP.app).listen(APP.port, '0.0.0.0');

		// http routing
		APP.routing();

		// main method
		APP.main();

	},

	// open the db
	openDB: function (){

		APP.mdb.connect(APP.dbURL, function(err, db){

			if(err)
				throw err;

			APP.db = db;

		});

	},

	// close the db
	closeDB: function (){
		
		APP.db.close();

	},

	// insert a file to the db
	create: function (col, data){

		// open the db
		APP.openDB();

		var collection = APP.db.collection(col);
		collection.insert(data, function(err, docs){
			if(err){
				console.warn(err.message);
			} else {
				console.log('Successfully inserted record');
			}
		});

		// close the db
		APP.closeDB();

	},

	// insert a file to the db
	update: function (col, crit, data){

		// open the db
		APP.openDB();
  
		// example criteria
		// {key: value} // get something specific
		// {key: {$lt: value}} // Less Than
		// {key: {$gte: value}} // Greater than or equal to
		// {key: {$ne: 'value'}} // Not Equal To
		// {key: {$in: ['value', 'value', 'value']}} // Exists in array

		// updateoperators
		//   db.col.update({key: 'value'}, {$addToSet: {key: ['value']}});
		// Or we can add a new field to Cash
		//   db.col.update({key: 'value'}, {$set: {'age': 50} });
		// You can also push and pull items from arrays:
		//   db.col.update({key: 'value'}, {$push: {'key': 'value'} });
		//   db.col.update({key: 'value'}, {$pull: {'key': 'value'} });

		var collection = APP.db.collection(col);
		collection.update(crit, data, function (){
			if(err){
				console.warn(err.message);
			} else {
				console.log('Successfully updated record');
			}
		});

		// close the db
		APP.closeDB();

	},

	// find all in the db collection that match
	read: function (col, crit){

		// open the db
		APP.openDB();
  
		// example criteria
		// {key: value} // get something specific
		// {key: {$lt: 5}} // Less Than
		// {key: {$gte: 10}} // Greater than or equal to
		// {key: {$ne: 'b'}} // Not Equal To
		// {key: {$in: ['a', 'b', 'c']}} // Exists in array

		var collection = APP.db.collection(col);
		collection.find(crit).toArray(function(err, results) {
			if(err){
				console.warn(err.message);
			} else {
				console.log(results);
			}
		});

		// close the db
		APP.closeDB();

	},

	// find and delete from collection
	delete: function (col, crit){

		// open the db
		APP.openDB();
  
		// example criteria
		// {key: value} // get something specific
		// {key: {$lt: 5}} // Less Than
		// {key: {$gte: 10}} // Greater than or equal to
		// {key: {$ne: 'b'}} // Not Equal To
		// {key: {$in: ['a', 'b', 'c']}} // Exists in array

		var collection = APP.db.collection(col);
		collection.remove(crit);

		// close the db
		APP.closeDB();

	},

	// routing files
	routing: function (){

		// hide the engine creating the server
		APP.app.disable('x-powered-by');
		
		// set directory to use for files prefixed with /library
		APP.app.use('/library', APP.express.static(__dirname + '/library'));

		// index page
		APP.app.get('/*', function (req, res, next){

			// get query
			console.log(req.query);

			// get file
			res.sendfile(__dirname + '/' + req.route.params);

		});
		
	},

	main: function (){

	}

};

// run the script
APP.init();