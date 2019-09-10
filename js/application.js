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

function cacheSelectionImages(selection,type){
  var images = [];
  if (type=="all"){
    var keys = Object.keys(selection);
    for (var i = 0; i < keys.length; i++){
      var key = keys[i];
      var _keys = Object.keys(selection[key])
      for (var j = 0; j < _keys.length; j++){
        if (_keys[j] == "desc"){
          continue;
        }
        var _key = _keys[j];
        images.push(selection[key][_key]["img"]);
      }
    }
  }else{
    var key = type;
    var keys = Object.keys(selection[key])
    for (var i = 0; i < keys.length; i++){
      if (keys[i] == "desc"){
        continue;
      }
      var _key = keys[i];
      images.push(selection[key][_key]["img"]);
    }
  }
  cacheImages(images);
}

function cacheFinalImages(hb,data){
  var images = [];

  // Fixtures
  var fixture = data.fixture.replace(/\s/g,'').replace('Blue/Red','').replace('Blue', '').replace('Red','').split('+');
  var fixtures = [];
  for (var i = 0; i < fixture.length; i++){
    fixtures.push('img/application/fixtures/'+fixture[i]+'.png');
  }
  images.push(fixtures);

  //CCT
  var cct_count = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system]).length;
  var ccts = [];

  for (var i = 0; i < cct_count; i++){
    var _cct = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system])[i];
    if (data.system == "Static"){
      ccts.push('img/application/adjustments/cct/' + cct_count + ' ' +  _cct + '.jpg');
    }else{
      ccts.push('img/application/adjustments/cct/' + cct_count+ ' ' +_cct.replace(/\s/g, '').replace(/>/g,'') + '.jpg');
    }
  }
  images.push(ccts);

  // ToD
  if (data.system == "Static"){
    var tod_count = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system])[0].length;
    var tods = [];
    for (var i = 0; i < tod_count; i++){
      var _tod = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system])[0][i];
      tods.push('img/application/adjustments/tod/' + tod_count + ' ' + _tod.replace(/\s/g, '').replace(/\//g, '-').replace('0.1','').replace('0.2','').replace('0.3','').replace('0.4','') + '.jpg');
    }
    images.push(tods);
  }


  // Render and Plan
  var path = hb[data.facility][data.room][data.fixture][data.target][data.system];
  var keys = Object.keys(path);
  for (var i = 0; i < keys.length; i++){
    var key = keys[i];
    var _keys = Object.keys(path[key]);
    for (var j = 0; j < _keys.length; j++){
      var _key = _keys[j];
      images.push(path[key][_key]["plan"]);
      images.push(path[key][_key]["render"]);
    }
  }
  cacheImages(images);
}

// From jfriend00 on Stack Overflow https://stackoverflow.com/questions/10240110/how-do-you-cache-an-image-in-javascript
function cacheImages(images) {
  if (!cacheImages.list) {
    cacheImages.list = [];
  }
  var list = cacheImages.list;
  for (var i = 0; i < images.length; i++) {
    var img = new Image();
    img.onload = function() {
      var index = list.indexOf(this);
      if (index !== -1) {
        // remove image from the images once it's loaded
        // for memory consumption reasons
        list.splice(index, 1);
      }
    }
    list.push(img);
    img.src = images[i];
  }
}

function main(hb_json,selection_json){
  var data = {
    facility : "",
    room : "",
    fixture : "",
    target : "",
    system : "",
    cct : "",
    time : "",
    view: 0,
    infants: 0
  }
  getFacility(hb_json,selection_json,data);
}

function checkModalSize(values){
  var size = values.length;
  for (var i = 0; i < values.length; i++){
    if (values[i] == 'desc'){
      size -= 1;
    }
  }
  if (size < 3){
    $('#modalSize').removeClass('modal-xl');
    $('#modalSize').addClass('modal-lg');
  }else{
    $('#modalSize').removeClass('modal-lg');
    $('#modalSize').addClass('modal-xl');
  }
}

