import {type} from 'redux-action-factory';

function item(state = {}, action) {
    switch (action.type) {
        case type('CHANGE_ITEM_STATUS'):
            return {...state, done: action.done};
        case type('RETRIEVE_ITEM'):
            return {...state, done: false};
        default:
            return state;
    }
}

export default item;
