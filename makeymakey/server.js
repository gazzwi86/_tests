var keypress = require('keypress');

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
	
	// right action
	if(key && key.name === 'right'){
		console.log('Right');
	}

	// left action
	if(key && key.name === 'left'){
		console.log('Left');
	}
	
	// up action
	if(key && key.name === 'up'){
		console.log('Up');
	}

	// down action
	if(key && key.name === 'down'){
		console.log('Down');
	}

	// space action
	if(key && key.name === 'space'){
		console.log('Space');
	}

	// allow exit application
	if (key && key.ctrl && key.name === 'c') {
		process.stdin.pause();
	}

});

process.stdin.setRawMode(true);
process.stdin.resume();