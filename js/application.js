/*jshint esversion: 8 */
/*jshint -W030 */
/*jshint -W083 */
var hb, selection;
var data = {};

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

function cacheSelectionImages(type){
  var images = [];
  var key, _key, keys, _keys;
  var i, j;
  if (type=="all"){
    keys = Object.keys(selection);
    for (i = 0; i < keys.length; i++){
      key = keys[i];
      _keys = Object.keys(selection[key]);
      for (j = 0; j < _keys.length; j++){
        if (_keys[j] == "desc"){
          continue;
        }
        _key = _keys[j];
        images.push(selection[key][_key].img);
      }
    }
  }else{
    key = type;
    keys = Object.keys(selection[key]);
    for (i = 0; i < keys.length; i++){
      if (keys[i] == "desc"){
        continue;
      }
      _key = keys[i];
      images.push(selection[key][_key].img);
    }
  }
  cacheImages(images);
}

function cacheFinalImages(){
  var images = [];
  var i, j;

  // Fixtures
  var fixture = data.fixture.replace(/\s/g,'').replace('Blue/Red','').replace('Blue', '').replace('Red','').split('+');
  var fixtures = [];
  for (i = 0; i < fixture.length; i++){
    fixtures.push('img/application/fixtures/'+fixture[i]+'.png');
  }
  images.push(fixtures);

  //CCT
  var cct_count = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system]).length;
  var ccts = [];

  for (i = 0; i < cct_count; i++){
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
    for (i = 0; i < tod_count; i++){
      var _tod = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system])[0][i];
      tods.push('img/application/adjustments/tod/' + tod_count + ' ' + _tod.replace(/\s/g, '').replace(/\//g, '-').replace('0.1','').replace('0.2','').replace('0.3','').replace('0.4','') + '.jpg');
    }
    images.push(tods);
  }


  // Render and Plan
  var path = hb[data.facility][data.room][data.fixture][data.target][data.system];
  var keys = Object.keys(path);
  for (i = 0; i < keys.length; i++){
    var key = keys[i];
    var _keys = Object.keys(path[key]);
    for (j = 0; j < _keys.length; j++){
      var _key = _keys[j];
      images.push(path[key][_key].plan);
      images.push(path[key][_key].render);
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
    };
    list.push(img);
    img.src = images[i];
  }
}

function main(){
  data = {
    facility : "",
    room : "",
    fixture : "",
    target : "",
    system : "",
    cct : "",
    time : "",
    view: 0,
    infants: 0,
    zone: 0
  };
  getFacility();
}

function checkModalSize(values){
  var size = values.length;
  for (var i = 0; i < values.length; i++){
    if (values[i] == 'desc' || values[i] == 'plan'){
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

function generateModalBreadcrumb(current){
  if (current == "facility"){
    $('#application-modal-breadcrumb').html('<li class="breadcrumb-item">Facility</li>');
  }
  if (current == "room"){
    $('#application-modal-breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="repick-facility">'+data.facility+'</a></li><li class="breadcrumb-item">Room</li>');
  }
  if (current == "fixture"){
    $('#application-modal-breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="repick-facility">'+data.facility+'</a></li><li class="breadcrumb-item"><a href="#" id="repick-room">'+data.room+'</a></li><li class="breadcrumb-item">Luminaire</li>');
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
    data.facility = "", data.room = "", data.fixture = "", data.target = "", data.system = "", data.cct = "", data.time = '';
    getFacility();
  });
  $('#repick-room').click(function(){
    data.room = "", data.fixture = "", data.target = "", data.system = "", data.cct = "", data.time = "";
    getRoom();
  });
  $('#repick-fixture').click(function(){
    data.fixture = "", data.target = "", data.system = "", data.cct = "", data.time = "";
    getFixture();
  });
  $('#repick-target').click(function(){
    data.target = "", data.system = "", data.cct = "", data.time = "";
    getTarget();
  });
  $('#repick-system').click(function(){
    data.system = "", data.cct = "", data.time = "";
    getSystem();
  });
  $('#repick-cct').click(function(){
    data.cct = "", data.time = "";
    getCCT();
  });
}

function getFacility(){
  var facilities = Object.values(hb);
  checkModalSize(Object.keys(hb));
  generateModalBreadcrumb("facility");
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a Facility <i class="modal-label-caret fas fa-caret-down"></i> <p class="collapse" id="application-modal-desc">'+selection.Facility.desc+'</p>');
  $('#application-modal-desc').html(selection.Facility.desc);
  cacheSelectionImages("Room");
  for (var i = 0; i < facilities.length; i++){
    var _facility = Object.keys(hb)[i];
    var __facility = _facility.replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__facility+'" data-value="'+_facility+'"><img class="card-img-top card-img-top-facility" src="'+selection.Facility[_facility].img+'" alt="Facility" /><div class="card-body"><h5 class="card-title">'+_facility+'</h5><hr/><p class="card-text selection-card-text">'+selection.Facility[_facility].desc+'</p></div></a></div>');
    $('#'+__facility).click(function(){
      data.facility = $(this).data("value");
      getRoom();
    });
  }
}

function getRoom(){
  var rooms = Object.values(hb[data.facility]);
  checkModalSize(Object.keys(hb[data.facility]));
  generateModalBreadcrumb("room");
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a Room <i class="modal-label-caret fas fa-caret-down"></i> <p class="collapse" id="application-modal-desc">'+selection.Room.desc+'</p>');
  cacheSelectionImages("Fixture");
  for (var i = 0; i < rooms.length; i++){
    var _room = Object.keys(hb[data.facility])[i];
    var __room = _room.replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__room+'" data-value="'+_room+'"><img class="card-img-top" src="'+selection.Room[_room].img+'" alt="Room" /><div class="card-body"><h5 class="card-title">'+_room+'</h5><hr/><p class="card-text">'+selection.Room[_room].desc+'</p></div></a></div>');
    $('#'+__room).click(function(){
      data.room = $(this).data("value");
      getFixture();
    });
  }
}

