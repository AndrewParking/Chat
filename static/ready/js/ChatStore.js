'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AppDispatcher = require('./AppDispatcher'),
    EventEmitter = require('events').EventEmitter;

var _messages = [],
    _users = [];

var ChatStore = (function (_EventEmitter) {
	_inherits(ChatStore, _EventEmitter);

	function ChatStore() {
		_classCallCheck(this, ChatStore);

		_get(Object.getPrototypeOf(ChatStore.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(ChatStore, [{
		key: 'addMessage',
		value: function addMessage(message) {
			_messages.push(message);
		}
	}, {
		key: 'emitChange',
		value: function emitChange() {
			this.emit('change');
		}
	}, {
		key: 'addChangeListener',
		value: function addChangeListener(callback) {
			this.on('change', callback);
		}
	}, {
		key: 'removeChangeListener',
		value: function removeChangeListener(callback) {
			this.removeListener('change', callback);
		}
	}, {
		key: 'Messages',
		get: function get() {
			return _messages;
		},
		set: function set(mesList) {
			_messages = mesList;
		}
	}, {
		key: 'Users',
		get: function get() {
			return _users;
		},
		set: function set(usersList) {
			_users = usersList;
		}
	}]);

	return ChatStore;
})(EventEmitter);

module.exports = ChatStore;