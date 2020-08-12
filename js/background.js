/*jshint esversion: 8 */
/*jshint -W030 */
/*jshint -W083 */
var refJSON, glossaryJSON, releaseJSON, references = {}, mobile = false;

var navOffset;

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

function getReleaseNotesJSON(){
  $.ajax({
    url: "json/release.json",
    async: false,
    dataType: 'json',
    success: function(result) {
      $.each(result,function(){
        releaseJSON = this;
      });
    }
  });
}

function printGlossary(){
  var terms = [];
  for (var id in glossaryJSON){
    str = glossaryJSON[id].title + "$%$" + glossaryJSON[id].definition;
    terms.push(str);
  }
  terms.sort();
  for (var id in terms){
    var term = terms[id];
    var str = '';
    str += '<div class="row mb-4">';
    str += '  <div class="col-md-3">';
    str += '    <p class="glossaryTitle ">' +term.split("$%$")[0]+ '</p>';
    str += '  </div>';
    str += '  <div class="col-md-9">';
    str += '    <p class="">'+term.split("$%$")[1]+'</p>';
    str += '  </div>';
    str += '</div>';
    $('#glossaryContent').append(str);
  }
}

function assignGlossaryTerms(){
  $('a.term').each(function(term){
    id = $(this).attr("data-termID");
    $(this).attr('data-toggle', 'tooltip');
    $(this).attr('data-html', 'true');
    $(this).attr('title', "<span class='term-text'>Definition: </span>" + glossaryJSON[id].definition);
  });
}

async function handleGlossary(){
  await printGlossary();
  await assignGlossaryTerms();
  await $('[data-toggle="tooltip"]').tooltip();
}

function handleReleaseNotes(){
  var str = '';
  for (var i =  Object.keys(releaseJSON).length; i > 0; i--){
    var note = releaseJSON[i];
    str += '<div class="row mb-4">';
    str += '  <div class="col release-note">';
    str += '    <h3 class="release-note-title">'+note.version+'</h3>';
    str += '    <h5 class="release-note-date">'+note.type+ ' on ' +note.date+ '</h5>';
    str += '    <ul class="fa-ul">';
    for (var j = 0; j < Object.keys(note.notes).length; j++){
      var num = j + 1, _class = "";
      if (note.notes[num].startsWith("B:")){
        _class='class="blue-text"';
      }else if(note.notes[num].startsWith("A:")){
        _class='class="red-text"';
      }
      str += '    <li><span class="fa-li"><i class="fas fa-lightbulb"></i></span>' + '<span ' + _class + '>' + note.notes[num].replace(/->/g, "&#8594;").replace(/Ev/g,"E<sub>V</sub>").replace(/Eh/g,"E<sub>H</sub>") + '</span></li>';
    }
    str += '    </ul>';
    str += '  </div>';
    str += '</div>';
  }
  $("#releaseNotesContainer").html(str);
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
    $(this).attr('title', "<span class='ref-text'>Reference: </span>" + refJSON[id]);
    if (id in references){
      $(this).html('[' +references[id]+']');
    }else{
      str += "<p id='reference-"+id+"' class='anchored reference'>[" + count + "]" + " " + refJSON[id] + "</p>";
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
      scrollTop: $('#content').offset().top - navOffset
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

function enlargeModalExit(){
  $("#enlarge_modal").on("click",function(){
    $('#enlarge_modal').modal('hide');
  })
}

function handleImageEnlarge(){
  $("img.enlarge").on("click",function(){
    var src = $(this).attr('src')
    $("#img_enlarge").html('<figure class="w-auto"><img src="'+src+'" class="text-center enlarged"/></figure>');
    $('#enlarge_modal').modal('show');
  });
  enlargeModalExit();
}

function setNavOffset(){
  navOffset = $("#navbar").innerHeight() + 3;
  if($(window).width() <= 768){
    $(".accordion").css('top','');
  }else{
    $(".accordion").css('top', navOffset + "px");
  }
}

function handleWindowResize(){
  window.onresize = function(){
    setNavOffset();
  }
}

$(document).ready(async function(){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
   mobile = true;
  }

  setNavOffset();

  ajaxWarning();

  let images = document.querySelectorAll(".lazy-load");
  lazyload(images);

  await getRefJSON();

  handleReferences();

  await getGlossaryJSON();

  handleGlossary();

  await getReleaseNotesJSON();

  handleReleaseNotes();

  backgroundButton();

  accordion();

  backToTop();

  helpMenuItems();

  handleImageEnlarge();

  handleWindowResize();
});