function getFixture(){
  var fixtures = Object.values(hb[data.facility][data.room]);
  checkModalSize(Object.keys(hb[data.facility][data.room]));
  generateModalBreadcrumb("fixture");
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose Luminaire(s) <i class="modal-label-caret fas fa-caret-down"></i> <p class="collapse" id="application-modal-desc">'+selection.Fixture.desc+'</p>');
  cacheSelectionImages("Target");
  for (var i = 0; i < fixtures.length; i++){
    var _fixture = Object.keys(hb[data.facility][data.room])[i];
    if (_fixture == "desc" || _fixture == "cs graph path"){
      continue;
    }
    var __fixture = _fixture.replace("[^a-zA-Z]", "").replace(/\//g, '').replace(/\s/g, '').replace(/\+/g, "");
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__fixture+'" data-value="'+_fixture+'"><img class="card-img-top" src="'+selection.Fixture[_fixture].img+'" alt="Fixture" /><div class="card-body"><h5 class="card-title">'+_fixture+'</h5><hr/><p class="card-text">'+selection.Fixture[_fixture].desc+'</p></div></a></div>');
    $('#'+__fixture).click(function(){
      data.fixture = $(this).data("value");
      getTarget();
    });
  }
}

function getTarget(){
  var targets = Object.values(hb[data.facility][data.room][data.fixture]);
  checkModalSize(Object.keys(hb[data.facility][data.room][data.fixture]));
  generateModalBreadcrumb("target");
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a Target CS <i class="modal-label-caret fas fa-caret-down"></i> <p class="collapse" id="application-modal-desc">'+selection.Target.desc+'</p>');
  cacheSelectionImages("System");
  for (var i = 0; i < targets.length; i++){
    var _target = Object.keys(hb[data.facility][data.room][data.fixture])[i];
    if (_target == "chart path"){
      continue;
    }
    var __target = _target.split(".").pop().replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__target+'" data-value="'+_target+'"><img class="card-img-top" src="'+selection.Target[_target].img+'" alt="Target CS" /><div class="card-body"><hr/><p class="card-text">'+selection.Target[_target].desc+'</p></div></a></div>');
    $('#'+__target).click(function(){
      data.target = $(this).data("value");
      getSystem();
    });
  }
}

function getSystem(){
  var systems = Object.values(hb[data.facility][data.room][data.fixture][data.target]);
  checkModalSize(Object.keys(hb[data.facility][data.room][data.fixture][data.target]));
  generateModalBreadcrumb("system");
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a System <i class="modal-label-caret fas fa-caret-down"></i> <p class="collapse" id="application-modal-desc">'+selection.System.desc+'</p>');
  cacheSelectionImages("CCT");
  for (var i = 0; i < systems.length; i++){
    var _system = Object.keys(hb[data.facility][data.room][data.fixture][data.target])[i];
    if (_system.startsWith("plan")){
      continue;
    }
    var __system = _system.replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#application-modal-deck').append('<div class="card hover"><a id="'+__system+'" data-value="'+_system+'"><img class="card-img-top" src="'+selection.System[_system].img+'" alt="CCT System" /><div class="card-body"><h5 class="card-title">'+_system+'</h5><hr/><p class="card-text">'+selection.System[_system].desc+'</p></div></a></div>');
    $('#'+__system).click(function(){
      data.system = $(this).data("value");
      getCCT();
    });
  }
}

function getCCT(){
  var ccts = Object.values(hb[data.facility][data.room][data.fixture][data.target][data.system]);
  checkModalSize(Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system]));
  generateModalBreadcrumb("cct");
  $('#application-modal-deck').html('');
  $('#application-modal-label').html('Choose a CCT <i class="modal-label-caret fas fa-caret-down"></i> <p class="collapse" id="application-modal-desc">'+selection.CCT.desc+'</p>');
  cacheFinalImages();
  for (var i = 0; i < ccts.length; i++){
    var _cct = (Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system])[i]).replace(/R/g,'').replace(/B/g,'').replace(/W/g,'').replace(/\s\s+/g, ' ').trim();
    var __cct = inWords(_cct.split("K")[0].replace(/\s/g, '')).replace("[^a-zA-Z]", "").replace(/\s/g, '');
    var ___cct = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system])[i];
    var _target = '0.4';
    if (data.target == '0.3'){
      _target = data.target;
    }
    if (data.system=='Tunable'){
      $('#application-modal-deck').append('<div class="card hover"><a id="'+__cct+'" data-value="'+___cct+'"><img class="card-img-top" src="'+selection.CCT[_cct].img+'" alt="CCT" /><div class="card-body"><hr/><p class="card-text">'+selection.CCT[_cct].desc+'</p></div></a></div>');
    }else{
      $('#application-modal-deck').append('<div class="card hover"><a id="'+__cct+'" data-value="'+___cct+'"><img class="card-img-top" src="'+selection.CCT[_cct].img+'" alt="CCT" /><div class="card-body"><h5 class="card-title">'+_cct+'</h5><hr/><p class="card-text">'+selection.CCT[_cct].desc+'</p></div></a></div>');
    }
    $('#'+__cct).click(function(){
      data.cct = $(this).data("value");
      if (data.system == "Tunable"){
        data.time = "N/A";
      }else{
        data.time = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system][data.cct])[0];
      }
      generateContent();
    });
  }
}

