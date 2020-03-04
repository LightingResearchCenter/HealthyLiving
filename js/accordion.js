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

function openLevel2(label){
	var parent, list;
	parent = label.parent().parent('.has-children');
	list = label.parent().siblings('.acnav__list');

	if (!(parent.hasClass('is-open'))) {
		list.slideDown('fast');
		parent.addClass('is-open');
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

function removeAccordionActive(){
  $('.section-link').removeClass('active');
	$('.subsection-link').removeClass('active');
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

$('.subsection-link').on('click', async function(){
	await removeAccordionActive();
  $(this).addClass('active');
});

$('.acnav__link').on('click',function(){
	if ($(this).hasClass('acnav__link--level3')){

	}else{
		closeAllLevel2();
	}
});

$(document).ready(function(){
	  $('#content').scroll(function(event){
	    var scrollPos = $('#content').scrollTop();
	    var sections = [];
	    var current, currentID, currentClass, accordionEl, level1Label, level1ID;
	    $('[id^=section],[id^=subsection]').each(function(_, section) {
	      if ($(section).position().top < 2 && $(section).position().top > (0 - $(section).outerHeight(true))){
	        sections.push(section);
	      }
	    });
	    current = $(sections[sections.length-1]);
	    currentID = current.attr('id');
      if (currentID == 'section-lightingAndTheCircadianSystem'){
        $('#goodAnimation')[0].play();
        $('#badAnimation')[0].play();
      }else {
        $('#goodAnimation')[0].currentTime = 0;
        $('#goodAnimation')[0].pause();
        $('#badAnimation')[0].currentTime = 0;
        $('#badAnimation')[0].pause();
      }
			currentClass = current.attr('class');
			if (currentClass == 'row'){
				level1ID = current.parent().parent().attr('class').replace('article-', '');
			}else{
				level1ID = currentClass.replace('article-', '');
			}
			level1Label = $('#' + level1ID).children('.acnav__label');
			level1Label.trigger('click');

	    accordionEl = $('a[href="#'+currentID+'"]');
			if (accordionEl.hasClass('acnav__link--level2')){
				closeAllLevel2();
			}else if(accordionEl.hasClass('drop')){
				var label = accordionEl.children('.acnav__label');
				closeOthersLevel2(label);
				openLevel2(label);
			}
	    removeAccordionActive();
	    accordionEl.addClass('active');
	  });
});
