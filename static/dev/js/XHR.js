var baseUrl = require('./utils').baseUrl;

module.exports = {

	signUpXHR(data) {
		return new Promise(function(resolve, reject) {
			let request = new XMLHttpRequest(),
				url = baseUrl + '/sign-up/';

			request.onload = function() {
				let response = JSON.parse(this.responseText);
				if (this.status == 201) {
					resolve(response);
				} else {
					reject(response);
				}
			}

			request.open('POST', url, true);
			request.setRequestHeader('Content-Type', 'application/json');
			console.log(JSON.stringify(data));
			request.send(JSON.stringify(data));

		});
	},

	signInXHR(data) {
		return new Promise(function(resolve, reject) {
			let request = new XMLHttpRequest(),
				url = baseUrl + '/sign-in/';

			request.onload = function() {
				let response = JSON.parse(this.responseText);
				if (this.status == 200) {
					resolve(response);
				} else {
					reject(response);
				}
			}

			request.open('POST', url, true);
			request.setRequestHeader('Content-Type', 'application/json');
			request.send(JSON.stringify(data));

		});
	},

	logOutXHR() {
		return new Promise(function(resolve, reject) {
			let request = new XMLHttpRequest(),
				url = baseUrl + '/log-out/';

			request.onload = function() {
				if (this.status == 200) {
					resolve('OK');
				} else {
					reject(this.responseText);
				}
			}

			request.open('GET', url, true);
			request.send(null);

		});
	},

	getMessagesXHR() {
		return new Promise(function(resolve, reject) {
			let request = new XMLHttpRequest(),
				url = baseUrl + '/messages/';

			request.onload = function() {
				let response = JSON.parse(this.responseText);
				if (this.status == 200) {
					resolve(response);
				} else {
					reject(response);
				}
			}

			request.open('GET', url, true);
			request.send(null);

		});
	},

	getUsersXHR() {
		return new Promise(function(resolve, reject) {
			let request = new XMLHttpRequest(),
				url = baseUrl + '/users/';

			request.onload = function() {
				let response = JSON.parse(this.responseText);
				if (this.status == 200) {
					resolve(response);
				} else {
					reject(response);
				}
			}

			request.open('GET', url, true);
			request.send(null);

		});
	},

	removeMessageXHR(id) {
		return new Promise(function(resolve, reject) {
			let request = new XMLHttpRequest(),
				url = baseUrl + '/messages/' + id + '/';

			request.onload = function() {
				if (this.status == 204) {
					resolve(this.responseText);
				} else {
					reject(this.responseText);
				}
			}

			request.open('DELETE', url, true);
			request.send(null);

		});
	},

	readAllFromThisUserXHR(id) {
		return new Promise(function(resolve, reject) {
			let request = new XMLHttpRequest(),
				url = baseUrl + '/users/' + id + '/';

			request.onload = function() {
				if (this.status == 200) {
					resolve(this.responseText);
				} else {
					reject(this.responseText);
				}
			}

			request.open('PATCH', url, true);
			request.send(null);

		});
	},

}