function buildHTML(){
  var str = '';

  str += '<div id="final_content" class="container-fluid">';
  str += '  <div class="row row-p">';
  str += '    <div class="col-xl-9 col-lg-12 col-p">';
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
  str += '                    <div class="bc-title">Luminaire(s)</div>';
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
  str += '                    <div class="bc-facility bc-selection" data-toggle="modal" data-target="#application-modal"></div>';
  str += '                  </div>';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">Room</div>';
  str += '                    <div class="bc-room bc-selection" data-toggle="modal" data-target="#application-modal"></div>';
  str += '                  </div>';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">Luminaire(s)</div>';
  str += '                    <div class="bc-fixture bc-selection" data-toggle="modal" data-target="#application-modal"></div>';
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
  str += '                    <div class="bc-facility bc-selection" data-toggle="modal" data-target="#application-modal"></div>';
  str += '                  </div>';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">Room</div>';
  str += '                    <div class="bc-room bc-selection" data-toggle="modal" data-target="#application-modal"></div>';
  str += '                  </div>';
  str += '                </div>';
  str += '                <div class="row bc-row">';
  str += '                  <div class="bc-item col px-0">';
  str += '                    <div class="bc-title">Luminaire(s)</div>';
  str += '                    <div class="bc-fixture bc-selection" data-toggle="modal" data-target="#application-modal"></div>';
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
  str += '        <div class="col-lg-6 col-md-12 mb-4">';
  str += '          <div class="card">';
  str += '            <div class="card-body card-body-small-padding drop-shadow">';
  str += '              <div class="container-fluid">';
  str += '                <div class="row">';
  str += '                  <div class="col-md-12 pl-0 pr-0">';
  str += '                    <div id="final_cs_graph">';
  str += '                      <img id="final_cs_graph_img" class="w-100 p-0" src="" />';
  str += '                    </div>';
  str += '                  </div>';
  str += '                </div>';
  str += '              </div>';
  str += '            </div>';
  str += '          </div>';
  str += '        </div>';
  str += '        <div class="col-lg-6 col-md-12 mb-4">';
  str += '          <div class="card">';
  str += '            <div class="card-body card-body-small-padding drop-shadow">';
  str += '              <div class="container-fluid">';
  str += '                <div class="row">';
  str += '                  <div class="col-md-12 p-0">';
  str += '                    <img id="final_cs_chart_img" class="w-100 p-0" src="" />';
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
  str += '            <a id="roomDescriptionTab" class="right-panel-expandable" data-toggle="collapse" data-target="#roomDescriptionContentContainer" aria-expanded="true" aria-controls="roomDescriptionContentContainer">';
  str += '              <div class="card-body pb-0">';
  str += '                <h5 class="card-title right-panel-h5 mb-0">Room Description</h5>';
  str += '                <div id="roomDescriptionContentContainer" class="right-panel-content-container right-panel-content collapse show">';
  str += '                  <div class="right-panel-padding">';
  str += '                   <hr class="right-panel-hr"/>';
  str += '                   <p id="roomDescriptionContent" class="card-text right-panel-p"></p>';
  str += '                  </div>';
  str += '                </div>';
  str += '              </div>';
  str += '            </a>';
  str += '          </div>';
  str += '          <div class="card right-panel-card">';
  str += '            <a class="right-panel-expandable collapsed" data-toggle="collapse" data-target="#assumptionsContentContainer" aria-expanded="false" aria-controls="assumptionsContentContainer">';
  str += '              <div class="card-body pb-0">';
  str += '                <h5 class="card-title right-panel-h5 mb-0">Assumptions</h5>';
  str += '                <div id="assumptionsContentContainer" class="right-panel-content-container right-panel-content collapse"><hr class="right-panel-hr"/>';
  str += '                  <div id="assumptionsContent" class="right-panel-padding">';
  str += '                    <h6 class="right-panel-outer-title">Room reflectances:</h6>';
  str += '                    <p class="right-panel-p mb-2 ml-3">A room’s finishing material and color can change perception of space as well as reflect or absorb light to affect how much reaches the eye. Reflectances are based on the percentage of light that is reflected off a surface.</p>';
  str += '                    <p class="right-panel-grey-box">Ceiling: 80% (0.8) <br /> Walls: 50% (0.5) <br /> Floor: 20% (0.2)</p><hr/>';
  str += '                    <h6 class="right-panel-outer-title">Illuminance calculation points:</h6>';
  str += '                    <p class="right-panel-p mb-2 ml-3">When determining how lighting performs in a space, it is important to determine the height and locations at which people’s eyes will receive light (E<sub>V</sub>) and the height at which tasks are performed (E<sub>H</sub>).</p>';
  str += '                    <p id="illuminance-info" class="right-panel-grey-box">E<sub>H</sub>: 2’-6” (0.76 m) above finished floor <br />E<sub>V</sub>: 4’-0” (1.22 m) above finished floor </p><hr/>';
  str += '                    <h6 class="right-panel-outer-title">Dimming system:</h6>';
  str += '                    <p class="right-panel-p mb-2 ml-3">Knowing how your dimming system operates helps to determine the lighting’s percentage output throughout the day.</p>';
  str += '                    <p class="right-panel-grey-box">Linear dimming system</p><hr/>';
  str += '                    <h6 class="right-panel-outer-title">Light loss factors:</h6>';
  str += '                    <p class="right-panel-p mb-2 ml-3">When determining how light luminaires perform over time, it is important to know how the luminaires’ depreciation rate might account for light loss factors over time.</p>';
  str += '                    <p class="right-panel-grey-box">No light loss factors accounted for</p><hr/>';
  str += '                    <h6 class="right-panel-outer-title">Relationship between lumen output and wattage:</h6>';
  str += '                    <p class="right-panel-p mb-2 ml-3">Knowing the luminaires’ lumen output will help to determine the amount of light that is delivered to a space. Knowing the luminaires’ wattage will also help to determine energy usage.</p>';
  str += '                    <p class="right-panel-grey-box">Linear relationship between fixture lumen output and wattage</p>';
  str += '                    <h6 class="right-panel-outer-title">SPD:</h6>';
  str += '                    <p class="right-panel-p mb-2 ml-3">A light source SPD plays a key role in how the circadian system will respond at varying light levels. It is crucial to check the SPD used in a design to determine target E<sub>V</sub> values for each project.</p>';
  str += '                  </div>';
  str += '                </div>';
  str += '              </div>';
  str += '            </a>';
  str += '          </div>';
  str += '          <div class="card right-panel-card">';
  str += '            <a class="right-panel-expandable collapsed" data-toggle="collapse" data-target="#lightingSolutionContentContainer" aria-expanded="false" aria-controls="lightingSolutionContentContainer">';
  str += '              <div class="card-body pb-0">';
  str += '                <h5 class="card-title right-panel-h5 mb-0">Lighting Solution</h5>';
  str += '                <div id="lightingSolutionContentContainer" class="right-panel-content-container right-panel-content collapse"><hr class="right-panel-hr"/>';
  str += '                <div id="lightingSolutionContent" class="right-panel-padding"></div>';
  str += '                </div>';
  str += '              </div>';
  str += '            </a>';
  str += '          </div>';
  str += '          <div class="card right-panel-card">';
  str += '            <a class="right-panel-expandable collapsed" data-toggle="collapse" data-target=".fixturesContentContainer" aria-expanded="false" aria-controls="fixtureContentContainer">';
  str += '              <div id="fixture_card" class="card-body pb-0">';
  str += '                <h5 class="card-title right-panel-h5 mb-0">Luminaire(s)</h5>';
  str += '                <div class="fixturesContentContainer right-panel-content-container right-panel-content collapse">';
  str += '                 <hr class="right-panel-hr"/>';
  str += '                 <div class="container-fluid px-0 right-panel-padding">';
  str += '                   <div class="row mb-3">';
  str += '                     <div class="col fixture-header">';
  str += '                       <h5 id="fixture_name" class="text-center mb-0 fixture-title"></h5>';
  str += '                     </div>';
  str += '                   </div>';
  str += '                   <div class="container-fluid fixture-scroll">';
  str += '                     <div class="row mb-2 pr-2">';
  str += '                       <div class="col-md-6 pr-1 pl-0">';
  str += '                         <img id="fixture_fixture" class="w-100" src=""/>';
  str += '                       </div>';
  str += '                       <div class="col-md-6 pl-1 pr-0">';
  str += '                         <img id="fixture_candela" class="w-100" src=""/>';
  str += '                       </div>';
  str += '                     </div>';
  str += '                    <div class="row mb-2">';
  str += '                       <div class="col px-0">';
  str += '                         <ul class="pl-0 my-4 no-bullets">';
  str += '                            <li class="card-text right-panel-p"><b>Quantity: </b><span id="fixture_amount"></span></li>';
  str += '                            <li class="card-text right-panel-p"><b>Mounting type: </b><span id="fixture_type"></span></li>';
  str += '                            <li class="card-text right-panel-p"><b>Mounting height: </b><span id="fixture_height"></span></li>';
  str += '                            <li class="card-text right-panel-p"><b>Orientation: </b><span id="fixture_orientation"></span></li>';
  str += '                            <li class="card-text right-panel-p"><b>Dimensions: </b><span id="fixture_dimensions"></span></li>';
  str += '                            <li class="card-text right-panel-p"><b>E<sub>V</sub>:E<sub>H</sub></b> <span id="fixture_eveh"></span></li>';
  str += '                          </ul>';
  str += '                          <div>';
  str += '                            <img id="fixture_lumens" class="w-100 mb-3" src="" />';
  str += '                          </div>';
  str += '                        <p class="card-text right-panel-p"><b>Description: </b><span id="fixture_description"></span></p>';
  str += '                        </div>';
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
  str += '            <a class="right-panel-expandable collapsed" data-toggle="collapse" data-target=".chartsContent" aria-expanded="false" aria-controls="chartsContent">';
  str += '              <div class="card-body pb-0">';
  str += '                <h5 class="card-title right-panel-h5 mb-0">Charts</h5>';
  str += '                <div class="chartsContent right-panel-content right-panel-content-container collapse">';
  str += '                  <hr class="right-panel-hr" />';
  str += '                    <div id="chart_images" class="right-panel-padding">';
  str += '                      <img id="chart_ev" class="mt-2 chart_img active"  src="" />';
  str += '                      <img id="chart_ratio" class="mt-2 d-none chart_img"  src="" />';
  str += '                      <img id="chart_lpd" class="mt-2 d-none chart_img"  src="" />';
  str += '                      <img id="chart_energy" class="mt-2 d-none chart_img"  src="" />';
  str += '                      <img id="chart_spd" class="mt-2 d-none chart_img"  src="" />';
  str += '                    </div>';
  str += '                </div>';
  str += '              </div>';
  str += '            </a>';
  str += '            <div class="card-footer chart-cart-footer chartsContent right-panel-content-container collapse">';
  str += '              <ul id="chart_footer" class="nav nav-tabs nav-tabs-footer card-footer-tabs">';
  str += '                <li class="nav-item nav-item-footer nav-item-footer-charts"><a id="show_chart_ev" class="nav-link nav-link-footer text-center active">E<sub>V</sub></a></li>';
  str += '                <li class="nav-item nav-item-footer nav-item-footer-charts"><a id="show_chart_ratio" class="nav-link nav-link-footer text-center">E<sub>V</sub>:E<sub>H</sub></a></li>';
  str += '                <li class="nav-item nav-item-footer nav-item-footer-charts"><a id="show_chart_lpd" class="nav-link nav-link-footer text-center">LPD</a></li>';
  str += '                <li class="nav-item nav-item-footer nav-item-footer-charts"><a id="show_chart_energy" class="nav-link nav-link-footer text-center">Energy</a></li>';
  str += '                <li class="nav-item nav-item-footer nav-item-footer-charts"><a id="show_chart_spd" class="nav-link nav-link-footer text-center">SPD</a></li>';
  str += '              </ul>';
  str += '            </div>';
  str += '          </div>';
  str += '          <div class="card right-panel-card">';
  str += '            <a class="right-panel-expandable collapsed" data-toggle="collapse" data-target="#disclaimerContentContainer" aria-expanded="false" aria-controls="disclaimerContentContainer">';
  str += '              <div class="card-body pb-0">';
  str += '                <h5 class="card-title right-panel-h5 mb-0">Disclaimers</h5>';
  str += '                <div id="disclaimerContentContainer" class="right-panel-content-container right-panel-content collapse">';
  str += '                  <div class="right-panel-padding">';
  str += '                   <hr class="right-panel-hr"/>';
  str += '                   <div id="disclaimerContent">';
  str += '                     <p class="card-text right-panel-p">There is no guarantee that these design patterns will cure diseases. These are based on existing literature suggesting that exposure to more circadian-effective light during the day leads to better sleep at night, reduced depression and improved behavior in certain populations. Regardless, these patterns are trying to emulate a more natural environment, or, in other words what one would be exposed to outside the built environment. Emulating the exact amount and spectrum of daylight using electric lighting only is likely not feasible to be done in the built environment, but the design patterns proposed here are an attempt to improve what is currently existent in the built environment.</p>';
  str += '                     <p class="card-text right-panel-p">The application page is for demonstration purposes only. Results will vary based on changing parameters such as project and products. These examples are meant to provide an understanding of what is needed to reach CS levels in a design and how different luminaire types or combination of luminaire types can perform. </p>';
  str += '                     <p class="card-text right-panel-p">All examples are designed to reach target CS values based on how much light is needed at the eye for specific SPDs. SPDs used in these designs are chosen from a collection of publicly available LED SPDs. Since spectrum impacts the circadian system, SPDs classified under the same CCT can vary greatly in the amount of illuminance needed at the eye to hit CS targets. The SPDs in these designs were chosen as the median in the collection of SPDs. Necessary lumen and wattage was scaled based on standard luminaires to reach the maximum CS targets in the suggested CS charts. For this reason, values may not be entirely realistic to achieve, however the site aims to show how varying luminaire types perform in terms of CS.</p>';
  str += '                     <p class="card-text right-panel-p">It is up to designers and manufacturers to follow these guidelines for determining CS, and collaborate to create products and designs that achieve these goals.</p>';
  str += '                     <p class="card-text right-panel-p">New additions to the CS model are being developed based on recent research discoveries. Vertical illuminance targets may vary slightly with this update, but not significantly. Application examples will be updated once changes to the model are complete. </p>';
  str += '                   </div>';
  str += '                  </div>';
  str += '                </div>';
  str += '              </div>';
  str += '            </a>';
  str += '          </div>';
  str += '        </div>';
  str += '      </div>';
  str += '    </div>';
  str += '  </div>';
  str += '</div>';
  str += '<footer class="flex-footer">';
  str += '<p class="footer-p">© '+new Date().getFullYear()+' Lighting Research Center All Right Reserved</p>';
  str += '</footer>';

  $('body').append(str);

  $('#showChart1').click(function(){
    $('#chart1').removeClass('d-none');
    $('#chart2').addClass('d-none');
    $('#chart3').addClass('d-none');
    $('#showChart1').addClass('active');
    $('#showChart2').removeClass('active');
    $('#showChart3').removeClass('active');
  });

  $('#showChart2').click(function(){
    $('#chart1').addClass('d-none');
    $('#chart2').removeClass('d-none');
    $('#chart3').addClass('d-none');
    $('#showChart1').removeClass('active');
    $('#showChart2').addClass('active');
    $('#showChart3').removeClass('active');
  });

  $('#showChart3').click(function(){
    $('#chart1').addClass('d-none');
    $('#chart2').addClass('d-none');
    $('#chart3').removeClass('d-none');
    $('#showChart1').removeClass('active');
    $('#showChart2').removeClass('active');
    $('#showChart3').addClass('active');
  });
}

