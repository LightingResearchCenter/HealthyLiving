/*jshint esversion: 8 */
/*jshint -W030 */
/*jshint -W083 */
var refJSON;

// function smoothScroll(id, offset1, offset2, hash, event){
//   if (Math.abs($(hash).position().top - $(id).position().top) < 5000){
//     if (hash !== "") {
//       $(id).animate({
//         scrollTop: $(hash).position().top + $(id).scrollTop() + offset1
//       }, 1200, function(){
//         window.location.hash = hash + offset2;
//         history.replaceState(undefined, undefined, hash);
//       });
//     }
//   }else{
//     if (hash !== "") {
//       event.preventDefault();
//       $(id).scrollTop( $(hash).position().top + $(id).scrollTop() + offset1);
//       window.location.hash = hash + offset2;
//       history.replaceState(undefined, undefined, hash);
//       $('#content').scrollTop($('#content').scrollTop());
//     }
//   }
// }
function assignReferences(){
  console.log(refJSON);
  var id, count = 1;
  $('a.ref').each(function(ref){
    id = $(this).attr("data-refID");
    $(this).attr('data-toggle', 'tooltip');
    $(this).attr('data-html', 'true');
    $(this).attr('title', refJSON[id]);
    $(this).html('[' +count+']');
    count++;
  });
}
async function handleReferences(){
  await assignReferences();
  await $('[data-toggle="tooltip"]').tooltip();
}

$(document).ready(async function(){
  $.ajaxSetup({beforeSend: function(xhr){
    if (xhr.overrideMimeType){
      xhr.overrideMimeType("application/json");
    }
  }});

  await $.ajax({
    url: "json/references.json",
    async: false,
    dataType: 'json',
    success: function(result) {
      $.each(result,function(){
        refJSON = this;
      });
    }
  });

  handleReferences();

  if (!$("#fundamentals").hasClass("is-open")){
    $("#fundamentals div a").trigger("click");
  }

  $(".help-menu-list-item").click(function(){
    $(".help-menu-list-item").removeClass('active');
    $(this).addClass('active');
    var id = "#help-" + $(this).data('value');
    $(".help-section").addClass('d-none');
    $(id).removeClass('d-none');
    $(".help-body").scrollTop();
  });

  // $('a.segue').on('click',function(event){
  //   smoothScroll('#content', 10, 1, $(this).attr('href'),event);
  // });

  $("#backgroundButton").on('click', function(){
    $('html,body').animate({
      scrollTop: $('#content').offset().top - 67
    }, 1200);
  });

  $('#segueToManufacturers').on('click',function(){
    $('#manufacturers').trigger('click');
  });

  $('[data-toggle="tooltip"]').tooltip();

  if(window.innerWidth < 768){
    $('#accordionCollapse').collapse("hide");
  }

  $(window).resize(function(){
    if(window.innerWidth > 768 && (!$('#accordionCollapse').is(':visible'))){
      $('#accordionCollapse').collapse("show");
    }
  });


  //https://codepen.io/matthewcain/pen/ZepbeR
  var bTT = $('#backToTop');

  $(window).scroll(function() {
    if ($(window).scrollTop() > 300) {
      bTT.addClass('show');
    } else {
      bTT.removeClass('show');
    }
  });

  bTT.on('click', function(event) {
    event.preventDefault();
    accordionToTop();
    $('#content').scrollTop(0);
    $('html, body').animate({scrollTop:0}, '300');
  });

});
