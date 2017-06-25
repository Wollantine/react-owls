import undoable from './undo';
import initialState from './initial-state';
import lists from './lists-reducer';
import items from './items-reducer';
import selectedList from './selected-list-reducer';
import {reducer as formReducer} from 'redux-form';


let reducer = (state = initialState, action) => {
	return {
	    lists: lists(state.lists, action),
	    items: items(state.items, action, state.lists),
	    selectedList: selectedList(state.selectedList, action, state.lists),
	    form: formReducer(state.form, action)
	}
}

// Make the reducer undoable
reducer = undoable(reducer);

export default reducer;