function generateFinalBreadcrumb(){
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
      getFacility();
    });
    $('.bc-room').click(function(){
      getRoom();
    });
    $('.bc-fixture').click(function(){
      getFixture();
    });
    $('.bc-target').click(function(){
      getTarget();
    });
    $('.bc-system').click(function(){
      getSystem();
    });
    $('.bc-cct').click(function(){
      getCCT();
    });
  });
}

function generateDescription(){
  if (data.fixture.includes('Cove') || data.fixture.includes('cove')){
    if(data.room == "Neonatal Intensive Care Unit"){
      $('#roomDescriptionContent').html("A NICU (newborn intensive care unit) in a hospital is where nurses watch over premature infants. This 1,975 SF room with a 12-foot ceiling includes a main desk with incubators around the perimeter of the room. Since nurses and infants have different circadian needs, zones of light should be created to achieve desired CS levels for both user types.");
    }
    else if(data.room == "Common Area"){
      $("#roomDescriptionContent").html("A common area in a senior care facility is where residents can choose to spend most of the day. This 1550 SF common area with a 12-foot ceiling is divided into two areas for dining and activities. The dining area has round tables with chairs and the activity area has sofas, side tables, and rectangular tables with chairs. Designs should deliver target CS levels to residents who are eating meals in the dining area, relaxing on the couch, or sitting at the activity area tables. Lighting schedules should be similar to those employed in individuals’ rooms.");
    }
    else if(data.room == "Special Education Classroom"){
      $("#roomDescriptionContent").html("A special education classroom provides a learning environment for students with developmental disabilities. This 980 SF classroom with an 10-foot ceiling includes 12 desks facing a board, along with 12 desks in sets of clusters for group work.");
    }
  }else{
    $('#roomDescriptionContent').html(hb[data.facility][data.room].desc);
  }
}

