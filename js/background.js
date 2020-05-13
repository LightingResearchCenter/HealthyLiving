/*jshint esversion: 8 */
/*jshint -W030 */
/*jshint -W083 */
var refJSON, glossaryJSON, references = {};

function ajaxWarning(){
  $.ajaxSetup({beforeSend: function(xhr){
    if (xhr.overrideMimeType){
      xhr.overrideMimeType("application/json");
    }
  }});
}

function getGlossaryJSON(){
  $.ajax({
    url: "json/glossary.json",
    async: false,
    dataType: 'json',
    success: function(result) {
      $.each(result,function(){
        glossaryJSON = this;
      });
    }
  });
}

function handleGlossary(){
  for (var id in glossaryJSON){
    var str = '';
    str += '<div class="row mb-4">';
    str += '  <div class="col-md-3">';
    str += '    <p class="glossaryTitle ">' +glossaryJSON[id].title+ '</p>';
    str += '  </div>';
    str += '  <div class="col-md-9">';
    str += '    <p class="">'+glossaryJSON[id].definition+'</p>';
    str += '  </div>';
    str += '</div>';
    $('#glossaryContent').append(str);
  }
}

function getRefJSON(){
    $.ajax({
      url: "json/references.json",
      async: false,
      dataType: 'json',
      success: function(result) {
        $.each(result,function(){
          refJSON = this;
        });
      }
    });
}

function assignReferences(){
  var id, str = "", count = 1;
  $('a.ref').each(function(ref){
    var currCount = count;
    id = $(this).attr("data-refID");
    $(this).attr('href', '#reference-' + id);
    $(this).attr('data-toggle', 'tooltip');
    $(this).attr('data-html', 'true');
    $(this).attr('title', refJSON[id]);
    if (id in references){
      $(this).html('[' +references[id]+']');
    }else{
      str += "<p id='reference-"+id+"' class='reference'>[" + count + "]" + " " + refJSON[id] + "</p>";
      $(this).html('[' +count+']');
      references[id] = count;
      count++;
    }
  });
  $("#references").html(str);
}

async function handleReferences(){
  await assignReferences();
  await $('[data-toggle="tooltip"]').tooltip();
}

function backgroundButton(){
  $("#backgroundButton").on('click', function(){
    $('html,body').animate({
      scrollTop: $('#content').offset().top - 61
    }, 1200);
  });
}

function accordion(){
    if (!$("#fundamentals").hasClass("is-open")){
      $("#fundamentals div a").trigger("click");
    }

    if(window.innerWidth < 768){
      $('#accordionCollapse').collapse("hide");
    }

    $(window).resize(function(){
      if(window.innerWidth > 768 && (!$('#accordionCollapse').is(':visible'))){
        $('#accordionCollapse').collapse("show");
      }
    });

    $(".acnav__link").on("click",function(){
        if(window.innerWidth < 768){
          $('#accordionCollapse').collapse("hide");
        }
    })
}

function backToTop(){
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
}

function helpMenuItems(){
  $(".help-menu-list-item").click(function(){
    $(".help-menu-list-item").removeClass('active');
    $(this).addClass('active');
    var id = "#help-" + $(this).data('value');
    $(".help-section").addClass('d-none');
    $(id).removeClass('d-none');
    $(".help-body").scrollTop();
  });
}

$(document).ready(async function(){
  ajaxWarning();

  await getRefJSON();

  handleReferences();

  await getGlossaryJSON();

  handleGlossary();

  backgroundButton();

  accordion();

  backToTop();

  helpMenuItems();
});
