function main(data){
  var facility = "", room = "", fixture = "", target = "", system ="", cct = "", time = "";
  var senior = data["Senior Care"];
  getFacility(data,facility,room,fixture,target,system,cct,time);
}

function getFacility(data,facility,room,fixture,target,system,cct,time){
  var facilities = Object.values(data);
  for (var i = 0; i < facilities.length; i++){
    var _facility = Object.keys(data)[i];
    var __facility = _facility.replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#stuff').append('<button id="'+__facility+'" value="'+_facility+'">'+_facility+'</button>');
    $('#'+__facility).click(function(){
      facility = $(this).val();
      $('#stuff').html('');
      getRoom(data,facility,room,fixture,target,system,cct,time);
    });
  }
}

function getRoom(data,facility,room,fixture,target,system,cct,time){
  var rooms = Object.values(data[facility]);
  for (var i = 0; i < rooms.length; i++){
    var _room = Object.keys(data[facility])[i];
    var __room = _room.replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#stuff').append('<button id="'+__room+'" value="'+_room+'">'+_room+'</button>');
    $('#'+__room).click(function(){
      room = $(this).val();
      $('#stuff').html('');
      getFixture(data,facility,room,fixture,target,system,cct,time);
    });
  }
}

function getFixture(data,facility,room,fixture,target,system,cct,time){
  var fixtures = Object.values(data[facility][room]);
  for (var i = 0; i < fixtures.length; i++){
    var _fixture = Object.keys(data[facility][room])[i];
    var __fixture = _fixture.replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#stuff').append('<button id="'+__fixture+'" value="'+_fixture+'">'+_fixture+'</button>');
    $('#'+__fixture).click(function(){
      fixture = $(this).val();
      $('#stuff').html('');
      getTarget(data,facility,room,fixture,target,system,cct,time);
    });
  }
}

function getTarget(data,facility,room,fixture,target,system,cct,time){
  var targets = Object.values(data[facility][room][fixture]);
  for (var i = 0; i < targets.length; i++){
    var _target = Object.keys(data[facility][room][fixture])[i];
    var __target = inWords(_target.split(".").pop()).replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#stuff').append('<button id="'+__target+'" value="'+_target+'">'+_target+'</button>');
    $('#'+__target).click(function(){
      target = $(this).val();
      $('#stuff').html('');
      getSystem(data,facility,room,fixture,target,system,cct,time);
    });
  }
}

function getSystem(data,facility,room,fixture,target,system,cct,time){
  var systems = Object.values(data[facility][room][fixture][target]);
  for (var i = 0; i < systems.length; i++){
    var _system = Object.keys(data[facility][room][fixture][target])[i];
    var __system = _system.replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#stuff').append('<button id="'+__system+'" value="'+_system+'">'+_system+'</button>');
    $('#'+__system).click(function(){
      system = $(this).val();
      $('#stuff').html('');
      getCCT(data,facility,room,fixture,target,system,cct,time);
    });
  }
}

function getCCT(data,facility,room,fixture,target,system,cct,time){
  var ccts = Object.values(data[facility][room][fixture][target][system]);
  for (var i = 0; i < ccts.length; i++){
    var _cct = Object.keys(data[facility][room][fixture][target][system])[i];
    var __cct = inWords(_cct.split("K")[0].replace(/\s/g, '')).replace("[^a-zA-Z]", "");
    $('#stuff').append('<button id="'+__cct+'" value="'+_cct+'">'+_cct+'</button>');
    $('#'+__cct).click(function(){
      cct = $(this).val();
      $('#stuff').html('');
      getTime(data,facility,room,fixture,target,system,cct,time);
    });
  }
}

function getTime(data,facility,room,fixture,target,system,cct,time){
  var times = Object.values(data[facility][room][fixture][target][system][cct]);
  for (var i = 0; i < times.length; i++){
    var _time = Object.keys(data[facility][room][fixture][target][system][cct])[i];
    var __time = _cct.replace("[^a-zA-Z]", "").replace(/\s/g, '');
    $('#stuff').append('<button id="'+__time+'" value="'+_time+'">'+_time+'</button>');
    $('#'+__time).click(function(){
      time = $(this).val();
      $('#stuff').html('');
      getTime(data,facility,room,fixture,target,system,cct,time);
    });
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

  //Get JSON and assign it to data varibale
  $.getJSON("json/healthyBuildings.json", function(result){
    $.each(result,function(){
      var data = this;
      main(data);
    });
  });
  //Get JSON and assign it to data varibale

});
