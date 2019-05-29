function main(data,pictures){
  var facility = "", room = "", fixture = "", target = "", system ="", cct = "", time = "";
  var senior = data["Senior Care"];
  getFacility(data,pictures,facility,room,fixture,target,system,cct,time);
}

function generateImagePath(){
  var int = Math.floor(Math.random() * (15 - 1) ) + 1;
  var path = "img/animals/"+int+".jpg";
  return path;
}

function generateModalBreadcrumb(data,pictures,current,facility,room,fixture,target,system,cct,time){
  if (current == "facility"){
    $('#application-modal-breadcrumb').html('<li class="breadcrumb-item">Facility</li>');
  }
  if (current == "room"){
    $('#application-modal-breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="repick-facility">'+facility+'</a></li><li class="breadcrumb-item">Room</li>');
  }
  if (current == "fixture"){
    $('#application-modal-breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="repick-facility">'+facility+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-room">'+room+'</a></li><li class="breadcrumb-item">Fixture</li>');
  }
  if (current == "target"){
    $('#application-modal-breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="repick-facility">'+facility+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-room">'+room+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-fixture">'+fixture+'</a></li><li class="breadcrumb-item">Target CS</li>');
  }
  if (current == "system"){
    $('#application-modal-breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="repick-facility">'+facility+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-room">'+room+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-fixture">'+fixture+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-target">'+target+'</a></li><li class="breadcrumb-item">CCT System</li>');
  }
  if (current == "cct"){
    $('#application-modal-breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="repick-facility">'+facility+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-room">'+room+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-fixture">'+fixture+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-target">'+target+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-system">'+system+'</a></li><li class="breadcrumb-item">CCT</li>');
  }
  if (current == "time"){
    $('#application-modal-breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="repick-facility">'+facility+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-room">'+room+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-fixture">'+fixture+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-target">'+target+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-system">'+system+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-cct">'+cct+'</a></li><li class="breadcrumb-item">Time of Day</li>');
  }
  $('#repick-facility').click(function(){
    getFacility(data,pictures,'','','','','','','');
  });
  $('#repick-room').click(function(){
    getRoom(data,pictures,facility,'','','','','','');
  });
  $('#repick-fixture').click(function(){
    getFixture(data,pictures,facility,room,'','','','','');
  });
  $('#repick-target').click(function(){
    getTarget(data,pictures,facility,room,fixture,'','','','');
  });
  $('#repick-system').click(function(){
    getSystem(data,pictures,facility,room,fixture,target,'','','');
  });
  $('#repick-cct').click(function(){
    getCCT(data,pictures,facility,room,fixture,target,system,'','');
  });
  $('#repick-time').click(function(){
    getTime(data,pictures,facility,room,fixture,target,system,cct,'');
  });
}

function getFacility(data,pictures,facility,room,fixture,target,system,cct,time){
  var facilities = Object.values(data);
  generateModalBreadcrumb(data,pictures,"facility",facility,room,fixture,target,system,cct,time);
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a Facility');
  for (var i = 0; i < facilities.length; i++){
    var _facility = Object.keys(data)[i];
    var __facility = _facility.replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__facility+'" data-value="'+_facility+'" ><img class="card-img-top" src="'+generateImagePath()+'" alt="Monkey" /><div class="card-body"><h5 class="card-title">'+_facility+'</h5><p class="card-text">Description blah blah blah blah blah blah blah blah blah blah blah blah blah.</p></div></a></div>');
    $('#'+__facility).click(function(){
      facility = $(this).data("value");
      getRoom(data,pictures,facility,room,fixture,target,system,cct,time);
    });
  }
}

function getRoom(data,pictures,facility,room,fixture,target,system,cct,time){
  var rooms = Object.values(data[facility]);
  generateModalBreadcrumb(data,pictures,"room",facility,room,fixture,target,system,cct,time);
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a Room');
  for (var i = 0; i < rooms.length; i++){
    var _room = Object.keys(data[facility])[i];
    var __room = _room.replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__room+'" data-value="'+_room+'"><img class="card-img-top" src="'+generateImagePath()+'" alt="Monkey" /><div class="card-body"><h5 class="card-title">'+_room+'</h5><p class="card-text">Description blah blah blah blah blah blah blah blah blah blah blah blah blah.</p></div></a></div>');
    $('#'+__room).click(function(){
      room = $(this).data("value");
      getFixture(data,pictures,facility,room,fixture,target,system,cct,time);
    });
  }
}

function getFixture(data,pictures,facility,room,fixture,target,system,cct,time){
  var fixtures = Object.values(data[facility][room]);
  generateModalBreadcrumb(data,pictures,"fixture",facility,room,fixture,target,system,cct,time);
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose Fixture(s)');
  for (var i = 0; i < fixtures.length; i++){
    var _fixture = Object.keys(data[facility][room])[i];
    var __fixture = _fixture.replace("[^a-zA-Z]", "").replace(/\//g, '').replace(/\s/g, '').replace(/\+/g, "");
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__fixture+'" data-value="'+_fixture+'"><img class="card-img-top" src="'+pictures["Fixture"][_fixture]+'" alt="Monkey" /><div class="card-body"><h5 class="card-title">'+_fixture+'</h5><p class="card-text">Description blah blah blah blah blah blah blah blah blah blah blah blah blah.</p></div></a></div>');
    $('#'+__fixture).click(function(){
      fixture = $(this).data("value");
      getTarget(data,pictures,facility,room,fixture,target,system,cct,time);
    });
  }
}

function getTarget(data,pictures,facility,room,fixture,target,system,cct,time){
  var targets = Object.values(data[facility][room][fixture]);
  generateModalBreadcrumb(data,pictures,"target",facility,room,fixture,target,system,cct,time);
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a Target CS');
  for (var i = 0; i < targets.length; i++){
    var _target = Object.keys(data[facility][room][fixture])[i];
    var __target = inWords(_target.split(".").pop()).replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__target+'" data-value="'+_target+'"><img class="card-img-top" src="'+generateImagePath()+'" alt="Monkey" /><div class="card-body"><h5 class="card-title">'+_target+'</h5><p class="card-text">Description blah blah blah blah blah blah blah blah blah blah blah blah blah.</p></div></a></div>');
    $('#'+__target).click(function(){
      target = $(this).data("value");
      getSystem(data,pictures,facility,room,fixture,target,system,cct,time);
    });
  }
}

function getSystem(data,pictures,facility,room,fixture,target,system,cct,time){
  var systems = Object.values(data[facility][room][fixture][target]);
  generateModalBreadcrumb(data,pictures,"system",facility,room,fixture,target,system,cct,time);
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a System');
  for (var i = 0; i < systems.length; i++){
    var _system = Object.keys(data[facility][room][fixture][target])[i];
    var __system = _system.replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__system+'" data-value="'+_system+'"><img class="card-img-top" src="'+generateImagePath()+'" alt="Monkey" /><div class="card-body"><h5 class="card-title">'+_system+'</h5><p class="card-text">Description blah blah blah blah blah blah blah blah blah blah blah blah blah.</p></div></a></div>');
    $('#'+__system).click(function(){
      system = $(this).data("value");
      getCCT(data,pictures,facility,room,fixture,target,system,cct,time);
    });
  }
}