function generateModalBreadcrumb(hb,selection,data,current){
  if (current == "facility"){
    $('#application-modal-breadcrumb').html('<li class="breadcrumb-item">Facility</li>');
  }
  if (current == "room"){
    $('#application-modal-breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="repick-facility">'+data.facility+'</a></li><li class="breadcrumb-item">Room</li>');
  }
  if (current == "fixture"){
    $('#application-modal-breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="repick-facility">'+data.facility+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-room">'+data.room+'</a></li><li class="breadcrumb-item">Fixture</li>');
  }
  if (current == "target"){
    $('#application-modal-breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="repick-facility">'+data.facility+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-room">'+data.room+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-fixture">'+data.fixture+'</a></li><li class="breadcrumb-item">Target CS</li>');
  }
  if (current == "system"){
    $('#application-modal-breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="repick-facility">'+data.facility+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-room">'+data.room+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-fixture">'+data.fixture+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-target">'+data.target+'</a></li><li class="breadcrumb-item">CCT System</li>');
  }
  if (current == "cct"){
    $('#application-modal-breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="repick-facility">'+data.facility+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-room">'+data.room+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-fixture">'+data.fixture+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-target">'+data.target+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-system">'+data.system+'</a></li><li class="breadcrumb-item">CCT</li>');
  }
  $('#repick-facility').click(function(){
    data.facility = "", data.room = "", data.fixture = "", data.target = "", data.system = "", data.cct = "", data.time = "";
    getFacility(hb,selection,data);
  });
  $('#repick-room').click(function(){
    data.room = "", data.fixture = "", data.target = "", data.system = "", data.cct = "", data.time = "";
    getRoom(hb,selection,data);
  });
  $('#repick-fixture').click(function(){
    data.fixture = "", data.target = "", data.system = "", data.cct = "", data.time = "";
    getFixture(hb,selection,data);
  });
  $('#repick-target').click(function(){
    data.target = "", data.system = "", data.cct = "", data.time = "";
    getTarget(hb,selection,data);
  });
  $('#repick-system').click(function(){
    data.system = "", data.cct = "", data.time = "";
    getSystem(hb,selection,data);
  });
  $('#repick-cct').click(function(){
    data.cct = "", data.time = "";
    getCCT(hb,selection,data);
  });
}

function getFacility(hb,selection,data){
  var facilities = Object.values(hb);
  checkModalSize(Object.keys(hb));
  generateModalBreadcrumb(hb,selection,data,"facility");
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a Facility <i class="modal-label-caret fas fa-caret-down"></i> <p class="collapse" id="application-modal-desc">'+selection["Facility"]["desc"]+'</p>');
  $('#application-modal-desc').html(selection["Facility"]["desc"]);
  cacheSelectionImages(selection,"Room");
  for (var i = 0; i < facilities.length; i++){
    var _facility = Object.keys(hb)[i];
    var __facility = _facility.replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__facility+'" data-value="'+_facility+'"><img class="card-img-top card-img-top-facility" src="'+selection["Facility"][_facility]["img"]+'" alt="Facility" /><div class="card-body"><h5 class="card-title">'+_facility+'</h5><hr/><p class="card-text">'+selection["Facility"][_facility]["desc"]+'</p></div></a></div>');
    $('#'+__facility).click(function(){
      data.facility = $(this).data("value");
      getRoom(hb,selection,data);
    });
  }
}

function getRoom(hb,selection,data){
  var rooms = Object.values(hb[data.facility]);
  checkModalSize(Object.keys(hb[data.facility]));
  generateModalBreadcrumb(hb,selection,data,"room");
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a Room <i class="modal-label-caret fas fa-caret-down"></i> <p class="collapse" id="application-modal-desc">'+selection["Room"]["desc"]+'</p>');
  cacheSelectionImages(selection,"Fixture");
  for (var i = 0; i < rooms.length; i++){
    var _room = Object.keys(hb[data.facility])[i];
    var __room = _room.replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__room+'" data-value="'+_room+'"><img class="card-img-top" src="'+selection["Room"][_room]["img"]+'" alt="Room" /><div class="card-body"><h5 class="card-title">'+_room+'</h5><hr/><p class="card-text">'+selection["Room"][_room]["desc"]+'</p></div></a></div>');
    $('#'+__room).click(function(){
      data.room = $(this).data("value");
      getFixture(hb,selection,data);
    });
  }
}

function getFixture(hb,selection,data){
  var fixtures = Object.values(hb[data.facility][data.room]);
  checkModalSize(Object.keys(hb[data.facility][data.room]));
  generateModalBreadcrumb(hb,selection,data,"fixture");
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose Fixture(s) <i class="modal-label-caret fas fa-caret-down"></i> <p class="collapse" id="application-modal-desc">'+selection["Fixture"]["desc"]+'</p>');
  cacheSelectionImages(selection,"Target");
  for (var i = 0; i < fixtures.length; i++){
    var _fixture = Object.keys(hb[data.facility][data.room])[i];
    if (_fixture == "desc"){
      continue;
    }
    var __fixture = _fixture.replace("[^a-zA-Z]", "").replace(/\//g, '').replace(/\s/g, '').replace(/\+/g, "");
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__fixture+'" data-value="'+_fixture+'"><img class="card-img-top" src="'+selection["Fixture"][_fixture]["img"]+'" alt="Fixture" /><div class="card-body"><h5 class="card-title">'+_fixture+'</h5><hr/><p class="card-text">'+selection["Fixture"][_fixture]["desc"]+'</p></div></a></div>');
    $('#'+__fixture).click(function(){
      data.fixture = $(this).data("value");
      getTarget(hb,selection,data);
    });
  }
}

function getTarget(hb,selection,data){
  var targets = Object.values(hb[data.facility][data.room][data.fixture]);
  checkModalSize(Object.keys(hb[data.facility][data.room][data.fixture]));
  generateModalBreadcrumb(hb,selection,data,"target");
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a Target CS <i class="modal-label-caret fas fa-caret-down"></i> <p class="collapse" id="application-modal-desc">'+selection["Target"]["desc"]+'</p>');
  cacheSelectionImages(selection,"System");
  for (var i = 0; i < targets.length; i++){
    var _target = Object.keys(hb[data.facility][data.room][data.fixture])[i];
    var __target = _target.split(".").pop().replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__target+'" data-value="'+_target+'"><img class="card-img-top" src="'+selection["Target"][_target]["img"]+'" alt="Target CS" /><div class="card-body"><hr/><p class="card-text">'+selection["Target"][_target]["desc"]+'</p></div></a></div>');
    $('#'+__target).click(function(){
      data.target = $(this).data("value");
      getSystem(hb,selection,data);
    });
  }
}

