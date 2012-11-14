(function($){

	// #1
	// plugin details
	// version, name,....licence

	// #2
	//Constructor
	var Plugin = function(elem, options) {
		this.elem     = elem;
		this.$elem    = $(elem);
		this.options  = options;
		this.$el      = "";
		this.selected = this.$elem.val();
		this.initialized = false;
	};

	// #3 prototype
	Plugin.prototype = {
		// #3.1
		// init
		init: function() {
			this.initialized = true;
			this.$elem.addClass(this.options.namespace);
			this.customBindEventHandlers();
			this.bindEventHandlers();
			
			this.hideSelect();
			this.showDropdown();
			this._getCurrentCss();
			return this;
		},
		// #3.2
		// bind DOM event handlers
		bindEventHandlers: function() {
			var _this = this;
			_this.$elem.on('change.' +  _this.options.namespace, function(e){
					_this._changeSelect();
			});
		},
		// #3.3
		// bind CUSTOM event handlers
		customBindEventHandlers: function(){
			var _this = this;
			_this
				.bindCustomEvent('showDropdown', '_showDropdown')
				.bindCustomEvent('changeSelect', '_changeSelect')
				.bindCustomEvent('hideSelect', '_hideSelect');
		},
		bindCustomEvent: function(event, eventHandler) {

			//console.log('binded the event :  ' + event+"."+this.options.namespace);
			var _this = this;
			_this.$elem.on(event+"."+_this.options.namespace, null, function(e){
				if(e.isDefaultPrevented())
					return;
				//console.log(eventHandler, _this[eventHandler], this, arguments);
				_this[eventHandler].apply(this, arguments);
			})
			return this;
		},
		triggerCustomEvent: function(event, data) {
			//console.log('about to trigger ' + event+"."+this.options.namespace);
			this.$elem.trigger(event+"."+this.options.namespace, [data]);
			return this;
		},
		// #3.4
		//private methods
		_showDropdown: function() {
			//console.log('show dropdown', this, arguments);
			var select_title = $(this).find('option:selected').text();
			var select_value = $(this).find('option:selected').val();
			var dropdown = $('<div class="customSelect" tabindex="10"></div>');
			dropdown.append('<div class="title"><a href="#">' + select_title + '</a></div><ul class="list"></ul>');
			$(this).find('option').each(function(i, el) {
				dropdown.find('.list').append($('<li>' + $(el).text() + '</li>').data('value',$(el).val()));
			});

			dropdown.insertAfter($(this));

			var api = $(this).data('customSelect');
			
			var css = api._getCurrentCss();
			dropdown.css(css);

			api.$el = dropdown;

			api.selected = select_value;
			api.$el.find('.list li').on({
				click: function(e) {
					api.selected = $(this).data('value');
					api.$elem.val(api.selected);
				}
			});
			api.$el.on('blur',function(e){
                var $this = $(this).find('a');
                $(this).find('ul').stop(true, true).slideUp(100);
            });

			api.$el.on('click',function(e){
                $(this).focus();
                e.stopPropagation();
                e.preventDefault();
                var $elem = $(e.target);
                if($elem.parent().hasClass('list')){
                    $(this).blur();
                    $(this).find('a').text($elem.text());
                    return;
                }
                var $ul = $(this).find('ul');
                
                $ul.stop(true, true)[$ul.is(':visible') ? 'slideUp' : 'slideDown'](300);
            });

			return this;
		},
		_getCurrentCss: function() {
			var css = {};
			var styles = window.getComputedStyle(this.$elem.get(0));
			for(var i=0;i<this.options.cssProperty.length;i++){
				css[this.options.cssProperty[i]] = styles[this.options.cssProperty[i]];
			}
			//console.log(css);
			return css;
		},
		_changeSelect: function(e) {

			//console.log(this, arguments);
			//var api = $(this).data('customSelect');
			if(typeof this == 'string')
				var api = $(this).data('customSelect');
			else
				var api = this;

			var value = api.$elem.find('option:selected').text();
			
			api.$el.find('.title a').text(value)
		},
		_hideSelect: function() {
			//console.log('hide Select');
			$(this).hide();
		},
		// #3.5
		//public methods
		showDropdown: function() {
			this.triggerCustomEvent('showDropdown');
		},
		changeSelect: function() {
			this.triggerCustomEvent('changeSelect');
		},
		hideSelect: function() {
			this.triggerCustomEvent('hideSelect');
		},
		destroy:function(){
			//unbind events
			this.$elem.off("." + this.options.namespace);

			//clear html
			this.$el.remove();

			//remove classes & data
			this.$elem.removeData('customSelect')
				.removeClass(this.options.namespace)
				.show();
		},
		reinit:function(){
			var $elem = this.$elem;
			this.destroy();
			$elem.Plugin();
		}
	};

	// #4
	// plugin definition
	$.fn.Plugin = function(options) {

		var o = $.extend({}, $.fn.Plugin.defaults, options),
			args = arguments;


		return this.each(function(){
			var api = $(this).data('customSelect');
			console.log(api, !api);
			if(!api){
				api = new Plugin(this, o);
				$(this).data('customSelect', api);
				api.init();
			}else if(typeof options == 'string' && api[options]) {
				api[options].apply(api, Array.prototype.slice.call(args, 1));
				return this;
			}

		});
	}

	// #5
	// plugin defaults
	$.fn.Plugin.defaults = {
		reinitialize: true,
		namespace: 'customSelect',
		cssProperty: ['marginTop', 'marginLeft', 'marginRight', 'marginBottom', 'paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom', 'top', 'left', 'right', 'bottom', 'position', 'z-index', 'width']
	};

})(jQuery);