import {type} from 'redux-action-factory';
import initialState from './initial-state';
import item from './item-reducer';
import List from '../utils/List';

const keepWhen = (condition, map) => (
    (result, current) => (
        condition(map[current]) ? {...result, [current]: map[current]} : result
    )
);

const belongsToList = (listId) => (item) => item.listId === listId;

const not = (func) => (args) => !func(args);

function items(state = initialState.items, action, lists) {
    let itemObj;
    let list;
    switch (action.type) {

        case type('DELETE_LIST'):
            // For each item, keep it only if it doesn't belong to the deleted list
            let items = Object.keys(state).reduce(
                keepWhen(not(belongsToList(action.id)), state),
                {}
            );
            return items;

        case type('ADD_ITEM'):
            // Only if the list exists
            if (lists[action.listId]) {
                let newItem = {
                    id: action.newId,
                    listId: action.listId,
                    name: action.name,
                    done: false
                };
                return {...state, [action.newId]: newItem};
            }
            return state;

        case type('RETRIEVE_ITEM'):
            list = lists[action.listId];
            itemObj = state[action.id];
            // If the list and item exist
            if (list && List(list.archive).contains(action.id)) {
                return {...state, [action.id]: item(itemObj, action)};
            }
            return state;

        case type('CHANGE_ITEM_STATUS'):
            itemObj = state[action.id];
            if (itemObj) {
                return {...state, [action.id]: item(itemObj, action)};
            }
            return state;

        case type('DELETE_ITEM'):
            list = lists[action.listId];
            itemObj = state[action.id];
            // Only if the list and item exist
            if (list && (List(list.pending).contains(action.id) || List(list.archive).contains(action.id))) {
                let { [action.id]: deletedItem, ...rest } = state;
                return rest;
            }
            return state;

        default:
            return state;
    }
}

export default items;