function getSystem(hb,selection,data){
  var systems = Object.values(hb[data.facility][data.room][data.fixture][data.target]);
  checkModalSize(Object.keys(hb[data.facility][data.room][data.fixture][data.target]));
  generateModalBreadcrumb(hb,selection,data,"system");
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a System <i class="modal-label-caret fas fa-caret-down"></i> <p class="collapse" id="application-modal-desc">'+selection["System"]["desc"]+'</p>');
  cacheSelectionImages(selection,"CCT");
  for (var i = 0; i < systems.length; i++){
    var _system = Object.keys(hb[data.facility][data.room][data.fixture][data.target])[i];
    if (_system == "plan"){
      continue;
    }
    var __system = _system.replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__system+'" data-value="'+_system+'"><img class="card-img-top" src="'+selection["System"][_system]["img"]+'" alt="CCT System" /><div class="card-body"><h5 class="card-title">'+_system+'</h5><hr/><p class="card-text">'+selection["System"][_system]["desc"]+'</p></div></a></div>');
    $('#'+__system).click(function(){
      data.system = $(this).data("value");
      getCCT(hb,selection,data);
    });
  }
}

function getCCT(hb,selection,data){
  var ccts = Object.values(hb[data.facility][data.room][data.fixture][data.target][data.system]);
  checkModalSize(Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system]));
  generateModalBreadcrumb(hb,selection,data,"cct");
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a CCT <i class="modal-label-caret fas fa-caret-down"></i> <p class="collapse" id="application-modal-desc">'+selection["CCT"]["desc"]+'</p>');
  cacheFinalImages(hb,data);
  for (var i = 0; i < ccts.length; i++){
    var _cct = (Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system])[i]).replace(/R/g,'').replace(/B/g,'').replace(/W/g,'').replace(/\s\s+/g, ' ').trim();
    var __cct = inWords(_cct.split("K")[0].replace(/\s/g, '')).replace("[^a-zA-Z]", "").replace(/\s/g, '');
    var ___cct = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system])[i];
    var _target = '0.4';
    if (data.target == '0.3'){
      _target = data.target;
    }
    if (data.system=='Tunable'){
      $('#application-modal-deck').append('<div class="card hover"><a id="'+__cct+'" data-value="'+___cct+'"><img class="card-img-top" src="'+selection["CCT"][_cct]["img"]+'" alt="CCT" /><div class="card-body"><hr/><p class="card-text">'+selection["CCT"][_cct]["desc"]+'</p></div></a></div>');
    }else{
      $('#application-modal-deck').append('<div class="card hover"><a id="'+__cct+'" data-value="'+___cct+'"><img class="card-img-top" src="'+selection["CCT"][_cct]["img"]+'" alt="CCT" /><div class="card-body"><h5 class="card-title">'+_cct+'</h5><hr/><p class="card-text">'+selection["CCT"][_cct]["desc"]+'</p></div></a></div>');
    }
    $('#'+__cct).click(function(){
      data.cct = $(this).data("value");
      if (data.system == "Tunable"){
        data.time = "N/A"
      }else{
        data.time = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system][data.cct])[0];
      }
      generateContent(hb,selection,data);
    });
  }
}

