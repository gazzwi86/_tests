
// require('newrelic');

// get libs
var codegen = require('echoprint-codegen'),
    echonest = require('echonest'),
    fs = require('fs'),
    LastfmAPI = require('lastfmapi');

// init
var myNest = new echonest.Echonest({
    api_key: 'A6CGUVFOPKR7BX0NC'
});

var lfm = new LastfmAPI({
    'api_key' : 'f1c77c49ae66456420543d03a6fc719f',
    'secret' : '8ea11ab4e30088f046674add4c93dd2a'
});

if(fs.existsSync('test.ogg')){

    // fingerprint the track
    codegen('test.ogg', function (err, data) {

        if(err)
            return console.error(err);
        
        // console.log(data); // {"metadata":{...}, "code_count": 4098, "code": "eJzFn..."}

        myNest.song.identify({
            query: JSON.stringify(data)
        }, function (error, response) {
            if (error) {
                console.log(error, response);
            } else {

                console.log(response.songs);
                if(response.songs[0]){
                    
                    console.log('Artist:', response.songs[0].artist_name);
                    console.log('Title:', response.songs[0].title);
                    var artists = response.songs[0].artist_name,
                        track = response.songs[0].title;

                    // see the whole response
                    // console.log('response:', response);

                    if(response.status.message == 'Success'){
                        lfm.track.getInfo({
                            'artist' : response.songs[0].artist_name,
                            'track' : response.songs[0].title
                        }, function (err, track) {
                            if(err)
                                throw err;
                            console.log(track);
                            console.log(track.toptags.tag);

                            for(i = 0; i < track.toptags.tag.length; i++){
                                console.log(track.toptags.tag[i].name);
                            }
                        });
                    }
                } else {
                    console.log(response);
                }
            }
        });

    });

} else {
    console.error('File does not exist');
}