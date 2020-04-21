import axios from 'axios';
import jwtDecode from 'jwt-decode';
import FuseUtils from '@fuse/FuseUtils';
import { BugsnagReporter } from '../../../utils/bugsnag';

class jwtService extends FuseUtils.EventEmitter {
	init() {
		axios.defaults.baseURL = process.env.REACT_APP_API_URL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		axios.interceptors.response.use(
			(response) => {
				return response;
			},
			(err) => {
				return new Promise((resolve, reject) => {
					if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
						// if you ever get an unauthorized response, logout the user
						if (err.response.data && err.response.code !== 'token_not_valid') {
							if (err.response.data.detail) {
								this.emit(
									'onAutoLogout',
									err.response.data.detail === 'No active account found with the given credentials'
										? 'Las credenciales proporcionadas son incorrectas'
										: err.response.data.detail
								);
							}
						} else {
							this.emit('onAutoLogout', 'El tiempo de su sesión finalizo');
						}

						this.setSession(null);
					}
					throw err;
				});
			}
		);
	};

	handleAuthentication = () => {
		let access_token = this.getAccessToken();

		if (!access_token) {
			this.emit('onNoAccessToken');
			return;
		}

		if (this.isAuthTokenValid(access_token)) {
			this.setSession(access_token);
			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null);
			this.emit('onAutoLogout', 'Tu sesión ha expirado');
		}
	};

	createUser = (data) => {
		return new Promise((resolve, reject) => {
			axios.post('/api/auth/register', data).then((response) => {
				if (response.data.user) {
					this.setSession(response.data.access);
					resolve(response.data.user);
				} else {
					reject(response.data.error);
				}
			});
		});
	};

	signInWithEmailAndPassword = async (username, password) => {
		try {
			const response = await axios.post('/api/token/', {
				username,
				password
			});
			if (response.data) {
				this.setSession(response.data.access);
				const user = await this.getInfoUser(jwtDecode(response.data.access));
				BugsnagReporter.setUser(user.id, `${user.first_name} ${user.last_name}`, user.email);
				return { success: true, user };
			} else {
				return { success: false, message: response.data };
			}
		} catch (error) {
			return { success: false, message: error.response.data };
		}
	};

	signInWithToken = () => {
		return new Promise((resolve, reject) => {
			axios
				.post('api/token/verify/', {
					token : this.getAccessToken()
				})
				.then(async (response) => {
					if (response) {
						this.setSession(this.getAccessToken());
						const user = await this.getInfoUser(jwtDecode(this.getAccessToken()));
						BugsnagReporter.setUser(user.id, `${user.first_name} ${user.last_name}`, user.email);
						resolve({ user });
					} else {
						this.logout();
						reject('Failed to login with token.');
					}
				})
				.catch((error) => {
					this.logout();
					reject('Failed to login with token.');
				});
		});
	};

	updateUserData = (user) => {
		return axios.post('/api/auth/user/update', {
			user : user
		});
	};

	setSession = (access_token) => {
		if (access_token) {
			localStorage.setItem('jwt_access_token', access_token);
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
		} else {
			localStorage.removeItem('jwt_access_token');
			delete axios.defaults.headers.common['Authorization'];
		}
	};

	logout = () => {
		this.setSession(null);
	};

	isAuthTokenValid = (access_token) => {
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn('access token expired');
			return false;
		} else {
			return true;
		}
	};

	getAccessToken = () => {
		return window.localStorage.getItem('jwt_access_token');
	};

	getInfoUser = async ({ user_id }) => {
		const response = await axios.get(`/user/${user_id}/`);
		return response.data;
	};
}

const instance = new jwtService();

export default instance;