function getCCT(data,pictures,facility,room,fixture,target,system,cct,time){
  var ccts = Object.values(data[facility][room][fixture][target][system]);
  generateModalBreadcrumb(data,pictures,"cct",facility,room,fixture,target,system,cct,time);
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a CCT');
  for (var i = 0; i < ccts.length; i++){
    var _cct = Object.keys(data[facility][room][fixture][target][system])[i];
    var __cct = inWords(_cct.split("K")[0].replace(/\s/g, '')).replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__cct+'" data-value="'+_cct+'"><img class="card-img-top" src="'+generateImagePath()+'" alt="Monkey" /><div class="card-body"><h5 class="card-title">'+_cct+'</h5><p class="card-text">Description blah blah blah blah blah blah blah blah blah blah blah blah blah.</p></div></a></div>');
    $('#'+__cct).click(function(){
      cct = $(this).data("value");
      if (system == "Tunable"){
        time = "N/A"
        generateContent(data,facility,room,fixture,target,system,cct,time);
      }else{
        getTime(data,pictures,facility,room,fixture,target,system,cct,time);
      }
    });
  }
}

function getTime(data,pictures,facility,room,fixture,target,system,cct,time){
  var times = Object.values(data[facility][room][fixture][target][system][cct]);
  generateModalBreadcrumb(data,pictures,"time",facility,room,fixture,target,system,cct,time);
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a Time of Day');
  for (var i = 0; i < times.length; i++){
    var _time = Object.keys(data[facility][room][fixture][target][system][cct])[i];
    var __time = _time.replace("[^a-zA-Z]", "").replace(/\//g, '').replace(/\./g,' ').replace(/\s/g, '');
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__time+'" data-value="'+_time+'"><img class="card-img-top" src="'+generateImagePath()+'" alt="Monkey" /><div class="card-body"><h5 class="card-title">'+_time+'</h5><p class="card-text">Description blah blah blah blah blah blah blah blah blah blah blah blah blah.</p></div></a></div>');
    $('#'+__time).click(function(){
      time = $(this).data("value");
      generateContent(data,facility,room,fixture,target,system,cct,time,0);
    });
  }
}

