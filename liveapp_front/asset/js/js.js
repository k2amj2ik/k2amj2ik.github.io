$(document).ready( function() {
	contentLoadFunc();
});

// wrap is loaded, must run this function. (ajax call, page load, etc...)
var contentLoadFunc = function(wrap) {
	wrap = !wrap ? $('body') : wrap;
	
	wrap.find('.slide_on_off').slideOnOff();		// slode toggle button
	
	wrap.find('.profile_img').each( function() {
		profileImageCrop( $(this) );		// profile image crop center....
	});
	wrap.find('.img_align').each( function() {
		imageAlignFix( $(this) );		// image horizontal and vertical align center!
	});
	ellipsisAct( wrap.find('.ellipsis') );		// multiline ellipsis activate..
	
};

// slide check button activate!
$.extend($.fn, {
	slideOnOff: function (method, opt) {
		var elem = $(this);
		if ( typeof method == 'object' && !opt ) {
			opt = method;
			method = '';
		}
		var options = {
		};
		var makeBtns = function(el) {
			var btn = el.find('.btn');
			var distance = el.width() - btn.outerWidth(true);
			var input = el.find('.input');
			var onVal = el.attr('data-on');
			var offVal = el.attr('data-off');
			var val = input.val();
			el.off('touchstart mousedown').on('touchstart mousedown', function(e) {
				e.preventDefault();
				var start = !!e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;
				var startL = btn.position().left;
				$(document).off('touchmove mousemove').on('touchmove mousemove', function(ev) {
					var curr = !!ev.pageX ? ev.pageX : ev.originalEvent.touches[0].pageX;
					var dist = curr - start;
					var left = startL + dist;
					if ( Math.abs(dist)>3 ) { el.addClass('moved'); }
					if ( left > distance ) {
						left = distance;
					} else if ( left < 0 ) {
						left = 0;
					}
					if ( left > distance*0.7 ) {
						el.addClass('on').removeClass('off');
					} else if ( left < distance*0.3 ) {
						el.addClass('off').removeClass('on');
					}
					btn.css('left', left);
					if ( Math.abs(dist)>$(window).width()/2 ) { setValue(left); }
				});
				$(document).off('touchend mouseup').on('touchend mouseup', function(evt) {
					var end = !!evt.pageX ? evt.pageX : evt.originalEvent.changedTouches[0].pageX;
					var left = btn.position().left;
					var togg = 0;
					if ( el.hasClass('moved') ) { // moved
						togg = ( left > distance/2 ) ? distance : 0;
					} else { // toggle
						togg = ( left < distance/2 ) ? distance : 0;
					}
					setValue( togg );
				});
			});
			var setValue = function(num) {
				$(document).off('touchmove touchend mousemove mouseup');
				el.removeClass('moved');
				btn.stop().animate({'left':num+'px'}, 100, function() {
					if ( num > 0 ) {
						el.addClass('on').removeClass('off');
						input.val( onVal );
						btn.text('currently on. click to turn off!');
					} else {
						el.addClass('off').removeClass('on');
						input.val( offVal );
						btn.text('currently off. click to turn on!');
					}
				});
			};
		};
		elem.each( function() { makeBtns( $(this) ); });
		return $(this);
	}
});

var pageJson = {};
// setJsonVar
var setJsonAjax = function(url, key, data, callback) {
	var data = {};
	var errorFlag = false;
	$.ajax({
		url:url,
		data:data,
		type:'POST',
		dataType:'json',
		success: function(obj) {
			if ( typeof obj == 'string' ) {
				obj = eval('('+obj+')');
			}
			pageJson[key] = obj;
			if ( typeof callback == 'function' ) { callback(obj); }
		},
		error: function(xhr,status,error) {
			errorFlag = true;
		},
		complete: function() {
			if ( !errorFlag ) {}
		}
	});
};

/* modal layer open(by ajax call or html selector) : modal(align center, middle)  */
var modalLayer = function(opener) {
	if ( !opener ) { return false; }
	opener = $(opener);
	$('#record_layer_wrap').remove();
	$('body').append('<div id="modal_layer_wrap" class="modal"><div class="layer_cont"><button type="button" class="close_layer"></button></div></div>');
	var wrap = $('#modal_layer_wrap');
	wrap.stop().animate({opacity:1}, 300);
	var cont = wrap.find('.layer_cont');
	var url = !!opener.attr('href') ? opener.attr('href') : opener.attr('data-href');
	var data = !!data ? data : !!opener.attr('data-param') ? opener.attr('data-param') : !!$(opener.attr('data-form')).serialize() ? $(opener.attr('data-form')).serialize() : null;
	cont.attr('data-url',url).attr('data-data',data).attr('data-type','html').attr('data-target','#record_layer_wrap .layer_cont').attr('data-callback','afterCallLayer');
	if ( !!url ) {
		ajaxCall(cont,0);
	} else {
		var target = $(opener.attr('data-html'));
		cont.html( target.html() );
		afterCallLayer(cont);
	}
};
var afterCallLayer = function(el, errorFlag) {
	var callback = el.attr('data-callback');
	if ( !!errorFlag ) {
		closeOpenedLayer();
		return false;
	} else {
		var wrap = $('#record_layer_wrap');
		var wid = $('body').width();
		$('html,body').css('width',wid+'px').addClass('lay_opened');
		$(document).off('click','.close_layer');
		el.animate({opacity:1}, 300, function() {
			if ( !!callback ) { eval(callback)(el); }
		});
	}
};
var closeOpenedLayer = function() {
	var wrap = $('#record_layer_wrap');
	wrap.fadeOut(250, function() { wrap.remove(); $('html,body').removeClass('lay_opened'); $('html,body').css('width','100%'); });
};

