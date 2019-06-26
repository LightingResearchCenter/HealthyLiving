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

function checkModalSize(values){
  var size = values.length;
  for (var i = 0; i < values.length; i++){
    if (values[i] == 'desc'){
      size -= 1;
    }
  }
  console.log(size);
  if (size < 3){
    $('#modalSize').removeClass('modal-xl');
    $('#modalSize').addClass('modal-lg');
  }else{
    $('#modalSize').removeClass('modal-lg');
    $('#modalSize').addClass('modal-xl');
  }
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
    getFacility(data,selection,'','','','','','','');
  });
  $('#repick-room').click(function(){
    getRoom(data,selection,facility,'','','','','','');
  });
  $('#repick-fixture').click(function(){
    getFixture(data,selection,facility,room,'','','','','');
  });
  $('#repick-target').click(function(){
    getTarget(data,selection,facility,room,fixture,'','','','');
  });
  $('#repick-system').click(function(){
    getSystem(data,selection,facility,room,fixture,target,'','','');
  });
  $('#repick-cct').click(function(){
    getCCT(data,selection,facility,room,fixture,target,system,'','');
  });
  $('#repick-time').click(function(){
    getTime(data,selection,facility,room,fixture,target,system,cct,'');
  });
}

function getFacility(data,selection,facility,room,fixture,target,system,cct,time){
  var facilities = Object.values(data);
  checkModalSize(Object.keys(data));
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
  checkModalSize(Object.keys(data[facility]));
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
  checkModalSize(Object.keys(data[facility][room]));
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
  checkModalSize(Object.keys(data[facility][room][fixture]));
  generateModalBreadcrumb(data,selection,"target",facility,room,fixture,target,system,cct,time);
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a Target CS<p class="modal-title-desc">'+selection["Target"]["desc"]+'</p>');

  for (var i = 0; i < targets.length; i++){
    var _target = Object.keys(data[facility][room][fixture])[i];
    if (_target == "desc"){
      continue;
    }
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
  checkModalSize(Object.keys(data[facility][room][fixture][target]));
  generateModalBreadcrumb(data,selection,"system",facility,room,fixture,target,system,cct,time);
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a System<p class="modal-title-desc">'+selection["System"]["desc"]+'</p>');

  for (var i = 0; i < systems.length; i++){
    var _system = Object.keys(data[facility][room][fixture][target])[i];
    var __system = _system.replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__system+'" data-value="'+_system+'"><img class="card-img-top" src="'+selection["System"][_system]["img"]+'" alt="CCT System" /><div class="card-body"><h5 class="card-title">'+_system+'</h5><hr/><p class="card-text">'+selection["System"][_system]["desc"]+'</p></div></a></div>');
    $('#'+__system).click(function(){
      system = $(this).data("value");
      getCCT(data,selection,facility,room,fixture,target,system,cct,time);
    });
  }
}

function getCCT(data,selection,facility,room,fixture,target,system,cct,time){
  var ccts = Object.values(data[facility][room][fixture][target][system]);
  checkModalSize(Object.keys(data[facility][room][fixture][target][system]));
  generateModalBreadcrumb(data,selection,"cct",facility,room,fixture,target,system,cct,time);
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a CCT<p class="modal-title-desc">'+selection["CCT"]["desc"]+'</p>');
  for (var i = 0; i < ccts.length; i++){
    var _cct = Object.keys(data[facility][room][fixture][target][system])[i];
    var __cct = inWords(_cct.split("K")[0].replace(/\s/g, '')).replace("[^a-zA-Z]", "").replace(/\s/g, '');
    if (system=='Tunable'){
      $('#application-modal-deck').append('<div class="card hover"><a id="'+__cct+'" data-value="'+_cct+'"><img class="card-img-top" src="'+selection["CCT"][_cct]["img"]+'" alt="CCT" /><div class="card-body"><hr/><p class="card-text">'+selection["CCT"][_cct]["desc"]+'</p></div></a></div>');
    }else{
      $('#application-modal-deck').append('<div class="card hover"><a id="'+__cct+'" data-value="'+_cct+'"><img class="card-img-top" src="'+selection["CCT"][_cct]["img"]+'" alt="CCT" /><div class="card-body"><h5 class="card-title">'+_cct+'</h5><hr/><p class="card-text">'+selection["CCT"][_cct]["desc"]+'</p></div></a></div>');
    }
    $('#'+__cct).click(function(){
      cct = $(this).data("value");
      if (system == "Tunable"){
        time = "N/A"
      }else{
        time = Object.keys(data[facility][room][fixture][target][system][cct])[0];
      }
      generateContent(data,selection,facility,room,fixture,target,system,cct,time,0);
    });
  }
}

