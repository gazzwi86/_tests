/*
	Docs: 
		https://github.com/sreuter/node-speakable
*/

var Speakable = require('speakable');
var speakable = new Speakable({lang: 'en-GB'});

speakable.on('speechStart', function() {
	console.log('onSpeechStart');
});

speakable.on('speechStop', function() {
	console.log('onSpeechStop');
});

speakable.on('speechReady', function() {
	console.log('onSpeechReady');
});

speakable.on('error', function(err) {
	console.log('Error: ' + err);
	speakable.recordVoice();
});

speakable.on('speechResult', function(spokenWords) {

	var trigger;
	for(var i = 0; i <= spokenWords.length; i++){

		if(spokenWords[i] == 'computer'){
			trigger = i;
		} else if(trigger !== '' && i > trigger){
			console.log(spokenWords[i]);
		}

	}
	
	// start recording again
	speakable.recordVoice();

});

// begin recording
speakable.recordVoice();