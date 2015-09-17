'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react'),
    ChatComponent = require('./ChatComponent'),
    authCookie = require('./utils').authCookie,
    signUpXHR = require('./XHR').signUpXHR,
    signInXHR = require('./XHR').signInXHR,
    logOutXHR = require('./XHR').logOutXHR;

var AppComponent = (function (_React$Component) {
	_inherits(AppComponent, _React$Component);

	function AppComponent() {
		_classCallCheck(this, AppComponent);

		_get(Object.getPrototypeOf(AppComponent.prototype), 'constructor', this).call(this);
		this.state = {
			authed: authCookie,
			form: 'sign_in',
			error: ''
		};
		this.chooseSignIn = this.chooseSignIn.bind(this);
		this.chooseSignUp = this.chooseSignUp.bind(this);
		this.clearError = this.clearError.bind(this);
		this.signIn = this.signIn.bind(this);
		this.signUp = this.signUp.bind(this);
		this.logOut = this.logOut.bind(this);
		this.getForm = this.getForm.bind(this);
		this.getError = this.getError.bind(this);
	}

	_createClass(AppComponent, [{
		key: 'chooseSignIn',
		value: function chooseSignIn() {
			this.setState(function (prev) {
				return {
					authed: false,
					form: 'sign_in',
					user: undefined,
					error: ''
				};
			});
		}
	}, {
		key: 'chooseSignUp',
		value: function chooseSignUp() {
			this.setState(function (prev) {
				return {
					authed: false,
					form: 'sign_up',
					error: ''
				};
			});
		}
	}, {
		key: 'clearError',
		value: function clearError() {
			this.setState(function (prev) {
				return {
					authed: prev.authed,
					form: prev.form,
					error: ''
				};
			});
		}
	}, {
		key: 'signIn',
		value: function signIn() {
			var self = this,
			    data = {
				nickname: document.getElementById('sign-in-nick').value,
				password: document.getElementById('sign-in-pass').value
			};
			signInXHR(data).then(function (result) {
				console.log('sign in result -> ' + result);
				self.setState(function (prev) {
					return {
						authed: true,
						form: prev.form,
						error: ''
					};
				});
				console.log(result);
			}, function (error) {
				self.setState(function (prev) {
					return {
						authed: false,
						form: prev.form,
						error: error.error
					};
				});
				console.log(error);
			});
		}
	}, {
		key: 'signUp',
		value: function signUp() {
			var self = this,
			    data = {
				nickname: document.getElementById('sign-up-nick').value,
				email: document.getElementById('sign-up-email').value,
				password: document.getElementById('sign-up-pass').value
			};
			signUpXHR(data).then(function (result) {
				self.setState(function (prev) {
					return {
						authed: true,
						form: prev.form,
						error: ''
					};
				});
			}, function (error) {
				self.setState(function (prev) {
					return {
						authed: false,
						form: prev.form,
						error: error.error
					};
				});
			});
		}
	}, {
		key: 'logOut',
		value: function logOut() {
			var self = this;
			logOutXHR().then(function (result) {
				self.setState(function (prev) {
					return {
						authed: false,
						form: prev.form,
						error: ''
					};
				});
			}, function (error) {
				console.log('Some connection error');
			});
		}
	}, {
		key: 'getForm',
		value: function getForm() {
			if (this.state.form === 'sign_in') {
				return React.createElement("div", null, React.createElement("input", { type: "text", id: "sign-in-nick", placeholder: "Nickname" }), React.createElement("input", { type: "password", id: "sign-in-pass", placeholder: "Password" }), React.createElement("button", { onClick: this.signIn }, "Sign In"));
			} else {
				return React.createElement("div", null, React.createElement("input", { type: "text", id: "sign-up-nick", placeholder: "Nickname" }), React.createElement("input", { type: "text", id: "sign-up-email", placeholder: "Email" }), React.createElement("input", { type: "password", id: "sign-up-pass", placeholder: "Password" }), React.createElement("button", { onClick: this.signUp }, "Sign Up"));
			}
		}
	}, {
		key: 'getError',
		value: function getError() {
			if (this.state.error) {
				return React.createElement("div", { className: "error" }, React.createElement("span", { className: "del-error", onClick: this.clearError }), React.createElement("p", null, this.state.error));
			} else {
				return '';
			}
		}
	}, {
		key: 'render',
		value: function render() {
			console.log('---> ' + this.state.user);
			if (this.state.authed) {

				return React.createElement("section", null, React.createElement("div", { className: "chat-header" }, React.createElement("button", { onClick: this.logOut }, "Logout")), React.createElement("div", null, React.createElement(ChatComponent, null)));
			} else {

				var form = this.getForm(),
				    error = this.getError(),
				    signInBtnClass = this.state.form === 'sign_in' ? 'current' : '',
				    signUpBtnClass = this.state.form === 'sign_up' ? 'current' : '';
				return React.createElement("section", null, React.createElement("div", { className: "chat-header" }, React.createElement("button", { onClick: this.chooseSignIn, className: signInBtnClass }, "Sign In"), React.createElement("button", { onClick: this.chooseSignUp, className: signUpBtnClass }, "Sign Up")), error, React.createElement("div", { className: "auth-form" }, form));
			}
		}
	}]);

	return AppComponent;
})(React.Component);

module.exports = AppComponent;