function buildHTML(){
  var str = '';

  str += '<div id="final_content" class="container-fluid">';
  str += '  <div class="row pt-3">';
  str += '    <div class="col-xl-9 col-lg-12 pr-4">';
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
  str += '                    <div class="bc-facility bc-selection" data-toggle="modal" data-target="#application-modal"></div>'
  str += '                  </div>';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">Room</div>';
  str += '                    <div class="bc-room bc-selection" data-toggle="modal" data-target="#application-modal"></div>'
  str += '                  </div>';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">Fixture</div>';
  str += '                    <div class="bc-fixture bc-selection" data-toggle="modal" data-target="#application-modal"></div>'
  str += '                  </div>';
  str += '                </div>';
  str += '                <div class="row bc-row">';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">Target CS</div>';
  str += '                    <div class="bc-target bc-selection" data-toggle="modal" data-target="#application-modal"></div>';
  str += '                  </div>';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">CCT System</div>';
  str += '                    <div class="bc-system bc-selection" data-toggle="modal" data-target="#application-modal"></div>';
  str += '                  </div>';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">CCT</div>';
  str += '                    <div class="bc-cct bc-selection" data-toggle="modal" data-target="#application-modal"></div>';
  str += '                  </div>';
  str += '                </div>';
  str += '              </div>';
  str += '            </div>';
  str += '          </div>';
  str += '        </div>';
  str += '      </div>';
  str += '      <div class="row mb-4 bc-xsmall">';
  str += '        <div class="col px-0">';
  str += '          <div class="card drop-shadow">';
  str += '            <div class="card-body p-0">';
  str += '              <div class="container-fluid">';
  str += '                <div class="row bc-row">';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">Facility</div>';
  str += '                    <div class="bc-facility bc-selection" data-toggle="modal" data-target="#application-modal"></div>'
  str += '                  </div>';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">Room</div>';
  str += '                    <div class="bc-room bc-selection" data-toggle="modal" data-target="#application-modal"></div>'
  str += '                  </div>';
  str += '                </div>';
  str += '                <div class="row bc-row">';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">Fixture</div>';
  str += '                    <div class="bc-fixture bc-selection" data-toggle="modal" data-target="#application-modal"></div>'
  str += '                  </div>';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">Target CS</div>';
  str += '                    <div class="bc-target bc-selection" data-toggle="modal" data-target="#application-modal"></div>';
  str += '                  </div>';
  str += '                </div>';
  str += '                <div class="row bc-row">';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">CCT System</div>';
  str += '                    <div class="bc-system bc-selection" data-toggle="modal" data-target="#application-modal"></div>';
  str += '                  </div>';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">CCT</div>';
  str += '                    <div class="bc-cct bc-selection" data-toggle="modal" data-target="#application-modal"></div>';
  str += '                  </div>';
  str += '                </div>';
  str += '              </div>';
  str += '            </div>';
  str += '          </div>';
  str += '        </div>';
  str += '      </div>';
  str += '      <div class="row">';
  str += '        <div class="col-xl-6 col-lg-12 mb-4">';
  str += '          <div id class="card drop-shadow">';
  str += '            <div id="final_render">';
  str += '              <img id="final_render_img" class="card-img-top" src="" alt="Selection Render" />';
  str += '            </div>';
  str += '            <div id="final_adjustments" class="card-body card-body-small-padding pb-0"></div>';
  str += '          </div>';
  str += '        </div>';
  str += '        <div class="col-xl-6 col-lg-12 mb-4">';
  str += '          <div class="card drop-shadow">';
  str += '            <div id="final_plan">';
  str += '              <img id="final_plan_img" class="card-img-top p-2" src="" alt="Selection Lighting Plan" />';
  str += '            </div>';
  str += '            <div id="final_fixtures" class="card-body card-body-small-padding pb-0"></div>';
  str += '          </div>';
  str += '        </div>';
  str += '      </div>';
  str += '      <div class="row">';
  str += '        <div class="col mb-4">';
  str += '          <div class="card">';
  str += '            <div class="card-body card-body-small-padding pb-0 drop-shadow">';
  str += '              <div class="container-fluid">';
  str += '                <div class="row">';
  str += '                  <div class="col-md-6 pl-0 pr-0">';
  str += '                    <div id="final_cs_graph" class="padding-right-16">';
  str += '                      <img id="final_cs_graph_img" class="w-100 pr-2" src="" />';
  str += '                    </div>';
  str += '                  </div>';
  str += '                  <div class="col-md-6">';
  str += '                    <img class="w-100" src="" />';
  str += '                  </div>';
  str += '                </div>';
  str += '              </div>';
  str += '            </div>';
  str += '          </div>';
  str += '        </div>';
  str += '      </div>';
  str += '    </div>';
  str += '    <div class="col-xl-3 col-lg-12 right-panel-col">';
  str += '      <div class="card drop-shadow right-panel">';
  str += '        <div class="card-body card-body-small-padding">';
  str += '          <div class="card right-panel-card">';
  str += '            <a class="right-panel-expandable" data-toggle="collapse" data-target="#roomDescriptionContentContainer" aria-expanded="true" aria-controls="roomDescriptionContentContainer">';
  str += '              <div class="card-body pb-0">';
  str += '                <h5 class="card-title right-panel-h5 mb-0">Room Description</h5>';
  str += '                <div id="roomDescriptionContentContainer" class="right-panel-content-container right-panel-content collapse show">';
  str += '                <hr class="right-panel-hr"/>';
  str += '                <p id="roomDescriptionContent" class="card-text right-panel-p"></p>'
  str += '                </div>';
  str += '              </div>';
  str += '            </a>';
  str += '          </div>';
  str += '          <div class="card right-panel-card">';
  str += '            <a class="right-panel-expandable collapsed" data-toggle="collapse" data-target="#assumptionsContentContainer" aria-expanded="false" aria-controls="assumptionsContentContainer">';
  str += '              <div class="card-body pb-0">';
  str += '                <h5 class="card-title right-panel-h5 mb-0">Assumptions</h5>';
  str += '                <div id="assumptionsContentContainer" class="right-panel-content-container right-panel-content collapse"><hr class="right-panel-hr"/>';
  str += '                  <h6 class="reflectance-title">Room reflectances:</h6>';
  str += '                  <p class="right-panel-p mb-2 ml-3">A room’s finishing material and color can change perception of space as well as reflect or absorb light to affect how much gets to the eye. Reflectances are based on a percentage of how much light is reflected off a surface.</p>';
  str += '                  <p class="reflectance-grey-box">Ceiling: 80% (0.8) <br /> Walls: 50% (0.5) <br /> Floor: 20% (0.2)</p>';
  str += '                  <h6 class="reflectance-title">Height of illuminance calculation points:</h6>';
  str += '                  <p class="right-panel-p mb-2 ml-3">When determining how light performs in a space, it is important to know the height at which people’s eyes will receive light (EV) and the height at which tasks are being done (EH).</p>';
  str += '                  <p class="reflectance-grey-box">Horizontal illuminance (EH): 2’-6” AFF <br /> Vertical illuminance (EV): 4’-0” AFF</p>';
  str += '                  <h6 class="reflectance-title">Dimming system:</h6>';
  str += '                  <p class="right-panel-p mb-2 ml-3">Knowing how your dimming system operates is important to determine what percent output your lights should be as brightness levels vary throughout the day.</p>';
  str += '                  <p class="reflectance-grey-box">Linear dimming system</p>';
  str += '                  <h6 class="reflectance-title">Light Loss Factors:</h6>';
  str += '                  <p class="right-panel-p mb-2 ml-3">When determining how light fixtures perform over time, it is important to know the depreciation over time. With light loss factors accounted for, light received from a fixture will decrease over time.</p>';
  str += '                  <p class="reflectance-grey-box">No light loss factors accounted for</p>';
  str += '                  <h6 class="reflectance-title">Relationship between lumen output and wattage:</h6>';
  str += '                  <p class="right-panel-p mb-2 ml-3">Changing the lumen output of a fixture will change how much light is in a space. Lumen output from a fixture is important to know achieve light levels to determine energy usage, wattage must also be known.</p>';
  str += '                  <p class="reflectance-grey-box">Linear relationship between fixture lumen output and wattage</p>';
  str += '                </div>';
  str += '              </div>';
  str += '            </a>'
  str += '          </div>';
  str += '          <div class="card right-panel-card">';
  str += '            <div class="card-body pb-0">';
  str += '              <h5 class="card-title right-panel-h5 mb-0">Lighting Solutions</h5>';
  str += '            </div>';
  str += '          </div>';
  str += '          <div class="card right-panel-card">';
  str += '            <a class="right-panel-expandable collapsed" data-toggle="collapse" data-target=".fixturesContentContainer" aria-expanded="false" aria-expanded="false" aria-controls="fixtureContentContainer">';
  str += '              <div id="fixture_card" class="card-body pb-0">';
  str += '                <h5 class="card-title right-panel-h5 mb-0">Fixtures</h5>';
  str += '                <div class="fixturesContentContainer right-panel-content-container right-panel-content collapse">';
  str += '                 <hr class="right-panel-hr"/>';
  str += '                 <div class="container-fluid px-0">';
  str += '                   <div class="row mb-3">';
  str += '                     <div class="col fixture-header">';
  str += '                        <h5 id="fixture_name" class="text-center mb-0 fixture-title"></h5>';
  str += '                      </div>';
  str += '                    </div>';
  str += '                    <div class="row mb-2">';
  str += '                      <div class="col-md-6 pr-1">';
  str += '                        <img id="fixture_fixture" class="w-100" src=""/>'
  str += '                      </div>';
  str += '                      <div class="col-md-6 pl-1">';
  str += '                       <img id="fixture_candela" class="w-100" src=""/>'
  str += '                      </div>';
  str += '                    </div>';
  str += '                    <div class="row mb-2">';
  str += '                      <div class="col px-0">';
  str += '                        <ul class="pl-3 my-4">';
  str += '                          <li class="card-text right-panel-p"><b>Amount: </b><span id="fixture_amount"></span></li>';
  str += '                          <li class="card-text right-panel-p"><b>Mounting type: </b><span id="fixture_type"></span></li>';
  str += '                          <li class="card-text right-panel-p"><b>Mounting height: </b><span id="fixture_height"></span></li>';
  str += '                          <li class="card-text right-panel-p"><b>Orientation: </b><span id="fixture_orientation"></span></li>';
  str += '                          <li class="card-text right-panel-p"><b>Dimensions: </b><span id="fixture_dimensions"></span></li>';
  str += '                          <li class="card-text right-panel-p"><b>Initial lumens per source: </b><span id="fixture_lumens"></span> lx</li>';
  str += '                          <li class="card-text right-panel-p"><b>Initial wattage per source: </b><span id="fixture_wattage"></span> W</li>';
  str += '                        </ul>';
  str += '                       <p class="pl-3 card-text right-panel-p"><b>Description: </b><span id="fixture_description"></span></p>';
  str += '                      </div>';
  str += '                    </div>';
  str += '                  </div>';
  str += '                </div>';
  str += '              </div>';
  str += '            </a>';
  str += '            <div class="card-footer fixtures-card-footer right-panel-content-container fixturesContentContainer collapse">';
  str += '              <ul id="fixture_footer" class="nav nav-tabs nav-tabs-footer card-footer-tabs">';
  str += '              </ul>';
  str += '            </div>';
  str += '          </div>';
  str += '          <div class="card right-panel-card">';
  str += '            <div class="card-body pb-0">';
  str += '              <h5 class="card-title right-panel-h5 mb-0">Charts</h5>';
  str += '            </div>';
  str += '          </div>';
  str += '        </div>';
  str += '      </div>';
  str += '    </div>';
  str += '  </div>';
  str += '</div>';

  $('body').append(str);
}

