(function($){
    var customSelect = function(elem, options){
        this.elem    = elem;
        this.$elem   = $(elem);
        this.options = options;
    };

    customSelect.prototype = {
        init: function() {

            this.$elem.addClass('customSelect');
            this.bindEventHandlers();

            return this;
        },
        displayMessage: function(){
            //alert(this.defaults.displayMessage);
        },
        _showDropdown:function(elem){
            elem.find('ul')
                    .stop(true, true)
                    .slideDown().end()
                .find('a').css({
                    borderBottom: 'none',
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0
                });
             return this;
        },
        _hideDropdown:function(elem){
            var $a = elem.find('a');
            elem.find('ul')
                    .stop(true, true)
                    .slideUp(300,function(){
                        $a.css({
                            borderBottom: '1px solid #555',
                            borderBottomLeftRadius: 5,
                            borderBottomRightRadius: 5
                        });
                    })
                    .end();
                    
            return this;
        },



        bindEventHandlers: function(){
            var _this = this;
            _this.$elem.hide();
            $("li", this.elem).each(function(){
                var $this = $(this);
                $this.data('originalColor','#'+Math.floor(Math.random()*16777215).toString(16))
                    .data('randomColor','#'+Math.floor(Math.random()*16777215).toString(16))
                    .css({color:$this.data('originalColor')});
            });

            $('li:odd', this.elem).css({backgroundColor:_this.options.oddColor});
            $('li:even', this.elem).css({backgroundColor:_this.options.evenColor});

            $('li', this.elem).on({
                click: function(){
                   _this.showAnimate($(this));                       
                },
                blur: function(){
                   _this.hideAnimate($(this));
               }
            });

            $(this.elem).on('animateDropdownShow.customSelect',null, function(e){
                if(e.isDefaultPrevented())
                    return;
                if($(e.traget).parent().hasClass('list')){
                    _this._hideDropdown($(this));
                    //_this._setValueSelect(_this.$elem);
                    return;
                }
            })
          },



          // public methods
          startAnimate : function($el){
            $el.get(0).start = true;
            $el.trigger('animateDropdownShow.customSelect');
          },

          stopAnimate : function($el){
            $el.trigger('animateDropdownHide.customSelect');
          }
        };


    $.fn.customSelect = function(options) {
        var api = $(this).data('customSelectApi');

        if(api && typeof options == 'string' && api[arguments[0]])
            {
                api[arguments[0]].apply(api, Array.prototype.slice.call(arguments, 1));
                return this;
            }
        
        var o = $.extend({}, $.fn.customSelect.defaults, options);
        return this.each(function() {
            $(this).data('customSelectApi', new customSelect(this, o).init());
        });

    };

    $.fn.customSelect.defaults = {
        animatePadding: 30,
        defaultPadding: 10,
        evenColor: '#ccc',
        oddColor: '#555',
        duration: 300,
        displayMessage: "Hello World!"
    };

})(jQuery);
