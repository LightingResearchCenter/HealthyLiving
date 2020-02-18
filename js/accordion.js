// Basic accordion functions from https://codepen.io/byrnecode/pen/GxdQdQ

function closeOthersLevel1(label){
	var labels = $('.acnav__label');
	console.log(label);
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
	var parent = label.parent('.has-children');
	var list = label.siblings('.acnav__list');

	if (!(parent.hasClass('is-open'))) {
		if (!label.hasClass('acnav__label--level2')){
			closeOthersLevel1(label);
			list.slideDown('fast');
			parent.addClass('is-open');
		}
	}
});
