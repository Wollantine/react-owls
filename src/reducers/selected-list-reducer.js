import {type} from 'redux-action-factory';
import initialState from './initial-state';

function selectedList(state = initialState.selectedList, action, lists) {
    switch (action.type) {
        case type('SELECT_LIST'):
            // Change selected list if and only if it exists
            if (lists[action.id]) {
                return {id: action.id, name: action.name};
            }
        case type('DELETE_LIST'):
            // If the deleted list was the selected one, select the first list.
            if (action.id == state.id) {
                const firstListId = Object.keys(lists)[0];
                const firstList = lists[firstListId];
                return {id: firstList.id, name: firstList.name};
            }
        default:
            return state;
    }
}

export default selectedList;