function checkAssumptions(){
  if(data.room == 'Single Patient Room' || data.room == 'Double Patient Room'){
    $('#illuminance-info').html('E<sub>H</sub>: 2’-6” (0.76 m) above finished floor <br />E<sub>V</sub> laying facing ceiling: 2’-6” (0.76 m) above finished floor <br/>E<sub>V</sub> bed angled 45° from vertical: 4’-0” (1.22 m) above finished floor');
  }
  else if(data.room == 'Neonatal Intensive Care Unit'){
    $('#illuminance-info').html('E<sub>H</sub>: 2’-6” (0.76 m) above finished floor <br />E<sub>V</sub> infant laying facing ceiling: 2’-6” (0.76 m) above finished floor<br/>E<sub>V</sub> nurse sitting: 4’-0” (1.22 m) above finished floor');
  }
  else{
    $('#illuminance-info').html('E<sub>H</sub>: 2’-6” (0.76 m) above finished floor <br />E<sub>V</sub>: 4’-0” (1.22 m) above finished floor');
  }
}

function generateLightingSolution(){
  $('#lightingSolutionContent').html('');
  $.getJSON('json/lightingSolutions.json',function(solutions_result){
    $.each(solutions_result,function(){
      var solutions = this;
      var path = solutions[data.facility][data.room][data.fixture][data.target];
      for (var key in path){
        if (key == "intro"){
          $('#lightingSolutionContent').append('<p class="right-panel-p mb-2 ml-3">'+path[key]+'</p><hr/>');
        }else{
          if (key.replace(/[0-9]/g, '') == 'outer' || key.replace(/[0-9]/g, '') == 'outerlast'){
            $('#lightingSolutionContent').append('<h6 class="right-panel-outer-title">'+path[key][0]+'</h6>');
            $('#lightingSolutionContent').append('<p class="right-panel-p mb-2 ml-3">'+path[key][1]+'</p>');
            if (key != Object.keys(path)[Object.keys(path).length-1] && key.replace(/[0-9]/g, '') != 'outerlast') {
              $('#lightingSolutionContent').append('<hr/>');
            }
          }else{
            var number = key.replace(/\D/g,'');
            if (number == 0 || number % 2 == 0){
              $('#lightingSolutionContent').append('<div class="solutions-inner-even"><h6 class="right-panel-outer-title">'+path[key][0]+'</h6><p class="right-panel-p mb-2">'+path[key][1]+'</p></div>');
            }else{
              $('#lightingSolutionContent').append('<div class="solutions-inner-odd"><h6 class="right-panel-outer-title">'+path[key][0]+'</h6><p class="right-panel-p mb-2">'+path[key][1]+'</p></div>');
            }
          }
        }
      }
    });
  });
}

