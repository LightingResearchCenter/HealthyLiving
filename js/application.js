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

function main(data,selection){
  var facility = "", room = "", fixture = "", target = "", system ="", cct = "", time = "";
  getFacility(data,selection,facility,room,fixture,target,system,cct,time);
}

function generateModalBreadcrumb(data,selection,current,facility,room,fixture,target,system,cct,time){
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
    if ($('#modalSize').hasClass('modal-lg')){
      $('#modalSize').removeClass('modal-lg');
      $('#modalSize').addClass('modal-xl');
    }
    getFacility(data,selection,'','','','','','','');
  });
  $('#repick-room').click(function(){
    if ($('#modalSize').hasClass('modal-lg')){
      $('#modalSize').removeClass('modal-lg');
      $('#modalSize').addClass('modal-xl');
    }
    getRoom(data,selection,facility,'','','','','','');
  });
  $('#repick-fixture').click(function(){
    if ($('#modalSize').hasClass('modal-lg')){
      $('#modalSize').removeClass('modal-lg');
      $('#modalSize').addClass('modal-xl');
    }
    getFixture(data,selection,facility,room,'','','','','');
  });
  $('#repick-target').click(function(){
    if ($('#modalSize').hasClass('modal-lg')){
      $('#modalSize').removeClass('modal-lg');
      $('#modalSize').addClass('modal-xl');
    }
    getTarget(data,selection,facility,room,fixture,'','','','');
  });
  $('#repick-system').click(function(){
    if ($('#modalSize').hasClass('modal-lg')){
      $('#modalSize').removeClass('modal-lg');
      $('#modalSize').addClass('modal-xl');
    }
    getSystem(data,selection,facility,room,fixture,target,'','','');
  });
  $('#repick-cct').click(function(){
    if ($('#modalSize').hasClass('modal-lg')){
      $('#modalSize').removeClass('modal-lg');
      $('#modalSize').addClass('modal-xl');
    }
    getCCT(data,selection,facility,room,fixture,target,system,'','');
  });
  $('#repick-time').click(function(){
    if ($('#modalSize').hasClass('modal-lg')){
      $('#modalSize').removeClass('modal-lg');
      $('#modalSize').addClass('modal-xl');
    }
    getTime(data,selection,facility,room,fixture,target,system,cct,'');
  });
}

function getFacility(data,selection,facility,room,fixture,target,system,cct,time){
  var facilities = Object.values(data);
  generateModalBreadcrumb(data,selection,"facility",facility,room,fixture,target,system,cct,time);
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a Facility<p class="modal-title-desc">'+selection["Facility"]["desc"]+'</p>');
  for (var i = 0; i < facilities.length; i++){
    var _facility = Object.keys(data)[i];
    var __facility = _facility.replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__facility+'" data-value="'+_facility+'"><img class="card-img-top card-img-top-facility" src="'+selection["Facility"][_facility]["img"]+'" alt="Facility" /><div class="card-body"><h5 class="card-title">'+_facility+'</h5><hr/><p class="card-text">'+selection["Facility"][_facility]["desc"]+'</p></div></a></div>');
    $('#'+__facility).click(function(){
      facility = $(this).data("value");
      getRoom(data,selection,facility,room,fixture,target,system,cct,time);
    });
  }
}

function getRoom(data,selection,facility,room,fixture,target,system,cct,time){
  var rooms = Object.values(data[facility]);
  generateModalBreadcrumb(data,selection,"room",facility,room,fixture,target,system,cct,time);
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a Room<p class="modal-title-desc">'+selection["Room"]["desc"]+'</p>');
  for (var i = 0; i < rooms.length; i++){
    var _room = Object.keys(data[facility])[i];
    var __room = _room.replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__room+'" data-value="'+_room+'"><img class="card-img-top" src="'+selection["Room"][_room]["img"]+'" alt="Room" /><div class="card-body"><h5 class="card-title">'+_room+'</h5><hr/><p class="card-text">'+selection["Room"][_room]["desc"]+'</p></div></a></div>');
    $('#'+__room).click(function(){
      room = $(this).data("value");
      getFixture(data,selection,facility,room,fixture,target,system,cct,time);
    });
  }
}

