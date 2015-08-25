/*
	AKQA Test
	This is a test shopping basket that should display my ability to code to a suffcient standard.
*/

var APP = {
	url: 'basket.html',

	init: function (){

		// get by class name fallback
		if(!document.getElementsByClassName){
			document.getElementsByClassName=function(cn) {
				var allT=document.getElementsByTagName('*'), allCN=[], i=0, a;
				while(a=allT[i++]) {
					a.className==cn ? allCN[allCN.length]=a : null;
				}
				return allCN
			}
		}

		// setup the plus and minus buttons
		APP.amendQuantitiesBtns();

		// set up the input on change event
		APP.quantityChange();

		// set up the input on change event
		APP.trashBtns();

		// disable the buy now button
		var buy_now_btn = document.getElementsByClassName('buy_now_button');
		buy_now_btn[0].onclick = function (e){

			e.preventDefault();

			var total = document.getElementsByClassName('total')[0].innerHTML;
			if(total == 0.00) {
				alert('You have no items in your basket');
			} else {
				APP.ajaxPost();
			}
		}

	},

	// enable the amend quantities buttons
	amendQuantitiesBtns: function (){

		// get the elements and loop them
		var qtyUpBtns = document.getElementsByClassName('up'),
			qtyDownBtns = document.getElementsByClassName('down');
		for(i=0; i < qtyUpBtns.length; i++){
			
			// set up the up button
			qtyUpBtns[i].onclick = function (e){

				e.preventDefault();
				
				// get the elements and loop them class name
				var classes = this.className.split(' '),
					rgx = /item[0-9]{1,2}_qty/;
				for(i=0; i < classes.length; i++){

					// get url data and remove the item
					var test = rgx.test(classes[i]);
					if(test === true){
						
						var elm = document.getElementById(classes[i]),
							val = elm.value;
						
						if(val <= 9){
							elm.value = parseInt(val) + 1;
							elm.onchange();
						}

					}
				}

			};

			// set up the down button
			qtyDownBtns[i].onclick = function (e){

				e.preventDefault();
				
				// get the elements and loop them class name
				var classes = this.className.split(' '),
					rgx = /item[0-9]{1,2}_qty/;
				for(i=0; i < classes.length; i++){

					// get url data and remove the item
					var test = rgx.test(classes[i]);
					if(test === true){
						
						var elm = document.getElementById(classes[i]),
							val = elm.value;
						
						if(val > 0){
							elm.value = parseInt(val) - 1;
							elm.onchange();
						}

					}
				}

			};

		}

	},

	// update the quantity and totals on change
	quantityChange: function (){

		// get the elements and loop them
		var quantity = document.getElementsByClassName('quantity');
		for(i=0; i < quantity.length; i++){

			// on the update of the value
			quantity[i].onchange = function(e){

				var qty = this.value;
				if(qty > 10){
					this.value = 10;
					alert('There is a maximum of 10 items aloud. Sorry for the inconvenience.');
				}

				// update totals
				APP.updateTotals();

			}

		}

	},

	// enable the on click event of the trash buttons
	trashBtns: function (){
		
		// get the elements and loop them
		var trashBtns = document.getElementsByClassName('trash');
		for(i=0; i < trashBtns.length; i++){
			trashBtns[i].onclick = function(e){
				
				e.preventDefault();
				
				// get the elements and loop them class name and href
				var classes = this.className.split(' '),
					href = this.getAttribute('href');
				for(k=0; k < classes.length; k++){

					// get url data and remove the item
					if(classes[k] != 'trash' && classes[k].substr(0, 7) == 'remove_'){
						
						var id = classes[k].substr(7),
							elm = document.getElementById(id);

						// delete the item from the dom
						elm.parentNode.removeChild(elm);

						// update the totals
						APP.updateTotals();

					}
				}

			}
		}

	},

	// an ajax action for posting to the page
	ajaxPost: function (){
		
		// get the elements and loop them
		var json = Array(),
			elms = document.getElementsByClassName('quantity');
		for(i=0; i < elms.length; i++){

			// get the sku
			var classes = elms[i].className.split(' '),
				rgx = /sku[0-9]{4}/;
			for(k=0; k < classes.length; k++){

				// get url data and remove the item
				var test = rgx.test(classes[k]);
				if(test === true){
					json[i] = [classes[k].substr(3), elms[i].value];
				}
			}

		}


		// get the XMLHttpRequest object
		if(window.XMLHttpRequest){
			var req = new XMLHttpRequest();   
		} else {
			var req = new ActiveXObject("Microsoft.XMLHTTP");
		};

		// on success
		req.onreadystatechange = function(){
    		if (req.readyState === 4 && req.status === 200){
				alert('Updated basket complete');
			}
		}

		// send the request to our url
		req.open('POST', APP.url, true);
		req.send(JSON.stringify(json));
		
	},

	// a method for calculating and updatetine totals
	updateTotals: function (){

		// get the elements and loop them
		var price = document.getElementsByClassName('single_cost'),
			quantity = document.getElementsByClassName('quantity'),
			cost = document.getElementsByClassName('quantity_cost'),
			subtotal = 0,
			vat = 0,
			total = 0;

		for(i=0; i < price.length; i++){

			// update quantity cost and add to subtotal
			var single_cost = parseFloat(price[i].innerHTML),
				qty = parseInt(quantity[i].value),
				the_cost =  (single_cost * qty);
			
			the_cost = the_cost.toFixed(2);
			cost[i].innerHTML = the_cost;
			subtotal = (parseFloat(subtotal) + parseFloat(the_cost)).toFixed(2);
			
		}

		// vat is 20% on top
		vat = (subtotal / 100 * 20).toFixed(2);

		// create the total
		total = (parseFloat(subtotal) + parseFloat(vat)).toFixed(2);

		// update the totals
		document.getElementsByClassName('subtotal')[0].innerHTML = subtotal;
		document.getElementsByClassName('vat')[0].innerHTML = vat;
		document.getElementsByClassName('total')[0].innerHTML = total;

	}

};

APP.init();