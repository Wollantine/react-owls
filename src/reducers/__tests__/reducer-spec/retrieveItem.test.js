import reducer from '../../reducer';
import {createAction} from 'redux-action-factory';

describe('Reducer, upon RETRIEVE_ITEM', () => {
    let initialState;
    let existingListId;
    let existingItemId;

    beforeEach(() => {
        initialState = reducer(undefined, {});
        existingListId = initialState.present.selectedList.id;
        existingItemId = initialState.present.lists[existingListId].pending[0];
    });

    describe('when retrieving the initial item after archiving it', () => {
    	let finalState, archive, retrieve;

    	before(() => {
			// Actions for archiving and retrieving the initial item
	    	archive = createAction('ARCHIVE_ITEM', {listId: existingListId, id: existingItemId});
		    retrieve = createAction('RETRIEVE_ITEM', {listId: existingListId, id: existingItemId});
    	});

    	it('should leave the state the same as before archiving', () => {
    		finalState = reducer(reducer(initialState, archive), retrieve);
    		finalState.present.should.deep.equal(initialState.present);
    	});

    	it('should delete the item from the archive', () => {
    		finalState = reducer(reducer(initialState, archive), retrieve);
    		finalState.present.lists[existingListId].archive.should.deep.equal([]);
    	});

    	it('should add the item to the list of pending items', () => {
    		finalState = reducer(reducer(initialState, archive), retrieve);
	    	finalState.present.lists[existingListId].pending.should.deep.equal([existingItemId]);
	    });

	    it('should always retrieve the item as not done', () => {
	    	const markAsDone = createAction('CHANGE_ITEM_STATUS', {id: existingItemId, done: true});
	    	finalState = reducer(reducer(reducer(initialState,
	    		markAsDone), archive), retrieve);
	    	finalState.present.items[existingItemId].done.should.equal(false);
	    });

    });

    it('should do nothing on an already retrieved item', () => {
    	// We retrieve the initial item
    	const archive = createAction('ARCHIVE_ITEM', {listId: existingListId, id: existingItemId});
	    const retrieve = createAction('RETRIEVE_ITEM', {listId: existingListId, id: existingItemId});
    	const firstState = reducer(reducer(initialState, archive), retrieve);

    	// We re-retrieve it by repeating the action
    	const secondState = reducer(firstState, retrieve);

    	// Check nothing changed
    	firstState.present.should.deep.equal(secondState.present);
    });

    it('should do nothing on an item never archived', () => {
	    const retrieve = createAction('RETRIEVE_ITEM', {listId: existingListId, id: existingItemId});
    	const finalState = reducer(initialState, retrieve);
    	finalState.present.should.deep.equal(initialState.present);
    })

    it('should do nothing on a non existing item', () => {
    	const archive = createAction('ARCHIVE_ITEM', {listId: existingListId, id: existingItemId});
    	// We retrieve a non existing item
    	const retrieve = createAction('RETRIEVE_ITEM', {listId: existingListId, id: 'non-existing item'});
    	const firstState = reducer(initialState, archive);
    	const finalState = reducer(firstState, retrieve);

    	finalState.present.should.deep.equal(firstState.present);
    });

    it('should do nothing on a non existing list', () => {
    	const archive = createAction('ARCHIVE_ITEM', {listId: existingListId, id: existingItemId});
    	// We archive an item of a non-existing list
    	const retrieve = createAction('RETRIEVE_ITEM', {listId: 'non-existing list', id: existingItemId});
    	const firstState = reducer(initialState, archive);
    	const finalState = reducer(firstState, retrieve);

    	finalState.present.should.deep.equal(firstState.present);
    });

});