function generateFixtures(){
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
        $('#fixture_fixture').attr('src','img/application/selection/3_Fixture/'+path.fixture[index].replace(/ /g,'_')+'.jpg');
        $('#fixture_candela').attr('src','img/application/selection/3_Fixture/candela/'+path.candela[index]+'.jpg');
        $('#fixture_amount').html(path.quantity[index]);
        $('#fixture_type').html(path.type[index]);
        $('#fixture_height').html(path.height[index]);
        $('#fixture_orientation').html(path.orientation[index]);
        $('#fixture_dimensions').html(path.dimensions[index]);
        $('#fixture_description').html(path.description[index]);
        $('#fixture_eveh').html("<b>(" + path[data.target].eveh_desc + "):</b> " + path[data.target].eveh[index]);
        $('#fixture_lumens').attr("src",path[data.target].lumen[index]);
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
        var other = $(this);
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

function generateCharts(){
  // Ev
  var ev_path = 'img/application/charts/ev/' + data.facility.replace(" ", "_").toLowerCase() + '/' + data.target + '.jpg';
  $("#chart_ev").attr("src",ev_path);
  $('#show_chart_ev').click(function(){
    var this_chart = "ev";
    for (var j in charts){
      var _chart = charts[j].toLowerCase();
      $('#chart_'+_chart).addClass('d-none');
      $('#show_chart_'+_chart).removeClass('active');
    }
    $('#chart_spd').addClass('d-none');
    $('#chart_ratio').addClass('d-none');
    $('#show_chart_ratio').removeClass('active');
    $('#show_chart_spd').removeClass('active');
    $('#chart_'+this_chart).removeClass('d-none');
    $('#show_chart_'+this_chart).addClass('active');
  });

  // Ratio
  var ratio_path = 'img/application/charts/ratio/' + data.facility.replace(/ /g,"_").toLowerCase() + '/' + data.room.replace(/ /g,"_").toLowerCase() + '.jpg';
  $("#chart_ratio").attr("src",ratio_path);
  $('#show_chart_ratio').click(function(){
    var this_chart = "ratio";
    for (var j in charts){
      var _chart = charts[j].toLowerCase();
      $('#chart_'+_chart).addClass('d-none');
      $('#show_chart_'+_chart).removeClass('active');
    }
    $('#chart_spd').addClass('d-none');
    $('#chart_ev').addClass('d-none');
    $('#show_chart_ev').removeClass('active');
    $('#show_chart_spd').removeClass('active');
    $('#chart_'+this_chart).removeClass('d-none');
    $('#show_chart_'+this_chart).addClass('active');
  });

  // LPD and Energy
  var charts = ["LPD","Energy"];
  var chart_path = hb[data.facility][data.room][data.fixture]["chart path"]+'/'+data.target.toString().replace(/ /g,"_");
  for (var i in charts){
    var chart = charts[i].toLowerCase();
    $("#chart_" + chart).attr("src",'img/application/charts/'+chart+'/'+chart_path+'.jpg');
    $('#show_chart_'+chart).click(function(){
      var this_chart = this.id.replace("show_chart_","");
      for (var j in charts){
        var _chart = charts[j].toLowerCase();
        $('#chart_'+_chart).addClass('d-none');
        $('#show_chart_'+_chart).removeClass('active');
      }
      $('#chart_spd').addClass('d-none');
      $('#chart_ratio').addClass('d-none');
      $('#show_chart_ratio').removeClass('active');
      $('#chart_ev').addClass('d-none');
      $('#show_chart_ev').removeClass('active');
      $('#show_chart_spd').removeClass('active');
      $('#chart_'+this_chart).removeClass('d-none');
      $('#show_chart_'+this_chart).addClass('active');
    });
  }

  // SPD
  $('#chart_spd').attr("src",'img/application/spd/' + data.cct.replace(/ /g, "").replace(/->/g,"_") + '_med.jpg');
  $("#show_chart_spd").click(function(){
    console.log('here');
    var this_chart = "spd";
    for (var j in charts){
      var _chart = charts[j].toLowerCase();
      $('#chart_'+_chart).addClass('d-none');
      $('#show_chart_'+_chart).removeClass('active');
    }
    $('#chart_ev').addClass('d-none');
    $('#chart_ratio').addClass('d-none');
    $('#show_chart_ratio').removeClass('active');
    $('#show_chart_ev').removeClass('active');
    $('#chart_'+this_chart).removeClass('d-none');
    $('#show_chart_'+this_chart).addClass('active');
  });
}

function generateCSContent(){
  var chart_path = hb[data.facility][data.room][data.fixture]["chart path"]+'/'+data.target+'_'+data.cct.replace(/ |\>/g,'');
  var graph_path;
  console.log(data.system);
  if ((data.fixture.includes("Blue") || data.fixture.includes("Red")) && data.system != "Tunable"){
    graph_path = hb[data.facility][data.room]["cs graph path"]+'/'+data.target+'_'+data.cct.replace(/ |\>/g,'')+"-color";
  }else{
    graph_path = hb[data.facility][data.room]["cs graph path"]+'/'+data.target+'_'+data.cct.replace(/ |\>/g,'');
  }

  if (data.infants == 1){
    chart_path = hb[data.facility][data.room][data.fixture]["chart path"]+'/'+'infants_'+data.cct.replace(/ /g,'');
  }

  $('#final_cs_graph_img').attr('src','img/application/cs_graphs/' + graph_path + '.jpg');
  $('#final_cs_chart_img').attr('src','img/application/cs_charts/' + chart_path + '.jpg');

  $('#cs-graph-buttons').remove();
  if (data.room == "Neonatal Intensive Care Unit"){
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
      generateCSContent();
      data.zone = 1;
      generatePlan(hb[data.facility][data.room][data.fixture][data.target],data.view,data.zone);
    });
    $('#infants_button').click(function(){
      $('#nurses_button').removeClass('active');
      $('#infants_button').addClass('active');
      data.infants = 1;
      generateCSContent();
      data.zone = 2;
      generatePlan(hb[data.facility][data.room][data.fixture][data.target],data.view,data.zone);
    });
  }
}

