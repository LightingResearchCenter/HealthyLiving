function printOut(reference){
  var json = JSON.stringify(reference);
  var out = "{\"Reference\":" + json + "}";
  $('#out').html(out);
}

function add1(el,reference){
  $('#addModalBody').html('<div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Link</span></div><input id="addInput" type="text" class="form-control" placeholder="www.google.com" aria-label="Link" aria-describedby="basic-addon1"></div>');
  $('#addButton').off("click");
  $('#addButton').click(function(){
    add2(el,reference);
  });
}

function add2(el,reference){
  console.log(el)
  var val = $('#addInput').val();
  reference.splice(el,0,val);
  main(reference);
}

function remove(el,reference){
  reference.splice(el,1);
  main(reference);
}

function main(reference){
  var str = '';
  for (var i = 0; i < reference.length; i++){
    var num = i+1;
    str +='<tr><th scope="row">'+num+': </th><td class="text-center">'+reference[i]+'</td><td class="text-sm-right"><button value="'+i+'" class="m-1 btn btn-small btn-success reference-add" data-target="#addModal" data-toggle="modal" data-backdrop="static" data-keyboard="false">Add Before</button><button value="'+i+'" class="m-1 btn btn-small btn-danger reference-remove">Remove</button></td></tr>';
  }
  $('#TB_in').html(str);
  printOut(reference);

  $('.reference-add').off("click");
  $('.reference-remove').off("click");

  $('.reference-add').click(function(){
    add1($(this).val(),reference);
  });

  $('.reference-remove').click(function(){
    remove($(this).val(),reference);
  });

}


$(document).ready(function(){

  $('#DT_in').dataTable({
    "ordering": false,
    "searching": false
  });

  $.ajaxSetup({beforeSend: function(xhr){
    if (xhr.overrideMimeType){
      xhr.overrideMimeType("application/json");
    }
  }});

  var reference;
  $.getJSON("json/reference.json", function(result){
    $.each(result,function(){
      reference = this;
    });
  });

  $('body').click(function(){
    main(reference);
  });
});
