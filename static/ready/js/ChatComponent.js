'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react'),
    getUsersXHR = require('./XHR').getUsersXHR,
    getMessagesXHR = require('./XHR').getMessagesXHR,
    removeMessageXHR = require('./XHR').removeMessageXHR,
    readAllFromThisUserXHR = require('./XHR').readAllFromThisUserXHR,
    baseUrl = require('./utils').baseUrl,
    wsUrl = require('./utils').wsUrl;

var ChatComponent = (function (_React$Component) {
	_inherits(ChatComponent, _React$Component);

	function ChatComponent() {
		_classCallCheck(this, ChatComponent);

		_get(Object.getPrototypeOf(ChatComponent.prototype), 'constructor', this).call(this);
		this.state = {
			users: [],
			messages: [],
			currentUser: undefined
		};
		this.getUsers = this.getUsers.bind(this);
		this.selectUser = this.selectUser.bind(this);
		this.getMessages = this.getMessages.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.getForm = this.getForm.bind(this);
		this.removeMessage = this.removeMessage.bind(this);
		this.socket = new WebSocket(wsUrl + '/message/');
		var self = this;

		this.socket.onmessage = function (e) {
			var message = JSON.parse(e.data);
			console.log(message);
			self.setState(function (prev) {
				var newMessages = prev.messages;
				if (prev.currentUser && message.from_account_id == prev.currentUser.account_id) {
					message.alr_read = 1;
				};
				newMessages.push(message);
				return {
					users: prev.users,
					messages: newMessages,
					currentUser: prev.currentUser
				};
			});
		};

		this.socket.onerror = function (error) {
			console.log(error.message);
		};
	}

	_createClass(ChatComponent, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this = this;

			Promise.all([getUsersXHR(), getMessagesXHR()]).then(function (results) {
				console.log(results);
				_this.setState(function (prev) {
					return {
						users: results[0],
						messages: results[1],
						currentUser: prev.currentUser
					};
				});
			}, function (error) {
				console.log('Error!');
			});
		}
	}, {
		key: 'selectUser',
		value: function selectUser(e) {
			console.log(e.target.parentNode);
			var found = '',
			    self = this,
			    nick = e.target.parentNode.getAttribute('data-nick');
			console.log('---->', nick);
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.state.users[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var user = _step.value;

					if (user.nickname = nick) {
						found = user;
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			readAllFromThisUserXHR(found.account_id).then(function (result) {
				self.setState(function (prev) {
					var oldMessages = prev.messages;
					for (var i = 0, len = oldMessages.length; i < len; i++) {
						if (oldMessages[i].from_account_id == found.account_id) {
							oldMessages[i].alr_read = 1;
						}
					}
					return {
						messages: oldMessages,
						users: prev.users,
						currentUser: found
					};
				});
			}, function (error) {
				console.log('error while reading messages');
			});
		}
	}, {
		key: 'getUsers',
		value: function getUsers() {
			var _this2 = this;

			return this.state.users.map(function (user) {
				var counter = 0;
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = _this2.state.messages[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var message = _step2.value;

						if (message.from_account_id == user.account_id && message.alr_read == 0) {
							counter++;
						}
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2['return']) {
							_iterator2['return']();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				;
				if (!counter) {
					counter = '';
				};
				return React.createElement("button", { onClick: _this2.selectUser, "data-nick": user.nickname, key: user.account_id }, user.nickname, React.createElement("span", null, counter));
			});
		}
	}, {
		key: 'getMessages',
		value: function getMessages() {
			var _this3 = this;

			var user = this.state.currentUser;
			if (user) {
				return this.state.messages.map(function (message) {
					if (message.to_account_id === user.account_id) {
						return React.createElement("div", { className: "message own", key: message.message_id }, message.content, React.createElement("button", { id: message.message_id, onClick: _this3.removeMessage }, "Delete"));
					};
					if (message.from_account_id === user.account_id) {
						return React.createElement("div", { className: "message foreign", key: message.message_id }, message.content, React.createElement("button", { id: message.message_id, onClick: _this3.removeMessage }, "Delete"));
					};
				});
			} else {
				return React.createElement("div", null, "Please, choose the user...");
			}
		}
	}, {
		key: 'getForm',
		value: function getForm() {
			if (this.state.currentUser) {
				return React.createElement("div", null, React.createElement("textarea", { id: "mes-input", placeholder: "Start typing here..." }), React.createElement("button", { onClick: this.sendMessage }, "Send"));
			} else {
				return '';
			}
		}
	}, {
		key: 'sendMessage',
		value: function sendMessage() {
			var formInput = document.getElementById('mes-input'),
			    data = {
				to_account_id: this.state.currentUser.account_id,
				content: formInput.value
			};
			this.socket.send(JSON.stringify(data));
			formInput.value = '';
		}
	}, {
		key: 'removeMessage',
		value: function removeMessage(e) {
			var id = e.target.id,
			    oldMessages = this.state.messages,
			    self = this;
			removeMessageXHR(id).then(function (result) {
				for (var i = 0, len = oldMessages.length; i < len; i++) {
					console.log(oldMessages[i].message_id, id);
					if (oldMessages[i].message_id == id) {
						oldMessages.splice(i, 1);
						break;
					}
				}
				self.setState(function (prev) {
					return {
						users: prev.users,
						messages: oldMessages,
						currentUser: prev.currentUser
					};
				});
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var usersList = this.getUsers(),
			    messages = this.getMessages(),
			    messageForm = this.getForm();
			return React.createElement("section", { className: "app" }, React.createElement("div", { className: "users" }, usersList), React.createElement("div", { className: "chat" }, React.createElement("div", { className: "messages" }, messages), messageForm));
		}
	}]);

	return ChatComponent;
})(React.Component);

module.exports = ChatComponent;