function generateFinalBreadcrumb(hb,selection,data){
  $.getJSON("json/alias.json", function(alias_result){
    var _facility = data.facility;
    var _room = data.room;
    var _fixture = data.fixture;
    var _target = data.target;
    var _system = data.system;
    var _cct = data.cct;
    $.each(alias_result,function(){
      for (var i = 0; i < Object.keys(this).length; i++){
        if (Object.keys(this)[i] == _facility){
          _facility = Object.values(this)[i];
        }
        if (Object.keys(this)[i] == _room){
          _room = Object.values(this)[i];
        }
        if (Object.keys(this)[i] == _fixture){
          _fixture = Object.values(this)[i];
        }
        if (Object.keys(this)[i] == _target){
          _target = Object.values(this)[i];
        }
        if (Object.keys(this)[i] == _system){
          _system = Object.values(this)[i];
        }
        if (Object.keys(this)[i] == _cct){
          _cct = Object.values(this)[i];
        }
      }
    });
    $('.bc-facility').html(_facility);
    $('.bc-room').html(_room);
    $('.bc-fixture').html(_fixture);
    $('.bc-target').html(_target);
    $('.bc-system').html(_system);
    if (_system == "Tunable"){
      $('.bc-cct').html("Dynamic");
    }else{
      $('.bc-cct').html(_cct);
    }
    $('.bc-facility').click(function(){
      var _data = {
        facility : "",
        room : "",
        fixture : "",
        target : "",
        system : "",
        cct : "",
        time : "",
        view: 0
      }
      getFacility(hb,selection,_data);
    });
    $('.bc-room').click(function(){
      var _data = {
        facility : data.facility,
        room : "",
        fixture : "",
        target : "",
        system : "",
        cct : "",
        time : "",
        view: 0
      }
      getRoom(hb,selection,data);
    });
    $('.bc-fixture').click(function(){
      var _data = {
        facility : data.facility,
        room : data.room,
        fixture : "",
        target : "",
        system : "",
        cct : "",
        time : "",
        view: 0
      }
      getFixture(hb,selection,data);
    });
    $('.bc-target').click(function(){
      var _data = {
        facility : data.facility,
        room : data.room,
        fixture : data.facility,
        target : "",
        system : "",
        cct : "",
        time : "",
        view: 0
      }
      getTarget(hb,selection,data);
    });
    $('.bc-system').click(function(){
      var _data = {
        facility : data.facility,
        room : data.room,
        fixture : data.facility,
        target : data.target,
        system : "",
        cct : "",
        time : "",
        view: 0
      }
      getSystem(hb,selection,data);
    });
    $('.bc-cct').click(function(){
      var _data = {
        facility : data.facility,
        room : data.room,
        fixture : data.facility,
        target : data.target,
        system : data.system,
        cct : "",
        time : "",
        view: 0
      }
      getCCT(hb,selection,data);
    });
  });
}

