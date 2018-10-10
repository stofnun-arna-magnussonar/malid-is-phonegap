var app = {

	initialize: function() {
		this.bindEvents();
	},

	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},

	onDeviceReady: function() {
		var initialized = false;

		var initializeApp = function() {
			console.log('onDeviceReady')
			var networkState = navigator.connection.type;

			if (networkState == Connection.NONE) {
				document.getElementById('noConnection').setAttribute('style', 'display:block;');

				if (!this.initialized) {
					document.getElementById('retryButton').addEventListener('click', initializeApp, false);
					console.log('add addEventListener')
				}
			}
			else {
				var checkBrowserUrl;
				var browserRef = cordova.InAppBrowser.open('http://malid.is', '_blank', 'location=no,zoom=no,hideurlbar=yes');

				browserRef.addEventListener('exit', function() {
					// Lokum appinu ef inAppBrowser lokast, gerist ef ýtt er á bakk-takkann á tækinu á forsíðu málsins.is
					if (navigator.app) {
						navigator.app.exitApp();
					} else if (navigator.device) {
						navigator.device.exitApp();
					} else {
						window.close();
					}
				}, false);

				browserRef.addEventListener('loadstop', function() {
					browserRef.insertCSS({
						code: `
							.navbar {
								height: 350px;
							}
							nav img {
								max-width: 120px;
							}
						`
					});

					// Bæti við JavaScript sem athugar alla tengla sem eru opnaðir. Ef þeir tilheyra ekki síðum sem
					// tengdar eru við málið.is eru þær opnaðar í ytri vafra í tækinu (ekki inAppBrowser)
					browserRef.executeScript({
						code: `
							var elements = document.getElementsByTagName('a');
							for(var i = 0, len = elements.length; i < len; i++) {
								elements[i].onclick = function (event) {
									var linkHref = event.currentTarget.href;

									if (!linkHref.match(/bin.arnastofnun.is|malid.is|islenskordabok.arnastofnun.is|ordanet.arnastofnun.is|ordanet.is|ordabanki.hi.is/)) {
										event.preventDefault();

										localStorage.setItem('openUrl', linkHref);
									}
								}
							}

							localStorage.setItem('openUrl', '');
						`
					}, function() {
						if (checkBrowserUrl) {
							clearInterval(checkBrowserUrl);
						}

						checkBrowserUrl = setInterval(function() {
							browserRef.executeScript({
								code: "localStorage.getItem('openUrl')"
							}, function(values) {
								openUrl = values[0];
								if (openUrl != '') {
									browserRef.executeScript({
										code: "localStorage.setItem('openUrl', '');"
									});

									window.open(openUrl, '_system');
								}
							});
						}, 100);
					});
				});
			}

			initialized = true;
		}

		initializeApp();
	}
};
