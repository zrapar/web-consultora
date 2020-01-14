import { combineReducers } from 'redux';
import clients from './clients.reducer';

const reducer = combineReducers({
	clients
});

export default reducer;
