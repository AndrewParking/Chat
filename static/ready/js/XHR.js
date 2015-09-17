'use strict';

var baseUrl = require('./utils').baseUrl;

module.exports = {

	signUpXHR: function signUpXHR(data) {
		return new Promise(function (resolve, reject) {
			var request = new XMLHttpRequest(),
			    url = baseUrl + '/sign-up/';

			request.onload = function () {
				var response = JSON.parse(this.responseText);
				if (this.status == 201) {
					resolve(response);
				} else {
					reject(response);
				}
			};

			request.open('POST', url, true);
			request.setRequestHeader('Content-Type', 'application/json');
			console.log(JSON.stringify(data));
			request.send(JSON.stringify(data));
		});
	},

	signInXHR: function signInXHR(data) {
		return new Promise(function (resolve, reject) {
			var request = new XMLHttpRequest(),
			    url = baseUrl + '/sign-in/';

			request.onload = function () {
				var response = JSON.parse(this.responseText);
				if (this.status == 200) {
					resolve(response);
				} else {
					reject(response);
				}
			};

			request.open('POST', url, true);
			request.setRequestHeader('Content-Type', 'application/json');
			request.send(JSON.stringify(data));
		});
	},

	logOutXHR: function logOutXHR() {
		return new Promise(function (resolve, reject) {
			var request = new XMLHttpRequest(),
			    url = baseUrl + '/log-out/';

			request.onload = function () {
				if (this.status == 200) {
					resolve('OK');
				} else {
					reject(this.responseText);
				}
			};

			request.open('GET', url, true);
			request.send(null);
		});
	},

	getMessagesXHR: function getMessagesXHR() {
		return new Promise(function (resolve, reject) {
			var request = new XMLHttpRequest(),
			    url = baseUrl + '/messages/';

			request.onload = function () {
				var response = JSON.parse(this.responseText);
				if (this.status == 200) {
					resolve(response);
				} else {
					reject(response);
				}
			};

			request.open('GET', url, true);
			request.send(null);
		});
	},

	getUsersXHR: function getUsersXHR() {
		return new Promise(function (resolve, reject) {
			var request = new XMLHttpRequest(),
			    url = baseUrl + '/users/';

			request.onload = function () {
				var response = JSON.parse(this.responseText);
				if (this.status == 200) {
					resolve(response);
				} else {
					reject(response);
				}
			};

			request.open('GET', url, true);
			request.send(null);
		});
	},

	removeMessageXHR: function removeMessageXHR(id) {
		return new Promise(function (resolve, reject) {
			var request = new XMLHttpRequest(),
			    url = baseUrl + '/messages/' + id + '/';

			request.onload = function () {
				if (this.status == 204) {
					resolve(this.responseText);
				} else {
					reject(this.responseText);
				}
			};

			request.open('DELETE', url, true);
			request.send(null);
		});
	},

	readAllFromThisUserXHR: function readAllFromThisUserXHR(id) {
		return new Promise(function (resolve, reject) {
			var request = new XMLHttpRequest(),
			    url = baseUrl + '/users/' + id + '/';

			request.onload = function () {
				if (this.status == 200) {
					resolve(this.responseText);
				} else {
					reject(this.responseText);
				}
			};

			request.open('PATCH', url, true);
			request.send(null);
		});
	}

};