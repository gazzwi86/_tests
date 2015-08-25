/* 
  Zepto fadeIn plugin 
  $(element).fadeIn(int);
*/
(function($){
  $.extend($.fn, {
    fadeOut: function(ms, easing, callback){

      if(typeof(ms) === 'undefined'){
        ms = 250;
      }
      
      if(typeof(easing) === 'undefined'){
        easing = 'linear';
      }

      $(this).animate({
        opacity: 0
      }, ms, easing, function (){

        if(typeof(callback) !== 'undefined'){
          callback();
        }
        
      });
      return this;
    }
  });
})(Zepto);