function buildHTML(){
  var str = '';

  str += '<div id="final_content" class="container-fluid">';
  str += '  <div class="row pt-3 pr-4">';
  str += '    <div class="col-xl-9 col-lg-12">';
  str += '      <div class="row mb-4 bc-large">';
  str += '        <div class="col">';
  str += '          <div class="card drop-shadow">';
  str += '            <div class="card-body p-0">';
  str += '              <div class="container-fluid">';
  str += '                <div class="row bc-row">';
  str += '                  <div class="col bc-item px-0">';
  str += '                    <div class="bc-title">Facility</div>';
  str += '                    <div class="bc-facility bc-selection" data-toggle="modal" data-target="#application-modal"></div>';
  str += '                  </div>';
  str += '                  <div class="col bc-item px-0">';
  str += '                    <div class="bc-title">Room</div>';
  str += '                    <div class="bc-room bc-selection" data-toggle="modal" data-target="#application-modal"></div>';
  str += '                  </div>';
  str += '                  <div class="col bc-item px-0">';
  str += '                    <div class="bc-title">Fixtures</div>';
  str += '                    <div class="bc-fixture bc-selection" data-toggle="modal" data-target="#application-modal"></div>';
  str += '                  </div>';
  str += '                  <div class="col bc-item px-0">';
  str += '                    <div class="bc-title">Target CS</div>';
  str += '                    <div class="bc-target bc-selection" data-toggle="modal" data-target="#application-modal"></div>';
  str += '                  </div>';
  str += '                  <div class="col bc-item px-0">';
  str += '                    <div class="bc-title">CCT System</div>';
  str += '                    <div class="bc-system bc-selection" data-toggle="modal" data-target="#application-modal"></div>';
  str += '                  </div>';
  str += '                  <div class="col bc-item px-0">';
  str += '                    <div class="bc-title">CCT</div>';
  str += '                    <div class="bc-cct bc-selection" data-toggle="modal" data-target="#application-modal"></div>';
  str += '                  </div>';
  str += '                </div>';
  str += '              </div>';
  str += '            </div>';
  str += '          </div>';
  str += '        </div>';
  str += '      </div>';
  str += '      <div class="row mb-4 bc-small">';
  str += '        <div class="col px-0">';
  str += '          <div class="card drop-shadow">';
  str += '            <div class="card-body p-0">';
  str += '              <div class="container-fluid">';
  str += '                <div class="row bc-row">';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">Facility</div>';
  str += '                    <div class="bc-facility bc-selection"></div>'
  str += '                  </div>';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">Room</div>';
  str += '                    <div class="bc-room bc-selection"></div>'
  str += '                  </div>';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">Fixture</div>';
  str += '                    <div class="bc-fixture bc-selection"></div>'
  str += '                  </div>';
  str += '                </div>';
  str += '                <div class="row bc-row">';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">Target CS</div>';
  str += '                    <div class="bc-target bc-selection"></div>';
  str += '                  </div>';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">CCT System</div>';
  str += '                    <div class="bc-system bc-selection"></div>';
  str += '                  </div>';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">CCT</div>';
  str += '                    <div class="bc-cct bc-selection"></div>';
  str += '                  </div>';
  str += '                </div>';
  str += '              </div>';
  str += '            </div>';
  str += '          </div>';
  str += '        </div>';
  str += '      </div>';
  str += '      <div class="row mb-4">';
  str += '        <div class="col-xl-6 col-lg-12">';
  str += '          <div class="card drop-shadow">';
  str += '            <img id="final_render_img" class="card-img-top" src="" alt="Selection Render" />';
  str += '            <div id="final_adjustments" class="card-body card-body-small-padding pb-0"></div>';
  str += '          </div>';
  str += '        </div>';
  str += '        <div class="col-xl-6 col-lg-12">';
  str += '          <div class="card drop-shadow">';
  str += '            <img id="final_plan_img" class="card-img-top p-2" src="" alt="Selection Lighting Plan" />';
  str += '            <div id="final_fixtures" class="card-body card-body-small-padding"></div>';
  str += '          </div>';
  str += '        </div>';
  str += '      </div>';
  str += '      <div class="row mb-4">';
  str += '        <div class="col">';
  str += '          <div class="card">';
  str += '            <div id="final_cs" class="card-body card=body-small-padding drop-shadow"></div>';
  str += '          </div>';
  str += '        </div>';
  str += '      </div>';
  str += '    </div>';
  str += '    <div class="col-xl-3 col-lg-12 pr-0 mb-4">';
  str += '      <div class="card drop-shadow"></div>';
  str += '    </div>';
  str += '  </div>';
  str += '</div>';

  $('body').append(str);
}

