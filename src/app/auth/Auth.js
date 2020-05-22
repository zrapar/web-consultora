import React, { Component } from 'react';
import { FuseSplashScreen } from '@fuse';
import { connect } from 'react-redux';
import * as userActions from 'app/auth/store/actions';
import { bindActionCreators } from 'redux';
import * as Actions from 'app/store/actions';
import jwtService from 'app/services/jwtService';
import moment from 'moment';

class Auth extends Component {
	state = {
		waitAuthCheck   : true,
		timerSession    : null,
		timerModal      : null,
		sessionEndsSoon : false,
		sessionEnd      : false
	};

	componentDidMount() {
		return Promise.all([ this.jwtCheck() ]).then(() => {
			this.setState({
				waitAuthCheck : false
			});
		});
	}

	jwtCheck = () =>
		new Promise((resolve) => {
			jwtService.on('onAutoLogin', () => {
				this.props.showMessage({ message: 'Bienvenido de Vuelta' });

				/**
				 * Sign in and retrieve user data from Api
				 */
				jwtService
					.signInWithToken()
					.then(({ user }) => {
						this.props.setUserData(user);

						resolve();

						this.props.showMessage({ message: 'Bienvenido de Vuelta' });
					})
					.catch((error) => {
						this.props.showMessage({ message: error });

						resolve();
					});
			});

			jwtService.on('onAutoLogout', (message) => {
				if (message) {
					this.props.showMessage({ message });
				}

				this.props.logout();

				resolve();
			});

			jwtService.on('onNoAccessToken', () => {
				resolve();
			});

			jwtService.on('startTimers', () => {
				this.setState({
					timerModal   : this.getTimerModal(),
					timerSession : this.getTimerSession()
				});
				resolve();
			});

			jwtService.init();

			return Promise.resolve();
		});

	getTimerSession() {
		const expirationToken = window.localStorage.getItem('exp_token');
		if (this.state.timerSession) {
			clearTimeout(this.state.timerSession);
		}
		if (expirationToken) {
			// console.log('start timer getTimerSession');
			const date = new Date(0);
			date.setUTCSeconds(expirationToken);
			const endValidTime = moment(date);
			const actualTime = moment();
			const timer = setTimeout(() => {
				this.setState({ sessionEnd: true });
			}, endValidTime.diff(actualTime, 'miliseconds'));
			return timer;
		}
	}

	getTimerModal() {
		const expirationToken = window.localStorage.getItem('exp_token');
		if (this.state.timerModal) {
			clearTimeout(this.state.timerModal);
		}
		if (expirationToken) {
			// console.log('start timer getTimerModal');
			const date = new Date(0);
			date.setUTCSeconds(expirationToken);
			const endValidTime = moment(date);
			const actualTime = moment();
			const modalTime = moment(endValidTime).subtract(2, 'minutes');
			const timer = setTimeout(() => {
				this.setState({ sessionEndsSoon: true });
			}, modalTime.diff(actualTime, 'miliseconds'));
			return timer;
		}
	}

	showTimerModal() {
		// console.log('Su sesion esta a punto de finalizar');
		this.props.showMessage({ message: 'Su sesion esta a punto de finalizar' });
		this.props.openSessionDialog();
		this.setState({ sessionEndsSoon: false });
	}

	closeSessionByTime() {
		// console.log('Su sesion ha finalizado');
		this.props.showMessage({ message: 'Su sesion ha finalizado' });
		this.props.closeSessionDialog();
		this.props.logout();
		this.setState({
			timerSession    : null,
			timerModal      : null,
			sessionEndsSoon : false,
			sessionEnd      : false
		});
	}

	render() {
		if (this.state.sessionEndsSoon) {
			this.showTimerModal();
		}

		if (this.state.sessionEnd) {
			this.closeSessionByTime();
		}

		return this.state.waitAuthCheck ? <FuseSplashScreen /> : <React.Fragment children={this.props.children} />;
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			logout              : userActions.logoutUser,
			setUserData         : userActions.setUserData,
			setUserDataAuth0    : userActions.setUserDataAuth0,
			setUserDataFirebase : userActions.setUserDataFirebase,
			showMessage         : Actions.showMessage,
			hideMessage         : Actions.hideMessage,
			openSessionDialog   : Actions.openSessionDialog,
			closeSessionDialog  : Actions.closeSessionDialog
		},
		dispatch
	);
}

export default connect(null, mapDispatchToProps)(Auth);
