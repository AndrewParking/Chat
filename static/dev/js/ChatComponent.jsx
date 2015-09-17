var React = require('react'),
	getUsersXHR = require('./XHR').getUsersXHR,
	getMessagesXHR = require('./XHR').getMessagesXHR,
	removeMessageXHR = require('./XHR').removeMessageXHR,
	readAllFromThisUserXHR = require('./XHR').readAllFromThisUserXHR,
	baseUrl = require('./utils').baseUrl,
	wsUrl = require('./utils').wsUrl;


class ChatComponent extends React.Component {

	constructor() {
		super();
		this.state = {
			users: [],
			messages: [],
			currentUser: undefined,
		}
		this.getUsers = this.getUsers.bind(this);
		this.selectUser = this.selectUser.bind(this);
		this.getMessages = this.getMessages.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.getForm = this.getForm.bind(this);
		this.removeMessage = this.removeMessage.bind(this);
		this.socket = new WebSocket(wsUrl + '/message/');
		let self = this;

		this.socket.onmessage = function(e) {
			let message = JSON.parse(e.data);
			console.log(message);
			self.setState(prev => {
				let newMessages = prev.messages;
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

		this.socket.onerror = function(error) {
			console.log(error.message);
		};

	}

	componentDidMount() {
		Promise.all([
			getUsersXHR(),
			getMessagesXHR()
		]).then(results => {
			console.log(results);
			this.setState(prev => {
				return {
					users: results[0],
					messages: results[1],
					currentUser: prev.currentUser,
				};
			});
		}, error => {
			console.log('Error!');
		});
	}

	selectUser(e) {
		console.log(e.target.parentNode);
		let found = '',
			self = this,
			nick = e.target.parentNode.getAttribute('data-nick');
		console.log('---->', nick);
		for (let user of this.state.users) {
			if (user.nickname = nick) {
				found = user;
			}
		}
		readAllFromThisUserXHR(found.account_id)
			.then(result => {
				self.setState(prev => {
					let oldMessages = prev.messages;
					for (let i=0, len=oldMessages.length; i<len; i++) {
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
			}, error => {
				console.log('error while reading messages');
			});
	}

	getUsers() {
		return this.state.users.map(user => {
			let counter = 0;
			for (let message of this.state.messages) {
				if (message.from_account_id == user.account_id && message.alr_read == 0) {
					counter++;
				}
			};
			if (!counter) {
				counter = '';
			};
			return (
				<button onClick={this.selectUser} data-nick={user.nickname} key={user.account_id}>
					{user.nickname}
					<span>{counter}</span>
				</button>
			);
		});
	}

	getMessages() {
		let user = this.state.currentUser;
		if (user) {
			return this.state.messages.map(message => {
				if (message.to_account_id === user.account_id) {
					return (
						<div className='message own' key={message.message_id}>
							{message.content}
							<button id={message.message_id} onClick={this.removeMessage}>Delete</button>
						</div>
					);
				};
				if (message.from_account_id === user.account_id) {
					return (
						<div className='message foreign' key={message.message_id}>
							{message.content}
							<button id={message.message_id} onClick={this.removeMessage}>Delete</button>
						</div>
					);
				};
			});
		} else {
			return <div>Please, choose the user...</div>
		}
	}

	getForm() {
		if (this.state.currentUser) {
			return (
				<div>
					<textarea id='mes-input' placeholder='Start typing here...'></textarea>
					<button onClick={this.sendMessage}>Send</button>
				</div>
			);
		} else {
			return '';
		}
	}

	sendMessage() {
		let formInput = document.getElementById('mes-input'),
			data = {
				to_account_id: this.state.currentUser.account_id,
				content: formInput.value
			};
		this.socket.send(JSON.stringify(data));
		formInput.value = '';
	}

	removeMessage(e) {
		let id = e.target.id,
			oldMessages = this.state.messages,
			self = this;
		removeMessageXHR(id)
			.then(result => {
				for (let i=0, len=oldMessages.length; i<len; i++) {
					console.log(oldMessages[i].message_id, id);
					if (oldMessages[i].message_id == id) {
						oldMessages.splice(i, 1);
						break;
					}
				}
				self.setState(prev => {
					return {
						users: prev.users,
						messages: oldMessages,
						currentUser: prev.currentUser
					};
				});
			});
	}

	render() {
		let usersList = this.getUsers(),
			messages = this.getMessages(),
			messageForm = this.getForm();
		return (
			<section className='app'>
				<div className='users'>{usersList}</div>
				<div className='chat'>
					<div className='messages'>{messages}</div>
					{messageForm}
				</div>
			</section>
		);
	}

}

module.exports = ChatComponent;

