/* 
  Zepto fadeIn plugin 
  $(element).fadeIn(int);
*/
(function($){
  $.extend($.fn, {
    fadeIn: function(ms, easing, callback){

      if(typeof(ms) === 'undefined'){
        ms = 250;
      }

      if(typeof(easing) === 'undefined'){
        easing = 'linear';
      }

      $(this).css({
        display: 'block'
      }).animate({
        opacity: 1
      }, ms, easing, function (){

        if(typeof(callback) !== 'undefined'){
          callback();
        }

      });
      return this;
    }
  });
})(Zepto);