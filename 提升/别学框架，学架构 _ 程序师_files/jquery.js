/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.3
 *
 */

(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : true,
            appear          : null,
            load            : null,
            placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAABCAMAAAAsPuSGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEJCNDc2QUI2NTk0MTFFNTgyMEM4MzQ3NUUyMTA3RjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEJCNDc2QUM2NTk0MTFFNTgyMEM4MzQ3NUUyMTA3RjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0QkI0NzZBOTY1OTQxMUU1ODIwQzgzNDc1RTIxMDdGMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0QkI0NzZBQTY1OTQxMUU1ODIwQzgzNDc1RTIxMDdGMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pob9L04AAAAGUExURfunpwAAAMiJMi8AAAAOSURBVHjaYmBgYAAIMAAABAABmwPqCQAAAABJRU5ErkJggg=="
        };

        function update() {
            var counter = 0;

            elements.each(function() {
                var $this = $(this);

                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        function resize_video(){

            if(!$('article.post').css('width')) return;

        	//不包含 padding
            var parent_width = parseInt( $('article.post').css('width').replace(/[^-\d\.]/g, '') );

            //距离entry-content的padding的外边缘
            var position_left = $('article .entry-content').offset().left
            						- parseInt( $('article.post').css('padding-left').replace(/[^-\d\.]/g, '') );

            var video_width = parent_width 
            				- parseInt( $('article .entry-content').css('padding-left').replace(/[^-\d\.]/g, '') )
            				- parseInt( $('article .entry-content').css('padding-right').replace(/[^-\d\.]/g, '') );;						

            var video_height = parseInt( video_width * 400 / 480 );

            //console.log(parent_width,content_width,position_left);

            $("embed").attr( 'width', video_width );

            $("embed").attr( 'height', video_height );

            $("embed").css({ maxWidth: video_width + "px",marginLeft:"-"+position_left+"px"});

        }

        function resize_image($self){
               
                if( $self.attr('width') == undefined ) return;

                var w = $self.attr('width');
                var h = $self.attr('height');

                //包含right padding
                var parent_width = parseInt( $('article.post').css('width').replace(/[^-\d\.]/g, '') )
                                    + parseInt( $('article.post').css('padding-right').replace(/[^-\d\.]/g, '') );

                // content width 不包含 padding
                var content_width = parseInt( $('article .entry-content').css('width').replace(/[^-\d\.]/g, '') );

                //entry-content的padding的外边距离 parent内边
                var position_left = $('article .entry-content').offset().left
                                - parseInt( $('article.post').css('padding-left').replace(/[^-\d\.]/g, '') )
                                + parseInt( $('article .entry-content').css('padding-left').replace(/[^-\d\.]/g, '') );

                //content width + conent padding left + right + parent padding left + right
                var width1 =  parseInt( $('article .entry-content').css('width').replace(/[^-\d\.]/g, '') )
                            + parseInt( $('article .entry-content').css('padding-left').replace(/[^-\d\.]/g, '') )
                            + parseInt( $('article .entry-content').css('padding-right').replace(/[^-\d\.]/g, '') )
                            + parseInt( $('article.post').css('padding-left').replace(/[^-\d\.]/g, '') )
                            + parseInt( $('article.post').css('padding-right').replace(/[^-\d\.]/g, '') );


                //使用大图片功能，图片标记上必须有width属性，表明图片的原始尺寸
                var self_width = $self.attr('width').replace(/[^-\d\.]/g, '');

                var maxWidth = "100%";

                var marginLeft = "0";

                if(self_width <= content_width){

                    maxWidth = self_width + "px";

                }else if(self_width <= width1){

                    maxWidth = self_width + "px";

                    marginLeft = parseInt( ( self_width - content_width ) / 2 );

                }else if(self_width <= parent_width){

                    maxWidth = self_width + "px";

                    marginLeft = self_width
                                - content_width
                                - parseInt( $('article .entry-content').css('padding-right').replace(/[^-\d\.]/g, '') )
                                - parseInt( $('article.post').css('padding-right').replace(/[^-\d\.]/g, '') );

                }else if(self_width > parent_width){

                    maxWidth = parent_width + "px";

                    marginLeft = position_left;

                }

                //console.log('parent:', parent_width, 'content_width', content_width, 'position_left', position_left, 'width1', width1, 'self_width', self_width);

                $self.css({maxWidth: maxWidth, marginLeft:"-"+marginLeft+"px"});

                //IF IS div background
                //if( $self.is("img") ) return;

                
                if( $self.attr('height') == undefined ) return;

                var nh = $self.width()*h/w;

                $self.css('height', nh + 'px');
        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .bind("load", function() {

                            var original = $self.attr("data-" + settings.data_attribute);
                            $self.hide();
                            if ($self.is("img")) {
                                $self.attr("src", original);
                            } else {
                                $self.css("background-image", "url('" + original + "')");
                            }
                            $self[settings.effect](settings.effect_speed);

                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });


                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                         //   resize_image($self);
                        })
                        .attr("src", $self.attr("data-" + settings.data_attribute));

                       // resize_image($self);
                }

            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function() {

            update();
           // resize_video();
            //窗口resize时调整超宽图片 class=large-size
            $('.single .entry-content img').each(function() {
                // resize_image($(this));

            });
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        $(window).load(function(){
        	//resize_video();
        });

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);
