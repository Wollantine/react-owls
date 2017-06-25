import {type} from 'redux-action-factory';
import List from '../utils/List';

const boundIndexBetween = (min, max, index) => (
    index > max ? max :
    index < min ? min :
    index
);

const isBetween = (a, b, num) => (
    (a <= num && num <= b) ||
    (b <= num && num <= a)
);

const itemWithItsNewPosition = (itemToReorder, itemPosition, newPosition) => {
    return (item, index)  => {
        if (isBetween(itemPosition, newPosition, index)) {
            if (index === itemPosition) return {item, newPosition};
            if (itemPosition < newPosition) return {item, newPosition: index - 1};
            if (newPosition < itemPosition) return {item, newPosition: index + 1};
        } else {
            return {item, newPosition: index};
        }
    }
};

/**
* Moves an item of the list array to the index newPosition. If newPosition is beyond
* the array's limits, the item will end up in the end (if higher than length) or the
* beginning, if lower than 0.
*/
export const moveItem = (array, itemToReorder, newPosition) => {
    const list = List(array);
    if (!list.contains(itemToReorder)) return list.valueOf();

    const boundedPosition = boundIndexBetween(0, list.length - 1, newPosition);
    const itemPosition = list.indexOf(itemToReorder);

    return list.map(itemWithItsNewPosition(itemToReorder, itemPosition, boundedPosition))
        .sort((a, b) => (a.newPosition - b.newPosition))
        .map(item => item.item)
        .valueOf();
}


function list(state = {}, action) {
    const {id, name} = state,
        pending = List(state.pending),
        archive = List(state.archive);
    switch (action.type) {

        case type('CHANGE_LIST_NAME'):
            return {
                ...state,
                name: action.newName,
            };

        case type('ADD_ITEM'):
            return {
                ...state,
                pending: [...pending, action.newId],
            };

        case type('ARCHIVE_ITEM'):
            const existsAndNotArchived = pending.contains(action.id) &&
                !archive.contains(action.id);
            return {
                ...state,
                pending: pending.without(action.id).valueOf(),
                archive: archive.when(existsAndNotArchived).prepend(action.id).valueOf(),
            };

        case type('RETRIEVE_ITEM'):
            const existsAndNotPending = archive.contains(action.id) &&
                !pending.contains(action.id);
            return {
                ...state,
                pending : pending.when(existsAndNotPending).append(action.id).valueOf(),
                archive: archive.without(action.id).valueOf(),
            };

        case type('REORDER_ITEM'):
            const isPending = pending.contains(action.id);
            const isArchived = archive.contains(action.id) && !isPending;
            return {
                ...state,
                pending: isPending ? moveItem(pending, action.id, action.newPosition) : pending.valueOf(),
                archive: isArchived ? moveItem(archive, action.id, action.newPosition) : archive.valueOf(),
            };

        case type('DELETE_ITEM'):
            // Remove it from both pending and archive, regardless of where it is
            return {
                ...state,
                pending: pending.without(action.id).valueOf(),
                archive: archive.without(action.id).valueOf(),
            };

        case type('ARCHIVE_LIST'):
            return {
                ...state,
                pending: [],
                archive: [...pending, ...archive],
            };

        case type('DELETE_LIST'):
            return {
                ...state,
                pending: [],
                archive: []
            };

        default:
            return state;
    }
}

export default list;
