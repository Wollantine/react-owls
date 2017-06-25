import reducer from '../../reducer';
import {createAction} from 'redux-action-factory';
import List from '../../../utils/List';

describe('Reducer, upon ARCHIVE_ITEM', () => {
    let initialState;
    let existingListId;
    let existingItemId;

    beforeEach(() => {
        initialState = reducer(undefined, {});
        existingListId = initialState.present.selectedList.id;
        existingItemId = initialState.present.lists[existingListId].pending[0];
    });

    describe('when the item is not archived', () => {
    	let finalState;

    	before(() => {
	    	// We archive the initial item
	    	const action = createAction('ARCHIVE_ITEM', {listId: existingListId, id: existingItemId});
	    	finalState = reducer(initialState, action);
    	});

    	it('should delete the item from the list of pending', () => {
    		finalState.present.lists[existingListId].pending.should.deep.equal([]);
    	});

    	it('should add the item to the archive', () => {
	    	finalState.present.lists[existingListId].archive.should.deep.equal([existingItemId]);
	    });

    });

    it('should do nothing on an already archived item', () => {
    	// We archive the initial item
    	const action = createAction('ARCHIVE_ITEM', {listId: existingListId, id: existingItemId});
    	const firstState = reducer(initialState, action);

    	// We re-archive it by repeating the action
    	const secondState = reducer(firstState, action);

    	// Check nothing changed
        firstState.present.should.deep.equal(secondState.present);
    });

    it('should do nothing on a non existing item', () => {
    	// We archive a non existing item
    	const action = createAction('ARCHIVE_ITEM', {listId: existingListId, id: 'non-existing item'});
    	const finalState = reducer(initialState, action);

    	finalState.present.should.deep.equal(initialState.present);
    });

    it('should do nothing on a non existing list', () => {
    	// We archive an item of a non-existing list
    	const action = createAction('ARCHIVE_ITEM', {listId: 'non-existing list', id: existingItemId});
    	const finalState = reducer(initialState, action);

    	finalState.present.should.deep.equal(initialState.present);
    });

});
