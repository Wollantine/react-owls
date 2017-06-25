import reducer from '../../reducer';
import {createAction, createRawAction} from 'redux-action-factory';

describe('Reducer, upon REORDER_ITEM', () => {
    let initialState,
    	existingItemId,
    	existingListId,
    	reorderItem;

    before(() => {
        initialState = reducer(undefined, {});
        existingListId = initialState.present.selectedList.id;
        existingItemId = initialState.present.lists[existingListId].pending[0];
		reorderItem = createAction('REORDER_ITEM',
			{listId: existingListId, id: existingItemId, newPosition: 1});
    });


    describe('when there is only one item in the list', () => {

    	it('should do nothing', () => {
    		const finalState = reducer(initialState, reorderItem);
    		finalState.present.should.deep.equal(initialState.present);
    	});

    });

    describe('when there are no items in the list', () => {

    	it('should do nothing', () => {
    		const reorderItem = createAction('REORDER_ITEM',
    			{listId: existingListId, id: existingItemId, newPosition: 2});
    		const finalState = reducer(initialState, reorderItem);
    		finalState.present.should.deep.equal(initialState.present);
    	});

    });

    describe('when there are several items', () => {

    	before(() => {
    		const actions = [
    			{...createRawAction('ADD_ITEM', {listId: existingListId, name: 'item-1'}), newId: 'test-1'},
    			{...createRawAction('ADD_ITEM', {listId: existingListId, name: 'item-2'}), newId: 'test-2'},
    			{...createRawAction('ADD_ITEM', {listId: existingListId, name: 'item-3'}), newId: 'test-3'},
    			{...createRawAction('ADD_ITEM', {listId: existingListId, name: 'item-1'}), newId: 'test-4'},
    			{...createRawAction('ADD_ITEM', {listId: existingListId, name: 'item-2'}), newId: 'test-5'},
    			{...createRawAction('ADD_ITEM', {listId: existingListId, name: 'item-3'}), newId: 'test-6'},
    			{...createRawAction('ADD_ITEM', {listId: existingListId, name: 'item-3'}), newId: 'test-7'},
    			createAction('ARCHIVE_ITEM', {listId: existingListId, id: 'test-4'}),
    			createAction('ARCHIVE_ITEM', {listId: existingListId, id: 'test-5'}),
    			createAction('ARCHIVE_ITEM', {listId: existingListId, id: 'test-6'}),
    			createAction('ARCHIVE_ITEM', {listId: existingListId, id: 'test-7'}),
    		];
    		initialState = actions.reduce(reducer, initialState);

    	})

    	const moveToFirstPos = (list, id) => {
    		return list.reduce((previous, item) => {
				if (item === id) return [item, ...previous];
				else return [...previous, item];
			}, []);
		};

		const moveToLastPos = (list, id) => {
			let found = false;
			return list.reduce((previous, item) => {
        		let result;
				if (found) {
					const rest = previous.slice(0, -1);
					const last = previous.slice(-1);
					result = [...rest, item, ...last];
				}
				else result = [...previous, item];
				if (item === id) found = true;
        		return result;
			}, []);
		};

		const getItems = list => (list.pending);

		const getArchive = list => (list.archive);


    	const testBattery = (getSubList) => {

    		let list, listId;

    		before(() => {
    			list = initialState.present.lists[existingListId];
    			listId = existingListId;
    		});

    		it('should be able to move an item to the first position', () => {
    			const subList = getSubList(list);
    			const reorderItem = createAction('REORDER_ITEM',
    				{listId: listId, id: subList[2], newPosition: 0});
    			const finalState = reducer(initialState, reorderItem);
    			const expectedList = moveToFirstPos(subList, subList[2]);
    			getSubList(finalState.present.lists[listId]).should.deep.equal(expectedList);
    		});

    		it('should be able to move an item to an Nth position', () => {
    			const subList = getSubList(list);
    			const reorderItem = createAction('REORDER_ITEM',
    				{listId: listId, id: subList[0], newPosition: 1});
    			const finalState = reducer(initialState, reorderItem);
    			const expectedList = [subList[1], subList[0], subList[2], subList[3]];
    			getSubList(finalState.present.lists[listId]).should.deep.equal(expectedList);
    		});

    		it('should move an item to the first position if position is lower than 0', () => {
    			const subList = getSubList(list);
    			const reorderItem = createAction('REORDER_ITEM',
    				{listId: listId, id: subList[1], newPosition: -1});
    			const finalState = reducer(initialState, reorderItem);
    			const expectedList = moveToFirstPos(subList, subList[1]);
    			getSubList(finalState.present.lists[listId]).should.deep.equal(expectedList);
    		});

    		it('should move an item to the last position if position is higher than length-1', () => {
    			const subList = getSubList(list);
    			const reorderItem = createAction('REORDER_ITEM',
    				{listId: listId, id: subList[1], newPosition: 10});
    			const finalState = reducer(initialState, reorderItem);
    			const expectedList = moveToLastPos(subList, subList[1]);
    			getSubList(finalState.present.lists[listId]).should.deep.equal(expectedList);
    		});

    	}



    	describe('in the pending list', testBattery.bind(null, getItems));

    	describe('in the archive', testBattery.bind(null, getArchive));

    });

});