function getFixture(data,selection,facility,room,fixture,target,system,cct,time){
  var fixtures = Object.values(data[facility][room]);
  generateModalBreadcrumb(data,selection,"fixture",facility,room,fixture,target,system,cct,time);
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose Fixture(s)<p class="modal-title-desc">'+selection["Fixture"]["desc"]+'</p>');
  for (var i = 0; i < fixtures.length; i++){
    var _fixture = Object.keys(data[facility][room])[i];
    var __fixture = _fixture.replace("[^a-zA-Z]", "").replace(/\//g, '').replace(/\s/g, '').replace(/\+/g, "");
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__fixture+'" data-value="'+_fixture+'"><img class="card-img-top" src="'+selection["Fixture"][_fixture]["img"]+'" alt="Fixture" /><div class="card-body"><h5 class="card-title">'+_fixture+'</h5><hr/><p class="card-text">'+selection["Fixture"][_fixture]["desc"]+'</p></div></a></div>');
    $('#'+__fixture).click(function(){
      fixture = $(this).data("value");
      getTarget(data,selection,facility,room,fixture,target,system,cct,time);
    });
  }
}

function getTarget(data,selection,facility,room,fixture,target,system,cct,time){
  var targets = Object.values(data[facility][room][fixture]);
  generateModalBreadcrumb(data,selection,"target",facility,room,fixture,target,system,cct,time);
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a Target CS<p class="modal-title-desc">'+selection["Target"]["desc"]+'</p>');
  for (var i = 0; i < targets.length; i++){
    var _target = Object.keys(data[facility][room][fixture])[i];
    var __target = inWords(_target.split(".").pop()).replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__target+'" data-value="'+_target+'"><img class="card-img-top" src="'+selection["Target"][_target]["img"]+'" alt="Target CS" /><div class="card-body"><hr/><p class="card-text">'+selection["Target"][_target]["desc"]+'</p></div></a></div>');
    $('#'+__target).click(function(){
      target = $(this).data("value");
      getSystem(data,selection,facility,room,fixture,target,system,cct,time);
    });
  }
}

function getSystem(data,selection,facility,room,fixture,target,system,cct,time){
  var systems = Object.values(data[facility][room][fixture][target]);
  generateModalBreadcrumb(data,selection,"system",facility,room,fixture,target,system,cct,time);
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a System<p class="modal-title-desc">'+selection["System"]["desc"]+'</p>');
  $('#modalSize').removeClass('modal-xl');
  $('#modalSize').addClass('modal-lg');
  for (var i = 0; i < systems.length; i++){
    var _system = Object.keys(data[facility][room][fixture][target])[i];
    var __system = _system.replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__system+'" data-value="'+_system+'"><img class="card-img-top" src="'+selection["System"][_system]["img"]+'" alt="CCT System" /><div class="card-body"><h5 class="card-title">'+_system+'</h5><hr/><p class="card-text">'+selection["System"][_system]["desc"]+'</p></div></a></div>');
    $('#'+__system).click(function(){
      if ($('#modalSize').hasClass('modal-lg')){
        $('#modalSize').removeClass('modal-lg');
        $('#modalSize').addClass('modal-xl');
      }
      system = $(this).data("value");
      getCCT(data,selection,facility,room,fixture,target,system,cct,time);
    });
  }
}

