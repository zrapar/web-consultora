import { combineReducers } from 'redux';
import tasks from './tasks.reducer';

const reducer = combineReducers({
	tasks
});

export default reducer;
