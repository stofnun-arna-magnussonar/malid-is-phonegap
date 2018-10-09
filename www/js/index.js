var app = {

	initialize: function() {
		this.bindEvents();
	},

	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},

	onDeviceReady: function() {
		var networkState = navigator.connection.type;

		if (networkState == Connection.NONE) {
			document.getElementById('noConnection').setAttribute('style', 'display:block;');
		}
		else {
			cordova.InAppBrowser.open('http://malid.is', '_self', 'location=no,zoom=no,hideurlbar=yes');
		}
	}
};