function getCCT(data,selection,facility,room,fixture,target,system,cct,time){
  var ccts = Object.values(data[facility][room][fixture][target][system]);
  generateModalBreadcrumb(data,selection,"cct",facility,room,fixture,target,system,cct,time);
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a CCT<p class="modal-title-desc">'+selection["CCT"]["desc"]+'</p>');
  if (target=="0.4" && system=="Tunable"){
    $('#modalSize').removeClass('modal-xl');
    $('#modalSize').addClass('modal-lg');
  }
  for (var i = 0; i < ccts.length; i++){
    var _cct = Object.keys(data[facility][room][fixture][target][system])[i];
    var __cct = inWords(_cct.split("K")[0].replace(/\s/g, '')).replace("[^a-zA-Z]", "").replace(/\s/g, '');
    if (system=='Tunable'){
      $('#application-modal-deck').append('<div class="card hover"><a id="'+__cct+'" data-value="'+_cct+'"><img class="card-img-top" src="'+selection["CCT"][_cct]["img"]+'" alt="CCT" /><div class="card-body"><hr/><p class="card-text">'+selection["CCT"][_cct]["desc"]+'</p></div></a></div>');
    }else{
      $('#application-modal-deck').append('<div class="card hover"><a id="'+__cct+'" data-value="'+_cct+'"><img class="card-img-top" src="'+selection["CCT"][_cct]["img"]+'" alt="CCT" /><div class="card-body"><h5 class="card-title">'+_cct+'</h5><hr/><p class="card-text">'+selection["CCT"][_cct]["desc"]+'</p></div></a></div>');
    }
    $('#'+__cct).click(function(){
      if ($('#modalSize').hasClass('modal-lg')){
        $('#modalSize').removeClass('modal-lg');
        $('#modalSize').addClass('modal-xl');
      }
      cct = $(this).data("value");
      if (system == "Tunable"){
        time = "N/A"
      }else{
        time = Object.keys(data[facility][room][fixture][target][system][cct])[0];
      }
      generateContent(data,facility,room,fixture,target,system,cct,time,0);
    });
  }
}

function buildHTML(){
  var str = '';

  str += '<div class="container-fluid pr-4">';
  str += '  <div class="row my-4">';
  str += '    <div class="col-md-12 text-center mb-4">';
  str += '      <h6 class="final_title py-1">Description</h6>'
  str += '      <div id="final_description">';
  str += '      </div>';
  str += '    </div>';
  str += '  </div>';
  str += '  <div class="row my-4">';
  str += '    <div class="col-md-6 text-center mb-4">';
  str += '      <h6 class="final_title py-1">Image Render</h6>';
  str += '      <div id="final_render" class="render-container">';
  str += '      </div>';
  str += '    </div>';
  str += '    <div class="col-md-6 text-center mb-4">';
  str += '      <h6 class="final_title py-1">Lighting plan</h6>';
  str += '        <div id="final_plan">';
  str += '        </div>'
  str += '    </div>';
  str += '  </div>';
  str += '  <div class="row my-4">';
  str += '    <div class="col-md-6 text-center mb-4">';
  str += '      <h6 class="final_title py-1">Adjustments</h6>';
  str += '        <div id="final_adjustments">';
  str += '        </div>';
  str += '    </div>';
  str += '    <div id="final_fixtures" class="col-md-6 text-center mb-4">';
  str += '      <h6 class="final_title py-1">Fixtures</h6>';
  str += '    </div>';
  str += '  </div>';
  str += '  <div class="row my-4">';
  str += '    <div id="final_chart" class="col-md-12 text-center mb-4">';
  str += '      <h6 class="final_title py-1">CS Chart</h6>';
  str += '    </div>';
  str += '  </div>';
  str += '</div>';

  $('body').append(str);
}

function generateRender(path,data,facility,room,fixture,target,system,cct,time,view){
  $('#final_render').html('');
  $('#final_render').append('<img class="img rounded m-auto" src="'+path.render[view]+'"/>');
  if (path.render.length > 1){
    $('#final_render').append('<button id="toggle_view" class="btn btn-primary img-button">Toggle View</button>');
    $('#toggle_view').click(function(){
     if (view == path.render.length-1){
        view = 0;
      }else{
        view +=1;
      }
      generatePlan(path,view);
      generateRender(path,data,facility,room,fixture,target,system,cct,time,view);
      generateAdjustments(data,facility,room,fixture,target,system,cct,time,view);
    });
  }
}

function generatePlan(path,view){
  $('#final_plan').html('');
  $('#final_plan').append('<img class="img m-auto" src="'+path.plan[view]+'"/>');
}

