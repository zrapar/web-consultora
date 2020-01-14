import { combineReducers } from 'redux';
import signatories from './signatories.reducer';

const reducer = combineReducers({
	signatories
});

export default reducer;
