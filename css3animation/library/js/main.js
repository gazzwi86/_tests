var APP = {

	// changeable variables
	socket: io.connect('http://gaz.local:3000'),
	gaid: '',
	emptyTag: '000000000000',
	timerSpeed: 250,
	demoDelay: 67500,
	slideSpeed: 1500,
	slideDistance: 340,
	slideDuration: 750,
	fadeSpeed: 750,
	inactiveOverlayOpacity: 0.6,
	overlayFade: 750,
	slideBoxUpDelay: 5000,
	slideBoxUpBy: 45,
	shadesInTime: 5000,
	bouncePause: 2000,
	bounceDistance: 6,
	bounceSpeed: 500,
	lastBounce: 0,
	buttonSlideOut: 1000,
	buttonSlideIn: 1500,
	dotsSpeedOut: 1000,
	dotsSpeedIn: 1500,
	carouselBtnDelay: 10000,
	boxSpeedOut: 1000,
	boxSpeedMin: 500,
	boxSpeedIn: 1000,
	inactiveSlideDown: 1000,
	demoSlidesIntSpeed: 8000,
	demoSlides: ['library/images/h1/h1.jpg', 'library/images/h2/h2.jpg', 'library/images/h3/h3.jpg'],
	nailPolishDistance: 112,
	nailPolishAniSpeed: 1000,
	nailPolishReset: 92,
	downArrowDistance: 313,
	downArrowAniSpeed: 1000,
	downArrowReset: 303,

	// app controled variables
	lastInteraction: (new Date).getTime(),
	tags: null,
	fingers: [null, null, null, null, null],
	currentFingers: [null, null, null, null, null],
	tonePicked: false,
	handsMoving: false,
	slideBox: [null,null,null,null,null],
	slideBoxUpSet: [null,null,null,null,null],
	shadesIn: false,
	demoing: false,
	_gaq: null,
	carouselBtnsIn: true,
	demoSlideInt: null,
	totalNails: 0,
	firstStart: true,
	minimising: false,
	minimised: null,
	bounceShadeTimeout1: null,
	bounceShadeTimeout2: null,
	bounceShadeTimeout3: null,
	bounceShadeTimeout4: null,
	bounceShadeTimeout5: null,
	bounceTimeout1: null,
	bounceTimeout2: null,
	fullHand: false,
	demoAni1: null,
	demoAni2: null,
	demoAni3: null,
	demoSlidesAni: null,

	// analytics
	aStartTime: 0,
	aEndTime: 0,
	aToneTaps: 0,
	aToneSwipes: 0,
	aToneChanges: 0,
	aColourCount: 0,
	aCleanStart: false,
	aFirstPosition: null,
	aFirstColour: null,
	aMoreThanOneColour: false,
	aShadeFirst: false,
	aShadeThenTone: false,

	// analytics helpers
	intType: '',
	firstChange: false,
	shadeToneFirst: false,

	// elements
	elDots: $('#dots'),
	elLeftBtn: $('#leftBtn'),
	elRightBtn: $('#rightBtn'),
	elSlide: $('.slide'),
	elFinger: $('.finger'),
	elDemo: $('#demo'),
	elDemoImages: $('#demoImages img'),
	elDemoImagesCont: $('#demoImages'),
	elNailPolish: $('#nailPolish'),
	elDownArrow: $('#downArrow'),

	// app constructor
    init: function(){
        
        this.bindEvents();

    },

    // Bind Event Listeners
    bindEvents: function(){
        
        document.addEventListener('deviceready', this.onDeviceReady, false);

    },

    // deviceready Event Handler
    onDeviceReady: function(){

		// set up analytics
		APP._gaq = _gaq || [];
		_gaq.push(['_setAccount', APP.gaid]);
		_gaq.push(['_setDomainName', 'none']);
		_gaq.push(['_trackPageview', 'index']);

		// get the tags
		APP.setTags();
		
		// start recieving data from the server
		// APP.recieveData();

		// setup the carousel and its buttons
		APP.carosuel();

		// set up buttons and interactions
		APP.userInteractions();

		// start the timed events interval
		// APP.startTimer();

		APP.socket.on('put_down', function(data){
			APP.fingers = data.fingers;
			// console.log(APP.fingers);
			APP.trayCheck();
		});

		// set the analytics start time
		APP.aStartTime = (new Date).getTime();

		// start demo mode
		// APP.demoMode();

		// if we have empty tray set analytics
		APP.emptyTray();

    },

    // get all the rfid tags data
	setTags: function (){
		
		console.log('getTags');

		APP.tags = {
			'KKK222222222': {'src': 'c1', 'colour': '#ffd1a2', 'code': 'No. 100', 'name': 'Nude Beige'},
			'KKK222222222': {'src': 'c2', 'colour': '#fcd0b5', 'code': 'No. 101', 'name': 'Nude Pink'},
			'KKK222222222': {'src': 'c3', 'colour': '#fdc1af', 'code': 'No. 102', 'name': 'English Rose'},
			'KKK222222222': {'src': 'c4', 'colour': '#dab8b4', 'code': 'No. 103', 'name': 'Ash Rose'},
			'KKK222222222': {'src': 'c5', 'colour': '#edcea3', 'code': 'No. 104', 'name': 'Stone'},
			'KKK222222222': {'src': 'c6', 'colour': '#b89976', 'code': 'No. 105', 'name': 'Mink'},
			'KKK222222222': {'src': 'c7', 'colour': '#e2dbab', 'code': 'No. 106', 'name': 'Dark Trench'},
			'KKK222222222': {'src': 'c8', 'colour': '#000000', 'code': 'No. 107', 'name': 'Light Gold'},
			'6C009678A220': {'src': 'c9', 'colour': '#8d8573', 'code': 'No. 200', 'name': 'Steel Grey'},
			'6C00963EAF6B': {'src': 'c10', 'colour': '#484645', 'code': 'No. 201', 'name': 'Graphite'},
			'KKK222222222': {'src': 'c11', 'colour': '#5d4729', 'code': 'No. 202', 'name': 'Metalic Khaki'},
			'KKK222222222': {'src': 'c12', 'colour': '#5e5e66', 'code': 'No. 203', 'name': 'Storm Grey'},
			'6C0096510CA7': {'src': 'c13', 'colour': '#6e5f39', 'code': 'No. 204', 'name': 'Khaki'},
			'6C0096A3F5AC': {'src': 'c14', 'colour': '#000000', 'code': 'No. 299', 'name': 'Poppy Black'},
			'6C0096942D43': {'src': 'c15', 'colour': '#d20000', 'code': 'No. 300', 'name': 'Military Red'},
			'6C009653F158': {'src': 'c16', 'colour': '#e21616', 'code': 'No. 301', 'name': 'Poppy Red'},
			'6C0096A2F0A8': {'src': 'c17', 'colour': '#8d0524', 'code': 'No. 302', 'name': 'Lacquer Red'},
			'6C00965C09AF': {'src': 'c18', 'colour': '#63021e', 'code': 'No. 303', 'name': 'Oxblood'}
		};

		// set current finger states for start up
		APP.currentFingers[0] = APP.emptyTag;
		APP.currentFingers[1] = APP.emptyTag;
		APP.currentFingers[2] = APP.emptyTag;
		APP.currentFingers[3] = APP.emptyTag;
		APP.currentFingers[4] = APP.emptyTag;

	},

	// recieve data from the server
	recieveData: function (){
		
		console.log('recieveData');
		
		// when we have a lipstick picked up


	},



	// setup the carousel and its buttons
	carosuel: function (){

		console.log('carosuel');

		// carousel btns
		APP.elLeftBtn.on('tap', function (){
			if(APP.handsMoving === false){
				APP.carousel.prev();
				APP.intType = 'tap';
			}
		});
		APP.elRightBtn.on('tap', function (){
			if(APP.handsMoving === false){
				APP.carousel.next();
				APP.intType = 'tap';
			}
		});

		// set up hand swipe
		APP.carousel = new Swipe(document.getElementById('hands'), {
			startSlide:			0,
			speed:				APP.slideSpeed,
			auto:				0,
			continuous:			true,
			disableScroll:		false,
			stopPropagation:	false,
			slideDuration:		APP.slideDuration,
			slideDistance:		APP.slideDistance,
			callback: function(i, el) {
				
				// set hand to moving
				APP.handsMoving = true;

				// add classes
				$('#hands .active').removeClass('active');
				$(el).addClass('active');

				// loop through the slides
				$.each(APP.elSlide, function (index, item){
					
					// if we have the active slide
					if($(item).hasClass('active')){
						
						// fade out the inactive overlay
						$(el).children('.inactiveOverlay').fadeOut(APP.overlayFade);

					} else {
						
						// fade in the inactive overlay
						$(item).children('.inactiveOverlay').css({
							display: 'block',
							opacity: 0
						}).animate({
							opacity: APP.inactiveOverlayOpacity
						}, APP.overlayFade);

					}
				});

			},
			transitionEnd: function(i, el) {
				
				// update analytics for taps
				if(APP.intType === 'tap'){
					APP.aToneTaps++;
				} else {
					APP.aToneSwipes++;
				}

				// reset interaction type
				APP.intType = '';

				// set hand moving to false
				APP.handsMoving = false;

				// update the active dot
				$('#dots ul li.active').removeClass('active');
				$('.dot' + i).addClass('active');
				
				// update the most recent interaction
				APP.lastInteraction = (new Date).getTime();

				// update the tone changes
				APP.aToneChanges++;

				// if we have not yet selected a shade
				if(APP.shadeToneFirst === false){
					APP.shadeToneFirst = true;
				} else {
					APP.aShadeThenTone = true;
				}

			}
		});

	},

	// set up any swipe or tap events
	userInteractions: function (){

		console.log('userInteractions');

		// stop demo mode
		APP.elSlide.on('tap', function (){
			
			// the user is still active update last interaction
			APP.lastInteraction = (new Date).getTime();

			// bring in the hand arrows
			APP.bringInCarouselBtns();

		});

		// set up exit button
		APP.elDemo.on('tap', function (){
			APP.exitDemo();
		});

		// click colour info
		$('#colour0').on('tap', function (){
			APP.colourButtonAction(0);
		});

		$('#colour1').on('tap', function (){
			APP.colourButtonAction(1);
		});

		$('#colour2').on('tap', function (){
			APP.colourButtonAction(2);
		});

		$('#colour3').on('tap', function (){
			APP.colourButtonAction(3);
		});

		$('#colour4').on('tap', function (){
			APP.colourButtonAction(4);
		});

	},

	// exit demo mode action
	exitDemo: function (){

		console.log('exitDemo');
		
		// set demo mode to false and fade out button
		APP.demoing = false;

		// set last interaction time
		APP.lastInteraction = (new Date).getTime();

		// fade out the exit demo mode screen
		APP.elDemo.fadeOut(APP.fadeSpeed);

		// after the above
		setTimeout(function (){
			
			// slide in the dots
			APP.elDots.animate({
				'bottom': 29
			}, APP.dotsSpeedIn);

			// bring in the car btns
			APP.bringInCarouselBtns();
		
			// set current finger states for start up
			APP.currentFingers[0] = APP.emptyTag;
			APP.currentFingers[1] = APP.emptyTag;
			APP.currentFingers[2] = APP.emptyTag;
			APP.currentFingers[3] = APP.emptyTag;
			APP.currentFingers[4] = APP.emptyTag;

			// hide the video and exit button so we can swipe again
			APP.elDemo.hide();

		}, APP.fadeSpeed);

		// clear other animations
		clearTimeout(APP.demoSlideInt);
		clearTimeout(APP.demoAni1);
		clearTimeout(APP.demoAni2);
		clearTimeout(APP.demoAni3);
		clearTimeout(APP.demoSlidesAni);
		delete APP.demoSlideInt;
		delete APP.demoAni1;
		delete APP.demoAni2;
		delete APP.demoAni3;
		delete APP.demoSlidesAni;

		// set the analytics start time
		APP.aStartTime = (new Date).getTime();

		// if we have empty tray set analytics
		APP.emptyTray();

	},

	// when colour information is clicked
	colourButtonAction: function (i){

		console.log('colourButtonAction');

		if($('#colour' + i).hasClass('active') === true){

			// clear old timeout
			clearTimeout(APP.slideBox[i]);
			delete APP.slideBox[i];

			// start bounce animation
			$('#colour' + i).animate({
				'margin-top': 0
			}, APP.fadeSpeed);
			$('#colourCode' + i).fadeIn(APP.fadeSpeed);

			APP.slideBox[i] = setTimeout(function (){

				// animate the box up
				$('#colour' + i).animate({
					'margin-top': -APP.slideBoxUpBy
				}, APP.fadeSpeed);
				$('#colourCode' + i).fadeOut(APP.fadeSpeed);

			}, APP.slideBoxUpDelay);

		}

	},

	// timed events
	startTimer: function (){

		// console.log('startTimer');

		// check for timed events
		setTimeout(function (){

			// get the time
			var date = (new Date).getTime();
			
			// check if the tray has updated
			APP.trayCheck();

			// remove the carousel buttons
			if(APP.demoing === false && APP.carouselBtnsIn === true && (date - APP.lastInteraction) >= APP.carouselBtnDelay){
				APP.removeCarouselBtns();
			}

			// check for last interaction vs demo time
			if(APP.demoing === false && (date - APP.lastInteraction) >= APP.demoDelay){
				APP.demoMode();
			}

			// check for last interaction vs shades in time
			if(APP.demoing === false && APP.shadesIn === false && APP.carouselBtnsIn === false && (date - APP.lastInteraction) >= APP.shadesInTime && (date - APP.lastBounce) >= APP.shadesInTime && APP.minimising === false && (APP.minimised === null || (date - APP.minimised) >= APP.shadesInTime)){
				
				// fade in the inactive shades
				APP.fadeInInactiveShades();

				// wait for the inactive shades to fade in
				APP.bounceShadeTimeout1 = setTimeout(function (){
				
					// bounce the shades
					APP.bounceShades();

					APP.bounceShadeTimeout2 = setTimeout(function (){
						// bounce the shades
						APP.bounceShades();
					}, APP.bounceSpeed * 10);

					APP.bounceShadeTimeout3 = setTimeout(function (){
						// bounce the shades
						APP.bounceShades();
					}, APP.bounceSpeed * 20);

					APP.bounceShadeTimeout4 = setTimeout(function (){
			
						// fade out the shades
						$('#shades .inactive').fadeOut(APP.fadeSpeed);

						APP.bounceShadeTimeout5 = setTimeout(function (){
	
							$('#shades .inactive').css({'margin-top': -(APP.slideBoxUpBy*2)});
	
							// update shades state
							APP.shadesIn = false;

							// update shades state
							APP.lastBounce = (new Date).getTime();

						}, APP.fadeSpeed);

					}, (APP.bounceSpeed * 30));

				}, APP.bouncePause);

			}

			// run the function again
			APP.startTimer();

		}, APP.timerSpeed);

	},

	// check whats in the tray
	trayCheck: function (){

		// console.log('trayCheck');

		// loop through the fingers
		APP.totalNails = 0;
		for(i = 0; i < 5; i++){

			// if we have tray that is not empty & if the tag exists
			var obj = APP.fingers[i];
			if(APP.fingers[i] !== null && APP.fingers[i] !== APP.emptyTag && typeof APP.tags[obj] === 'object'){

				// update the total nails
				APP.totalNails++;

			}

		}

		var newInteraction = false;
		for(i = 0; i < 5; i++){

			// if the tray has changed
			var obj = APP.fingers[i];
			if(APP.fingers[i] !== null && APP.fingers[i] !== APP.currentFingers[i]){

				// if we have a new tag
				if(APP.fingers[i] !== APP.emptyTag && typeof APP.tags[obj] === 'object'){

					// update the current finger state
					APP.currentFingers[i] = APP.fingers[i];

					// notify we have a new interaction
					newInteraction = true;

					// if demoing then exit demo
					if(APP.demoing === true){
						APP.exitDemo();
					}
					
					// fade in the finger
					if(APP.totalNails === 1){
						APP.fadeInAllFingers(i, obj);
					} else {
						APP.fadeInFinger(i, obj);
					}

					// update analytics for new colour
					APP.aColourCount++;

					// see if we have a new item
					if(APP.firstChange === false){

						var obj = APP.fingers[i];
						APP.aFirstColour = APP.tags[obj].name;
						APP.aFirstPosition = i;
						APP.firstChange = true;

						// if tone has not been edited set shadefirst to true
						if(APP.shadeToneFirst === false){
							APP.aShadeFirst = true;
						}

					} else {

						APP.aMoreThanOneColour = true;

					}

				// if we have an empty tag
				} else if(APP.demoing === false && APP.fingers[i] === APP.emptyTag){
		
					// update the current finger state
					APP.currentFingers[i] = APP.fingers[i];

					// remove the shade data
					APP.removeFinger(i);

					// fade in the finger
					if(APP.totalNails === 1){
						APP.fadeInAllFingers(null, null);
					}

					// notify we have a new interaction
					newInteraction = true;

				}
			}

		}

		// if we have a new finger
		if(APP.demoing === false && newInteraction === true){
			
			// this is an interaction, update interaction time
			APP.lastInteraction = (new Date).getTime();
			
			// fade out the inactive shades
			APP.fadeOutInactiveShades();

			// check how many nail varnishes have been placed down
			if(APP.totalNails === 0){

				// fade out the old nail
				APP.elFinger.fadeOut(APP.fadeSpeed);

			}

			// if tone not picked it is now now picked
			if(APP.tonePicked === false){
				
				// update the tone picked state
				APP.tonePicked = true;

				// fade out the left and right buttons
				if(APP.carouselBtnsIn === true){
					APP.removeCarouselBtns();
				}
					
			}

		}

	},

	// fade in required finger
	fadeInFinger: function (i, obj){

		console.log('fadeInFinger');

		// if a full hand is showing
		if(APP.fullHand === true){

			// fade out the other fingers if they are empty
			for(k = 0; k < 5; k++){
				if(APP.currentFingers[k] === APP.emptyTag){
					$('.finger' + k).fadeOut(APP.fadeSpeed);
				}
			}

			APP.fullHand = false;

		}

		// fade out the old nail
		$('.finger' + i).fadeOut(APP.fadeSpeed);

		// after the above setup the shade data
		setTimeout(function (){

			// fade new finger
			$.each($('.finger' + i), function (index, item){
				var path = $(item).attr('src').substring(0,18);
				console.log(path);
				$(item)
					.attr('src', path + APP.tags[obj].src + '/f' + i + '.png')
					.fadeIn(APP.fadeSpeed);
			});

			// bring in the shade data
			APP.shadeData(i, obj);

		}, APP.fadeSpeed);

	},

	// fade in all fingers if we have one
	fadeInAllFingers: function (i, obj){
		
		console.log('fadeInAllFingers');

		// set full hand to true
		APP.fullHand = true;

		var dontAnimateShades = false;
		if(i === null){

			dontAnimateShades = true;

			// fade out the other fingers if they are empty
			for(i = 0; i < 5; i++){
				if(APP.currentFingers[i] !== APP.emptyTag){
					break;
				}
			}

		}
		
		// set the tag object
		var obj = APP.fingers[i];

		// loop through each nail and if not active nail fade out
		for(k = 0; k < 5; k++){
			if(k !== i){
				$('.finger' + k).fadeOut(APP.fadeSpeed)
			}
		}

		// fade in
		setTimeout(function (){
			
			for(k = 0; k < 5; k++){

				if(dontAnimateShades === false){
					
					// fade new finger
					var path = $('.finger' + k).attr('src').substring(0,18);
					console.log(path);
					$('.finger' + k)
						.attr('src', path + APP.tags[obj].src + '/f' + k + '.png')
						.fadeIn(APP.fadeSpeed);

					// bring in the shade data
					APP.shadeData(i, obj);

				} else if(k !== i){
					
					// fade new finger
					var path = $('.finger' + k).attr('src').substring(0,18);
					console.log(path);
					$('.finger' + k)
						.attr('src', path + APP.tags[obj].src + '/f' + k + '.png')
						.fadeIn(APP.fadeSpeed);

				}

			}

		}, APP.fadeSpeed);


		// tidy up code
		delete path, obj;

	},

	// bring in shade data
	shadeData: function (i, obj){

		console.log('shadeData');
		
		// set minimising to true
		APP.minimising = true;

		// update shade data
		$('#colourCode' + i).html(APP.tags[obj].code);
		$('#colourName' + i).html(APP.tags[obj].name);

		// fade new shade in
		$('#colour' + i)
			.removeClass('inactive')
			.addClass('active')
			.css({'margin-top': -(APP.slideBoxUpBy*2), 'background-color': APP.tags[obj].colour, 'opacity': 1})
			.animate({
				'margin-top': 0
			}, APP.boxSpeedIn);
		
		// set the box to slide up
		APP.slideBoxUpSet[i] = (new Date).getTime();
		APP.slideBox[i] = setTimeout(function (){

			// animate the box up
			$('#colour' + i).animate({
				'margin-top': -APP.slideBoxUpBy
			}, APP.boxSpeedMin);

			// wait for the animation to stop
			setTimeout(function (){
	
				// update the time minimised
				APP.minimised = (new Date).getTime();
				
				// set minimising to false
				APP.minimising = false;
	
			}, APP.boxSpeedMin);

		}, APP.slideBoxUpDelay);

	},

	// update the shade data
	removeFinger: function (i){

		console.log('removeFinger');

		// fade out the required finger and data
		$('.finger' + i).fadeOut(APP.fadeSpeed);
		$('#colour' + i).animate({
			'margin-top': -(APP.slideBoxUpBy*2)
		}, APP.boxSpeedOut);

		// add inactive class and remove the data
		setTimeout(function (){
			
			$('#colourCode' + i).html('');
			$('#colourName' + i).html('');
			$('#colour' + i)
				.css({'background-color': 'transparent'})
				.removeClass('active')
				.addClass('inactive');

			// if the box is set to slide up
			if(APP.slideBoxUpSet[i] !== null){

				// clear the slide up action
				APP.slideBoxUpSet[i] = null;
				clearTimeout(APP.slideBox[i]);
				delete APP.slideBox[i];

			}

		}, APP.boxSpeedOut);

	},

	// remove the carousel buttons
	removeCarouselBtns: function (){

		console.log('removeCarouselBtns');

		// set buttons to out
		APP.carouselBtnsIn = false;

		// slide out the carousel buttons
		APP.elLeftBtn.animate({
			'left': -52
		}, APP.buttonSlideOut, 'ease-in-out');
		APP.elRightBtn.animate({
			'right': -52
		}, APP.buttonSlideOut, 'ease-in-out');

		// update last interaction
		APP.lastInteraction = (new Date).getTime();

	},

	// bring in the carousel buttons
	bringInCarouselBtns: function (){

		console.log('removeCarouselBtns');

		// set buttons to in
		APP.carouselBtnsIn = true;

		// slide out the carousel buttons
		APP.elLeftBtn.animate({
			'left': 20
		}, APP.buttonSlideIn, 'ease-in-out');
		APP.elRightBtn.animate({
			'right': 20
		}, APP.buttonSlideIn, 'ease-in-out');

	},

	// fade out the inactive shades
	fadeOutInactiveShades: function (){
		
		console.log('fadeOutInactiveShades');

		// update shades state
		APP.shadesIn = false;

		// clear timeouts
		clearTimeout(APP.bounceShadeTimeout1);
		clearTimeout(APP.bounceShadeTimeout2);
		clearTimeout(APP.bounceShadeTimeout3);
		clearTimeout(APP.bounceShadeTimeout4);
		clearTimeout(APP.bounceShadeTimeout5);
		clearTimeout(APP.bounceTimeout1);
		clearTimeout(APP.bounceTimeout2);
		delete APP.bounceShadeTimeout1;
		delete APP.bounceShadeTimeout2;
		delete APP.bounceShadeTimeout3;
		delete APP.bounceShadeTimeout4;
		delete APP.bounceShadeTimeout5;
		delete APP.bounceTimeout1;
		delete APP.bounceTimeout2;
		
		// fade out inactive shades
		$('#shades .inactive').animate({
			'margin-top': -(APP.slideBoxUpBy*2)
		}, APP.boxSpeedIn);

	},

	// fade in the inactive shades
	fadeInInactiveShades: function (){
		
		console.log('fadeInInactiveShades');

		// update shades state
		APP.shadesIn = true;

		// fade in inactive shades
		$('#shades .inactive').css({'opacity': 1});
		$('#shades .inactive').animate({
			'margin-top': 0
		}, APP.boxSpeedOut);

	},

	// bounce the shades to highlight interaction
	bounceShades: function (){

		console.log('bounceShades');

		// start bounce animation
		$('#shades .inactive').animate({
			'margin-top': -APP.bounceDistance
		}, APP.bounceSpeed, 'ease-in-out', function(){
			
			$('#shades .inactive').animate({
				'margin-top': 0
			}, APP.bounceSpeed, 'ease-in-out');

		});

		APP.bounceTimeout1 = setTimeout(function (){

			$('#shades .inactive').animate({
				'margin-top': -APP.bounceDistance
			}, APP.bounceSpeed, 'ease-in-out', function(){
				
				$('#shades .inactive').animate({
					'margin-top': 0
				}, APP.bounceSpeed, 'ease-in-out');

			});

		}, (APP.bounceSpeed * 2));

		APP.bounceTimeout2 = setTimeout(function (){

			$('#shades .inactive').animate({
				'margin-top': -APP.bounceDistance
			}, APP.bounceSpeed, 'ease-in-out', function (){
				
				$('#shades .inactive').animate({
					'margin-top': 0
				}, APP.bounceSpeed, 'ease-in-out');

			});

		}, (APP.bounceSpeed * 4));

	},

	// start demo mode
	demoMode: function (){

		console.log('startDemo');

		// set demo mode to on
		APP.demoing = true;

		// set interacting state to true
		APP.tonePicked = false;
		
		// remove shade data and fingers
		for(i = 0; i < 5; i++){
			APP.removeFinger(i);
			APP.elFinger.fadeOut(APP.fadeSpeed);
		}

		// remove carousel buttons
		APP.removeCarouselBtns();

		// remove the inactive shades
		APP.fadeOutInactiveShades();
		
		// slide out the dots
		APP.elDots.animate({
			'bottom': -47
		}, APP.dotsSpeedOut, 'ease-in-out');

		// fade in the exit demo screen and video
		APP.elDemo.fadeIn(APP.fadeSpeed);

		// set the demo slideshow interval
		APP.demoAni(APP.elDemoImages.length);

		// send analytics if not first start
		if(APP.firstStart === true){
			APP.firstStart = false;
		} else {
			APP.analytics();
		}

	},

	// animations in demo mode
	demoAni: function (k){

		console.log('demoAni');

		APP.demoSlideInt = setInterval(function (){

			// start the nail polish animaton
			APP.elNailPolish.animate({
				'top': APP.nailPolishDistance
			}, APP.nailPolishAniSpeed, 'ease-in-out');

			APP.elDownArrow.animate({
				'top': APP.downArrowDistance
			}, APP.downArrowAniSpeed, 'ease-in-out');

			APP.demoAni1 = setTimeout(function (){
				
				APP.elNailPolish.animate({
					'top': APP.nailPolishReset
				}, APP.nailPolishAniSpeed, 'ease-in-out');

				APP.elDownArrow.animate({
					'top': APP.downArrowReset
				}, APP.downArrowAniSpeed, 'ease-in-out');

			}, APP.nailPolishAniSpeed);

			// start the nail polish animaton
			APP.demoAni2 = setTimeout(function (){
					
				APP.elNailPolish.animate({
					'top': APP.nailPolishDistance
				}, APP.nailPolishAniSpeed, 'ease-in-out');

				APP.elDownArrow.animate({
					'top': APP.downArrowDistance
				}, APP.downArrowAniSpeed, 'ease-in-out');

				APP.demoAni3 = setTimeout(function (){
					
					APP.elNailPolish.animate({
						'top': APP.nailPolishReset
					}, APP.nailPolishAniSpeed, 'ease-in-out');

					APP.elDownArrow.animate({
						'top': APP.downArrowReset
					}, APP.downArrowAniSpeed, 'ease-in-out');

				}, APP.nailPolishAniSpeed);
			
			}, APP.nailPolishAniSpeed * 2);
		
			APP.demoSlidesAni = setTimeout(function (){

				// loop through images
				for(i = 0; i < APP.elDemoImages.length; i++){
					
					// set the element selector
					if(k === 0){
						k = APP.elDemoImages.length;
					}
					k--;

					// fade out the slide
					$('#demoSlide' + k).fadeOut(APP.fadeSpeed);
					
					// move the slide to the start
					// setTimeout(function(){
					// 	$('#demoSlide' + k).prependTo(APP.elDemoImagesCont).fadeIn(APP.fadeSpeed);
					// }, APP.fadeSpeed);

					break;

				}

			}, APP.nailPolishAniSpeed * 6);

			APP.demoAni();

		}, APP.demoSlidesIntSpeed);

	},

	// send the analytics
	analytics: function (){
		
		// set the analytics end time
		APP.aEndTime = (new Date).getTime();

		console.log('aStartTime: ' + APP.aStartTime);
		console.log('aCleanStart: ' + APP.aCleanStart);
		console.log('aShadeFirst: ' + APP.aShadeFirst);
		console.log('aShadeThenTone: ' + APP.aShadeThenTone);
		console.log('aToneTaps: ' + APP.aToneTaps);
		console.log('aToneSwipes: ' + APP.aToneSwipes);
		console.log('aToneChanges: ' + APP.aToneChanges);
		console.log('aFirstPosition: ' + APP.aFirstPosition);
		console.log('aFirstColour: ' + APP.aFirstColour);
		console.log('aColourCount: ' + APP.aColourCount);
		console.log('aMoreThanOneColour: ' + APP.aMoreThanOneColour);
		console.log('aEndTime: ' + APP.aEndTime);

		// session length
		APP._gaq.push(['Session', 'Session length', '', (APP.aEndTime - APP.aStartTime)]);
		APP._gaq.push(['Session', 'Clean start', '', APP.aCleanStart]);
		APP._gaq.push(['Interaction', 'Shade first', '', APP.aShadeFirst]);
		APP._gaq.push(['Interaction', 'Shade then tone', '', APP.aShadeThenTone]);
		APP._gaq.push(['Interaction', 'Tone taps', '', APP.aToneTaps]);
		APP._gaq.push(['Interaction', 'Tone swipes', '', APP.aToneSwipes]);
		APP._gaq.push(['Interaction', 'Tone changes', '', APP.aToneChanges]);
		APP._gaq.push(['Interaction', 'First position', '', APP.aFirstPosition]);
		APP._gaq.push(['Interaction', 'First colour', '', APP.aFirstColour]);
		APP._gaq.push(['Interaction', 'More than one colour', '', APP.aMoreThanOneColour]);
		APP._gaq.push(['Interaction', 'Colour count', '', APP.aColourCount]);
		

		// reset the analytics variables
		APP.aStartTime = 0;
		APP.aCleanStart = false;
		APP.aShadeFirst = false;
		APP.aShadeThenTone = false;
		APP.aToneTaps = 0;
		APP.aToneSwipes = 0;
		APP.aToneChanges = 0;
		APP.aFirstPosition = null;
		APP.aFirstColour = null;
		APP.aColourCount = 0;
		APP.aMoreThanOneColour = false;
		APP.aEndTime = 0;
		APP.intType = '';
		APP.firstChange = false;
		APP.shadeToneFirst = false;

	},

	// check if the tray is empty and update analytics data
	emptyTray: function (){
		
		if(APP.currentFingers[0] === APP.emptyTag && APP.currentFingers[1] === APP.emptyTag && APP.currentFingers[2] === APP.emptyTag && APP.currentFingers[3] === APP.emptyTag && APP.currentFingers[4] === APP.emptyTag){
			APP.aCleanStart = true;
		}

	}

};

$(function (){ APP.init(); });