function generateDescription(hb,data){
  $('#roomDescriptionContent').html(hb[data.facility][data.room]["desc"]);
}

function generateFixtures(data){
  $.getJSON("json/fixtures.json", function(fixtures_result){
    $.each(fixtures_result,function(){
      var fixtures = this;
      var count = Object.values(fixtures[data.facility][data.room][data.fixture])[0].length;
      var str = '';
      for (var i = 0; i < count; i++){
        str += '<li class="nav-item nav-item-footer nav-item-footer-fixtures"><a ';
        if (i==0){
          str += 'id="fixture_change_first" ';
        }
        str += 'data-value="'+i+'" class="nav-link nav-link-footer text-center fixture-change">'+(i+1)+'</a></li>';
      }
      $('#fixture_footer').html(str);
      $('.fixture-change').click(function(){
        $('.fixture-change').removeClass('active');
        $(this).addClass('active');
        var index = $(this).data('value');
        var path = fixtures[data.facility][data.room][data.fixture];
        $('#fixture_name').html(path.name[index]);
        $('#fixture_fixture').attr('src','img/application/selection/3 Fixture/'+path.fixture[index]+'.jpg');
        $('#fixture_candela').attr('src','img/application/selection/3 Fixture/candela/'+path.candela[index]+'.jpg');
        $('#fixture_amount').html(path.amount[index]);
        $('#fixture_type').html(path.type[index]);
        $('#fixture_height').html(path.height[index]);
        $('#fixture_orientation').html(path.orientation[index]);
        $('#fixture_dimensions').html(path.dimensions[index]);
        $('#fixture_lumens').html(path.lumens[index]);
        $('#fixture_wattage').html(path.wattage[index]);
        $('#fixture_description').html(path.description[index]);
      });
      $('#fixture_change_first').trigger('click');
    });
  });
}

