;(function ( $, window, document, undefined ) {

	var pluginName = "simpleSelect",
	defaults = {
		speed: 0,
		debug: false
	};

	$.expr[":"].firstChar = jQuery.expr.createPseudo(function (arg) {
		return function (elem) {
			return $(jQuery(elem)).text().toUpperCase().charCodeAt(0) == arg.charCodeAt(0);
		};               
	});

	function Plugin ( element, options ) {
		this.element = element;
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	Plugin.prototype = {
		_debug: function(log){
			if ( this.settings.debug ){
				console.log(log);
			}
		},
		init: function () {
			var self = this,
				el = $(this.element);
			if ( el.attr('multiple') !== undefined && el.attr('multiple') !== false ){
				self._multiple();
			} else {
				self._single();
			}
			el.hide();
		},
		_single: function(){
			var self = this,
				el = $(this.element),
			selectOption = el.find('option'),
			selectboxText = $('<span>', {
				'class': 'selectbox-text',
				'text': el.find('option:selected').text()
			}),
			selectboxArrow = $('<span>', {
				'class': 'selectbox-arrow'
			}),
			selectbox = $('<div>', {
				'class': 'selectbox',
				'tabindex': 0
			}).append(selectboxText).append(selectboxArrow).append(this._createOption(selectOption).hide());
			el.after(selectbox);
			this.val(el.val());
			var selectbox = el.next();
			selectbox.on({
				click: function(e){
					e.stopPropagation();
					e.preventDefault();
					this.focus();
					self._debug('mainclick trigger');
					$(document).one('click', function(e){
						self._debug('document click trigger');
						self.close();
					});
					self.val(el.val());
					self.toggle();
				},
				focusout: function(e){
					self.close();
					self._debug('focusout trigger');
				},
				blur: function(e){
					self.close();
					self._debug('blur trigger');
				},
				keydown: function(e){
					var selected = [];
					if ( e.keyCode === 9 ){
						//selectbox.trigger('focusout');
						self.close();
						return;
					} else {
						e.preventDefault();
					}
					var allDisabled = $(selectbox).find('li a').length == $(selectbox).find('li a.disabled').length
					if ( e.keyCode === 13 ){
						selectbox.trigger('click');
					} else if ( e.keyCode >= 39 && e.keyCode <= 40 ){ // key down and right
						selected = selectbox.find('li a.selected').closest('li').next().children('a');
						if ( selected.length == 0 ){
							selected = selectbox.find('li:first a');
						}
						if ( allDisabled ){
							selected = $();
						}
						while ( selected.is('.disabled') && !allDisabled ){
							selected = selected.closest('li').next().children('a');
							if ( selected.length == 0 ){
								selected = selectbox.find('li:first a');
							}
						}
					} else if ( e.keyCode >= 37 && e.keyCode <= 38 ){ // key up and left
						selected = selectbox.find('li a.selected').closest('li').prev().children('a');
						if ( selected.length == 0 ){
							selected = selectbox.find('li:last a');
						}
						if ( allDisabled ){
							selected = $();
						}
						while ( selected.is('.disabled') && !allDisabled  ){
							selected = selected.closest('li').prev().children('a');
							if ( selected.length == 0 ){
								selected = selectbox.find('li:last a');
							}
						}
					} else {
						selected = selectbox.find('li a:firstChar("' + String.fromCharCode(e.keyCode)  + '").selected');
						if ( selected.length == 0 ){
							selected = selectbox.find('li a:firstChar("' + String.fromCharCode(e.keyCode)  + '")').closest('li').first().children('a');
							while ( selected.is('.disabled') ){
								selected = selected.closest('li').next().children('a');
								if ( selected.length == 0 || !selected.is(':firstChar("' + String.fromCharCode(e.keyCode)  + '")')){
									selected = $();
								}
							}
						} else if ( selected.hasClass('selected') ){
							selected = selected.closest('li').next().children('a');
							while ( selected.is('.disabled') ){
								selected = selected.closest('li').next().children('a');
							}
							if ( selected.length == 0 || !selected.is(':firstChar("' + String.fromCharCode(e.keyCode)  + '")')){
								selected = selectbox.find('li a:firstChar("' + String.fromCharCode(e.keyCode)  + '")').closest('li').first().children('a');
							}
						}
					}
					if ( selected.length > 0 ){
						selectbox.find('li a.selected').removeClass('selected');
						var position = selected.addClass('selected').closest('li').position();
						self.val(selected.attr('rel'));
						if ( position !== undefined ){
							selectbox.children('.selectbox-box').scrollTop(position.top + selectbox.children('.selectbox-box').scrollTop());
						}
					}
				}
			});
			selectbox.on({
				mousedown: function(e){
					e.stopPropagation();
					e.preventDefault();
					var selected = selectbox.find('.selectbox-box li a.selected');
					if ( selected.length > 0 ){
						self.val( selected.attr('rel'));
						self.close();
						selectbox.off('focusout');
						self._debug('list click');
					} else {
						self.open();
					}
				},
				click: function(e){
					e.stopPropagation();
					e.preventDefault();
				},
				mouseenter: function(){
					selectbox.find('.selectbox-box li a.selected').removeClass('selected');
					if ( !$(this).is('.disabled') ){
						$(this).addClass('selected');
					}
				}
			},'.selectbox-box li a');
		},
		_multiple : function(){
			var self = this,
				el = $(this.element),
			selectOption = el.find('option'),
			selectbox = $('<div>', {
				'class': 'selectbox multiple',
				'tabindex': 0
			}).append(this._createOption(selectOption));
			el.after(selectbox);
			this.val(el.val());
		},
		_createOption: function(option){
			selectboxList = $('<ul>', {
				'class': 'selectbox-box'
			});
			option.each(function(){
				var opt = {
					'rel': $(this).val(),
					'href': '#' + $(this).val(),
					'text': $(this).text()
				};
				if ( $(this).attr('disabled') !== undefined && $(this).attr('disabled') !== false ){
					opt['class'] = 'disabled';
				}
				selectboxList.append($('<li>').append($('<a>', opt )));
			});
			return selectboxList;
		},
		val: function(val){
			var el = $(this.element),
			selectbox = el.next();
			if ( val === undefined || val === null || val.length === 0 ){
				return el.val();
			} else {
				el.val(val);
				el.trigger('change');
				selectbox.find('.selectbox-box li a.selected').removeClass('selected');
				var selected = selectbox.find('.selectbox-box li a[rel="'+ val +'"]').addClass('selected');
				selectbox.children('.selectbox-text').text(selected.text());
			}
		},
		open: function(callback){
			var self = this,
				el = $(this.element),
				selectbox = el.next();
			selectbox.children('.selectbox-box').stop().slideDown(self.settings.speed);
			selectbox.css('z-index', '9999');
			if ( callback !== undefined && typeof(callback[0]) === 'function' ){
				callback[0]();
			}
		},
		close: function(callback){
			var self = this,
				el = $(this.element),
				selectbox = el.next();
			selectbox.children('.selectbox-box').stop().slideUp(self.settings.speed, function(){
				selectbox.css('z-index', '1');
			});
			if ( callback !== undefined && typeof(callback[0]) === 'function' ){
				callback[0]();
			}
		},
		toggle: function(callback){
			var self = this,
				el = $(this.element),
				selectbox = el.next();
			if ( selectbox.children('.selectbox-box').is(':visible') ){
				self.close();
			} else {
				self.open();
			}
			if ( callback !== undefined && typeof(callback[0]) === 'function' ){
				callback[0]();
			}
		}
	};

	$.fn[ pluginName ] = function ( options ) {
		var args = Array.prototype.slice.call(arguments,1);
		var fnList = ['val','open','close','toggle'];
		if ( $.data( this[0], "plugin_" + pluginName ) && typeof( options ) === 'string' ){
			if ( $.inArray(options, fnList) !== -1 ){
				return $.data(this[0], "plugin_" + pluginName)[options]( args );
			} else {
				throw "Function do not exists";
			}
		} else {
			this.each(function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
				}
			});
			return this;
		}
	};

})( jQuery, window, document );