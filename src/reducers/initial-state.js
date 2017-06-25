import shortid from 'shortid';
import {listPrefix, itemPrefix} from '../actions/storage-consts';

let initialListId = listPrefix+shortid.generate();
let initialItemId = itemPrefix+shortid.generate();

const initialState = {
    lists: {
        [initialListId]: {
            id: initialListId,
            name: 'Shopping List',
            pending: [ initialItemId ],
            archive: []
        }
    },
    items: {
        [initialItemId]: {
            id: initialItemId,
            listId: initialListId,
            name: 'Swipe me!',
            done: false
        }
    },
    selectedList: {
        id: initialListId,
        name: 'Shopping List'
    }
};

export default initialState;
