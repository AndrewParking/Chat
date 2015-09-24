var React = require('react'),
	ChatComponent = require('./ChatComponent'),
	authCookie = require('./utils').authCookie,
	signUpXHR = require('./XHR').signUpXHR,
	signInXHR = require('./XHR').signInXHR,
	logOutXHR = require('./XHR').logOutXHR;

class AppComponent extends React.Component {

	constructor() {
		super();
		this.state = {
			authed: (authCookie),
			form: 'sign_in',
			error: '',
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

	chooseSignIn() {
		this.setState(prev => {
			return {
				authed: false,
				form: 'sign_in',
				user: undefined,
				error: '',
			};
		});
	}

	chooseSignUp() {
		this.setState(prev => {
			return {
				authed: false,
				form: 'sign_up',
				error: '',
			};
		});
	}

	clearError() {
		this.setState(prev => {
			return {
				authed: prev.authed,
				form: prev.form,
				error: '',
			};
		});
	}

	signIn() {
		let self = this,
			data = {
				nickname: document.getElementById('sign-in-nick').value,
				password: document.getElementById('sign-in-pass').value
			};
		signInXHR(data)
			.then(result => {
				console.log('sign in result -> '+result);
				self.setState(prev => {
					return {
						authed: true,
						form: prev.form,
						error: ''
					};
				});
			}, error => {
				self.setState(prev => {
					return {
						authed: false,
						form: prev.form,
						error: error.error
					};
				});
			});
	}

	signUp() {
		let self = this,
			data = {
				nickname: document.getElementById('sign-up-nick').value,
				email: document.getElementById('sign-up-email').value,
				password: document.getElementById('sign-up-pass').value
			};
		signUpXHR(data)
			.then(result => {
				console.log('sign up data -->', result);
				self.setState(prev => {
					return {
						authed: true,
						form: prev.form,
						error: ''
					};
				});
			}, error => {
				self.setState(prev => {
					return {
						authed: false,
						form: prev.form,
						error: error.error
					};
				});
			});
	}

	logOut() {
		let self = this;
		logOutXHR()
			.then(result => {
				self.setState(prev => {
					return {
						authed: false,
						form: prev.form,
						error: ''
					};
				});
			}, error => {
				console.log('Some connection error');
			});
	}

	getForm() {
		if (this.state.form === 'sign_in') {
			return (
				<div>
					<input type="text" id="sign-in-nick" placeholder="Nickname" />
					<input type="password" id="sign-in-pass" placeholder="Password" />
					<button onClick={this.signIn}>Sign In</button>
				</div>
			);
		} else {
			return (
				<div>
					<input type="text" id="sign-up-nick" placeholder="Nickname" />
					<input type="text" id="sign-up-email" placeholder="Email" />
					<input type="password" id="sign-up-pass" placeholder="Password" />
					<button onClick={this.signUp}>Sign Up</button>
				</div>
			);
		}
	}

	getError() {
		if (this.state.error) {
			return (
				<div className="error">
					<span className='del-error' onClick={this.clearError}></span>
					<p>{this.state.error}</p>
				</div>
			);
		} else {
			return '';
		}
	}

	render() {
		console.log('---> '+this.state.user);
		if (this.state.authed) {

			return (
				<section>
					<div className="chat-header">
						<div className='logo'>Simple chat</div>
						<button onClick={this.logOut}>Logout</button>
					</div>
					<div>
						<ChatComponent />
					</div>
				</section>
			);

		} else {

			let form = this.getForm(),
				error = this.getError(),
				signInBtnClass = (this.state.form === 'sign_in') ? 'current' : '',
				signUpBtnClass = (this.state.form === 'sign_up') ? 'current' : '';
			return (
				<section>
					<div className="chat-header">
						<div className='logo'>Simple chat</div>
						<button onClick={this.chooseSignIn} className={signInBtnClass}>Sign In</button>
						<button onClick={this.chooseSignUp} className={signUpBtnClass}>Sign Up</button>
					</div>
					{error}
					<div className="auth-form">{form}</div>
				</section>
			);

		}
	}

}

module.exports = AppComponent;