function generateContent(data,facility,room,fixture,target,system,cct,time,view){
  $('#application-modal').modal('hide');
  $('#landing').html();
  $('body').html('<div id="navbar"><script type="text/javascript">$("#navbar").load("navbar.html");</script></div><script type="text/javascript">$(document).ready(function(){$("#application-tab").addClass("active");$("#background-tab").attr("href", "background.html");});</script>');
  if (system == "Tunable"){
    $('body').append('<img width="400px" src="'+data[facility][room][fixture][target][system][cct].render[view]+'"/>');
    $('body').append('<img width="400px" src="'+data[facility][room][fixture][target][system][cct].plan[view]+'"/>');
  }else{
    var path = data[facility][room][fixture][target][system][cct][time]
    if (path.render.length > 1){
      $('body').append('<button id="cycle">Cycle View</button>');
      $('#cycle').click(function(){
        if (view == path.render.length-1){
          view = 0;
        }else{
          view +=1;
        }
        $('#introduction').html('');
        generateContent(data,facility,room,fixture,target,system,cct,time,view);
      });
    }
    $('body').append('<img width="400px" src="'+path.render[view]+'"/>');
    $('body').append('<img width="400px" src="'+path.plan[view]+'"/>');
  }
}

// From https://www.npmjs.com/~salmanm
function inWords(num){
  var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
  var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

  if ((num = num.toString()).length > 9) return 'overflow';
  n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return; var str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
  return str;
}

$(document).ready(function(){

  // Avoids Firefox throwing a warning when reading JSON
  $.ajaxSetup({beforeSend: function(xhr){
    if (xhr.overrideMimeType){
      xhr.overrideMimeType("application/json");
    }
  }});
  // Avoids Firefox throwing a warning when reading JSON

  //Get HealthyBuildings JSON and assign it to data varibale
  var data;
  $.getJSON("json/healthyBuildings.json", function(hb_result){
    $.each(hb_result,function(){
      data = this;
    });
  });
  //Get HealthyBuildings JSON and assign it to data varibale

  //Get Pictures JSON and assing it to pictures variable
  var pictures;
  $.getJSON("json/pictures.json", function(pic_result){
    $.each(pic_result,function(){
      pictures = this;
    });
  });
  //Get Pictures JSON and assing it to pictures variable

  $('#begin').click(function(){
    $('#introduction').html('');
    main(data,pictures);
  });


});