function generateAdjustments(data,facility,room,fixture,target,system,cct,time,view){
  $('#final_adjustments').html('');
  var cct_count = Object.keys(data[facility][room][fixture][target][system]).length;
  var cct_str = '';
  var tod_str = '';
  var cct_selected = cct_count;
  for (var i = cct_count-1; i > -1; i--){
    if (Object.keys(data[facility][room][fixture][target][system])[i] == cct){
      cct_selected  = i;
    }
  }
  for (var i = cct_count -1; i > -1; i--){
    cct_str += '<div data-value="'+i+'" class="mb-2 cct-border adjustment-container-cct adjustment-container'+cct_count;
    if (i == cct_selected){
      cct_str += ' cct-selected';
    }
    cct_str += '">';
    cct_str += '  <img class="m-0 p-0" width="100%" src="img/application/adjustments/'+cct_count+' '+Object.keys(data[facility][room][fixture][target][system])[i]+'.jpg"/>';
    cct_str += '</div>';
  }

  if (system == "Static"){
    if(target == "0.4"){
      var tod_count = 4;
    }else if(target == "0.3"){
      var tod_count = 3;
    }
    var tod_selected = tod_count;
    for (var i = 0; i < tod_count; i++){
      if (Object.keys(data[facility][room][fixture][target][system][cct])[i] == time){
        tod_selected = i;
      }
    }
    for (var i = 0; i < tod_count; i++){
      tod_str += '<div data-value="'+i+'" class="mb-2 tod-border adjustment-container-tod adjustment-container'+tod_count;
      if (i == tod_selected){
        tod_str += ' tod-selected';
      }
      tod_str += '">';
      tod_str += '  <img class="m-0 p-0" width="100%" src="img/application/adjustments/'+tod_count+' '+i+'.jpg"/>';
      tod_str += '</div>';
    }
  }
  $('#final_adjustments').append(cct_str);
  $('#final_adjustments').append(tod_str);

  $('.adjustment-container-cct').click(function(){
    $('#final_adjustments .cct-border').removeClass('cct-selected');
    if(!$(this).hasClass('cct-selected')){
      $(this).addClass('cct-selected');
    }

    cct = Object.keys(data[facility][room][fixture][target][system])[$(this).data("value")];
    if (system == "Tunable"){
      var path = data[facility][room][fixture][target][system][cct];
    }else{
      var path = data[facility][room][fixture][target][system][cct][time];
    }
    generateRender(path,data,facility,room,fixture,target,system,cct,time,view);
  });

  $('.adjustment-container-tod').click(function(){
    $('#final_adjustments .tod-border').removeClass('tod-selected');
    if(!$(this).hasClass('tod-selected')){
      $(this).addClass('tod-selected');
    }

    time = Object.keys(data[facility][room][fixture][target][system][cct])[$(this).data("value")];
    if (system == "Tunable"){
      var path = data[facility][room][fixture][target][system][cct];
    }else{
      var path = data[facility][room][fixture][target][system][cct][time];
    }
    generateRender(path,data,facility,room,fixture,target,system,cct,time,view);
  });


}

function generateContent(data,facility,room,fixture,target,system,cct,time,view){
  //Hide the modal and remove necessary landing page content
  $('#application-modal').modal('hide');
  $('#landing-content').remove();
  $('body').removeAttr('data-vide-bg');
  $('body').removeAttr('data-vide-options');
  if ($('body').find('div').first().attr('id') != 'navbar'){
    $('body').find('div').first().remove();
  }
  //Hide the modal and remove necessary landing page content

  //Get path of our content in the json file
  if (system == "Tunable"){
    var path = data[facility][room][fixture][target][system][cct];
  }else{
    var path = data[facility][room][fixture][target][system][cct][time];
  }
  //Get path of our content in the json file


  buildHTML();
  generateRender(path,data,facility,room,fixture,target,system,cct,time,view);
  generatePlan(path,view);
  generateAdjustments(data,facility,room,fixture,target,system,cct,time,view);

  // if (path.render.length > 1){
  //   $('body').append('<button id="cycle">Cycle View</button>');
  //   $('#cycle').click(function(){
  //     if (view == path.render.length-1){
  //       view = 0;
  //     }else{
  //       view +=1;
  //     }
  //     generateContent(data,facility,room,fixture,target,system,cct,time,view);
  //   });
  // }
  //
  // $('body').append('<img width="400px" src="'+path.render[view]+'"/>');
  // $('body').append('<img width="400px" src="'+path.plan[view]+'"/>');
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

  //Get selection JSON and assign it to selection variable
  var selection;
  $.getJSON("json/selection.json", function(selection_result){
    $.each(selection_result,function(){
      selection = this;
    });
  });
  //Get selection JSON and assign it to selection variable

  $('#begin').click(function(){
    main(data,selection);
  });


});
