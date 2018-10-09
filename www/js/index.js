var app = {

	initialize: function() {
		this.bindEvents();
	},

	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},

	exitApp: function() {
		console.log('exitApp');
		if (navigator.app) {
			navigator.app.exitApp();
		} else if (navigator.device) {
			navigator.device.exitApp();
		} else {
			window.close();
		}
	},

	onBrowserClose: function() {
		this.exitApp();
	},

	onDeviceReady: function() {
		var networkState = navigator.connection.type;

		if (networkState == Connection.NONE) {
			document.getElementById('noConnection').setAttribute('style', 'display:block;');
		}
		else {
			var browserRef = cordova.InAppBrowser.open('http://malid.is', '_self', 'location=no,zoom=no,hideurlbar=yes');

			browserRef.addEventListener('exit', this.onBrowserClose)
		}
	}
};
