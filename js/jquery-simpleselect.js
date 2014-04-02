(function($) {
$.expr[":"].firstChar = jQuery.expr.createPseudo(function (arg) {
	return function (elem) {
		return $(jQuery(elem)).text().toUpperCase().charCodeAt(0) == arg.charCodeAt(0);
	};               
});


$.fn.simpleSelect = function(obj) {
	var $select = $(this);
	function init(){
		$select.hide();
		var $selectOption = $('<ul></ul>');
		$select.children('option').each( function(){
			$selectOption.append('<li><a rel="' + $(this).val() + '" href="#">' + $(this).text() + '</a></li>');
		}).promise().done(function(){
			$selectDiv = $('<div class="selectbox" tabindex="0"><div class="selectbox-select"><span class="selectbox-select-text"></span><span class="selectbox-select-arrow"></span></div><div class="selectbox-box"></div></div>');
			$selectDiv.find('.selectbox-select .selectbox-select-text').text($selectOption.children('li').first().text());
			$selectDiv.children('.selectbox-box').html($selectOption).hide();
			$select.after($selectDiv);
		});


		$select.next().on({
			click: function(e){
				e.preventDefault();
				$select.val($(this).attr('rel'));
				$(this).closest('.selectbox-box').prev().find('.selectbox-select-text').text($(this).text());
				$(this).closest('.selectbox-box').toggle();
				$select.trigger('change');
			},
			mouseenter: function(){
				$(this).closest('.selectbox-box').find('li a.selected').removeClass('selected');
				$(this).addClass('selected');
			},
			mouseleave: function(){
			}
		},'.selectbox-box li a');

		$select.next().on('click', '.selectbox-select', function(e){
			e.stopPropagation();
			e.preventDefault();
			$(this).next().slideToggle();
			// console.log('click select');
		});

		// $(document).click(function(e){
		// 	$('.selectbox .selectbox-box').slideUp();
		// 	console.log('click documents');
		// });

		$select.next().on('blur', function(e){
			$selectbox = $(this).children('.selectbox-box').slideUp();
			// console.log('blur');
		});

		// $select.next().on('focus', function(e){
		// 	$selectbox = $(this).children('.selectbox-box').slideDown();
		// 	console.log('focus');
		// });

		$select.next().on('keydown', function(e){
			e.preventDefault();
			$selectbox = $(this).children('.selectbox-box');
			if ( e.keyCode == 9 ){
				$(this).blur();
				return false;
			} else if(e.keyCode == 13) {
				$selectbox.slideToggle();
				return;
			} else if ( !$selectbox.is(':visible') ){
				$selectbox.slideToggle();
			}
			// console.log(e.keyCode);
			if ( e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 ){
				$filterText = $selectbox.find('li a');
				$filterText.each(function(k ,v){
					if ( $(v).is('.selected') ){
						if ( e.keyCode == 37 || e.keyCode == 38) {
							if ( k == 0 )
								$checkSelected = $filterText.length-1;
							else
								$checkSelected = k-1;
						}
						if ( e.keyCode == 39 || e.keyCode == 40 ) { 
							if ( k == $filterText.length-1 )
								$checkSelected = 0;
							else
								$checkSelected = k+1;
						}
						return false;
					} else {
						$checkSelected = 0;
					}
				}).promise().done( function(){
					$selectbox.find('li a.selected').removeClass('selected');
					var $selected = $(this).eq($checkSelected);
					$select.val($selected.attr('rel'));
					$select.trigger('change');
					$selectbox.prev().find('.selectbox-select-text').text($selected.text());
					var position = $selected.addClass('selected').closest('li').position();
					var boxPosition = $selectbox.position();
					if ( position !== undefined )
						$selectbox.children('ul').scrollTop(position.top + $selectbox.children('ul').scrollTop());
				});
			} else {
				$filterText = $selectbox.find('li a:firstChar("' + String.fromCharCode(e.keyCode)  + '")');
				$checkSelected = false;
				$filterText.each(function(k ,v){
					if ( $(v).is('.selected') ){
						$checkSelected = k+1;
						if ( $filterText.length == $checkSelected ) {
							$checkSelected = 0;
						}
						return false;
					} else {
						$checkSelected = 0;
					}
				}).promise().done( function(){
					$selectbox.find('li a.selected').removeClass('selected');
					var $selected = $(this).eq($checkSelected);
					$select.val($selected.attr('rel'));
					$select.trigger('change');
					$selectbox.prev().find('.selectbox-select-text').text($selected.text());
					var position = $selected.addClass('selected').closest('li').position();
					var boxPosition = $selectbox.position();
					if ( position !== undefined )
						$selectbox.children('ul').scrollTop(position.top + $selectbox.children('ul').scrollTop());
				});
			}
			return false;
		});
	}

	if ( obj === undefined ){
		if ( $(this).attr('multiple') !== undefined && $(this).attr('multiple') !== false ){

		} else {
			init();
		}
	}
}
})(jQuery);