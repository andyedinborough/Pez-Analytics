(function($) {
	var a = function(b) {
		var _a = this;
		var _b = b || {};
		var _id = _b.id;
		var _debug = _b.debug;
		var _gaq = [];
		var _log = function(e) {
			if (_debug) log(e);
		};
		_a.track = function(b) {
			var e = [ '_trackEvent', b.category, b.action ];
			if (b.label) e.push(b.label);
			if (!isNaN(b.value)) e.push(parseInt(b.value, 10));
			_gaq.push(e);
			_log('ga event tracked: ' + e);
		};
		_a.trackDownloads = function(b) {
			if (typeof(b) === 'string') b = b.split(','); //convert string to array
			$('a:not(.untracked)').each(function() {
				var a = $(this);
				var href = a.attr('href');
				var hrefSlash = href.split('/');
				var fileName = hrefSlash[hrefSlash.length-1].split('.')[0];
				
				for(var i = 0; i < b.length; i++) {
					var ext = $.trim(b[i]);
					if (href.length - href.lastIndexOf(ext) - ext.length === 0) {
						a.click(function(e) {
							e.preventDefault();
							_a.track({
								category: 'Downloads',
								action: ext,
								label: fileName
							});
							setTimeout(function() { 
								window.location = href;
							}, 100);
						});
					}
				}
			});
		};
		_a.trackOutboundLinks = function(b) {
			$('a').live('click', function(e) {
				var a = $(this);
				var href = $.trim(a.attr('href') || '').toLowerCase();
				if (href.length === 0 || href.substring(0, 1) === '#') {
					return;
				}
				if (href.indexOf('http') === 0) {
					e.preventDefault();
					var domain = href.split(/^https?:\/\/[^\/]\//)[0].split('//')[1].split('/')[0].toLowerCase();
					if (domain == window.location.hostname.toLowerCase()) {
						return;
					}
					_a.track({
						category: 'Outbound Links',
						action: domain,
						label: href
					});
					setTimeout(function() {
						window.location = href;
					}, 100);
				}
			});
		};
		_a.trackForms = function(b) {
			var trackFocus = function() {
				var field = $(this);
				var form = field.closest('form[name]');
				_a.track({
					category: 'Forms',
					action: $.trim(form.attr('name')),
					label: $.trim(field.attr('name'))
				});
			};
			$('form[name] input:not([type=submit]), form[name] textarea').live('focus', trackFocus);
			$('form[name] input[type=checkbox], form[name] input[type=radio], form[name] select').live('click', trackFocus);
			$('form[name] input[type=submit]').live('click', function() {
				var field = $(this);
				var form = field.closest('form[name]');
				_a.track({
					category: 'Forms',
					action: $.trim(form.attr('name')),
					label: 'Submit'
				});
			});
		};
		(function() {
			_gaq = window._gaq = window._gaq || [];
			_gaq.push(['_setAccount', _id]);
			_gaq.push(['_trackPageview']);
			var src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var tag = document.createElement('script');
			tag.type = 'text/javascript';
			tag.async = true;
			tag.src = src;

			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(tag, s);
			_log('ga account loaded: ' + _id);
			
			if (_b.trackDownloads) 		_a.trackDownloads(_b.trackDownloads);
			if (_b.trackOutboundLinks)	_a.trackOutboundLinks();
			if (_b.trackForms)			_a.trackForms();
		})();		
	};
	$(function() {
		var metaTag = $('head meta[name=analytics]');
		window.ga = window.ga || new a({
			id: metaTag.attr('data-id'),
			debug: metaTag.attr('data-debug') === 'true',
			trackDownloads: metaTag.attr('data-trackDownloads'),
			trackOutboundLinks: metaTag.attr('data-trackOutboundLinks'),
			trackForms: metaTag.attr('data-trackForms')
		});	
	});
})(jQuery);

window.log = function(){
	log.history = log.history || [];
	log.history.push(arguments);
	arguments.callee = arguments.callee.caller;  
	if(this.console) console.log( Array.prototype.slice.call(arguments) );
};