function handleRightPanelAccordion(){
  $('.right-panel-expandable').click(function(){
    var clicked = $(this);
    if(clicked.hasClass('collapsed')){
      $('.right-panel-expandable').each(function(){
        var other = $(this)
        if (!other.hasClass('collapsed')){
          other.find('.right-panel-content-container').each(function(){
            $(this).collapse('toggle');
          });
          if(other.next().hasClass('right-panel-content-container')){
            other.next().collapse('toggle');
          }
        }
      });
    }
  });
}

function generateCSGraph(data){
  var facility = data.facility;
  var room = data.room;
  var fixture = data.fixture;
  var target = data.target;
  var cct = data.cct;
  var str = 'img/application/cs graphs/' +facility+ '/' +facility.replace(/ /g,'')+ '_' +target+ '_' +cct.replace(/ /g,'').replace(/\>/g,'')+ '.jpg';

  if (facility == "Office" && room == "Private Office" && fixture == "Downlight + Blue/Red Wall Wash"){
    str = 'img/application/cs graphs/' +facility+ '/' +facility.replace(/ /g,'')+ '_' +cct.replace(/ /g,'').replace(/\>/g,'')+ '.jpg';
  }

  if (data.infants == 1){
    str = 'img/application/cs graphs/' +facility+ '/' +facility.replace(/ /g,'')+ '_infants_' + cct.replace(/ /g,'').replace(/\>/g,'')+ '.jpg';
  }

  $('#final_cs_graph_img').attr('src',str);

  $('#cs-graph-buttons').remove();
  if (room == "Neonatal Intensive Care Unit"){
    $('#final_cs_graph').append('<div id="cs-graph-buttons"><button id="nurses_button" class="btn btn-primary cs-graph-button">Nurses</button><button id="infants_button" class="btn btn-primary cs-graph-button">Infants</button></div>');
    if (data.infants == 1){
      $('#infants_button').addClass('active');
    }else{
      $('#nurses_button').addClass('active');

    }
    $('#nurses_button').click(function(){
      $('#infants_button').removeClass('active');
      $('#nurses_button').addClass('active');
      data.infants = 0;
      generateCSGraph(data);
    });
    $('#infants_button').click(function(){
      $('#nurses_button').removeClass('active');
      $('#infants_button').addClass('active');
      data.infants = 1;
      generateCSGraph(data);
    });
  }

}

function generateRender(hb,selection,path,data){
  $('#final_render_img').attr('src',path.render[data.view]);
  if (path.render.length > 1){
    $('#toggle_view').remove();
    $('#final_render').append('<button id="toggle_view" class="btn btn-primary toggle-view-button"><span class="icon-plan-man"></span><span class="toggle-view-text">Toggle View</span></button>');
    $('#toggle_view').click(function(){
     if (data.view == path.render.length-1){
        data.view = 0;
      }else{
        data.view +=1;
      }
      generatePlan(hb[data.facility][data.room][data.fixture][data.target],data.view);
      generateRender(hb,selection,path,data);
      generateAdjustments(hb,selection,data);
    });
  }
}

function generatePlan(path,view){
  console.log(path);
  $('#final_plan_img').attr('src',path.plan[view]);
}

function generateFixtureIcons(fixture){
  fixture = fixture.replace(/\s/g,'').replace('Blue/Red','').replace('Blue', '').replace('Red','').replace('/','').split('+');
  str = '';
  for (var i = 0; i < fixture.length; i++){
    str += '<div data-value="'+i+'" class="mb-2 px-1 fixture-container">';
    str += '  <img class="m-0 p-0" src="img/application/fixtures/'+fixture[i]+'.png" alt="Fixture Image">';
    str += '</div>';
  }
  $('#final_fixtures').html(str);

  $('.fixture-container').click(function(){
    var num = $(this).data('value');
    if(!$('.fixturesContentContainer').hasClass('show')){
      $('#fixture_card').trigger('click');
    }
    $('ul#fixture_footer li a').each(function(){
      if ($(this).data('value') == num){
        $(this).trigger('click');
      }
    });
  });
}

