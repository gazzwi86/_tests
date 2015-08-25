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
        display: 'block',
      }).animate({
        display: 'block',
        opacity: 1
      }, ms, easing, function (){

          $(this).show();
          $(this).css({
            opacity: 1
          });
          
          if(typeof(callback) !== 'undefined'){
            callback();
          }

      });
      return this;
    }
  });
})(Zepto);