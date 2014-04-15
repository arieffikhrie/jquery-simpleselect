$(document).ready(function() {
	$('#select-test').simpleSelect();
	$('#select-test2').simpleSelect();
	$('#select-test3').simpleSelect();

	// $('select').change(function(){
	// 	console.log("test");
	// });

	/*$select = $("#select option");
	var option = '';
	$select.each( function(){
		option += '<li><a id="' + $(this).val() + '" href="#">' + $(this).text() + '</a></li>';
	});
	$select.promise().done( function(){
		$selectDiv = $('<div class="selectbox"><div class="selectbox-select"><span class="selectbox-select-text">' + $select.first().text() + '</span><span class="selectbox-select-arrow"></span></div><div class="selectbox-box"><ul>' + option + '</ul></div></div>');
		$selectDiv.children('.selectbox-box').hide();
		$('#select').after($selectDiv);
	});

	$('.selectbox .selectbox-box li').on({
		click: function(e){
			$('#select').val($(this).attr('id'));
			$('.selectbox .selectbox-select .selectbox-select-text').text($(this).text());
			$('.selectbox .selectbox-box').toggle();
			$('#select').trigger('change');
		},
		mouseenter: function(){
			$(this).addClass('selected');
		},
		mouseleave: function(){
			$('.selectbox .selectbox-box li a.selected').removeClass('selected');
		}
	},'a');

	$('.selectbox .selectbox-select').on('click', function(e){
		e.stopPropagation();
		$('.selectbox .selectbox-box').slideToggle();
	});

	$(document).keypress(function(e){
		if ( $('.selectbox .selectbox-box').is(':visible') ){
			if(e.which == 13) {
				$selected = $('.selectbox .selectbox-box li a.selected');
				if ( $selected.length > 0 ) {
					$('#select').val($selected.attr('id'));
					$('.selectbox .selectbox-select .selectbox-select-text').text($selected.text());
					$('.selectbox .selectbox-box').toggle();
					$('#select').trigger('change');
				}
			} else {
				$filterText = $('.selectbox .selectbox-box li a:firstChar("' + String.fromCharCode(e.which)  + '")');
				$checkSelected = false;
				$filterTextLength = $filterText.length; 
				$filterText.each(function(k ,v){
					if ( $(v).is('.selected') ){
						$checkSelected = k+1;
						if ( $filterTextLength == $checkSelected ) {
							$checkSelected = 0;
						}
						return false;
					} else {
						$checkSelected = 0;
					}
				}).promise().done( function(){
					$('.selectbox .selectbox-box li a.selected').removeClass('selected');
					var position = $(this).eq($checkSelected).addClass('selected').closest('li').position();
					var boxPosition = $('.selectbox .selectbox-box').position();
					var boxHeight = $('.selectbox .selectbox-box').height();
					if ( position !== undefined )
						$('.selectbox .selectbox-box ul').scrollTop(position.top + $('.selectbox .selectbox-box ul').scrollTop());
					return false;
				});
			}
		}
	});

	$(document).click(function(){
		$('.selectbox .selectbox-box').slideUp();
	});*/
});