function generateFinalBreadcrumb(data,selection,facility,room,fixture,target,system,cct){
  $('.bc-facility').html(facility);
  $('.bc-room').html(room);
  $('.bc-fixture').html(fixture);
  $('.bc-target').html(target);
  $('.bc-system').html(system);
  $('.bc-cct').html(cct);
  $('.bc-facility').click(function(){
    $('#toggle_view').remove();
    getFacility(data,selection,'','','','','','','');
  });
  $('.bc-room').click(function(){
    $('#toggle_view').remove();
    getRoom(data,selection,facility,'','','','','','');
  });
  $('.bc-fixture').click(function(){
    $('#toggle_view').remove();
    getFixture(data,selection,facility,room,'','','','','');
  });
  $('.bc-target').click(function(){
    $('#toggle_view').remove();
    getTarget(data,selection,facility,room,fixture,'','','','');
  });
  $('.bc-system').click(function(){
    $('#toggle_view').remove();
    getSystem(data,selection,facility,room,fixture,target,'','','');
  });
  $('.bc-cct').click(function(){
    $('#toggle_view').remove();
    getCCT(data,selection,facility,room,fixture,target,system,'','');
  });
}

function generateDescription(data,facility,room,fixture){
  $('#final_description').html(data[facility][room][fixture]["desc"]);
}

function generateRender(path,data,selection,facility,room,fixture,target,system,cct,time,view){
  $('#final_render_img').attr('src',path.render[view]);
  if (path.render.length > 1){
    $('#toggle_view').remove();
    $('#final_render').append('<button id="toggle_view" class="btn btn-primary img-button"><span class="float-left icon-plan-man"></span><span class="vert-cent">Toggle View</span></button>');
    $('#toggle_view').click(function(){
     if (view == path.render.length-1){
        view = 0;
      }else{
        view +=1;
      }
      generatePlan(path,view);
      generateRender(path,data,selection,facility,room,fixture,target,system,cct,time,view);
      generateAdjustments(data,selection,facility,room,fixture,target,system,cct,time,view);
    });
  }
}

function generatePlan(path,view){
  $('#final_plan_img').attr('src',path.plan[view]);
}

function generateFixtures(fixture){
  fixture = fixture.replace(/\s/g,'').split('+');
  str = '';
  for (var i = 0; i < fixture.length; i++){
    str += '<div class="mb-2 fixture-container">';
    str += '  <img class="m-0 px-1" src="img/application/fixtures/'+fixture[i]+'.png" alt="Fixture Image">';
    str += '</div>';
  }
  $('#final_fixtures').html(str);
}

function generateAdjustments(data,selection,facility,room,fixture,target,system,cct,time,view){
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
  for (var i = 0; i < cct_count; i++){
    cct_str += '<div data-value="'+i+'" class="mb-2 cct-border adjustment-container adjustment-container-cct adjustment-container'+cct_count;
    if (i == cct_selected){
      cct_str += ' cct-selected';
    }
    cct_str += '">';
    cct_str += '  <img class="m-0 p-0" src="img/application/adjustments/'+cct_count+' '+Object.keys(data[facility][room][fixture][target][system])[i]+'.jpg"/>';
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
      tod_str += '<div data-value="'+i+'" class="mb-2 tod-border adjustment-container adjustment-container-tod adjustment-container'+tod_count;
      if (i == tod_selected){
        tod_str += ' tod-selected';
      }
      tod_str += '">';
      tod_str += '  <img class="m-0 p-0" src="img/application/adjustments/'+tod_count+' '+i+'.jpg"/>';
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
    generateRender(path,data,selection,facility,room,fixture,target,system,cct,time,view);
    generateFinalBreadcrumb(data,selection,facility,room,fixture,target,system,cct);
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
    generateRender(path,data,selection,facility,room,fixture,target,system,cct,time,view);
  });


}

function generateContent(data,selection,facility,room,fixture,target,system,cct,time,view){
  //Hide the modal and remove necessary landing page content
  $('#application-modal').modal('hide');
  $('body').removeClass('modal-open');
  $('.modal-backdrop').remove();
  $('#landing-content').remove();
  $('body').removeAttr('data-vide-bg');
  $('body').removeAttr('data-vide-options');
  if ($('body').find('div').first().attr('id') != 'navbar' && $('body').find('div').first().attr('id') != 'application-modal'){
    console.log($('body').find('div').first());
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

  if ($('#final_content').length==0){
    buildHTML();
  }
  generateDescription(data,facility,room,fixture);
  generateRender(path,data,selection,facility,room,fixture,target,system,cct,time,view);
  generatePlan(path,view);
  generateAdjustments(data,selection,facility,room,fixture,target,system,cct,time,view);
  generateFinalBreadcrumb(data,selection,facility,room,fixture,target,system,cct);
  generateFixtures(fixture);
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