function generateRender(path){
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
      generatePlan(hb[data.facility][data.room][data.fixture][data.target],data.view,data.zone);
      generateRender(path);
      generateAdjustments();
    });
  }
}

function generatePlan(path,view,zone){
  if(zone != 0){
    if(zone == 1){
      $('#final_plan_img').attr('src',path.plan[view]);
    }else if (zone == 2){
      $('#final_plan_img').attr('src',path.plan2[view]);
    }
  }else{
    $('#final_plan_img').attr('src',path.plan[view]);
  }
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

function generateAdjustments(){
  var i, path;
  $('#final_adjustments').html('');

  var cct_count = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system]).length;
  var tod_count = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system][data.cct]).length;
  var cct_str = '';
  var tod_str = '';

  // Get CCT buttons
  for (i = 0; i < cct_count; i++){
    var _cct = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system])[i];
    cct_str += '<div data-value="'+i+'" class="mb-2 cct-border adjustment-container adjustment-container-cct adjustment-container'+cct_count;
    if (_cct == data.cct){
      cct_str += ' cct-selected';
    }
    cct_str += '">';
    cct_str += '  <img class="m-0 p-0" src="img/application/adjustments/cct/'+cct_count+'_'+_cct.replace(/\s/g, '').replace(/>/g,'')+'.jpg"/>';
    cct_str += '</div>';
  }

  if (data.system == "Static"){
    // Get ToD Buttons
    for (i = 0; i < tod_count; i++){
      var _tod = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system][data.cct])[i];
      tod_str += '<div data-value="'+i+'" class="mb-2 tod-border adjustment-container adjustment-container-tod adjustment-container'+tod_count;
      if (_tod == data.time){
        tod_str += ' tod-selected';
      }
      tod_str += '">';
      tod_str += '  <img class="m-0 p-0" src="img/application/adjustments/tod/'+tod_count+'_'+_tod.replace(/\s/g, '').replace(/\//g, '-').replace('0.1','').replace('0.2','').replace('0.3','').replace('0.4','')+'.jpg"/>';
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
      path = hb[data.facility][data.room][data.fixture][data.target][data.system][data.cct];
    }else{
      path = hb[data.facility][data.room][data.fixture][data.target][data.system][data.cct][data.time];
    }
    generateRender(path);
    generateFinalBreadcrumb();
    generateCSContent();
    generateCharts();
  });
  $('.adjustment-container-tod').click(function(){
    $('#final_adjustments .tod-border').removeClass('tod-selected');
    $(this).addClass('tod-selected');

    data.time = Object.keys(hb[data.facility][data.room][data.fixture][data.target][data.system][data.cct])[$(this).data("value")];
    var path = hb[data.facility][data.room][data.fixture][data.target][data.system][data.cct][data.time];
    generateRender(path);
  });
}

