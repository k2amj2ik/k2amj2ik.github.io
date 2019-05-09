$(function(){
	// console.log('ui_mobile.js load');
	$(".list_filter a").click(function(){
		if(!($(this).hasClass("check"))) {
			// console.log('has');
			$(this).addClass('check');
			$('.filter_wrap').addClass('open');
			$('.page_blur').addClass('open');
		}else{
			// console.log('not');
			$(this).removeClass('check');
		}
	});

	$(".list_sort a").click(function(){
		if(!($(this).hasClass("check"))) {
			console.log('has');
			$(this).addClass('check');
			$('.sort_wrap').addClass('open');
			$('.page_blur').addClass('open');
		}else{
			console.log('not');
			$(this).removeClass('check');
		}
	});


	$('.close_filter').click(function(){
		$('.filter_wrap').removeClass('open');
		$('.page_blur').removeClass('open');
	});
	$('.close_sort').click(function(){
		$('.sort_wrap').removeClass('open');
		$('.page_blur').removeClass('open');
	});

	
});
function isValueTrue(num) {
	var num = document.getElementById(num).value;
	if(num){
		return true;
	}else{
		return false;
	}
}

