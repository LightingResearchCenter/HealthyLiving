// Basic accordion functions from https://codepen.io/byrnecode/pen/GxdQdQ

function closeOthersLevel1(label){
	var labels = $('.acnav__label');
	for(var i = 0; i < labels.length; i++){
		if ($(labels[i]) != label && !$(label).hasClass('acnav__label--level2')){
			var parent = $(labels[i]).parent('.has-children');
			var list = $(labels[i]).siblings('.acnav__list');
			if (parent.hasClass('is-open')){
				list.slideUp('fast');
				parent.removeClass('is-open');
			}
		}
	}
}

function closeOthersLevel2(label){
	label = label[0];
	var labels = $('.acnav__label--level2');
	for (var i = 0; i < labels.length; i++){
		if($(labels)[i] != label){
			var parent = $(labels[i]).parent().parent('.has-children');
			var list = $(labels[i]).parent().siblings('.acnav__list');
			if (parent.hasClass('is-open')){
				list.slideUp('fast');
				parent.removeClass('is-open');
			}
		}
	}
}

function closeAllLevel2(){
	var labels = $('.acnav__label--level2');
	for (var i = 0; i < labels.length; i++){
		var parent = $(labels[i]).parent().parent('.has-children');
		var list = $(labels[i]).parent().siblings('.acnav__list');
		if (parent.hasClass('is-open')){
			list.slideUp('fast');
			parent.removeClass('is-open');
		}
	}
}

function accordionToTop(){
	var label = $('#fundamentals div');
	var parent = label.parent('.has-children');
	var list = label.siblings('.acnav__list');

	if (!(parent.hasClass('is-open'))) {
		if (!label.hasClass('acnav__label--level2')){
			closeOthersLevel1(label);
			list.slideDown('fast');
			parent.addClass('is-open');
			$('ul li a').removeClass('active');
			$('#accordion-ourRole').addClass('active');
		}
	}
}

$('.acnav__label').click(function () {
	var label = $(this);
	var parent,list;
	if (label.parent().hasClass('drop')){
		parent = label.parent().parent('.has-children');
		list = label.parent().siblings('.acnav__list');
	}else{
		parent = label.parent('.has-children');
		list = label.siblings('.acnav__list');
	}
	if (!(parent.hasClass('is-open'))) {
		if (label.hasClass('acnav__label--level2')){
			closeOthersLevel2(label);
		}else{
			closeAllLevel2();
			closeOthersLevel1(label);
		}
		list.slideDown('fast');
		parent.addClass('is-open');
	}
});

$('.section-link').on('click',async function(){
  await removeAccordionActive();
  if (!$(this).hasClass('drop')){
    $(this).addClass('active');
  }else{

  }
});

$('.acnav__link').on('click',function(){
	closeAllLevel2();
})
