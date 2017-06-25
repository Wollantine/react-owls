import reducer from '../../reducer';
import denormalizeState from './DenormalizeState';
import {createRawAction, createAction} from 'redux-action-factory';

describe('Reducer, upon ADD_ITEM', () => {
    let initialState;
    let existingListId;

    before(() => {
        initialState = reducer(undefined, {});
        existingListId = initialState.present.selectedList.id;
    });

    it('should add a not done item to an existing list', () => {
    	// We create the action with an added id
    	let action = createRawAction('ADD_ITEM', {listId: existingListId, name: 'Item Name'});
    	action.newId = 'item-0';

    	// We add the new item
    	let finalState = reducer(initialState, action);
        finalState = denormalizeState(finalState.present);

        // Check the item is inside the list
    	finalState.lists[0].should.have.property('pending').that.contains(
    		{name: 'Item Name', done: false});
    });

    it('should do nothing if list doesn\'t exist', () => {
    	// We create the action with an added id
    	const nonExistingListId = 'list-0';
    	let action = createRawAction('ADD_ITEM', {listId: nonExistingListId, name: 'Item Name'});
    	action.newId = 'item-0';

    	// We add the new item
    	let finalState = reducer(initialState, action);

        finalState.present.should.deep.equal(initialState.present);
    });

});