function generateContent(){
  var render_path;
  //Hide the modal and remove necessary landing page content
  $('#toggle_view').remove();
  $('#application-modal').modal('hide');
  $('body').removeClass('modal-open');
  $('.modal-backdrop').remove();
  $('#landing-content').remove();
  $('.fixed-footer').remove();
  $('body').removeAttr('data-vide-bg');
  $('body').removeAttr('data-vide-options');
  $('#navbar').removeClass('position-fixed');
  if ($('body').find('div').first().attr('id') != 'navbar' && $('body').find('div').first().attr('id') != 'application-modal' && $('body').find('div').first().attr('id') != 'helpModal'){
    $('body').find('div').first().remove();
  }
  //Hide the modal and remove necessary landing page content

  //Get path of our render in the json file
  if (data.system == "Tunable"){
    render_path = hb[data.facility][data.room][data.fixture][data.target][data.system][data.cct];
  }else{
    render_path = hb[data.facility][data.room][data.fixture][data.target][data.system][data.cct][data.time];
  }
  //Get path of our render in the json file



  if ($('#final_content').length==0){
    buildHTML();
  }
  generateRender(render_path);
  generatePlan(hb[data.facility][data.room][data.fixture][data.target],data.view,data.zone);
  generateAdjustments();
  generateFixtureIcons(data.fixture);
  generateCSContent();
  generateFinalBreadcrumb();
  generateDescription();
  checkAssumptions();
  generateLightingSolution();
  generateFixtures();
  handleRightPanelAccordion();
  generateCharts();
  if ($('#roomDescriptionTab').hasClass('collapsed')){
    $('#roomDescriptionTab').trigger('click');
  }
}

$(document).ready(async function(){

  // Avoids Firefox throwing a warning when reading JSON
  $.ajaxSetup({beforeSend: function(xhr){
    if (xhr.overrideMimeType){
      xhr.overrideMimeType("application/json");
    }
  }});
  // Avoids Firefox throwing a warning when reading JSON

  // get hb_json
  await $.ajax({
    url: "json/healthyBuildings.json",
    async: false,
    dataType: 'json',
    success: function(result) {
      $.each(result,function(){
        hb = this;
      });
    }
  });

  // get selection_json
  await $.ajax({
    url: "json/selection.json",
    async: false,
    dataType: 'json',
    success: function(result) {
      $.each(result,function(){
        selection = this;
        cacheSelectionImages("Facility");
      });
    }
  });

  $(".help-menu-list-item").click(function(){
    $(".help-menu-list-item").removeClass('active');
    $(this).addClass('active');
    var id = "#help-" + $(this).data('value');
    $(".help-section").addClass('d-none');
    $(id).removeClass('d-none');
    $(".help-body").scrollTop();
  });

  $('#begin').prop('disabled',false);

  $('#begin').click(function(){
    main();
  });
});
