$(document).ready(function(){

  function hideAllArticles(){
    $('.article-fundamentals').removeClass('d-inline-block');
    $('.article-manufacturers').removeClass('d-inline-block');
    $('.article-occupants').removeClass('d-inline-block');
    $('.article-office').removeClass('d-inline-block');
    $('.article-healthcare').removeClass('d-inline-block');
    $('.article-senior').removeClass('d-inline-block');
    $('.article-additional').removeClass('d-inline-block');
    $('.article-fundamentals').addClass('d-none');
    $('.article-manufacturers').addClass('d-none');
    $('.article-occupants').addClass('d-none');
    $('.article-office').addClass('d-none');
    $('.article-healthcare').addClass('d-none');
    $('.article-senior').addClass('d-none');
    $('.article-additional').addClass('d-none');
  }

  function smoothScroll(id, offset, hash){
    if (hash !== "") {
      $(id).animate({
        scrollTop: $(hash).position().top + $(id).scrollTop() + offset
      }, 1200, function(){
        window.location.hash = hash + offset;
      });
    }
  }

  $("a.section-link, a.segue").on('click', function(event) {
    event.preventDefault();
    smoothScroll('#content', 0, this.hash);
  });

  $("a.subsection-link").on('click', function(event) {
    event.preventDefault();
    smoothScroll('#content', -65, this.hash);
  });

  $("#backgroundButton").click(function(){
    if (!$("#fundamentals").hasClass("is-open")){
      $("#fundamentals div a").trigger("click");
    }
    $('html,body').animate({
      scrollTop: $('#content').offset().top - 67
    }, 1200);
  });

  // Scroll spy
  $('#content').scroll(function(e){
    var scroll = $('#content').position().top;
    $('[id^=section]').each(function(_, section) {
      var id = this.id;
      if($("#"+id).position().top < 0) {
        if ($(this).next().length > 0){
          var next_id = ($(this).next()[0]).id;
        }else{
          var next_id = $('article').last().attr('id');
        }
        if ($("#"+next_id).offset().top > window.innerHeight - 62){
          //TODO: remove active from others
          //$('a[href="#'+next_id+'"]').addClass('active');
          history.replaceState(undefined, undefined, '#' + id);

          if (id == 'section-lightingAndTheCircadianSystem'){
            $('#goodAnimation')[0].play();
            $('#badAnimation')[0].play();
          }else if ($('#section-lightingAndTheCircadianSystem').length != 0){
            $('#goodAnimation')[0].currentTime = 0;
            $('#goodAnimation')[0].pause();
            $('#badAnimation')[0].currentTime = 0;
            $('#badAnimation')[0].pause();
          }
        }
      }
    });
  });
  // Scroll spy

  $('#segueToManufacturers').on('click',function(){
    $('#manufacturers').trigger('click');
  });

  $('#fundamentals').on('click', function(){
    if($('#section-ourRole.d-inline-block').length == 0){
      hideAllArticles();
      $('.article-fundamentals').removeClass('d-none');
      $('.article-fundamentals').addClass('d-inline-block');
      var id = $('article').first().attr('id');
      $('#content').animate({
        scrollTop: 0
      }, 1200, function(){
        window.location.hash = '#'+id;
      });
    }
  });

  $('#manufacturers').on('click',function(){
    if($('#section-componentsOfCircadianDesign.d-inline-block').length == 0){
      hideAllArticles();
      $('.article-manufacturers').removeClass('d-none');
      $('.article-manufacturers').addClass('d-inline-block');
      var id = $('article').first().attr('id');
      $('#content').animate({
        scrollTop: $('#'+id).offset().top - 67
      }, 1200, function(){
        window.location.hash = '#'+id - 67;
      });
    }
  });

  $('#occupants').on('click',function(){
    if($('#section-personalLightingTechniques.d-inline-block').length == 0){
      hideAllArticles();
      $('.article-occupants').removeClass('d-none');
      $('.article-occupants').addClass('d-inline-block');
      var id = $('article').first().attr('id');
      $('#content').animate({
        scrollTop: $('#'+id).offset().top - 67
      }, 1200, function(){
        window.location.hash = '#'+id - 67;
      });
    }
  });

  $('[data-toggle="popover"]').popover();
  document.onclick = function(){
    $('[data-toggle="popover"]').popover();
  }
});
