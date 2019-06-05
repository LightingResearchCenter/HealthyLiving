document.ready(function(){
  var img = $('#render');
  img.onload = function() {
      if(img.height > img.width) {
          img.height = '100%';
          img.width = 'auto';
      }
  };
});
