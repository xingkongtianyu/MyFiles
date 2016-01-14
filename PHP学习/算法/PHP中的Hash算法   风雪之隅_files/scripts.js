jQuery(document).ready(function() {
	jQuery("div.subscribe_me, li.subscribe_me").hover(function() {
		var p = jQuery(this);
		var i = 0;
		do {
			if ( p.children("div.subscribe_me_extra").size() ) {
				p.children("div.subscribe_me_extra").each(function() {
					var t = jQuery(this);
					var token = Math.random();
					
					if ( t.css('opacity') != 1 ) {
						return;
					}
					
					t.data('doFadeToken', token);
					t.data('doFadeIn', token);
					if ( t.data('doFadeOut') ) {
						t.data('doFadeOut', token);
					} else {
						t.data('doFadeOut', false);
					}
					
					setTimeout(function() {
						if ( !t.data('doFadeOut') && t.data('doFadeIn') === t.data('doFadeToken') ) {
							var r = p.children("div.subscribe_me_ruler");
							var d = jQuery(document);
							var w = jQuery(window);
							
							t.css('top', '');
							t.css('left', '');
							
							if ( r.offset().top + t.height() + 12 > w.height() + w.scrollTop() ) {
								t.css('top', p.children("div.subscribe_me_services").offset().top - t.height() - 12);
							}
					
							if ( t.width() > r.width() && r.offset().left > d.width() / 2 ) {
								t.css('left', r.offset().left + r.width() - t.width());
							}
							
							t.data('doFadeOut', token);
							
							t.fadeIn('normal');
						}
					}, 150);
				});
				break;
			}
			p = p.children();
		} while ( p.children().size() && i++ < 10 );
	}, function() {
		var p = jQuery(this);
		var i = 0;
		do {
			if ( p.children("div.subscribe_me_extra").size() ) {
				p.children("div.subscribe_me_extra").each(function() {
					var t = jQuery(this);
					
					t.data('doFadeIn', false);
					
					setTimeout(function() {
						if ( !t.data('doFadeIn') && t.data('doFadeOut') === t.data('doFadeToken') ) {
							t.data('doFadeIn', false);
							t.data('doFadeOut', false);
							t.fadeOut('slow');
						}
					}, 450);
				});
				break;
			}
			p = p.children();
		} while ( p.children().size() && i++ < 10 );
	});
});