// profile image crop (center and middle align)
var profileImageCrop = function(el) {
	var img = el.find('img').hide();
	var w = img.parent().width();
	var wid = getNatural( img[0] ).width;
	var hit = getNatural( img[0] ).height;
	var len = parseInt( el.attr('data-crop') || 0 );
	if ( !wid || !hit ) {
		if ( len < 5 ) {
			setTimeout( function() { profileImageCrop(el); },200);
		}
	} else {
		el.attr('data-crop', len+1 );
		if ( wid>hit ) {
			img.css({'height':w+'px','width':'auto','margin-left':parseInt((w-w*wid/hit)/2)+'px'});
		} else {
			img.css({'width':w+'px','height':'auto','margin-top':parseInt((w-w*hit/wid)/2)+'px'});
		}
		img.css({'opacity':'0','display':'block'}).animate({'opacity':'1'},350);
	}
};
var imageAlignFix = function(el) {
	var img = el.find('img').hide();
	var w = img.parent().width();
	var wid = getNatural( img[0] ).width;
	var hit = getNatural( img[0] ).height;
	var len = parseInt( el.attr('data-crop') || 0 );
	if ( !wid || !hit ) {
		if ( len < 5 ) {
			el.attr('data-crop', len+1 );
			setTimeout( function() { imageAlignFix(el); },200);
		} else {
			console.log('no more act... i guess this image is abnormal..');
		}
	} else {
		if ( wid>w || hit>w ) {
			if ( wid>=hit ) {
				img.css({'width':w+'px','height':'auto','margin-top':parseInt((w-w*hit/wid)/2)+'px'});
			} else if ( hit>wid ) {
				img.css({'height':w+'px','width':'auto','margin-left':parseInt((w-w*wid/hit)/2)+'px'});
			}
		} else {
			img.css({'margin':parseInt((w-hit)/2)+'px 0 0 ' + parseInt((w-wid)/2)+'px'});
		}
		img.css({'opacity':'0','display':'block'}).animate({'opacity':'1'},350, function() {
			// $(this).removeAttr('data-crop');
		});
	}
};
function getNatural(el) {
	if ( !el ) {return {width:0,height:0};}
	if ( el.naturalWidth ) {
		return {width: el.naturalWidth, height: el.naturalHeight};
	} else {
		var img = new Image();
		img.src = el.src;
		return {width: img.width, height: img.height};
	}
}


// date format yyyymmdd or yyyy-mm-dd
Date.prototype.yyyymmdd = function(sep) {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = this.getDate().toString();
	var seperator = !!sep ? sep : '';
	var result = yyyy + seperator + (mm[1]?mm:"0"+mm[0]) + seperator + (dd[1]?dd:"0"+dd[0]); // padding
	return result;
};
var paramToObj = function(str) {
	return str.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
};	// $.param(str) is reverse..
function fixNum10(str) {
	if ( str.substr(0,1) == '0' ) { str = str.substr(1) };
	if ( str.substr(0,1) == '0' ) { str = str.substr(1) };
	return (parseInt(str)<10) ? '0'+str : ''+str;
}

/* text multiline ellipsis */
function ellipsisAct(elem) {
	$(elem).each( function() {
		var el = this;
		var wordArray = el.innerHTML.split(' ');
		if ( parseInt( $(el).css('height') ) > 0 ) {
			while(el.scrollHeight > el.offsetHeight) {
				if ( !$(el).attr('title') ) { $(el).attr('title',el.innerHTML); }
				wordArray.pop();
				el.innerHTML = wordArray.join(' ')  + '...';
			}
		}
	});
}

var numberView = function(el,number) {
	var i = 0;
	if ( typeof number == 'string' ) { number = number.replace(/,/g,''); }
	var n = parseInt(number).toString();
	var j = n.length;
	var res = '';
	for (var l=0; l< j; l++ ) {
		res += '0';
		// if ( l%3 == 1 && l<j-1 ) { res += ','; }
	}
	var i = 0;
	var numbersTimeout = function(dur) {
		dur = !dur ? 10 : dur;
		setTimeout( function() {
			dur = 10;
			var num = ( i==10 ) ? n.substr(j-1,1) : i.toString();
			var before = (j==1) ? '' : res.substr(0,(j-1));
			var after = (j==n.length) ? '' : res.substr(j,n.length-j);
			res = before + '' + num + '' + after;
			el.html( res.replace(/\B(?=(\d{3})+(?!\d))/g, ",") );
			if ( i==10 ) { j--; i=0; dur = 30;}
			if ( j==0 ) { return false; }
			i++;
			numbersTimeout(dur);
		},dur);
	};
	numbersTimeout();
};
