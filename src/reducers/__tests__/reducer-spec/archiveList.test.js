import reducer from '../../reducer';
import {createAction, createRawAction} from 'redux-action-factory';

describe('Reducer, upon ARCHIVE_LIST', () => {
	let initialState;
    let existingListId;

    const addItem = (name, state) => {
		let action = createRawAction('ADD_ITEM', {listId: existingListId, name});
		action.newId = 'item-'+name;
		return reducer(state, action);
	}

    before(() => {
        initialState = reducer(undefined, {});
        existingListId = initialState.present.selectedList.id;
    });

	it('should do nothing if the pending list is empty', () => {
		const addList = createRawAction('ADD_LIST', {name: 'testlist'});
    	addList.newId = 'list-0';

		const archiveList = createAction('ARCHIVE_LIST', {id: 'list-0'});
		const firstState = reducer(addList, initialState);
		const finalState = reducer(archiveList, firstState);
		finalState.should.deep.equal(firstState);
	});

	it('should move all the items from the pending list into the archive', () => {
		// Add two items
        const firstState = addItem('test', addItem('test2', initialState));

		// Archive the list
		const archiveList = createAction('ARCHIVE_LIST', {id: existingListId});
		const finalState = reducer(firstState, archiveList);
		// The archive should have three items, the initial one and the new two.
		finalState.present.lists[existingListId].archive.length.should.equal(3);
	});

	it('should leave the pending list empty', () => {
		// Add two items
		const firstState = addItem('test', addItem('test2', initialState));

		// Archive the list
		const archiveList = createAction('ARCHIVE_LIST', {id: existingListId});
		const finalState = reducer(firstState, archiveList);

		finalState.present.lists[existingListId].pending.length.should.equal(0);
	});

	it('should keep the items that were in the archive', () => {
		// Add two items
		let firstState = addItem('test', addItem('test2', initialState));

		// Archive one of them
		firstState = reducer(firstState,
			createAction('ARCHIVE_ITEM', {listId: existingListId, id: 'item-test'}));

		// Archive the list
		const archiveList = createAction('ARCHIVE_LIST', {id: existingListId});
		const finalState = reducer(firstState, archiveList);

		finalState.present.lists[existingListId].archive.length.should.equal(3);
	});

});
