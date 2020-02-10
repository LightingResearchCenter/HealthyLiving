function smoothScroll(id, offset1, offset2, hash, event){
  console.log(Math.abs($(hash).position().top - $(id).position().top));
  if (Math.abs($(hash).position().top - $(id).position().top) < 5000){
    if (hash !== "") {
      $(id).animate({
        scrollTop: $(hash).position().top + $(id).scrollTop() + offset1
      }, 1200, function(){
        window.location.hash = hash + offset2;
        history.replaceState(undefined, undefined, hash);
      });
    }
  }else{
    if (hash !== "") {
      event.preventDefault();
      $(id).scrollTop( $(hash).position().top + $(id).scrollTop() + offset1);
      window.location.hash = hash + offset2;
      history.replaceState(undefined, undefined, hash);
      $('#content').scrollTop($('#content').scrollTop());
    }
  }
}

$(document).ready(function(){
  if (!$("#fundamentals").hasClass("is-open")){
    $("#fundamentals div a").trigger("click");
  }

  // var location = window.location.href.split('#')[1];
  // if (location != undefined && location != 'section-ourRole'){
  // }

  $(".help-menu-list-item").click(function(){
    $(".help-menu-list-item").removeClass('active');
    $(this).addClass('active');
    var id = "#help-" + $(this).data('value');
    $(".help-section").addClass('d-none');
    $(id).removeClass('d-none');
    $(".help-body").scrollTop();
  });

  $('a.segue').on('click',function(event){
    smoothScroll('#content', 10, 1, $(this).attr('href'),event);
  });

  $("div.acnav__link--level2, div.acnav__label--level2").on('click', function(event) {
    smoothScroll('#content', 10, 1, $(this).find('a').attr('href'),event);
  });

  $("a.acnav__link--level2").on('click', function(event) {
    smoothScroll('#content', 10, 1, $(this).attr('href'),event);
  });

  $("a.subsection-link").on('click', function(event) {
    smoothScroll('#content', -67, 5, this.hash,event);
  });

  $("#backgroundButton").on('click', function(){
    $('html,body').animate({
      scrollTop: $('#content').offset().top - 67
    }, 1200);
  });

  // Scroll spy
  $('#content').scroll(function(e){
      var scroll = $('#content').position().top;
      var ids = [];
      $('[id^=section],[id^=subsection]').each(function(_, section) {
        var id = this.id;
        var check = 0;
        if (id.startsWith('sub')){
          check = 75;
        }

        if($("#"+id).position().top < check){
          var next_id;
          if ($(this).next().length > 0){
            next_id = ($(this).next()[0]).id;
          }else{
            next_id = $("#"+id).parent().parent().next('article').attr('id');
          }

          if ($("#"+next_id).offset().top > window.innerHeight){
            if(!$('a[href="#' + $("#"+id).parent().parent().attr('id') + '"]').parent().parent().hasClass('is-open')){
              var parent = $('a[href="#' + $("#"+id).parent().parent().attr('id') + '"]').parent().parent();
              var label = parent.children(":first");
              var list = label.siblings('.acnav__list');
              if (parent.prev().hasClass('is-open')){
                var prev_parent = parent.prev();
                var prev_label = prev_parent.children(":first");
                var prev_list = prev_label.siblings('.acnav__list');
                prev_list.slideUp('fast');
            		prev_parent.removeClass('is-open');
              }
              if(parent.next().hasClass('is-open')){
                var next_parent = parent.next();
                var next_label = next_parent.children(":first");
                var next_list = next_label.siblings('.acnav__list');
                next_list.slideUp('fast');
                next_parent.removeClass('is-open');
              }
              if($('a[href="#' + $("#"+id).next().attr('id') + '"]').parent().parent().hasClass('is-open')){
                var parent2 = $('a[href="#' + $("#"+id).next().attr('id') + '"]').parent().parent();
                var label2 = parent2.children(":first");
                var list2 = label2.siblings(".acnav__list");
                list2.slideUp('fast');
            		parent2.removeClass('is-open');
              }
              list.slideDown('fast');
          		parent.addClass('is-open');
            }

            if($("#content").scrollTop() + $("#content").innerHeight() >= $("#content")[0].scrollHeight) {
              $('.acnav__link').removeClass('active');
              if(!$('a[href="#'+id+'"]').hasClass('last')){
                if($('a[href="#'+id+'"]').hasClass('acnav__link--level3')){
                  $('a[href="#'+id+'"]').parent().parent().parent().next().find('a').addClass('active');
                }else if($('a[href="#'+id+'"]').hasClass('acnav__link--level2')){
                  $('a[href="#'+id+'"]').parent().parent().children('li').last().find('a').addClass('active');
                }else if($('a[href="#'+id+'"]').hasClass('section-link')){
                  $('a[href="#'+id+'"]').parent().parent().parent().children().last().find('a').addClass('active');
                }else{
                  $('a[href="#'+id+'"]').parent().next().find('a').addClass('active');
                }
              }
            }else{
              $('.acnav__link').removeClass('active');
              $('a[href="#'+id+'"]').addClass('active');
            }

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

  $('[data-toggle="popover"]').popover();
  document.onclick = function(){
    $('[data-toggle="popover"]').popover();
  };

  if(window.innerWidth < 768){
    $('#accordionCollapse').collapse("hide");
  }

  $(window).resize(function(){
    if(window.innerWidth > 768 && (!$('#accordionCollapse').is(':visible'))){
      $('#accordionCollapse').collapse("show");
    }
  });

});
