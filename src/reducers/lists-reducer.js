import {type} from 'redux-action-factory';
import initialState from './initial-state';
import list from './list-reducer';

function lists(state = initialState.lists, action) {
    switch (action.type) {
        case type('ADD_LIST'):
            let newList = {
                id: action.newId,
                name: action.name,
                pending: [],
                archive: []
            };
            return {...state, [action.newId]: newList};
        case type('DELETE_LIST'):
            // Remove the list from the state
            let { [action.id]: deletedList, ...rest } = state;
            // But do not remove it when it is the last one
            if (Object.keys(rest).length === 0) {
                rest = {...state, [action.id]: list(state[action.id], action)};
            }
            return rest;
        case type('CHANGE_LIST_NAME'):
        case type('ARCHIVE_LIST'):
            // If and only if list exists
            if (state[action.id]) {
                // Return the lists with this concrete list modified as its reducer says
                return {...state, [action.id]: list(state[action.id], action)};
            }
        case type('ADD_ITEM'):
        case type('ARCHIVE_ITEM'):
        case type('RETRIEVE_ITEM'):
        case type('REORDER_ITEM'):
        case type('DELETE_ITEM'):
            // If and only if list exists
            if (state[action.listId]) {
                // Return the lists with this concrete list modified as its reducer says
                return {...state, [action.listId]: list(state[action.listId], action)};
            }
        default:
            return state;
    }
}

export default lists;