function generateAdjustments(hb,selection,data){
  $('#final_adjustments').html('');

  var cct_count = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system]).length;
  var tod_count = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system][data.cct]).length;
  var cct_str = '';
  var tod_str = '';

  // Get CCT buttons
  for (var i = 0; i < cct_count; i++){
    var _cct = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system])[i];
    cct_str += '<div data-value="'+i+'" class="mb-2 cct-border adjustment-container adjustment-container-cct adjustment-container'+cct_count;
    if (_cct == data.cct){
      cct_str += ' cct-selected';
    }
    cct_str += '">';
    cct_str += '  <img class="m-0 p-0" src="img/application/adjustments/cct/'+cct_count+' '+_cct.replace(/\s/g, '').replace(/>/g,'')+'.jpg"/>';
    cct_str += '</div>';
  }

  if (data.system == "Static"){
    // Get ToD Buttons
    for (var i = 0; i < tod_count; i++){
      var _tod = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system][data.cct])[i];
      tod_str += '<div data-value="'+i+'" class="mb-2 tod-border adjustment-container adjustment-container-tod adjustment-container'+tod_count;
      if (_tod == data.time){
        tod_str += ' tod-selected';
      }
      tod_str += '">';
      tod_str += '  <img class="m-0 p-0" src="img/application/adjustments/tod/'+tod_count+' '+_tod.replace(/\s/g, '').replace(/\//g, '-').replace('0.1','').replace('0.2','').replace('0.3','').replace('0.4','')+'.jpg"/>';
      tod_str += '</div>';
    }
  }

  // Build the buttons
  $('#final_adjustments').append(cct_str);
  $('#final_adjustments').append(tod_str);

  // Handle When the buttons are clicked
  $('.adjustment-container-cct').click(function(){
    $('#final_adjustments .cct-border').removeClass('cct-selected');
    $(this).addClass('cct-selected');

    data.cct = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system])[$(this).data("value")];
    if (data.system == "Tunable"){
      var path = hb[data.facility][data.room][data.fixture][data.target][data.system][data.cct];
    }else{
      var path = hb[data.facility][data.room][data.fixture][data.target][data.system][data.cct][data.time];
    }
    generateRender(hb,selection,path,data);
    generateFinalBreadcrumb(hb,selection,data);
    generateCSGraph(data,0);
  });
  $('.adjustment-container-tod').click(function(){
    $('#final_adjustments .tod-border').removeClass('tod-selected');
    $(this).addClass('tod-selected');

    data.time = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system][data.cct])[$(this).data("value")];
    var path = hb[data.facility][data.room][data.fixture][data.target][data.system][data.cct][data.time];
    generateRender(hb,selection,path,data);
  });
}

function generateContent(hb,selection,data){
  //Hide the modal and remove necessary landing page content
  $('#toggle_view').remove();
  $('#application-modal').modal('hide');
  $('body').removeClass('modal-open');
  $('.modal-backdrop').remove();
  $('#landing-content').remove();
  $('body').removeAttr('data-vide-bg');
  $('body').removeAttr('data-vide-options');
  if ($('body').find('div').first().attr('id') != 'navbar' && $('body').find('div').first().attr('id') != 'application-modal'){
    $('body').find('div').first().remove();
  }
  //Hide the modal and remove necessary landing page content

  //Get path of our render in the json file
  if (data.system == "Tunable"){
    var render_path = hb[data.facility][data.room][data.fixture][data.target][data.system][data.cct];
  }else{
    var render_path = hb[data.facility][data.room][data.fixture][data.target][data.system][data.cct][data.time];
  }
  //Get path of our render in the json file



  if ($('#final_content').length==0){
    buildHTML();
  }
  generateRender(hb,selection,render_path,data);
  generatePlan(hb[data.facility][data.room][data.fixture][data.target],data.view);
  generateAdjustments(hb,selection,data);
  generateFixtureIcons(data.fixture);
  generateCSGraph(data);
  generateFinalBreadcrumb(hb,selection,data);
  generateDescription(hb,data);
  generateFixtures(data);
  handleRightPanelAccordion();
}

$(document).ready(function(){

  // Avoids Firefox throwing a warning when reading JSON
  $.ajaxSetup({beforeSend: function(xhr){
    if (xhr.overrideMimeType){
      xhr.overrideMimeType("application/json");
    }
  }});
  // Avoids Firefox throwing a warning when reading JSON

  //Get HealthyBuildings JSON and assign it to hb varibale
  var hb_json;
  $.getJSON("json/healthyBuildings.json", function(hb_result){
    $.each(hb_result,function(){
      hb_json = this;
    });
  });
  //Get HealthyBuildings JSON and assign it to hb varibale

  //Get selection JSON and assign it to selection variable
  var selection_json;
  $.getJSON("json/selection.json", function(selection_result){
    $.each(selection_result,function(){
      selection_json = this;
      cacheSelectionImages(selection_json,"Facility");
    });
  });
  //Get selection JSON and assign it to selection variable

  $('#begin').click(function(){
    main(hb_json,selection_json);
  });
});
