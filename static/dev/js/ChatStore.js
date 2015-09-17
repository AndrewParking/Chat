var AppDispatcher = require('./AppDispatcher'),
	EventEmitter = require('events').EventEmitter;

var _messages = [],
	_users = [];


class ChatStore extends EventEmitter {

	get Messages() {
		return _messages;
	}

	set Messages(mesList) {
		_messages = mesList;
	}

	get Users() {
		return _users;
	}

	set Users(usersList) {
		_users = usersList;
	}

	addMessage(message) {
		_messages.push(message);
	}

	emitChange() {
		this.emit('change');
	}

	addChangeListener(callback) {
		this.on('change', callback);
	}

	removeChangeListener(callback) {
		this.removeListener('change', callback);
	}

}


module.exports = ChatStore;